import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { type UploadApiResponse } from "cloudinary";
import cloudinary, { rootFolder } from "../configs/cloudinary.js";
import User, { EUserRole, type IUser } from "../models/user.model.js";
import Recipe, { type IRecipe } from "../models/recipe.model.js";
import { JWT_REFRESH_SECRET } from "../configs/config.js";
import { type CustomError } from "../middlewares/error-handler.middleware.js";

export const register = async (data: Pick<IUser, "name" | "email" | "password"> & { role?: IUser["role"] | undefined }) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    const error: CustomError = new Error("User already exists with this email");
    error.statusCode = 400;
    throw error;
  }

  const newUser = new User({
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
  });

  await newUser.save();
  const { password, ...cleanUser } = newUser.toObject();
  const user: Omit<IUser, "password"> = cleanUser;
  const accessToken = newUser.generateAccessToken();
  const refreshToken = newUser.generateRefreshToken();

  return {
    refreshToken,
    message: "User registerd successfully",
    data: { user: user, accessToken },
  };
};

export const login = async (data: Pick<IUser, "email" | "password">) => {
  const user = await User.findOne({ email: data.email }).select("+password");
  if (!user) {
    const error: CustomError = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error: CustomError = new Error("Your account has been deactivated");
    error.statusCode = 403;
    throw error;
  }
  const isPasswordValid = await user.comparePassword(data.password);
  if (!isPasswordValid) {
    const error: CustomError = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const { password, ...userClean } = user.toObject();
  const userData: Omit<IUser, "password"> = userClean;
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  return {
    refreshToken,
    message: "Login succesfull",
    data: { user: userData, accessToken },
  };
};

export const refreshToken = async (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  const { id } = decoded as { id: string };
  const user = await User.findById(id);

  if (!user) {
    const error: CustomError = new Error("User not found with this token");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = user.generateAccessToken();
  const { password, ...userClean } = user.toObject();
  const data: Omit<IUser, "password"> = userClean;
  return {
    message: "Access token generated successfully",
    data: { user: data, accessToken },
  };
};

export const getProfile = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    const error: CustomError = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  const userData: Omit<IUser, "password"> = user;
  return {
    message: "Loaded profile successfully",
    data: { user: userData },
  };
};

export const updateProfile = async (
  userId: string,
  data: { name?: IUser["name"] | undefined; email?: IUser["email"] | undefined; phone?: IUser["phone"] | undefined },
) => {
  const user = await User.findById(userId);
  if (!user) {
    const error: CustomError = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const updated = await User.findByIdAndUpdate(user._id, data, {
    returnDocument: "after",
    runValidators: true,
  });
  const userData: Omit<IUser, "password"> = updated!;
  return {
    message: "Profile updated successfully",
    data: {
      updated: userData,
    },
  };
};

export const getPortfolio = async (userId: string) => {
  const user = await User.findById(userId).select("name role bio socials phone avatar banner");
  if (!user) {
    const error: CustomError = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== EUserRole.CHEF) {
    const error: CustomError = new Error("User is not a chef");
    error.statusCode = 400;
    throw error;
  }

  const recipes: Array<
    Pick<IRecipe, "_id" | "name" | "description" | "image" | "category" | "metrics" | "createdAt"> & {
      ratingAverage: number;
      ratingCount: number;
    }
  > = await Recipe.aggregate([
    // 1. Filter for the specific chef
    {
      $match: { chef: new mongoose.Types.ObjectId(user._id) },
    },

    // 2. Sort by creation date (Descending)
    {
      $sort: { createdAt: -1 },
    },

    // 3. Join with the Ratings collection
    {
      $lookup: {
        from: "ratings", // Must match your MongoDB collection name
        localField: "_id", // Recipe ID
        foreignField: "recipe", // Field in Rating model that refs Recipe
        as: "allRatings",
      },
    },

    // 4. Calculate Average and Count
    {
      $addFields: {
        ratingAverage: { $ifNull: [{ $avg: "$allRatings.value" }, 0] },
        ratingCount: { $size: "$allRatings" },
      },
    },

    // 5. Select only the necessary fields (Equivalent to .select)
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        image: 1,
        category: 1,
        metrics: 1,
        ratingAverage: 1,
        ratingCount: 1,
        createdAt: 1,
      },
    },
  ]);
  const userData: Pick<IUser, "name" | "role" | "bio" | "socials" | "phone" | "avatar" | "banner"> = user.toObject();
  return {
    success: true,
    message: "Loaded profile successfully",
    data: { chef: userData, recipes },
  };
};

export const updatePortfolio = async (
  userId: string,
  data: { bio?: IUser["bio"] | undefined; socials?: IUser["socials"] | undefined },
  fileBuffer?: Buffer,
) => {
  const user = await User.findById(userId);
  if (!user) {
    const error: CustomError = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const filteredData: {
    bio?: IUser["bio"] | undefined;
    socials?: IUser["socials"] | undefined;
    banner?: IUser["banner"] | undefined;
  } = data;

  if (fileBuffer) {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `${rootFolder}/banner`,
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
        .end(fileBuffer);
    });
    filteredData.banner = result.secure_url;
  }

  const updated = await User.findByIdAndUpdate(user._id, filteredData, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!updated) {
    const error: CustomError = new Error("Failed to update portfolio");
    error.statusCode = 500;
    throw error;
  }

  const userData: Omit<IUser, "password"> = updated;
  return {
    message: "Portfolio updated successfully",
    data: {
      updated: userData,
    },
  };
};

export const uploadAvatar = async (fileBuffer: Buffer, userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    const error: CustomError = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `${rootFolder}/avatars`,
          public_id: userId,
          overwrite: true,
          resource_type: "image",
          transformation: [
            { width: 300, height: 300, crop: "auto" },
            { fetch_format: "auto", quality: "auto" },
            { gravity: "face" },
          ],
        },
        (error, uploadResult) => {
          if (error || !uploadResult) return reject(error);
          return resolve(uploadResult);
        },
      )
      .end(fileBuffer);
  });

  user.avatar = result.secure_url;
  await user.save();
  const userData: Omit<IUser, "password"> = user;
  return {
    message: "User avatar uploaded",
    data: {
      user: userData,
    },
  };
};
