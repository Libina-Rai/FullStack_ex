const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');  // get the header

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.replace('Bearer ', '');
  } else {
    req.token = null;
  }
  next();
};

module.exports = { tokenExtractor };