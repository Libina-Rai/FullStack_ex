const jwt = require("jsonwebtoken");
const User = require("../models/user");

const tokenExtractor = (req, res, next) => {
  const auth = req.get("authorization");

  if (auth && auth.startsWith("Bearer ")) {
    req.token = auth.replace("Bearer ", "");
  }

  next();
};

const userExtractor = async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.token, process.env.SECRET);

    req.user = await User.findByPk(decoded.id);

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { tokenExtractor, userExtractor };
