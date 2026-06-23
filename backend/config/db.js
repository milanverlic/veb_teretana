const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Pokušaj povezivanja korišćenjem URI-ja iz .env fajla
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Povezan: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Greška pri povezivanju sa bazom: ${error.message}`);
    process.exit(1); // Gasi server ako povezivanje ne uspe
  }
};

module.exports = connectDB;