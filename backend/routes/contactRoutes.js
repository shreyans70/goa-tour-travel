const express = require('express');
const router = express.Router();
const { createContact, getContacts } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/', createContact);
router.get('/admin', protect, admin, getContacts);

module.exports = router;
