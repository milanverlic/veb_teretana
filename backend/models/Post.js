const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  // Šablon treninga koji se deli u zajednici
  workoutTemplate: {
    duration: String,
    exercises: [
      {
        exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
        name: String,      // Pamti ime ako vežba ne postoji kod drugog korisnika
        category: String,  // Pamti kategoriju
        sets: [
          {
            weight: Number,
            reps: Number
          }
        ]
      }
    ]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);