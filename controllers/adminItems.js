const Item = require('../models/itemLostAndFoundPost');

const getAllItemsAdmin = async (req, res) => {
  try {
    const items = await Item.find()
      .populate('postedBy', 'username email role')
      .sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getAllItemsAdmin };
