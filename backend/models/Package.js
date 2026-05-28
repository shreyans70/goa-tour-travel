const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discountPercent: { type: Number },
  offerTag: { type: String },
  duration: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  images: { type: [String], default: [] },
  description: { type: String, required: true },
  placesCovered: { type: [String], required: true },
  hotelIncluded: { type: Boolean, default: false },
  foodIncluded: { type: Boolean, default: false },
  transportIncluded: { type: Boolean, default: false },
  itinerary: { type: [String], required: true },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

const Package = mongoose.model('Package', packageSchema);
module.exports = Package;
