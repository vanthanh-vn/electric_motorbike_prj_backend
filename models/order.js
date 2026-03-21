import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    orderId: { type: String, unique: true, required: true }, // Mã đơn hàng (VD: RE123456)
    items: [{
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    subTotal: Number,
    discount: { type: Number, default: 0 },
    finalPrice: Number,
    status: { type: String, default: "Pending" }, // Trạng thái: Chờ xử lý, Đã giao...
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);