import express from "express";
import { createOrder,getOrdersByUser } from "../controllers/order.controller.js"; // Đảm bảo đúng đường dẫn controller

const router = express.Router();

// Đường dẫn: POST /api/orders/create
router.post("/create", createOrder);

// Đường dẫn: GET /api/orders/user/:userId
router.get("/user/:userId", getOrdersByUser);

export default router;