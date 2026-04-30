const jwt = require("jsonwebtoken");
const { User, userRoles } = require("../models/user.model");
const { JWT_ACCESS_SECRET } = require("../configs/config");

const authOnly = async (req, res, next) => {
  let token;

  const requestHasToken =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer");
  if (requestHasToken) token = req.headers.authorization.split(" ")[1];

  if (!token) {
    const error = new Error("Not authorized. Please Login");
    error.statusCode = 401;
    throw error;
  }

  const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    const error = new Error("User not found with this token");
    error.statusCode = 401;
    throw error;
  }

  req.user = user;
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === userRoles.values.ADMIN) {
    next();
  } else {
    const error = new Error("Not authorized. Admin access required.");
    error.statusCode = 403;
    throw error;
  }
};

const chefOnly = (req, res, next) => {
  if (
    req.user
    && (req.user.role === userRoles.values.CHEF
      || req.user.role === userRoles.values.ADMIN)
  ) {
    next();
  } else {
    const error = new Error("Not authorized, Chef access required.");
    error.statusCode = 403;
    throw error;
  }
};

module.exports = {
  authOnly,
  adminOnly,
  chefOnly,
};
