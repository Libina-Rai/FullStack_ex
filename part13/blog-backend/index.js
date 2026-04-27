const express = require("express");
const app = express();
const pool = require("./db");
require("dotenv").config();

app.use(express.json());

app.get("/api/blogs", async (req, res) => {
  const result = await pool.query("SELECT * FROM blogs");
  res.json(result.rows);
});

app.get("/api/test-db", async (req, res) => {
  console.log(req.body);
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows[0]);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
