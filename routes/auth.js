const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: username },
        { email: username }
      ]
    });
    
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }
    
    // Set session
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      profile: user.profile
    };
    
    res.json({ success: true, redirect: '/' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, password2 } = req.body;
    
    // Check if passwords match
    if (password !== password2) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { username: username },
        { email: email }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }
    
    // Create new user
    const newUser = new User({
      username,
      email,
      password
    });
    
    await newUser.save();
    
    // Set session
    req.session.user = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      profile: newUser.profile
    };
    
    res.json({ success: true, redirect: '/' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.redirect('/login');
  });
});

module.exports = router;