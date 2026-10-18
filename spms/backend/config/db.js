const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/spms';
    
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('💡 Tip: Make sure your MongoDB connection string is set correctly in .env (MONGO_URI) and your MongoDB server/Atlas is running.');
  }
};

module.exports = connectDB;
