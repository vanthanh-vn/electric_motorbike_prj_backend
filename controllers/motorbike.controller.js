import Motorbike from "../models/motorbike.js";
import Category from "../models/category.js";
import { connectDB } from "../libs/db.js";

/**
 * GET /api/motobikes
 */
export async function getAllMotorbikes(req, res) {
  try {
    await connectDB();

    const { status, category, minPrice, maxPrice, rating, keyword } = req.query;

    const filter = {};

    // 1. Status
    if (status !== undefined) {
      filter.status = Number(status);
    }

    // 2. Category
    if (category) {
      filter.category = category;
    }

    // 3. Keyword - Tìm kiếm tương đối (chứa từ khoá)
    if (keyword && keyword.trim() !== "") {
      filter.name = { $regex: keyword.trim(), $options: "i" };
    }

    // 4. Price
    if (minPrice || maxPrice) {
      const priceQuery = {};
      let hasPriceFilter = false;

      if (minPrice && !isNaN(Number(minPrice))) {
        priceQuery.$gte = Number(minPrice);
        hasPriceFilter = true;
      }

      if (maxPrice && !isNaN(Number(maxPrice))) {
        priceQuery.$lte = Number(maxPrice);
        hasPriceFilter = true;
      }

      if (hasPriceFilter) {
        filter.price = priceQuery;
      }
    }

    // 5. Rating
    if (rating && !isNaN(Number(rating))) {
      filter.rating = { $gte: Number(rating) };
    }

    console.log("🔍 Motorbike Filter Query:", JSON.stringify(filter, null, 2));

    const data = await Motorbike.find(filter)
      .populate("category", "name slug type")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("Lỗi API Motorbike:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * GET /api/motobikes/:id
 */
export async function getMotorbikeById(req, res) {
  try {
    await connectDB();

    const motorbike = await Motorbike
      .findById(req.params.id)
      .populate("category", "name slug type");

    if (!motorbike) {
      return res.status(404).json({
        success: false,
        message: "Motorbike not found",
      });
    }

    res.json({
      success: true,
      data: motorbike,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }
}

/**
 * POST /api/motobikes
 */
export async function createMotorbike(req, res) {
  try {
    await connectDB();

    const { category } = req.body;

    // --- KIỂM TRA CATEGORY HỢP LỆ ---
    if (category) {
      const validCategory = await Category.findOne({
        _id: category,
        type: "motorbike", // Bắt buộc phải là motorbike
      });

      if (!validCategory) {
        return res.status(400).json({
          success: false,
          message: "Danh mục không hợp lệ! Vui lòng chọn danh mục dành cho Xe máy.",
        });
      }
    }

    const motorbike = await Motorbike.create(req.body);

    res.status(201).json({
      success: true,
      data: motorbike,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

/**
 * PUT /api/motobikes/:id
 */
export async function updateMotorbike(req, res) {
  try {
    await connectDB();

    const motorbike = await Motorbike.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!motorbike) {
      return res.status(404).json({
        success: false,
        message: "Motorbike not found",
      });
    }

    res.json({
      success: true,
      data: motorbike,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

/**
 * DELETE /api/motobikes/:id
 */
export async function deleteMotorbike(req, res) {
  try {
    await connectDB();

    const motorbike = await Motorbike.findByIdAndDelete(req.params.id);

    if (!motorbike) {
      return res.status(404).json({
        success: false,
        message: "Motorbike not found",
      });
    }

    res.json({
      success: true,
      message: "Motorbike deleted",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }
}