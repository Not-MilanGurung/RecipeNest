import User, { type IUser, userRoles } from "../models/user.model.js";
import Recipe from "../models/recipe.model.js";
import {type CustomError } from "../middlewares/error-handler.middleware.js";
import { get as getRecipes } from "./recipe.service.js";

export const stats = async () => {
  const chefCount = await User.countDocuments({ role: userRoles.values.CHEF });
  const foodieCount = await User.countDocuments({
    role: userRoles.values.FOODIE,
  });
  const recipeCount = await Recipe.countDocuments();
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 as -1 },
  } = {};
  const recipes = await getRecipes(page, limit, sort, {});
  const recentRecipes = recipes.data.recipes;
  return {
    success: true,
    data: { chefCount, foodieCount, recipeCount, recentRecipes },
  };
};

export const flagRecipe = async (id : string, flagged : boolean) => {
  const recipe = await Recipe.findByIdAndUpdate(
    id,
    { flagged },
    { returnDocument: "after" },
  );
  if (!recipe) {
    const error : CustomError = new Error("Recipe not found");
    error.statusCode = 404;
    throw error;
  }
  return {
    success: true,
    message: "Recipe flagged status updated",
    data: { recipe },
  };
};
