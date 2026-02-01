import express from "express";
import {
  getAllMotorbikes,
  getMotorbikeById,
  createMotorbike,
  updateMotorbike,
  deleteMotorbike,
} from "../controllers/motorbike.controller.js";

const router = express.Router();

router.get("/", getAllMotorbikes);
router.get("/:id", getMotorbikeById);
router.post("/", createMotorbike);
router.put("/:id", updateMotorbike);
router.delete("/:id", deleteMotorbike);

export default router;
