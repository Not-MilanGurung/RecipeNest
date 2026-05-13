import express from "express";
const router = express.Router();

import { authOnly, chefOnly } from "../middlewares/auth.middleware.js";
import multer from "../configs/multer.js";

import * as recipeController from "../controllers/recipe.controller.js";

router.get("", recipeController.getRecipes);
router.get("/:id", recipeController.getRecipeById);

// Protected routes
router.post("/", authOnly, chefOnly, multer.single("image"), recipeController.createRecipe);
router.put("/:id", authOnly, chefOnly, multer.single("image"), recipeController.updateRecipe);
router.delete("/:id", authOnly, chefOnly, recipeController.deleteRecipe);

import * as ratingController from "../controllers/rating.controller.js";

router.get("/:id/rating", authOnly, ratingController.getRating);
router.post("/:id/rating", authOnly, ratingController.createRatingOrUpdate);

import * as commentController from "../controllers/comment.controller.js";

router.get("/:id/comments", commentController.getCommentsByRecipeId);
router.post("/:id/comments", authOnly, commentController.createCommentByRecipeId);
router.put("/comments/:id", authOnly, commentController.updateCommentById);
router.delete("/comments/:id", authOnly, commentController.deleteCommentById);

export default router;
