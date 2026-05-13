import Rating from "../models/rating.model.js";
import Recipe from "../models/recipe.model.js";
import type { CustomError } from "../middlewares/error-handler.middleware.js";

export const getRating = async (userId: string, recipeId: string) => {
  const rating = await Rating.findOne({ user: userId, recipe: recipeId });
  if (!rating) {
    const error : CustomError = new Error("Rating not found");
    error.statusCode = 404;
    throw error;
  }
  return {
    success: true,
    data: {
      rating,
    },
  };
};

export const createRatingOrUpdate = async (userId: string, recipeId: string, ratingValue: number) => {
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    const error : CustomError = new Error("Recipe not found");
    error.statusCode = 404;
    throw error;
  }

  if (ratingValue < 1 || ratingValue > 5) {
    const error : CustomError = new Error(
      "Invalid rating value. Please provide a rating between 1 and 5.",
    );
    error.statusCode = 400;
    throw error;
  }

  const existingRating = await Rating.findOne({
    user: userId,
    recipe: recipeId,
  });

  if (existingRating) {
    existingRating.value = ratingValue;
    await existingRating.save();
    return {
      success: true,
      data: {
        rating: existingRating,
      },
    };
  }

  const rating = new Rating({
    user: userId,
    recipe: recipeId,
    value: ratingValue,
  });
  await rating.save();
  return {
    success: true,
    data: {
      rating,
    },
  };
};

