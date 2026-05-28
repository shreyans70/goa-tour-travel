const express = require('express');
const router = express.Router();
const {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
} = require('../controllers/packageController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Public routes (or semi-public depending on controller logic)
router.get('/', getPackages);
router.get('/:id', getPackageById);

// Admin routes
router.post('/admin', protect, admin, createPackage);
router.put('/admin/:id', protect, admin, updatePackage);
router.delete('/admin/:id', protect, admin, deletePackage);

module.exports = router;
