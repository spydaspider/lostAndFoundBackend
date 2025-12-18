const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token, authorization failed' });
  }

  const token = authorization.split(' ')[1];

  try {
    // Decode token
    const { _id } = jwt.verify(token, process.env.SECRET);

    // Attach user to request
    req.user = await User.findById(_id).select('_id username email role');

    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = auth;
