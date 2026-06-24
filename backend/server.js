const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Workout = require('./models/Workout');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

console.log('Pokušavam povezivanje sa MongoDB Atlasom...');
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ USPEH: MongoDB Atlas je uspešno povezan!');
    
    // --- AUTOMATSKO ČIŠĆENJE LOŠIH PODATAKA IZ KOLEKCIJE WORKOUTS ---
    try {
      console.log('🔍 Pokrećem skeniranje i čišćenje nevalidnih treninga...');
      const allWorkouts = await Workout.find({});
      let obrisano = 0;

      for (let w of allWorkouts) {
        if (!w.user || !mongoose.Types.ObjectId.isValid(w.user.toString())) {
          await Workout.findByIdAndDelete(w._id);
          obrisano++;
        }
      }
      if (obrisano > 0) {
        console.log(`🧹 USPEŠNO OBRISANO: ${obrisano} korumpiranih treninga iz baze podataka!`);
      } else {
        console.log('✨ Svi treninzi u bazi imaju ispravan format korisničkog ID-ja.');
      }
    } catch (cleanErr) {
      console.error('Greška tokom čišćenja baze:', cleanErr.message);
    }

    // --- AUTOMATSKO KREIRANJE ADMINA (Podešen ispravan username Milan) ---
    try {
      const adminEmail = 'verlicmilan@gmail.com';
      const adminExists = await User.findOne({ email: adminEmail });
      
      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('sifra123', salt);
        await User.create({
          name: 'Milan Verlić',
          username: 'milan', // Postavljen čist username za prikaz u zajednici
          email: adminEmail,
          password: hashedPassword,
          role: 'admin'
        });
        console.log('🚀 Admin nalog uspešno kreiran sa username: @milan');
      }
    } catch (adminErr) {
      console.error('Greška pri proveri admina:', adminErr.message);
    }
  })
  .catch((err) => console.error('❌ GREŠKA SA BAZOM:', err.message));

// Kontroleri
const { getExercises, createExercise } = require('./controllers/exerciseController');
const { createWorkout, getUserWorkouts, getPreviousExerciseInfo } = require('./controllers/workoutController');
const { createPost, getPosts, likePost } = require('./controllers/postController'); // DODAT likePost KONTROLER

let register, login;
try {
  const authCtrl = require('./controllers/authController');
  register = authCtrl.register;
  login = authCtrl.login;
} catch (e) {
  try {
    const userCtrl = require('./controllers/userController');
    register = userCtrl.register;
    login = userCtrl.login;
  } catch (err) {
    console.log('❌ Kritično: Ne mogu da uvezem register i login funkcije!');
  }
}

// 1. Rute za KORISNIKE
if (register && login) {
  app.post('/api/auth/register', register);
  app.post('/api/auth/login', login);
  app.post('/api/users', register);
  app.post('/api/users/login', login);
}

// 2. Rute za VEŽBE
app.get('/api/exercises', getExercises);
app.post('/api/exercises', createExercise);

// 3. Rute za treninge
app.post('/api/workouts', createWorkout);
app.get('/api/workouts/user/:userId', getUserWorkouts);
app.get('/api/workouts/previous/:userId/:exerciseId', getPreviousExerciseInfo);

// 4. Rute za objave u zajednici (DODATA RUTA ZA LAJK!)
app.get('/api/posts', getPosts);
app.post('/api/posts', createPost);
app.put('/api/posts/:id/like', likePost); // Mapirana tačna ruta koju frontend sa slike traži!

app.get('/', (req, res) => {
  res.send('FitFlow API radi...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server uspešno pokrenut na portu ${PORT}`);
});