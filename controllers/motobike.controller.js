import Motorbike from "../models/Motorbike.js";
import { connectDB } from "../lib/db.js";

// GET /api/motorbikes
export async function getAllMotorbikes(req, res) {
  try {
    await connectDB();
    const data = await Motorbike.find();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// POST /api/motorbikes
export async function createMotorbike(req, res) {
  try {
    await connectDB();
    const motorbike = await Motorbike.create(req.body);
    res.status(201).json({ success: true, data: motorbike });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}
