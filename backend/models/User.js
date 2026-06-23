const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Molimo vas dodajte ime']
  },
  email: {
    type: String,
    required: [true, 'Molimo vas dodajte email'],
    unique: true, // Ne mogu postojati dva ista email-a u bazi
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Molimo vas dodajte ispravan email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Molimo vas dodajte šifru'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Uloge prema zahtevima projekta
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);