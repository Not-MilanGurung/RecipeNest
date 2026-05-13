import type { Request, Response } from "express";
import {type CustomError} from '../middlewares/error-handler.middleware.js';
import * as recipeService from "../services/recipe.service.js";
import {type AuthenicatedResponse} from '../middlewares/auth.middleware.js';
import { z } from 'zod';

const getRecipesQuery = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
  sort: z.string().optional().default("-createdAt"),
  search: z.string().optional(),
  category: z.string().optional(),
  chefId: z.string().optional()
});

export const getRecipes = async (req: Request, res: Response) => {
  // Destructure specifically for filtering
  const { page, limit, sort, search, category, chefId } = getRecipesQuery.parse(req.query);

  const sortObject: Record<string, 1 | -1> = typeof sort === "string" 
  ? { [sort.startsWith("-") ? sort.substring(1) : sort]: sort.startsWith("-") ? -1 : 1 }
  : { createdAt: -1 };

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
  const userId = res.locals.user._id.toString();

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
  const userId = res.locals.user._id.toString();

  const result = await recipeService.updateById(id, userId, recipeData, imageBuffer);
  res.status(200).json(result);
};

export const deleteRecipe = async (req: Request<{ id: string }>, res: AuthenicatedResponse) => {
  const userId = res.locals.user._id.toString();
  const { id } = req.params;

  const result = await recipeService.deleteById(userId, id);
  res.status(200).json(result);
};

