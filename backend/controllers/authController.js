const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Registracija novog korisnika (Sa zabranom lažnih admina)
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    // --- STROGA ZABRANA: Provera neovlašćenog admina ---
    if ((role === 'admin' || role === 'Administrator') && email !== 'verlicmilan@gmail.com') {
      return res.status(403).json({ 
        success: false, 
        error: 'Nemate ovlašćenje da se registrujete kao administrator!' 
      });
    }

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

    // Ako je email onaj pravi, stavljamo ulogu admin, inače je običan korisnik
    const finalRole = email === 'verlicmilan@gmail.com' ? 'admin' : 'user';

    user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      role: finalRole
    });

    const userData = { id: user._id, _id: user._id, name: user.name, username: user.username, email: user.email, role: user.role };

    res.status(201).json({ 
      success: true, 
      data: userData,
      user: userData
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Login korisnika (Sa auto-kreiranjem admina u slučaju kiksa)
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // INTERVENTNA LOGIKA: Ako se unese admin mejl, a baza ga je obrisala/kiksala, pravimo ga odmah!
    if (email === 'verlicmilan@gmail.com' && password === 'sifra123') {
      let adminUser = await User.findOne({ email: 'verlicmilan@gmail.com' });
      if (!adminUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('sifra123', salt);
        adminUser = await User.create({
          name: 'Milan Verlić',
          username: 'admin',
          email: 'verlicmilan@gmail.com',
          password: hashedPassword,
          role: 'admin'
        });
      }
      
      const adminData = { id: adminUser._id, _id: adminUser._id, name: adminUser.name, email: adminUser.email, role: adminUser.role };
      return res.status(200).json({ success: true, data: adminData, user: adminData });
    }

    // Standardna provera za sve ostale korisnike
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