const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Uvoz kontrolera za treninge direktno ovde
const { 
  createWorkout, 
  getUserWorkouts, 
  getPreviousExerciseInfo 
} = require('./controllers/workoutController');

// Učitavanje varijabli iz .env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Povezivanje sa MongoDB Atlasom
console.log('Pokušavam povezivanje sa MongoDB Atlasom...');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ USPEH: MongoDB Atlas je uspešno povezan!'))
  .catch((err) => {
    console.error('❌ GREŠKA PRI POVEZIVANJU NA MONGO BASE:');
    console.error(err.message);
  });

// 1. Rute za vežbe (preko postojećeg exerciseRoutes fajla)
app.use('/api/exercises', require('./routes/exerciseRoutes'));

// 2. Rute za treninge mapirane DIREKTNO ovde (kako ne bi zavisili od fajlova u routes folderu)
app.post('/api/workouts', createWorkout);
app.get('/api/workouts/user/:userId', getUserWorkouts);
app.get('/api/workouts/previous/:userId/:exerciseId', getPreviousExerciseInfo);

// Osnovna ruta
app.get('/', (req, res) => {
  res.send('FitFlow API radi...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server uspešno pokrenut na portu ${PORT}`);
});