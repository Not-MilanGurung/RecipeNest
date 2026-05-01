const Rating = require("../models/rating.model");
const Recipe = require("../models/recipe.model");

const getRating = async (userId, recipeId) => {
  const rating = await Rating.findOne({ user: userId, recipe: recipeId });
  if (!rating) {
    const error = new Error("Rating not found");
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

const createRatingOrUpdate = async (userId, recipeId, ratingValue) => {
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    const error = new Error("Recipe not found");
    error.statusCode = 404;
    throw error;
  }

  if (ratingValue < 1 || ratingValue > 5) {
    const error = new Error(
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

module.exports = {
  getRating,
  createRatingOrUpdate,
};
