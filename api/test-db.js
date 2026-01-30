import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/test";

async function test() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Kết nối MongoDB thành công!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi kết nối MongoDB:", err.message);
    process.exit(1);
  }
}

test();
