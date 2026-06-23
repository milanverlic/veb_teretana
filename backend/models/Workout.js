const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Trening Snage' // Rešava grešku "Molimo vas unesite naziv treninga"
  },
  duration: {
    type: String,
    required: true
  },
  exercises: [
    {
      exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
      },
      name: {
        type: String,
        default: 'Vežba' // Rešava grešku "Molimo vas unesite naziv vežbe" za starije strukture
      },
      sets: [
        {
          weight: { type: Number, required: true },
          reps: { type: Number, required: true }
        }
      ]
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);