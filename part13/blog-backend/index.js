require("dotenv").config();
const express = require("express");
const app = express();
const pool = require("./db");

app.use(express.json());

// Get all blog posts
app.get("/api/blogs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM blogs");
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/blogs failed", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Test database connection
app.get("/api/test-db", async (req, res) => {
  console.log(req.body);
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows[0]);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
