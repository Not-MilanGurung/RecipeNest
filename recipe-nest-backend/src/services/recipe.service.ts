import Recipe from "../models/recipe.model.js";
import cloudinary, { rootFolder } from "../configs/cloudinary.js";
import User, { userRoles } from "../models/user.model.js";
import { type CustomError } from "../middlewares/error-handler.middleware.js";
import type { UploadApiResponse } from "cloudinary";
import mongoose from 'mongoose';

export const getById = async (id: string) => {
  const recipeStats = await Recipe.aggregate([
    { $match: { _id: id } },
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "recipe",
        as: "recipeRatings",
      },
    },
    {
      $addFields: {
        ratingAverage: { $ifNull: [{ $avg: "$recipeRatings.value" }, 0] },
        ratingCount: { $size: "$recipeRatings" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "chef",
        foreignField: "_id",
        as: "chef",
      },
    },
    { $unwind: "$chef" },
    { $project: { recipeRatings: 0, "chef.password": 0 } }, // Exclude what you don't need
  ]);

  const recipe = recipeStats[0]; // Aggregate returns an array
  if (!recipe) {
    const error: CustomError = new Error("Recipe not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    success: true,
    message: "Recipe found",
    data: {
      recipe,
    },
  };
};

export const get = async (page: number, limit: number, sort: Record<string, 1 | -1>, filter: Record<string, any>) => {
  const recipes = await Recipe.aggregate([
    // 1. Apply your filters first
    { $match: filter },

    // 2. Sort, Skip, and Limit (Pagination)
    { $sort: sort },
    { $skip: (page - 1) * limit },
    { $limit: limit },

    // 3. Join with Ratings collection
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "recipe",
        as: "recipeRatings",
      },
    },

    // 4. Calculate Stats
    {
      $addFields: {
        ratingAverage: { $ifNull: [{ $avg: "$recipeRatings.value" }, 0] },
        ratingCount: { $size: "$recipeRatings" },
      },
    },

    // 5. Join with Users (Chef) - Manual "Populate"
    {
      $lookup: {
        from: "users",
        localField: "chef",
        foreignField: "_id",
        as: "chef",
      },
    },
    { $unwind: "$chef" },

    // 6. Project (Select specific fields)
    {
      $project: {
        name: 1,
        image: 1,
        description: 1,
        metrics: 1,
        category: 1,
        flagged: 1,
        ratingAverage: 1,
        ratingCount: 1,
        "chef._id": 1,
        "chef.name": 1,
        "chef.role": 1,
        "chef.avatar": 1,
      },
    },
  ]);
  const total = await Recipe.countDocuments(filter);
  return {
    success: true,
    data: {
      recipes,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    },
  };
};

const handleImage = async (imageBuffer: Buffer, recipeId: string) => {
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `${rootFolder}/recipes`,
          public_id: recipeId,
          overwrite: true,
          resource_type: "image",
          transformation: [
            { width: 1200, height: 1200, crop: "auto" },
            { fetch_format: "auto", quality: "auto" },
          ],
        },
        (error, uploadResult) => {
          if (error || !uploadResult) return reject(error);
          return resolve(uploadResult);
        },
      )
      .end(imageBuffer);
  });

  return result;
};

export type RecipeCreationData = {
  name: string;
  description: string;
  steps: string[];
  ingredients: {
    name: string;
    unit: string;
    quantity: number;
  }[];
  utensils?: string[];
  metrics?: {
    preptime?: string;
    cooktime?: string;
    servings?: number;
  };
  category: string;
}

export const create = async (userId: string, data: RecipeCreationData, imageBuffer: Buffer | undefined) => {
  const recipe = new Recipe(data);
  recipe.chef = new mongoose.Types.ObjectId(userId);

  if (imageBuffer) {
    const image = await handleImage(imageBuffer, recipe.id);
    recipe.image = image.secure_url;
  }

  await recipe.save();

  return {
    success: true,
    message: "Recipe created successfully",
    data: { recipe },
  };
};

export const updateById = async (recipeId: string, userId: string, data: any, imageBuffer: Buffer | undefined) => {
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    const error : CustomError = new Error("Recipe not found");
    error.statusCode = 404;
    throw error;
  }

  if (!recipe.chef.equals(userId)) {
    const error : CustomError = new Error("Unauthorized action");
    error.statusCode = 403;
    throw error;
  }

  const allowedUpdates = ["name", "steps", "ingredients", "description", "utensils", "metrics", "category"];
  const filteredData : any = {};
  for (const key of allowedUpdates) {
    if (data[key] !== undefined) {
      filteredData[key] = data[key];
    }
  }

  if (imageBuffer) {
    const image = await handleImage(imageBuffer, recipe.id);
    filteredData.image = image.secure_url;
  }

  const updated = await Recipe.findByIdAndUpdate(recipe._id, filteredData, {
    returnDocument: "after",
    runValidators: true,
  });

  return {
    success: true,
    message: "Recipe updated succesfully",
    data: { updated },
  };
};

export const deleteById = async (userId: string, recipeId: string) => {
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    const error : CustomError = new Error("Recipe not found");
    error.statusCode = 404;
    throw error;
  }
  const user = await User.findById(userId);
  if (!user) {
    const error : CustomError = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const userIsCreatorOrAdmin = recipe.chef.equals(user._id) || user.role === userRoles.values.ADMIN;
  if (!userIsCreatorOrAdmin) {
    const error : CustomError = new Error("Unauthorized action");
    error.statusCode = 403;
    throw error;
  }

  await recipe.deleteOne();
  return {
    success: true,
    message: "Recipe deleted successfully",
  };
};
