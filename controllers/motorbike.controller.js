import Motorbike from "../models/motorbike.js";
import { connectDB } from "../libs/db.js";

export async function getAllMotorbikes(req, res) {
  try {
    await connectDB();
    const data = await Motorbike.find();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function createMotorbike(req, res) {
  try {
    await connectDB();
    const motorbike = await Motorbike.create(req.body);
    res.status(201).json({ success: true, data: motorbike });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}
