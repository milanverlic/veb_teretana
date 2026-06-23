const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Registracija novog korisnika
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    // 1. Dodaj username ovde u izvlačenje iz req.body
    const { name, username, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: 'Korisnik sa ovim email-om već postoji' });
    }

    // Provera i za jedinstven username
    let usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ success: false, error: 'Korisničko ime je zauzeto' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 2. Dodaj username ovde u kreiranje
    user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ success: true, data: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role } });
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