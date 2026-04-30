const ratingService = require('../services/rating.service');

const getRating = async (req, res) => {
  const userId = req.user.id;
  const { recipeId } = req.params;

  const result = await ratingService.getRating(userId, recipeId);
  res.status(200).json(result);
}

const createRatingOrUpdate = async (req, res) => {
  const userId = req.user.id;
  const { recipeId } = req.params;
  const { rating } = req.body;
  if (!rating){
    const error = new Error('Rating value of 1 to 5 is required');
    error.statusCode = 400;
    throw error;
  }

  const result = await ratingService.createRatingOrUpdate(userId, recipeId, rating);
  res.status(200).json(result);
}

module.exports = {
  getRating,
  createRatingOrUpdate
}