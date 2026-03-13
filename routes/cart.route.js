import express from "express";
import { addToCart,getCart } from "../controllers/cart.controller.js";

const router = express.Router();

// Định nghĩa endpoint: POST /api/cart/add
router.post("/add", addToCart);
router.get("/:userId", getCart); // Endpoint: GET /api/cart/user_test_123
export default router;