import mongoose from "mongoose";

const MotorbikeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      default: "VinFast",
      trim: true,
    },

    // 🔥 LIÊN KẾT CATEGORY
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      trim: true,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    status: {
      type: Number,
      default: 1,
      enum: [0, 1],
    },

    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Motorbike ||
  mongoose.model("Motorbike", MotorbikeSchema);
