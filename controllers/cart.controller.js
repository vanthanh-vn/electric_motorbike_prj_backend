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
    console.log("Dữ liệu nhân đc t")
    try {
        // Lấy dữ liệu FE gửi lên
        const { userId, productId, productType, name, price, image, quantity = 1 } = req.body;
        if(!productId){
      return res.status(400).json({ success: false, message: "Thiếu productId rồi bạn ơi!" });
        }
        // 1. Tìm giỏ hàng của user
        let cart = await Cart.findOne({ userId });

        // 2. Nếu chưa từng có giỏ hàng -> Tạo một giỏ hàng rỗng
        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        }

        // 3. Kiểm tra xem xe này đã nằm trong giỏ chưa
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            // Có rồi -> Cộng dồn số lượng
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Chưa có -> Thêm xe mới vào mảng items
            cart.items.push({ productId, productType, name, price, image, quantity });
        }

        // 4. Tính lại tổng tiền của cả giỏ
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

        // 5. Lưu vào DB
        await cart.save();
        
        res.status(200).json({ success: true, message: "Đã thêm vào giỏ hàng", data: cart });

    } catch (error) {
        console.error("Lỗi thêm giỏ hàng:", error);
        res.status(500).json({ success: false, message: "Lỗi Server" });
    }
};