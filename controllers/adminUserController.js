const User = require('../models/user');

const deactivateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User deactivated successfully',
      userId: user._id,
      isActive: user.isActive
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Reactivate user
 */
const reactivateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    res.status(200).json({
      message: 'User reactivated successfully',
      userId: user._id,
      isActive: user.isActive
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete user permanently (optional)
 */
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: 'User deleted permanently'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
    deactivateUser, reactivateUser, deleteUser
}