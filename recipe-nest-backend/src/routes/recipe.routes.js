const express = require('express');
const router = express.Router();

const { authOnly, chefOnly, adminOnly } = require('../middlewares/auth.middleware');
const multer = require('../configs/multer');

const recipeController = require('../controllers/recipe.controller');

// Public routes
/** 
 * @swagger
 * /recipes:
 *   get:
 *     summary: Get all recipes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Recipes retrieved successfully
 */
router.get('', recipeController.getRecipes);

/** 
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Get a recipe by ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The recipe ID
 *     responses:
 *       200:
 *         description: Recipe retrieved successfully
 *       404:
 *         description: Recipe not found
 */
router.get('/:id', recipeController.getRecipeById);

// Protected routes
/** 
 * @swagger
 * /recipes:
 *   post:
 *     summary: Create a new recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authOnly, chefOnly, multer.single('image'), recipeController.createRecipe);

/** 
 * @swagger
 * /recipes/{id}:
 *   put:
 *     summary: Update a recipe
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The recipe ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
*             type: object
*             properties:
*               image:
*                 type: string
*                 format: binary
*     responses:
*       200:
*         description: Recipe updated successfully
*       400:
*         description: Bad request
*/
router.put('/:id', authOnly, chefOnly, multer.single('image'), recipeController.updateRecipe);

/** 
* @swagger
* /recipes/{id}:
*   delete:
*     summary: Delete a recipe
*     tags: [Recipes]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The recipe ID
*     responses:
*       200:
*         description: Recipe deleted successfully
*       400:
*         description: Bad request
*/
router.delete('/:id', authOnly, chefOnly, recipeController.deleteRecipe);


module.exports = router;