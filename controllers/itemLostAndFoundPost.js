const Item = require('../models/itemLostAndFoundPost.js');
const bcrypt = require('bcrypt');
// Create a new lost/found item
const createItem = async (req, res) => {
  try {
    console.log('REQ.BODY:', req.body);
    console.log('REQ.FILE:', req.file);

    const { title, description, category, locationText, verificationQuestion, verificationAnswer } = req.body;

    if (!title || !description || !category || !locationText || !verificationQuestion || !verificationAnswer) {
      throw new Error('All fields are required');
    }

    if (!req.file) {
      throw new Error('Image is required');
    }

    // Placeholder: image path (replace later with cloud upload URL)

    const imageUrl = `uploads/${req.file.filename}`;


    // Hash verification answer for security
    const salt = await bcrypt.genSalt(10);
    const answerHash = await bcrypt.hash(verificationAnswer, salt);

    // Save item
    const item = await Item.create({
      title,
      description,
      category,
      locationText,
      imageUrl,
      verificationQuestion,
      verificationAnswerHash: answerHash,
      postedBy: req.user._id
    });

    // Return clean response (no hashed answer)
    res.status(201).json({
      _id: item._id,
      title: item.title,
      description: item.description,
      category: item.category,
      locationText: item.locationText,
      imageUrl: item.imageUrl,  // this is what client can use
      verificationQuestion: item.verificationQuestion,
      status: item.status,
      postedBy: item.postedBy,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getAllItems = async (req, res) => {
  try {
    const items = await Item.find({})
      .populate('postedBy', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


/**
 * Get single item by ID
 */
const getItemById = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findById(id).populate(
      'postedBy',
      'username email'
    );

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ error: 'Invalid item ID' });
  }
};

/**
 * Get items created by the logged-in user
 */
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Update item status (open → claimed → closed)
 * Only the owner can update
 */
const updateItemStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    item.status = status;
    await item.save();

    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const searchItems = async (req, res) => {
  try {
    const { category, location, fromDate, toDate } = req.query;

    // Base filter: only open items
    let filter = { status: 'open' };

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by location text (partial match, case-insensitive)
    if (location) {
      filter.locationText = { $regex: location, $options: 'i' };
    }

    // Filter by date range
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) {
        filter.createdAt.$gte = new Date(fromDate);
      }
      if (toDate) {
        filter.createdAt.$lte = new Date(toDate);
      }
    }

    const items = await Item.find(filter)
      .populate('postedBy', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  getMyItems,
  updateItemStatus,
  searchItems
};
