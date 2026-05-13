import type { RequestHandler, Request, Response } from "express";
import type { CustomError } from '../middlewares/error-handler.middleware.js';
import type { AuthenicatedResponse } from '../middlewares/auth.middleware.js';

import * as userServices from "../services/user.service.js";


export const register: RequestHandler = async (req, res) => {
  const data = req.body;
  if (!data) {
    const error: CustomError = new Error("No body provided");
    error.statusCode = 400;
    throw error;
  }

  const result = await userServices.register(data);

  // Making the refresh token a http only cookie
  const refreshToken = result.refreshToken;
  const out : Omit<typeof result, "refreshToken"> = result;
  res.cookie("jwt", refreshToken.token, refreshToken.config);
  
  res.status(201).json(out);
};

export const login : RequestHandler = async (req, res) => {
  const data = req.body;
  if (!data) {
    const error : CustomError = new Error("No body provided");
    error.statusCode = 400;
    throw error;
  }
  const { email, password } = data;

  const errors : string[] = [];

  const emailIsEmpty = !email || email.trim() === "";
  if (emailIsEmpty) errors.push("Email is required");

  const passwordIsEmpty = !password || password.trim() === "";
  if (passwordIsEmpty) errors.push("Password is required");

  if (errors.length > 0) {
    const error : CustomError = new Error("Missing fields");
    error.statusCode = 400;
    error.errorList = errors;
    throw error;
  }

  const result = await userServices.login({ email, password });

  const refreshToken = result.refreshToken;
  const output : Omit<typeof result, "refreshToken"> = result;
  res.cookie("jwt", refreshToken.token, refreshToken.config);

  res.status(200).json(output);
};

export const getProfile = async (req : Request, res : AuthenicatedResponse) => {
  const userId = res.locals.user._id.toString();
  const result = await userServices.getProfile(userId);
  res.status(200).json(result);
};

export const getPortfolio = async (req : Request<{ id: string }>, res : Response) => {
  const { id: chefId } = req.params;
  const result = await userServices.getPortfolio(chefId);
  res.status(200).json(result);
};

export const updatePortfolio = async (req : Request, res : AuthenicatedResponse) => {
  const userId = res.locals.user._id.toString();
  const fileBuffer = req.file?.buffer;

  const data = req.body;
  if (!data) {
    const error : CustomError = new Error("No body provided");
    error.statusCode = 400;
    throw error;
  }
  const result = await userServices.updatePortfolio(userId, data, fileBuffer);

  res.status(200).json(result);
};

export const refreshToken : RequestHandler= async (req , res) => {
  const refreshToken = req.cookies?.jwt;
  if (!refreshToken) {
    const error : CustomError = new Error("Unauthorized access");
    error.statusCode = 401;
    throw error;
  }

  const result = await userServices.refreshToken(refreshToken);
  res.status(200).json(result);
};

export const uploadAvatar = async (req : Request, res : AuthenicatedResponse) => {
  const file = req.file;
  const userId = res.locals.user._id.toString();
  if (!file) {
    const error : CustomError = new Error("Profile pic is need");
    error.statusCode = 400;
    throw error;
  }

  const result = await userServices.uploadAvatar(file.buffer, userId);
  res.status(200).json(result);
};

export const updateProfile = async (req : Request, res : AuthenicatedResponse) => {
  const userId = res.locals.user._id.toString();
  const data = req.body;
  if (!data) {
    const error : CustomError = new Error("No body provided");
    error.statusCode = 400;
    throw error;
  }

  const result = await userServices.updateProfile(userId, data);
  res.status(200).json(result);
};

export const logout : RequestHandler = async (req, res) => {
  res.clearCookie("jwt", { httpOnly: true });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

