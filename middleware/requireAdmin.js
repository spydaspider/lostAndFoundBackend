const User = require('../models/user');

const requireAdmin = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access only' });
  }

  next();
};

module.exports = requireAdmin;
