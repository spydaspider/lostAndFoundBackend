const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { submitClaim, getMyClaims } = require('../controllers/claimController');

router.post('/', auth, submitClaim);
router.get('/my', auth, getMyClaims);


module.exports = router;
