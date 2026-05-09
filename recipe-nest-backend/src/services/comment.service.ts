import Comment from "../models/comment.model";
import Recipe from "../models/recipe.model";
import { userRoles } from "../models/user.model";
import { type CustomError } from "../middlewares/error-handler.middleware";

export const getCommentsByRecipeId = async (recipeId : string) => {
  const comments = await Comment.find({ recipe: recipeId }).populate(
    "user",
    "name avatar",
  );
  return {
    success: true,
    data: {
      comments,
    },
  };
};

export const createCommentByRecipeId = async (userId : string, recipeId : string, content : string) => {
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    const error : CustomError = new Error("Recipe not found");
    error.statusCode = 404;
    throw error;
  }

  const comment = new Comment({
    user: userId,
    recipe: recipeId,
    text: content,
  });

  await comment.save();
  return {
    success: true,
    data: {
      comment,
    },
  };
};

export const updateCommentById = async (userId : string, commentId : string, content : string) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    const error : CustomError = new Error("Comment not found");
    error.statusCode = 404;
    throw error;
  }

  if (!comment.user.equals(userId)) {
    const error : CustomError = new Error("Unauthorized to update this comment");
    error.statusCode = 403;
    throw error;
  }

  comment.text = content;
  await comment.save();

  return {
    success: true,
    data: {
      comment,
    },
  };
};

export const deleteCommentById = async (userId : string, userRole : string, commentId : string) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    const error : CustomError = new Error("Comment not found");
    error.statusCode = 404;
    throw error;
  }

  if (!comment.user.equals(userId) && userRole !== userRoles.values.ADMIN) {
    const error : CustomError = new Error("Unauthorized to delete this comment");
    error.statusCode = 403;
    throw error;
  }

  await comment.deleteOne();

  return {
    success: true,
    message: "Comment deleted successfully",
  };
};


