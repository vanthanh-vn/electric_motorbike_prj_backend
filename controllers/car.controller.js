import Car from "../models/car.js";
import { connectDB } from "../libs/db.js";

// GET /api/cars
export async function getAllCars(req, res) {
  try {
    await connectDB();

    const { status, category, minPrice, maxPrice } = req.query;
    const filter = {};

    if (status !== undefined) filter.status = Number(status);
    if (category) filter.category = category;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const cars = await Car.find(filter)
      .populate("category", "name slug type")
      .sort({ rating: -1, createdAt: -1 });

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
