const Comment = require('../models/comment.model');
const Recipe = require('../models/recipe.model');
const {userRoles } = require('../models/user.model');

const getCommentsByRecipeId = async (recipeId) => {
  const comments = await Comment.find({ recipeId })
      .populate('user', 'name avatar');
  return {
    success: true,
    data: {
      comments
    }
  }
};

const createCommentByRecipeId = async (userId, recipeId, content) => {
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    const error = new Error('Recipe not found');
    error.statusCode = 404;
    throw error;
  }

  const comment = new Comment({
    user: userId,
    recipe: recipeId,
    text: content
  });

  await comment.save();
  return {
    success: true,
    data: {
      comment
    }
  };
}

const updateCommentById = async (userId, commentId, content) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    const error = new Error('Comment not found');
    error.statusCode = 404;
    throw error;
  }

  if (!comment.user.equals(userId)) {
    const error = new Error('Unauthorized to update this comment');
    error.statusCode = 403;
    throw error;
  }

  comment.text = content;
  await comment.save();

  return {
    success: true,
    data: {
      comment
    }
  };
};

const deleteCommentById = async (userId, userRole, commentId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    const error = new Error('Comment not found');
    error.statusCode = 404;
    throw error;
  }

  if (!comment.user.equals(userId) || userRole !== userRoles.ADMIN) {
    const error = new Error('Unauthorized to delete this comment');
    error.statusCode = 403;
    throw error;
  }

  await comment.remove();

  return {
    success: true,
    message: 'Comment deleted successfully'
  };
};

module.exports = {
  getCommentsByRecipeId,
  createCommentByRecipeId,
  updateCommentById,
  deleteCommentById
}