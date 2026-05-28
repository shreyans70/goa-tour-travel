const express = require('express');
const router = express.Router();
const { signup, login, getMe, getUsers, updateUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/admin/users', protect, admin, getUsers);
router.put('/admin/users/:id', protect, admin, updateUser);

module.exports = router;
