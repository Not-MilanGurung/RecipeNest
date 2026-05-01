const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: [true, "Recipe is required"],
    index: true,
  },
  value: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "Rating is required"],
  },
});

ratingSchema.index({ user: 1, recipe: 1 }, { unique: true });

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
