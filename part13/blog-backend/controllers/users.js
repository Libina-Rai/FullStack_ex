const router = require("express").Router();

const User = require("../models/user");

// GET all users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// CREATE user
router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json(user);
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

    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
