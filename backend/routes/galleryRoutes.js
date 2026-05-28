const express = require('express');
const router = express.Router();
const {
  getGallery,
  addGalleryImage,
  deleteGalleryImage,
  updateGalleryImage
} = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', getGallery);
router.post('/admin', protect, admin, addGalleryImage);
router.put('/admin/:id', protect, admin, updateGalleryImage);
router.delete('/admin/:id', protect, admin, deleteGalleryImage);

module.exports = router;
