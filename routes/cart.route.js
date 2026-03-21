import express from "express";
import { addToCart, getCart, updateCartItemQuantity, removeCartItem } from "../controllers/cart.controller.js";

const router = express.Router();

// Định nghĩa endpoint: POST /api/cart/add
router.post("/add", addToCart);
router.get("/:userId", getCart); // Endpoint: GET /api/cart/user_test_123
router.post("/update-quantity", updateCartItemQuantity); // Cập nhật số lượng
router.post("/remove-item", removeCartItem); // Xóa sản phẩm

export default router;