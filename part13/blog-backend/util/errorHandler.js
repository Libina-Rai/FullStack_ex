const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  // Sequelize validation errors
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      error: err.errors.map((e) => e.message),
    });
  }

  // Sequelize unique constraint errors
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      error: err.errors.map((e) => e.message),
    });
  }

  // default error response
  res.status(500).json({
    error: "Something went wrong",
  });
};

module.exports = errorHandler;
