import Car from "../models/car.js";
import Category from "../models/category.js";
import { connectDB } from "../libs/db.js";

// GET /api/cars
export async function getAllCars(req, res) {
  try {
    await connectDB();

    // 1. Thêm 'rating' vào danh sách lấy từ query
    const { status, category, minPrice, maxPrice, rating } = req.query;
    const filter = {};

    if (status !== undefined) filter.status = Number(status);
    if (category) filter.category = category;

    // Lọc theo giá
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // 2. --- BỔ SUNG LOGIC LỌC RATING ---
    // Nếu client gửi rating (ví dụ 4), lấy các xe có rating >= 4
    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    const cars = await Car.find(filter)
      .populate("category", "name slug type")
      .sort({ rating: -1, createdAt: -1 }); // Vẫn giữ sắp xếp điểm cao lên đầu

    res.json({
      success: true,
      count: cars.length,
      data: cars,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/cars/:id
export async function getCarById(req, res) {
  try {
    await connectDB();

    const car = await Car.findById(req.params.id).populate(
      "category",
      "name slug type"
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.json({ success: true, data: car });
  } catch {
    res.status(400).json({ success: false, message: "Invalid ID" });
  }
}

// POST /api/cars
export async function createCar(req, res) {
  try {
    await connectDB();

    const { category } = req.body;

    // --- BẮT ĐẦU ĐOẠN KIỂM TRA LOGIC ---
    // Tìm xem category có tồn tại VÀ có type là "car" hay không
    if (category) {
      const validCategory = await Category.findOne({
        _id: category,
        type: "car", // Bắt buộc phải là car
      });

      if (!validCategory) {
        return res.status(400).json({
          success: false,
          message: "Danh mục không hợp lệ! Vui lòng chọn danh mục dành cho Ô tô.",
        });
      }
    }
    // --- KẾT THÚC ĐOẠN KIỂM TRA LOGIC ---

    const car = await Car.create(req.body);

    res.status(201).json({
      success: true,
      data: car,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// PUT /api/cars/:id
export async function updateCar(req, res) {
  try {
    await connectDB();

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.json({ success: true, data: car });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// DELETE /api/cars/:id
export async function deleteCar(req, res) {
  try {
    await connectDB();

    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.json({
      success: true,
      message: "Car deleted",
    });
  } catch {
    res.status(400).json({ success: false, message: "Invalid ID" });
  }
}
