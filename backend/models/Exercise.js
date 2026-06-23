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
    enum: ['Grudi', 'Leđa', 'Noge', 'Ramena', 'Ruke', 'Trbušnjaci', 'Kardio']
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  // NOVO: Ako je null, u pitanju je sistemska vežba. Ako ima ID, kreirao ju je korisnik.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exercise', exerciseSchema);