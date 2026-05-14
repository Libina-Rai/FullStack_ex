const router = require("express").Router();
const { pool } = require("../util/db");
const { userExtractor } = require("../util/middleware");

// Get all blogs
router.get("/", async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT
        blogs.id,
        blogs.title,
        blogs.author,
        blogs.url,
        blogs.likes,
        blogs.user_id,
        users.id AS u_id,
        users.name,
        users.username
      FROM blogs
      LEFT JOIN users
      ON blogs.user_id = users.id
    `);

    const blogs = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      author: row.author,
      url: row.url,
      likes: row.likes,
      user: row.user_id
        ? {
            id: row.u_id,
            name: row.name,
            username: row.username,
          }
        : null,
    }));

    res.json(blogs);
  } catch (err) {
    next(err);
  }
});

// Create blog
router.post("/", userExtractor, async (req, res, next) => {
  const { title, author, url } = req.body;

  const result = await pool.query(
    "INSERT INTO blogs (title, author, url, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [title, author, url, req.user.id],
  );

  res.status(201).json(result.rows[0]);
});

// Delete blog
router.delete("/:id", userExtractor, async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await pool.query("SELECT * FROM blogs WHERE id = $1", [id]);

    const blog = result.rows[0];

    if (!blog) {
      return res.status(404).json({ error: "blog not found" });
    }

    if (blog.user_id !== req.user.id) {
      return res.status(403).json({ error: "not allowed to delete this blog" });
    }

    await pool.query("DELETE FROM blogs WHERE id = $1", [id]);

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// Update blog (only likes)
router.put("/:id", userExtractor, async (req, res, next) => {
  const id = req.params.id;
  const { likes } = req.body;

  try {
    const result = await pool.query(
      "UPDATE blogs SET likes = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [likes, id, req.user.id],
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

console.log("DATABASE:", process.env.DATABASE_URL);

module.exports = router;
