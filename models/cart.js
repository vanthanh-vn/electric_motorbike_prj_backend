import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Tạm thời dùng String giả lập nếu bạn chưa code phần Login User
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID của xe
        productType: { type: String, enum: ['Car', 'Motorbike'], required: true }, // Phân biệt ô tô hay xe máy
        name: String,
        price: Number,
        image: String,
        quantity: { type: Number, default: 1 }
    }],
    totalPrice: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);