import Motorbike from "../models/motorbike.js";
import Category from "../models/category.js";
import  { connectDB }  from "../libs/db.js";

/**
 * GET /api/motobikes
 * Lấy danh sách xe
 * Có thể filter theo status và sort theo rating
 */
export async function getAllMotorbikes(req, res) {
  try {
    await connectDB();

    const {
      status,
      category,
      minPrice,
      maxPrice,
      rating,
      keyword,
    } = req.query;

    const filter = {};

    // tình trạng
    if (status !== undefined) {
      filter.status = Number(status);
    }

    // category
    if (category) {
      filter.category = category;
    }

    // giá
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // rating
    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    // tìm kiếm tên
    if (keyword) {
      filter.name = { $regex: keyword, $options: "i" };
    }

    const data = await Motorbike
      .find(filter)
      .populate("category", "name slug type")
      .sort({ rating: -1, createdAt: -1 });

    res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}



/**
 * GET /api/motobikes/:id
 * Lấy chi tiết 1 xe
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
 * Tạo xe mới
 */
export async function createMotorbike(req, res) {
  try {
    await connectDB();

    const { category } = req.body;

    // --- BẮT ĐẦU ĐOẠN KIỂM TRA LOGIC ---
    // Tìm xem category có tồn tại VÀ có type là "motorbike" hay không
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
    // --- KẾT THÚC ĐOẠN KIỂM TRA LOGIC ---

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
 * Cập nhật xe
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
 * Xóa xe
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
