import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    // 🔥 phân loại lớn
    type: {
      type: String,
      required: true,
      enum: ["motorbike", "car"],
    },

    status: {
      type: Number,
      default: 1,
      enum: [0, 1],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
