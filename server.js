import express from "express";
import dotenv from "dotenv";
import motorbikeRoutes from "./routes/motorbike.route.js";
import categoryRoutes from "./routes/category.route.js";
dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/motorbikes", motorbikeRoutes);

app.use("/api/categories", categoryRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
