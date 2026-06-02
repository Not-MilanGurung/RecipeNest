import mongoose from "mongoose";

export interface IRating {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  recipe: mongoose.Types.ObjectId;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new mongoose.Schema<IRating>(
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
  value: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "Rating is required"],
  },
});

ratingSchema.index({ user: 1, recipe: 1 }, { unique: true });

const Rating = mongoose.model("Rating", ratingSchema);
export default Rating;
