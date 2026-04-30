const express = require("express");
const router = express.Router();

const {
  authOnly,
  adminOnly,
  chefOnly,
} = require("../middlewares/auth.middleware");
const multer = require("../configs/multer");

const adminController = require("../controllers/admin.controller");

const swaggerPaths = {};

router.get("/stats", authOnly, adminOnly, adminController.stats);

router.post("/recipes/:id/flag", authOnly, adminOnly, adminController.flagRecipe);

module.exports = router;
