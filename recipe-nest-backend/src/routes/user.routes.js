const express = require('express');
const router = express.Router();

const { authOnly, adminOnly } = require('../middlewares/auth.middleware');
const multer = require('../configs/multer');

const userController = require('../controllers/user.controller');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/refresh', userController.refreshToken);

// Protected routes
router.get('/profile', authOnly, userController.getProfile);
router.put('/profile/pic', authOnly, multer.single('avatar'), userController.uploadAvatar);


module.exports = router;