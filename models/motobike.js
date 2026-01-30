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
      type: Number, // dung lượng pin (Ah hoặc kWh)
    },
  },
  { timestamps: true }
);

// tránh lỗi overwrite model khi Vercel hot reload
export default mongoose.models.Motorbike ||
  mongoose.model("Motorbike", MotorbikeSchema);
