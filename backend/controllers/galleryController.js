const Gallery = require('../models/Gallery');

// @desc    Get all gallery images
// @route   GET /api/gallery
const getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find({});
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add gallery image
// @route   POST /api/gallery/admin
const addGalleryImage = async (req, res) => {
  try {
    const { title, image, category, about } = req.body;
    const gallery = new Gallery({ title, image, category, about });
    const createdGallery = await gallery.save();
    res.status(201).json(createdGallery);
  } catch (error) {
    res.status(400).json({ message: 'Invalid gallery data', error: error.message });
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/admin/:id
const deleteGalleryImage = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (gallery) {
      await Gallery.deleteOne({ _id: gallery._id });
      res.json({ message: 'Gallery image removed' });
    } else {
      res.status(404).json({ message: 'Gallery image not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update gallery image
// @route   PUT /api/gallery/admin/:id
const updateGalleryImage = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (gallery) {
      Object.assign(gallery, req.body);
      const updatedGallery = await gallery.save();
      res.json(updatedGallery);
    } else {
      res.status(404).json({ message: 'Gallery image not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid gallery data', error: error.message });
  }
};

module.exports = {
  getGallery,
  addGalleryImage,
  deleteGalleryImage,
  updateGalleryImage
};
