import mongoose from 'mongoose';

/** * Sử dụng biến global để duy trì kết nối qua các lần gọi API (đặc biệt hữu ích trên Vercel)
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // 1. Đưa việc lấy biến vào trong hàm để đảm bảo dotenv đã load xong
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('LỖI: Vui lòng định nghĩa biến MONGODB_URI trong file .env');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, 
    };

    console.log("⏳ Đang kết nối đến MongoDB...");
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("✅ Kết nối MongoDB thành công");
      return mongooseInstance;
    }).catch((err) => {
      console.error("❌ Lỗi kết nối MongoDB:", err.message);
      cached.promise = null; // Reset promise để có thể thử lại lần sau
      throw err;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;