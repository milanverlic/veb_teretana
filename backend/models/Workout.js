const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Povezujemo trening sa konkretnim korisnikom iz baze
    required: true
  },
  title: {
    type: String,
    required: [true, 'Molimo vas unesite naziv treninga'], // npr. "Push Day", "Legs"
    trim: true
  },
  exercises: [
    {
      name: {
        type: String,
        required: [true, 'Molimo vas unesite naziv vežbe'] // npr. "Squat", "Bench Press"
      },
      sets: [
        {
          reps: { type: Number, required: true }, // Broj ponavljanja
          weight: { type: Number, required: true } // Težina u kg (za progresivni overload)
        }
      ]
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Workout', WorkoutSchema);