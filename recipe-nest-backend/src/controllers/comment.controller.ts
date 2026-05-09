import type { Request, Response } from "express";

import { type CustomError } from '../middlewares/error-handler.middleware';
import * as commentController from "../services/comment.service";
import { type AuthenicatedResponse } from '../middlewares/auth.middleware';

export const getCommentsByRecipeId = async (req : Request<{ id : string }>, res : Response) => {
  const { id } = req.params;
  const result = await commentController.getCommentsByRecipeId(id);
  res.status(200).json(result);
};

export const createCommentByRecipeId = async (req : Request<{ id : string }, any, { content: string }>, res : AuthenicatedResponse) => {
  const { id } = req.params;
  const content = req.body?.content;
  if (!content) {
    const error : CustomError = new Error("Content is required");
    error.statusCode = 400;
    throw error;
  }
  const result = await commentController.createCommentByRecipeId(
    res.locals.user,
    id,
    content,
  );
  res.status(201).json(result);
};

export const updateCommentById = async (req : Request<{ id : string }, any, { content: string }>, res : AuthenicatedResponse) => {
  const { id } = req.params;
  const content = req.body?.content;
  if (!content) {
    const error : CustomError = new Error("Content is required");
    error.statusCode = 400;
    throw error;
  }
  const result = await commentController.updateCommentById(
    res.locals.user.id,
    id,
    content,
  );
  res.status(200).json(result);
};

export const deleteCommentById = async (req : Request<{ id : string }>, res : AuthenicatedResponse) => {
  const { id } = req.params;
  const result = await commentController.deleteCommentById(
    res.locals.user.id,
    res.locals.user.role,
    id,
  );
  res.status(200).json(result);
};

