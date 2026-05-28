const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  about: { type: String, required: false },
  bestTime: { type: String, required: true },
  entryFee: { type: String, required: true },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

const Place = mongoose.model('Place', placeSchema);
module.exports = Place;
