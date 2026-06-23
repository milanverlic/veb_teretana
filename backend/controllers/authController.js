const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Registracija novog korisnika
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Provera da li korisnik već postoji
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: 'Korisnik sa ovim email-om već postoji' });
    }

    // Hešovanje (šifrovanje) lozinke pre upisa u bazu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Kreiranje korisnika
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role // Može biti 'user' ili 'admin'
    });

    res.status(201).json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Login korisnika
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Provera da li email postoji
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Pogrešni kredencijali' });
    }

    // Provera da li je šifra ispravna
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Pogrešni kredencijali' });
    }

    // Vraćamo uspeh i osnovne podatke (kasnije ćemo ovde dodati JWT token)
    res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};