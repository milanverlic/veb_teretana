const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Grudi', 'Leđa', 'Noge', 'Ramena', 'Ruke', 'Trbušnjaci', 'Kardio'] // Kategorije vežbi
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true // Ovde će ići URL linkovi do slika/GIF-ova
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exercise', exerciseSchema);