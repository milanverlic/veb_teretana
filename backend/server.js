const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // 1. Uvozimo db.js fajl

// Učitavanje varijabli iz .env fajla
dotenv.config();

// 2. Pokrećemo povezivanje sa MongoDB bazom
connectDB();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Test ruta
app.get('/api', (req, res) => {
  res.send('FitFlow serverski sloj radi uspešno!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server je pokrenut na portu ${PORT}`);
});