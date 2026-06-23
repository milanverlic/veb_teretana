const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const workoutRoutes = require('./routes/workoutRoutes');
const authRoutes = require('./routes/authRoutes'); // 1. Uvozimo auth rute

dotenv.config();

connectDB();

const app = express();

app.use(cors()); 
app.use(express.json()); 

// Test ruta
app.get('/api', (req, res) => {
  res.send('FitFlow serverski sloj radi uspešno!');
});

// Rute aplikacije
app.use('/api/workouts', workoutRoutes);
app.use('/api/auth', authRoutes); // 2. Vezujemo za /api/auth URL
app.use('/api/exercises', require('./routes/exerciseRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server je pokrenut na portu ${PORT}`);
});