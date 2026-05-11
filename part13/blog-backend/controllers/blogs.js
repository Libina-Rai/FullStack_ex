const router = require("express").Router();
const { pool } = require("../util/db");

// Get all blogs
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM blogs");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Create blog
router.post("/", async (req, res, next) => {
  const { title, author, url } = req.body;

  const result = await pool.query(
    "INSERT INTO blogs (title, author, url) VALUES ($1, $2, $3) RETURNING *",
    [title, author, url],
  );

  res.status(201).json(result.rows[0]);
});

// Delete blog
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;

  await pool.query("DELETE FROM blogs WHERE id = $1", [id]);

  res.status(204).end();
});

// Update blog (only likes)
router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  const { likes } = req.body;

  try {
    const result = await pool.query(
      "UPDATE blogs SET likes = $1 WHERE id = $2 RETURNING *",
      [likes, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("PUT /api/blogs/:id failed", error);
    next(error);
  }
});

module.exports = router;
