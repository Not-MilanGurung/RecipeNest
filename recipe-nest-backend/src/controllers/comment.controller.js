const commentController = require('../services/comment.service');

const getCommentsByRecipeId = async (req, res) => {
  const { id } = req.params;
  const result = await commentController.getCommentsByRecipeId(id);
  res.status(200).json(result);
}

const createCommentByRecipeId = async (req, res) => {
  const { id } = req.params;
  const content  = req.body?.content;
  if (!content) {
    const error = new Error('Content is required');
    error.statusCode = 400;
    throw error;
  }
  const result = await commentController.createCommentByRecipeId(req.user.id, id, content);
  res.status(201).json(result);
}

const updateCommentById = async (req, res) => {
  const { id } = req.params;
  const content  = req.body?.content;
  if (!content) {
    const error = new Error('Content is required');
    error.statusCode = 400;
    throw error;
  }
  const result = await commentController.updateCommentById(req.user.id, id, content);
  res.status(200).json(result);
}

const deleteCommentById = async (req, res) => {
  const { id } = req.params;
  const result = await commentController.deleteCommentById(req.user.id, req.user.role, id);
  res.status(200).json(result);
}

module.exports = {
  getCommentsByRecipeId,
  createCommentByRecipeId,
  updateCommentById,
  deleteCommentById
}