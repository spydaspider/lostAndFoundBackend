const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
  getAllClaimsAdmin,
  updateClaimStatus
} = require('../controllers/adminClaimController');

router.get('/claims', adminAuth, getAllClaimsAdmin);
router.patch('/claims/:id', adminAuth, updateClaimStatus);

module.exports = router;
