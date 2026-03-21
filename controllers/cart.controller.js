import { connect } from "mongoose";
import Cart from "../models/cart.js";
import connectDB from "../libs/db.js";
export const getCart = async (req, res) => {
    try {
        await connectDB(); // Đảm bảo đã kết nối đến DB trước khi thực hiện truy vấn
        const { userId } = req.params;
        const cart = await Cart.findOne({ userId });
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error("Lỗi tại getCart:", error); 
        // TRẢ THẲNG MÃ LỖI VỀ ĐIỆN THOẠI
        res.status(500).json({ success: false, message: error.message }); 
    }
};
export const addToCart = async (req, res) => {
    try {
        const { userId, productId, productType, name, price, image, quantity = 1 } = req.body;

        // Kiểm tra đầu vào
        if (!userId || !productId) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin User hoặc Sản phẩm" });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        }

        // Ép kiểu productId về String để so sánh cho chuẩn
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, productType, name, price, image, quantity });
        }

        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

        // Lưu và đợi phản hồi từ DB
        const savedCart = await cart.save();
        
        return res.status(200).json({ 
            success: true, 
            message: "Đã thêm vào giỏ hàng thành công", 
            data: savedCart 
        });

    } catch (error) {
        console.error("Lỗi chi tiết tại Backend:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemQuantity = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        if (!userId || !productId || typeof quantity !== 'number') {
            return res.status(400).json({ success: false, message: "Thiếu thông tin hoặc số lượng không hợp lệ" });
        }
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: "Không tìm thấy giỏ hàng" });
        const item = cart.items.find(item => item.productId.toString() === productId.toString());
        if (!item) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm trong giỏ hàng" });
        if (quantity > 0) {
            item.quantity = quantity;
        } else {
            // Nếu quantity <= 0 thì xóa luôn sản phẩm
            cart.items = cart.items.filter(item => item.productId.toString() !== productId.toString());
        }
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        await cart.save();
        return res.status(200).json({ success: true, message: "Cập nhật thành công", data: cart });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Xóa sản phẩm khỏi giỏ hàng (chỉ xóa sản phẩm, không xóa cả giỏ hàng)
export const removeCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        if (!userId || !productId) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin" });
        }
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: "Không tìm thấy giỏ hàng" });
        const beforeCount = cart.items.length;
        cart.items = cart.items.filter(item => item.productId.toString() !== productId.toString());
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        await cart.save();
        if (cart.items.length === beforeCount) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm trong giỏ hàng" });
        }
        return res.status(200).json({ success: true, message: "Đã xóa sản phẩm khỏi giỏ hàng", data: cart });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};