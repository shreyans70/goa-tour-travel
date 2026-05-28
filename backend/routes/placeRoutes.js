const express = require('express');
const router = express.Router();
const {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace
} = require('../controllers/placeController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Public routes
router.get('/', getPlaces);
router.get('/:id', getPlaceById);

// Admin routes
router.post('/admin', protect, admin, createPlace);
router.put('/admin/:id', protect, admin, updatePlace);
router.delete('/admin/:id', protect, admin, deletePlace);

module.exports = router;
