const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

console.log('Pokušavam povezivanje sa MongoDB Atlasom...');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ USPEH: MongoDB Atlas je uspešno povezan!'))
  .catch((err) => console.error('❌ GREŠKA SA BAZOM:', err.message));

// Kontroleri
const { createWorkout, getUserWorkouts, getPreviousExerciseInfo } = require('./controllers/workoutController');
const { createPost, getPosts } = require('./controllers/postController');

// Rute za vežbe
try {
  app.use('/api/exercises', require('./routes/exerciseRoutes'));
} catch (e) {
  console.log('Problem sa uvozom exerciseRoutes, preskačem...');
}

// Rute za treninge
app.post('/api/workouts', createWorkout);
app.get('/api/workouts/user/:userId', getUserWorkouts);
app.get('/api/workouts/previous/:userId/:exerciseId', getPreviousExerciseInfo);

// Rute za objave u zajednici
app.post('/api/posts', createPost);
app.get('/api/posts', getPosts);

app.get('/', (req, res) => {
  res.send('FitFlow API radi...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server uspešno pokrenut na portu ${PORT}`);
});