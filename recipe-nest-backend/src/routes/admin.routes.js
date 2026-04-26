const express = require('express');
const router = express.Router();

const { authOnly, adminOnly, chefOnly } = require('../middlewares/auth.middleware');
const multer = require('../configs/multer');

const adminController = require('../controllers/admin.controller');

/** 
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get admin statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/stats', authOnly, adminOnly, adminController.stats);

/** 
 * @swagger
 * /admin/recipes/{id}/flag:
 *   post:
 *     summary: Flag a recipe for review
 *     tags: [Admin]
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
 *         description: Recipe flagged successfully
 */
router.post('/recipes/:id/flag', authOnly, adminOnly, adminController.flagRecipe);

module.exports = router;
