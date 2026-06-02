import mongoose from "mongoose";

export interface IComment {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  recipe: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
};

const commentSchema = new mongoose.Schema<IComment>(
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
export default Comment;
