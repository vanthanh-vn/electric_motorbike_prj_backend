import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import motorbikeRoutes from "./routes/motorbike.route.js";
import categoryRoutes from "./routes/category.route.js";
import carRouter from "./routes/car.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/motorbikes", motorbikeRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/orders", orderRouter);

app.use("/api/car",carRouter);

app.use("/api/cart",cartRouter);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
