const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  // default error response
  res.status(500).json({
    error: "Something went wrong",
  });
};

module.exports = errorHandler;
