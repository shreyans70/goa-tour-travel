const Place = require('../models/Place');

// @desc    Get all active places
// @route   GET /api/places
const getPlaces = async (req, res) => {
  try {
    const filter = req.user && req.user.role === 'admin' ? {} : { status: 'active' };
    const places = await Place.find(filter);
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single place
// @route   GET /api/places/:id
const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (place) {
      res.json(place);
    } else {
      res.status(404).json({ message: 'Place not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a place
// @route   POST /api/places/admin
const createPlace = async (req, res) => {
  try {
    const place = new Place(req.body);
    const createdPlace = await place.save();
    res.status(201).json(createdPlace);
  } catch (error) {
    res.status(400).json({ message: 'Invalid place data', error: error.message });
  }
};

// @desc    Update a place
// @route   PUT /api/places/admin/:id
const updatePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (place) {
      Object.assign(place, req.body);
      const updatedPlace = await place.save();
      res.json(updatedPlace);
    } else {
      res.status(404).json({ message: 'Place not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid place data', error: error.message });
  }
};

// @desc    Delete a place
// @route   DELETE /api/places/admin/:id
const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (place) {
      await Place.deleteOne({ _id: place._id });
      res.json({ message: 'Place removed' });
    } else {
      res.status(404).json({ message: 'Place not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace
};
