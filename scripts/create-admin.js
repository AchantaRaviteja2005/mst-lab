const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fitracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB connected successfully');
  
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('Only one admin user can exist in the system. Current admin:', adminExists.username);
      console.log('If you need to create a new admin, please remove the existing admin first.');
      process.exit(0);
    }
    
    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [
        { username: 'admin' },
        { email: 'admin@fitracker.com' }
      ]
    });
    
    if (existingUser) {
      console.log('A user with this username or email already exists');
      process.exit(0);
    }
    
    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@fitracker.com',
      password: 'admin123', // This will be hashed by the pre-save hook
      role: 'admin',
      profile: {
        age: 30,
        height: "6'0\"",
        accountType: 'Admin'
      },
      fitnessData: {
        water: 2.5,
        caloriesIn: 2000,
        caloriesOut: 500,
        fitnessScore: 8.5
      }
    });
    
    const savedUser = await adminUser.save();
    console.log('Admin user created successfully:', savedUser.username);
    
    process.exit(0);
  } catch (error) {
    console.error('Admin setup error:', error);
    process.exit(1);
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});