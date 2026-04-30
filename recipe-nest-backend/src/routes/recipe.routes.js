const express = require('express');
const router = express.Router();

const { authOnly, chefOnly, adminOnly } = require('../middlewares/auth.middleware');
const multer = require('../configs/multer');

const recipeController = require('../controllers/recipe.controller');


router.get('', recipeController.getRecipes);
router.get('/:id', recipeController.getRecipeById);

// Protected routes
router.post('/', authOnly, chefOnly, multer.single('image'), recipeController.createRecipe);
router.put('/:id', authOnly, chefOnly, multer.single('image'), recipeController.updateRecipe);
router.delete('/:id', authOnly, chefOnly, recipeController.deleteRecipe);

const ratingController = require('../controllers/rating.controller');

router.get('/:id/rating', authOnly, ratingController.getRating);
router.post('/:id/rating', authOnly, ratingController.createRatingOrUpdate);

const commentController = require('../controllers/comment.controller')

router.get('/:id/comments', commentController.getCommentsByRecipeId);
router.post('/:id/comments', authOnly, commentController.createCommentByRecipeId);
router.put('/comments/:id', authOnly, commentController.updateCommentById);
router.delete('/comments/:id', authOnly, commentController.deleteCommentById);

module.exports = router;