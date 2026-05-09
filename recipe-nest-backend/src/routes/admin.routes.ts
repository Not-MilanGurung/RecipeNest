import express from "express";
const router = express.Router();

import { authOnly, adminOnly, chefOnly } from "../middlewares/auth.middleware";

import * as adminController from "../controllers/admin.controller";

router.get("/stats", authOnly, adminOnly, adminController.stats);
router.post("/recipes/:id/flag", authOnly, adminOnly, adminController.flagRecipe);

export default router;
