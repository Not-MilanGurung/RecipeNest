import express from "express";
const router = express.Router();

import { authOnly, adminOnly, chefOnly } from "../middlewares/auth.middleware.js";

import * as adminController from "../controllers/admin.controller.js";

router.get("/stats", authOnly, adminOnly, adminController.stats);
router.post("/recipes/:id/flag", authOnly, adminOnly, adminController.flagRecipe);

export default router;
