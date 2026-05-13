import jwt from "jsonwebtoken";
import User, { userRoles, type IUser } from "../models/user.model.js";
import { JWT_ACCESS_SECRET } from "../configs/config.js";
import type { RequestHandler, Request, Response, Locals, NextFunction } from "express";
import type { CustomError } from "./error-handler.middleware.js";


export type AuthenicatedResponse = Response & {
  locals: Locals & {
    user: IUser;
  };
};


export const authOnly: RequestHandler = async (req, res, next) => {
  let token;

  const requestHasToken = req.headers.authorization && req.headers.authorization.startsWith("Bearer");
  if (requestHasToken) token = req.headers.authorization!.split(" ")[1];

  if (!token) {
    const error: CustomError = new Error("Not authorized. Please Login");
    error.statusCode = 401;
    throw error;
  }

  const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
  if (decoded instanceof String) {
    const error: CustomError = new Error("Invalid token");
    error.statusCode = 401;
    throw error;
  }
  const { id } = decoded as { id: string };
  const user = await User.findById(id);

  if (!user) {
    const error: CustomError = new Error("User not found with this token");
    error.statusCode = 401;
    throw error;
  }
  res.locals.user = user;
  next();
};

export const adminOnly = (req : Request, res: AuthenicatedResponse, next: NextFunction) => {
  if (res.locals.user && res.locals.user.role === userRoles.values.ADMIN) {
    next();
  } else {
    const error: CustomError = new Error("Not authorized. Admin access required.");
    error.statusCode = 403;
    throw error;
  }
};

export const chefOnly = (req: Request, res: AuthenicatedResponse, next: NextFunction) => {
  if (res.locals.user && (res.locals.user.role === userRoles.values.CHEF || res.locals.user.role === userRoles.values.ADMIN)) {
    next();
  } else {
    const error: CustomError = new Error("Not authorized, Chef access required.");
    error.statusCode = 403;
    throw error;
  }
};
