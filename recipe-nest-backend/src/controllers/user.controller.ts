import type { RequestHandler, Request, Response } from "express";
import type { CustomError } from "../middlewares/error-handler.middleware.js";
import type { AuthenicatedResponse } from "../middlewares/auth.middleware.js";
import { EUserRole } from "../models/user.model.js";

import { z } from "zod";

import * as userServices from "../services/user.service.js";

const registerBody = z.object({
  name: z
    .string("Name must be a string")
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long"),
  password: z.string("Password must be a string").min(8, "Password must be at least 8 characters long"),
  email: z.email("Invalid email format"),
  role: z.enum(EUserRole).optional(),
});

export const register: RequestHandler = async (req, res) => {
  const data = registerBody.safeParse(req.body);
  if (!data.success) {
    const error: CustomError = new Error("Invalid request body");
    error.statusCode = 400;
    error.errorList = data.error.issues.map((issue) => issue.message);
    throw error;
  }

  const result = await userServices.register(data.data);

  // Making the refresh token a http only cookie
  const { refreshToken, ...output } = result;
  res.cookie("jwt", refreshToken.token, refreshToken.config);

  res.status(201).json(output);
};

const loginBody = z.object({
  email: z.email("Invalid email format"),
  password: z.string("Password must be a string").min(8, "Password must be at least 8 characters long"),
});

export const login: RequestHandler = async (req, res) => {
  const data = loginBody.safeParse(req.body);
  if (!data.success) {
    const error: CustomError = new Error("Invalid request body");
    error.statusCode = 400;
    error.errorList = data.error.issues.map((issue) => issue.message);
    throw error;
  }

  const result = await userServices.login(data.data);

  const { refreshToken, ...output } = result;
  res.cookie("jwt", refreshToken.token, refreshToken.config);

  res.status(200).json(output);
};

export const getProfile = async (req: Request, res: AuthenicatedResponse) => {
  const userId = res.locals.user._id.toString();
  const result = await userServices.getProfile(userId);
  res.status(200).json(result);
};

export const getPortfolio = async (req: Request<{ id: string }>, res: Response) => {
  const { id: chefId } = req.params;
  const result = await userServices.getPortfolio(chefId);
  res.status(200).json(result);
};

const updatePortfolioBody = z.object({
  bio: z.string().max(200, "Bio must be at most 200 characters long").optional(),
  socials: z
    .array(
      z.object({
        platform: z
          .string()
          .min(2, "Platform must be at least 2 characters long")
          .max(50, "Platform must be at most 50 characters long"),
        url: z.url("Invalid URL format"),
      }),
    )
    .optional(),
});

export const updatePortfolio = async (req: Request, res: AuthenicatedResponse) => {
  const userId = res.locals.user._id.toString();
  const fileBuffer = req.file?.buffer;

  const data = updatePortfolioBody.safeParse(req.body);
  if (!data.success) {
    const error: CustomError = new Error("Invalid request body");
    error.statusCode = 400;
    error.errorList = data.error.issues.map((issue) => issue.message);
    throw error;
  }
  const result = await userServices.updatePortfolio(userId, data.data, fileBuffer);

  res.status(200).json(result);
};

export const refreshToken: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies?.jwt;
  if (!refreshToken) {
    const error: CustomError = new Error("Unauthorized access");
    error.statusCode = 401;
    throw error;
  }

  const result = await userServices.refreshToken(refreshToken);
  res.status(200).json(result);
};

export const uploadAvatar = async (req: Request, res: AuthenicatedResponse) => {
  const file = req.file;
  const userId = res.locals.user._id.toString();
  if (!file) {
    const error: CustomError = new Error("Profile pic is needed");
    error.statusCode = 400;
    throw error;
  }

  const result = await userServices.uploadAvatar(file.buffer, userId);
  res.status(200).json(result);
};

const updateProfileBody = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long")
    .optional(),
  email: z.email("Invalid email format").optional(),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 characters long")
    .max(15, "Phone must be at most 15 characters long")
    .optional(),
});

export const updateProfile = async (req: Request, res: AuthenicatedResponse) => {
  const userId = res.locals.user._id.toString();
  const data = updateProfileBody.safeParse(req.body);
  if (!data.success) {
    const error: CustomError = new Error("Invalid request body");
    error.statusCode = 400;
    error.errorList = data.error.issues.map((issue) => issue.message);
    throw error;
  }

  const result = await userServices.updateProfile(userId, data.data);
  res.status(200).json(result);
};

export const logout: RequestHandler = async (req, res) => {
  res.clearCookie("jwt", { httpOnly: true });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
