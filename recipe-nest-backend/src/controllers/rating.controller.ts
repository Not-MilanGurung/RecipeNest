import type { Request } from "express";
import * as ratingService from "../services/rating.service.js";
import { type AuthenicatedResponse } from '../middlewares/auth.middleware.js'
import type { CustomError } from '../middlewares/error-handler.middleware.js'

export const getRating = async (req : Request<{ id : string}>, res: AuthenicatedResponse) => {
  const userId = res.locals.user._id.toString();
  const { id: recipeId } = req.params;

  const result = await ratingService.getRating(userId, recipeId);
  res.status(200).json(result);
};

export const createRatingOrUpdate = async (req : Request<{ id : string}, any, { rating: number}>, res: AuthenicatedResponse) => {
  const userId = res.locals.user._id.toString();
  const { id: recipeId } = req.params;
  const { rating } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    const error : CustomError = new Error("Rating value of 1 to 5 is required");
    error.statusCode = 400;
    throw error;
  }

  const result = await ratingService.createRatingOrUpdate(
    userId,
    recipeId,
    rating,
  );
  res.status(200).json(result);
};

