const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Registracija novog korisnika
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: 'Korisnik sa ovim email-om već postoji' });
    }

    let usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ success: false, error: 'Korisničko ime je zauzeto' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      role
    });

    // Vraćamo i 'data' i '_id' i 'id' radi potpune kompatibilnosti sa frontendom
    res.status(201).json({ 
      success: true, 
      data: { id: user._id, _id: user._id, name: user.name, username: user.username, email: user.email, role: user.role },
      user: { id: user._id, _id: user._id, name: user.name, username: user.username, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Login korisnika
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Pogrešni kredencijali' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Pogrešni kredencijali' });
    }

    const userData = { id: user._id, _id: user._id, name: user.name, email: user.email, role: user.role };

    res.status(200).json({
      success: true,
      data: userData,
      user: userData
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};