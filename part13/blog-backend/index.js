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

app.post("/api/blogs", async (req, res) => {
  const { title, author, url } = req.body;

  const result = await pool.query(
    "INSERT INTO blogs (title, author, url) VALUES ($1, $2, $3) RETURNING *",
    [title, author, url],
  );

  res.status(201).json(result.rows[0]);
});

app.delete("/api/blogs/:id", async (req, res) => {
  const id = req.params.id;

  await pool.query("DELETE FROM blogs WHERE id = $1", [id]);

  res.status(204).end();
});

// Test database connection
app.get("/api/test-db", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows[0]);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
