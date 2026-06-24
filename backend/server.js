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

// STRIKTAN UVOZ AUTENTIFIKACIJE (Na osnovu koda koji si poslao)
let register, login;
try {
  // Pokušavamo da učitamo iz authController-a ili userController-a
  const authCtrl = require('./controllers/authController');
  register = authCtrl.register;
  login = authCtrl.login;
} catch (e) {
  try {
    const userCtrl = require('./controllers/userController');
    register = userCtrl.register;
    login = userCtrl.login;
  } catch (err) {
    console.log('❌ Kritično: Ne mogu da uvezem register i login funkcije iz kontrolera!');
  }
}

// Ostali kontroleri
const { createWorkout, getUserWorkouts, getPreviousExerciseInfo } = require('./controllers/workoutController');
const { createPost, getPosts } = require('./controllers/postController');

// 1. Rute za vežbe
try {
  app.use('/api/exercises', require('./routes/exerciseRoutes'));
} catch (e) {
  console.log('Problem sa uvozom exerciseRoutes, preskačem...');
}

// 2. Ručno i sigurno mapiranje autentifikacije na oba česta prefiksa
if (register && login) {
  app.post('/api/auth/register', register);
  app.post('/api/auth/login', login);
  app.post('/api/users', register);
  app.post('/api/users/login', login);
  console.log('✅ STRIKTNO: Povezane rute za login i register!');
}

// 3. Rute za treninge
app.post('/api/workouts', createWorkout);
app.get('/api/workouts/user/:userId', getUserWorkouts);
app.get('/api/workouts/previous/:userId/:exerciseId', getPreviousExerciseInfo);

// 4. Rute za objave u zajednici
app.post('/api/posts', createPost);
app.get('/api/posts', getPosts);

app.get('/', (req, res) => {
  res.send('FitFlow API radi...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server uspešno pokrenut na portu ${PORT}`);
});