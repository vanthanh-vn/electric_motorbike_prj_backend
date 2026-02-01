import Category from "../models/category.js";
import { connectDB } from "../libs/db.js";

export async function getAllCategories(req, res) {
  try {
    await connectDB();

    const { type } = req.query;
    
    const filter = {}; 

    if (type) {
      filter.type = type;
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function createCategory(req, res) {
  try {
    await connectDB();

    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}