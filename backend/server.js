const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const workoutRoutes = require('./routes/workoutRoutes'); // 1. Uvozimo rute

dotenv.config();

connectDB();

const app = express();

app.use(cors()); 
app.use(express.json()); 

// Test ruta
app.get('/api', (req, res) => {
  res.send('FitFlow serverski sloj radi uspešno!');
});

// 2. Vezujemo rute za specifičan URL endpoint
app.use('/api/workouts', workoutRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server je pokrenut na portu ${PORT}`);
});