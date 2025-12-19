const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { getAllItemsAdmin } = require('../controllers/adminItems');

router.get('/items', adminAuth, getAllItemsAdmin);

module.exports = router;
