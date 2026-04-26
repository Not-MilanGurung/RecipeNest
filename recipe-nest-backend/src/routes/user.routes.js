const express = require('express');
const router = express.Router();

const { authOnly, adminOnly, chefOnly } = require('../middlewares/auth.middleware');
const multer = require('../configs/multer');

const userController = require('../controllers/user.controller');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/refresh', userController.refreshToken);
router.get('/logout', userController.logout);
router.get('/:id/portfolio', userController.getPortfolio);

// Protected routes
router.get('/profile', authOnly, userController.getProfile);
router.put('/profile/pic', authOnly, multer.single('avatar'), userController.uploadAvatar);
router.put('/profile', authOnly, userController.updateProfile);
router.put('/portfolio', authOnly, chefOnly, multer.single('banner'), userController.updatePortfolio);



module.exports = router;