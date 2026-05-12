const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const User = require("../models/user");

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (!user) {
    return res.status(401).json({ error: "invalid username or password" });
  }

  const passwordCorrect = await bcrypt.compare(password, user.password);

  if (!passwordCorrect) {
    return res.status(401).json({ error: "invalid username or password" });
  }

  const token = jwt.sign(
    { username: user.username, id: user.id },
    process.env.SECRET,
    { expiresIn: "1h" },
  );

  res.json({ token, username: user.username });
});

module.exports = router;
