const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  about: { type: String }
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = Gallery;
