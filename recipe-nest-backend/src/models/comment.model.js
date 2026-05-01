const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
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
    text: {
      type: String,
      required: [true, "Comment text is required"],
      minlength: [1, "Comment text must be at least 1 character long"],
      maxlength: [500, "Comment text cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  },
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
