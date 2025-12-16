const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controllers/users.js');

router.post('/login', adminLogin);

module.exports = router;