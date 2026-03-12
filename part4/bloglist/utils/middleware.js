const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userExtractor = async(req, res, next) => {
   const authorization = req.get('authorization');

  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'token missing' });
  }

   const token = authorization.replace('Bearer ', '');

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET);
  } catch {
    return res.status(401).json({ error: 'token invalid' });
  }

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' });
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return res.status(404).json({ error: 'user not found' });
  }

  // Attach the user to the request object
  req.user = user;

  next();
};

module.exports = { userExtractor };