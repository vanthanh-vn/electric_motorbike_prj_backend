import express from "express";
import { createOrder } from "../controllers/order.controller.js"; // Đảm bảo đúng đường dẫn controller

const router = express.Router();

// Đường dẫn: POST /api/orders/create
router.post("/create", createOrder);

export default router;