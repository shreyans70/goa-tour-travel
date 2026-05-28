const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookings,
  updateBookingStatus
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);

// Admin routes
router.get('/admin', protect, admin, getBookings);
router.put('/admin/:id/status', protect, admin, updateBookingStatus);

module.exports = router;
