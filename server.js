import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB connected");
}

app.get("/", async (req, res) => {
  res.json({
    status: true,
    message: "Kết nối database thành công",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
});
