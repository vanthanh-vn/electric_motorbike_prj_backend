import Cart from "../models/cart.js";
export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ userId });
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server" });
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