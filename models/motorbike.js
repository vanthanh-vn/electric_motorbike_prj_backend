import mongoose from "mongoose";

const MotorbikeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    battery: {
      type: Number,
    },
  },
  { timestamps: true }
);

// collection = motorbikes
export default mongoose.models.Motorbike ||
  mongoose.model("Motorbike", MotorbikeSchema, "motorbikes");
