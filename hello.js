import express from "express";
const app = express();
app.use(express.json());

export default function handler(req, res) {
  res.status(200).json({
    message: "Hello Backend 👋"
  });
}


app.get("/", (_, res) => {
  res.json({ 
    status: true,
    message: "hi",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});