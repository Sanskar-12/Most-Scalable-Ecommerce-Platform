import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    comment: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, "Please give rating"],
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.model("Review", schema);
