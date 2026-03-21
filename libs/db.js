import mongoose from "mongoose";

// Khai báo global để giữ kết nối an toàn tuyệt đối trên Vercel
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  // Nếu đã kết nối thì dùng luôn
  if (cached.conn) {
    console.log("⚡ Đã dùng lại kết nối MongoDB có sẵn!");
    return cached.conn;
  }

  // Nếu chưa có kết nối hoặc đang trong quá trình kết nối
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI; // Đúng tên biến của bạn nhé
    if (!uri) throw new Error("Missing MONGODB_URI");

    console.log("⏳ Đang tạo kết nối mới tới MongoDB...");
    cached.promise = mongoose.connect(uri, { bufferCommands: false }).then((mongoose) => {
      return mongoose;
    });
  }
  
  // Chờ cho đến khi kết nối hoàn tất
  cached.conn = await cached.promise;
  console.log("✅ MongoDB connected an toàn trên Vercel!");
  return cached.conn;
}