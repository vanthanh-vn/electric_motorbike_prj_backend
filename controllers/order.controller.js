import Order from "../models/order.js";
import Cart from "../models/cart.js";

export const createOrder = async (req, res) => {
    try {
        const { userId, cartItems, subTotal, discount, finalPrice } = req.body;

        // 1. Tạo mã đơn hàng ngẫu nhiên (VD: RE + 6 số)
        const orderId = "RE" + Math.floor(100000 + Math.random() * 900000);

        // 2. Tạo bản ghi Order mới
        const newOrder = new Order({
            userId,
            orderId,
            items: cartItems,
            subTotal,
            discount,
            finalPrice,
        });

        await newOrder.save();

        // 3. (Quan trọng) Sau khi thanh toán xong, hãy xóa sạch giỏ hàng của User này
        await Cart.findOneAndDelete({ userId });

        res.status(201).json({ success: true, orderId: orderId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};