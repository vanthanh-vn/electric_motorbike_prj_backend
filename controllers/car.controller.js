import Car from "../models/car.js";
import Category from "../models/category.js";
import { connectDB } from "../libs/db.js";

// GET /api/cars
export async function getAllCars(req, res) {
  try {
    await connectDB();

    const { status, category, minPrice, maxPrice, rating, keyword } = req.query;
    
    // Khởi tạo bộ lọc
    const filter = {};

    // 1. Lọc theo trạng thái (nếu có)
    if (status !== undefined) {
      filter.status = Number(status);
    }

    // 2. Lọc theo danh mục
    if (category) {
      filter.category = category;
    }

    // 3. Lọc theo Tên (Keyword) - LOGIC TÌM KIẾM CHỨA TỪ KHÓA
    if (keyword && keyword.trim() !== "") {
      // $regex: Tìm chuỗi con (gõ 'ho' ra 'honda')
      // $options: 'i' (không phân biệt hoa thường)
      filter.name = { $regex: keyword.trim(), $options: "i" };
    }

    // 4. Lọc theo Giá (Price)
    if (minPrice || maxPrice) {
      const priceQuery = {};
      let hasPriceFilter = false;

      // Chỉ thêm điều kiện nếu minPrice là số hợp lệ
      if (minPrice && !isNaN(Number(minPrice))) {
        priceQuery.$gte = Number(minPrice);
        hasPriceFilter = true;
      }

      // Chỉ thêm điều kiện nếu maxPrice là số hợp lệ
      if (maxPrice && !isNaN(Number(maxPrice))) {
        priceQuery.$lte = Number(maxPrice);
        hasPriceFilter = true;
      }

      // Chỉ gán vào filter chính nếu có ít nhất 1 điều kiện
      if (hasPriceFilter) {
        filter.price = priceQuery;
      }
    }

    // 5. Lọc theo Rating
    if (rating && !isNaN(Number(rating))) {
      filter.rating = { $gte: Number(rating) };
    }

    console.log("🔍 Car Filter Query:", JSON.stringify(filter, null, 2));

    const cars = await Car.find(filter)
      .populate("category", "name slug type")
      .sort({ createdAt: -1 }); // Mới nhất lên đầu

    res.json({
      success: true,
      count: cars.length,
      data: cars,
    });
  } catch (err) {
    console.error("Lỗi API Car:", err);
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

    // --- KIỂM TRA CATEGORY HỢP LỆ ---
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