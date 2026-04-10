const express = require('express');
const router = express.Router();

const { authOnly, chefOnly, adminOnly } = require('../middlewares/auth.middleware');
const multer = require('../configs/multer');

const recipeController = require('../controllers/recipe.controller');

// Public routes
router.get('', recipeController.getRecipes);
router.get('/:id', recipeController.getRecipeById);

// Protected routes
router.post('/', authOnly, chefOnly, multer.single('image'), recipeController.createRecipe);
router.put('/:id', authOnly, chefOnly, multer.single('image'), recipeController.updateRecipe);
router.delete('/:id', authOnly, chefOnly, recipeController.deleteRecipe);


module.exports = router;