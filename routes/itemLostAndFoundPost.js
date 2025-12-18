const express = require('express');
const router = express.Router();
const { createItem, getAllItems, getItemById, getMyItems, updateItemStatus, searchItems } = require('../controllers/itemLostAndFoundPost.js');
const upload = require('../middleware/upload');
const requireAuth = require('../middleware/auth');

// public routes
router.get('/search', searchItems);

router.get('/', getAllItems);
router.get('/:id', getItemById);

// protected routes
router.get('/my/items', requireAuth, getMyItems);
router.post('/', requireAuth, upload.single('image'), createItem);
router.patch('/:id', requireAuth, updateItemStatus);

module.exports = router;
