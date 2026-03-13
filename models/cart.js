import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [{
        productId: { type: String, required: true }, // Nên để String để tránh lỗi format
        productType: String,
        name: String,
        price: Number,
        image: String,
        quantity: { type: Number, default: 1 }
    }],
    totalPrice: { type: Number, default: 0 }
});

export default mongoose.model("Cart", cartSchema);