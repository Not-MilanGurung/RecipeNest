const express = require("express");
const router = express.Router();

const {
  authOnly,
  adminOnly,
  chefOnly,
} = require("../middlewares/auth.middleware");
const multer = require("../configs/multer");

const userController = require("../controllers/user.controller");

// Public routes
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post("/register", userController.register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Bad request
 */
router.post("/login", userController.login);

/**
 * @swagger
 * /users/refresh:
 *   get:
 *     summary: Refresh user token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       400:
 *         description: Bad request
 */
router.get("/refresh", userController.refreshToken);

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Logout a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       400:
 *         description: Bad request
 */
router.get("/logout", userController.logout);

/**
 * @swagger
 * /users/{id}/portfolio:
 *   get:
 *     summary: Get a user's portfolio
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Portfolio retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/:id/portfolio", userController.getPortfolio);

// Protected routes
/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/profile", authOnly, userController.getProfile);

/**
 * @swagger
 * /users/profile/pic:
 *   put:
 *     summary: Upload user avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       400:
 *         description: Bad request
 */
router.put(
  "/profile/pic",
  authOnly,
  multer.single("avatar"),
  userController.uploadAvatar,
);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request
 */
router.put("/profile", authOnly, userController.updateProfile);

/**
 * @swagger
 * /users/portfolio:
 *   put:
 *     summary: Update user portfolio
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               banner:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Portfolio updated successfully
 *       400:
 *         description: Bad request
 */
router.put(
  "/portfolio",
  authOnly,
  chefOnly,
  multer.single("banner"),
  userController.updatePortfolio,
);

module.exports = router;
