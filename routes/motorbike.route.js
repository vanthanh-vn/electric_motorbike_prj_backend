import express from "express";
import {
  getAllMotorbikes,
  createMotorbike,
} from "../controllers/motorbike.controller.js";

const router = express.Router();

router.get("/", getAllMotorbikes);   // GET /api/motorbikes
router.post("/", createMotorbike);   // POST /api/motorbikes

export default router;
