const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Učitavanje eksternih podešavanja iz .env fajla
dotenv.config();

const app = express();

// Middleware (Posrednici)
app.use(cors()); // Omogućava React-u sa porta 3000 da šalje zahteve ovom serveru
app.use(express.json()); // Omogućava serveru da čita podatke u JSON formatu

// Osnovna test ruta
app.get('/api', (req, res) => {
  res.send('FitFlow serverski sloj radi uspešno!');
});

// Port na kome će server slušati (5000)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server je pokrenut na portu ${PORT}`);
});