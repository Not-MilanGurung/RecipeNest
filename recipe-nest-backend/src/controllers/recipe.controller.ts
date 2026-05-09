import type { Request, Response } from "express";
import {type CustomError} from '../middlewares/error-handler.middleware';
import * as recipeService from "../services/recipe.service";
import {type AuthenicatedResponse} from '../middlewares/auth.middleware';

export const getRecipes = async (
  req: Request<
    {},
    any,
    any,
    { page?: number; limit?: number; sort?: string | any; search?: string; category?: string; chefId?: string }
  >,
  res: Response,
) => {
  // Destructure specifically for filtering
  const { page = 1, limit = 10, sort = "-createdAt", search, category, chefId } = req.query;

  let sortObject: Record<string, 1 | -1> = {};

  if (typeof sort === "string") {
    // Handle string format "-fieldName" or "fieldName"
    const isDescending = sort.startsWith("-");
    const field = isDescending ? sort.substring(1) : sort;
    sortObject[field] = isDescending ? -1 : 1;
  } else {
    // Fallback to a default if the sort variable is empty or invalid
    sortObject = sort || { createdAt: -1 };
  }

  // Build the MongoDB filter object
  const mongoFilter : Record<string, any> = { flagged: false };

  // Add fuzzy search for names
  if (search) {
    mongoFilter.name = { $regex: search, $options: "i" };
  }

  // Exact match for category
  if (category) {
    mongoFilter.category = Array.isArray(category) ? { $in: category } : category;
  }

  if (chefId) {
    mongoFilter.chef = chefId;
  }

  const result = await recipeService.get(page, limit, sortObject, mongoFilter);
  res.status(200).json(result);
};

export const getRecipeById = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  const result = await recipeService.getById(id);
  res.status(200).json(result);
};

export const createRecipe = async (req: Request<{}, any, recipeService.RecipeCreationData>, res: AuthenicatedResponse) => {
  const data = req.body;
  if (!data) {
    const error : CustomError = new Error("No body provided");
    error.statusCode = 400;
    throw error;
  }

  const imageBuffer = req.file?.buffer;
  const userId = res.locals.user.id;

  const result = await recipeService.create(userId, req.body, imageBuffer);
  res.status(201).json(result);
};

export const updateRecipe = async (req: Request<{ id: string }>, res: AuthenicatedResponse) => {
  const { id } = req.params;
  const data = req.body;
  if (!data) {
    const error : CustomError = new Error("No body provided");
    error.statusCode = 400;
    throw error;
  }

  const recipeData = {
    ...req.body,
    metrics: JSON.parse(req.body.metrics),
    ingredients: JSON.parse(req.body.ingredients),
    steps: JSON.parse(req.body.steps),
  };

  const imageBuffer = req.file?.buffer ;
  const userId = res.locals.user.id;

  const result = await recipeService.updateById(id, userId, recipeData, imageBuffer);
  res.status(200).json(result);
};

export const deleteRecipe = async (req: Request<{ id: string }>, res: AuthenicatedResponse) => {
  const userId = res.locals.user.id;
  const { id } = req.params;

  const result = await recipeService.deleteById(userId, id);
  res.status(200).json(result);
};

