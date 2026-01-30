import {
  getAllMotorbikes,
  createMotorbike,
} from "../controllers/motorbike.controller.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return getAllMotorbikes(req, res);
  }

  if (req.method === "POST") {
    return createMotorbike(req, res);
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
