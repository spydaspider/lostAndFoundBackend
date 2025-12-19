const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');
const { adminLogin } = require('../controllers/users.js');
const {
  deactivateUser,
  reactivateUser,
  deleteUser
} = require('../controllers/adminUserController');
const requireAdmin = require('../middleware/requireAdmin');

router.post('/login', adminLogin);
//  Admin user management
router.patch('/users/:id/deactivate', auth, requireAdmin, deactivateUser);
router.patch('/users/:id/reactivate', auth, requireAdmin, reactivateUser);
router.delete('/users/:id', auth, requireAdmin, deleteUser);


module.exports = router;