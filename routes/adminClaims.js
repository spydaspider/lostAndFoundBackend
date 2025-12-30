const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
  getAllClaimsAdmin,
  updateClaimStatus,
  getActiveClaimsAdmin,
  getResolvedClaimsAdmin
} = require('../controllers/adminClaimController');

router.get('/claims', adminAuth, getAllClaimsAdmin);
router.get('/claims/pending',adminAuth, getActiveClaimsAdmin);
router.get('/claims/approved', adminAuth, getResolvedClaimsAdmin);
router.patch('/claims/:id', adminAuth, updateClaimStatus);


module.exports = router;
