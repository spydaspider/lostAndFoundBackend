const jwt = require('jsonwebtoken');
const User = require('../models/user');

const adminAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await User.findById(decoded._id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access only' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = adminAuth;
