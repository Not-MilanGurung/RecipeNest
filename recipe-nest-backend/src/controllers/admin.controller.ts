import * as adminService from "../services/admin.service";
import { type CustomError } from "../middlewares/error-handler.middleware";
import type { RequestHandler, Request, Response } from "express";

export const stats : RequestHandler  = async (req, res) => {
  const data = await adminService.stats();
  res.status(200).json(data);
};

export const flagRecipe = async (req : Request<{ id : string}, any, { flagged: boolean }>, res : Response) => {
  const { id } = req.params;
  const { flagged } = req.body;
  if (flagged === undefined) {
    const error : CustomError = new Error("Flagged status is required");
    error.statusCode = 400;
    throw error;
  }
  const data = await adminService.flagRecipe(id as string, flagged);
  res.status(200).json(data);
};
