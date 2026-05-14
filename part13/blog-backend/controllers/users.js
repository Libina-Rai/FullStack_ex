const router = require("express").Router();
const { pool } = require("../util/db");
const User = require("../models/user");

// GET all users
router.get("/", async (req, res, next) => {
  try {
    const usersResult = await User.findAll();

    const usersWithBlogs = await Promise.all(
      usersResult.map(async (user) => {
        const blogsResult = await pool.query(
          "SELECT id, title, author, url, likes FROM blogs WHERE user_id = $1",
          [user.id],
        );

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          blogs: blogsResult.rows,
        };
      }),
    );

    res.json(usersWithBlogs);
  } catch (err) {
    next(err);
  }
});

// CREATE user
router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      id: user.id,
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    next(err);
  }
});

// UPDATE user's name by username
router.put("/:username", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    user.name = req.body.name;

    await user.save();

    res.json({
      id: user.id,
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
