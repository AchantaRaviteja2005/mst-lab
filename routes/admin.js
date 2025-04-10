const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Contact = require('../models/Contact');
const { isAdmin } = require('../middleware/auth');

// Admin login page
router.get('/login', (req, res) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin-login', {
    title: 'Admin Login',
    user: req.session.user
  });
});

// Admin dashboard
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    // Get stats for dashboard
    const totalUsers = await User.countDocuments();
    const totalMessages = await Contact.countDocuments();
    const unreadMessages = await Contact.countDocuments({ status: 'unread' });
    
    // Get recent messages
    const recentMessages = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.render('admin-dashboard', {
      title: 'Admin Dashboard',
      user: req.session.user,
      stats: {
        totalUsers,
        totalMessages,
        unreadMessages
      },
      recentMessages
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load admin dashboard',
      user: req.session.user
    });
  }
});

// Admin setup page
router.get('/setup', (req, res) => {
  res.render('admin-setup', {
    title: 'Admin Setup',
    user: req.session.user
  });
});

// Admin setup API
router.post('/setup-api', async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB connection state:', mongoose.connection.readyState);
      
      // Try to reconnect
      try {
        await mongoose.connect('mongodb://localhost:27017/fitracker', {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        console.log('MongoDB reconnected successfully');
      } catch (connError) {
        console.error('MongoDB reconnection failed:', connError);
        return res.status(500).json({
          success: false,
          message: 'Database connection failed. Please make sure MongoDB is running.'
        });
      }
    }

    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Only one admin user can exist in the system. Current admin: ' + adminExists.username
      });
    }
    
    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [
        { username: 'admin' },
        { email: 'admin@fitracker.com' }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'A user with this username or email already exists'
      });
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
    
    res.json({ 
      success: true, 
      message: 'Admin user created successfully',
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    console.error('Admin setup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create admin user: ' + error.message,
      error: error.toString()
    });
  }
});

// User management page
router.get('/users', isAdmin, async (req, res) => {
  try {
    // Get all users
    const users = await User.find().select('username email role');
    
    res.render('admin-users', {
      title: 'User Management',
      user: req.session.user,
      users: users
    });
  } catch (error) {
    console.error('User management error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load user management page',
      user: req.session.user
    });
  }
});

// Delete user
router.post('/delete-user', isAdmin, async (req, res) => {
  try {
    const { userId, password } = req.body;
    const adminId = req.session.user.id;
    
    // Validate input
    if (!userId || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID and your password are required' 
      });
    }
    
    // Verify admin password
    const adminUser = await User.findById(adminId);
    const isMatch = await adminUser.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Your password is incorrect' 
      });
    }
    
    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Prevent deleting admin user
    if (targetUser.role === 'admin') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete admin user' 
      });
    }
    
    // Delete user's contact messages
    await Contact.deleteMany({ userId: userId });
    
    // Delete user
    await User.findByIdAndDelete(userId);
    
    res.json({ 
      success: true, 
      message: 'User and associated data deleted successfully' 
    });
  } catch (error) {
    console.error('User deletion error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete user: ' + error.message 
    });
  }
});

// Transfer admin privileges to another user
router.post('/transfer-admin', isAdmin, async (req, res) => {
  try {
    const { userId, password } = req.body;
    const adminId = req.session.user.id;
    
    // Validate input
    if (!userId || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID and your password are required' 
      });
    }
    
    // Verify admin password
    const adminUser = await User.findById(adminId);
    const isMatch = await adminUser.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Your password is incorrect' 
      });
    }
    
    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'Target user not found' 
      });
    }
    
    // Start a session to ensure atomic operations
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Remove admin role from current admin
      adminUser.role = 'user';
      await adminUser.save({ session });
      
      // Add admin role to target user
      targetUser.role = 'admin';
      await targetUser.save({ session });
      
      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
      
      // Update session data
      req.session.user.role = 'user';
      
      res.json({ 
        success: true, 
        message: 'Admin privileges transferred successfully' 
      });
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error('Admin transfer error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to transfer admin privileges: ' + error.message 
    });
  }
});

module.exports = router;