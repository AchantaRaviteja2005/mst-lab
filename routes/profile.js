const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
};

// Profile page
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    res.render('profile', {
      title: 'User Profile',
      user: user
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Failed to load profile' 
    });
  }
});

// Update profile
router.post('/update', isAuthenticated, async (req, res) => {
  try {
    const { username, email, age, height } = req.body;
    const userId = req.session.user.id;
    
    // Validate input
    if (!username || !email) {
      return res.status(400).json({ success: false, message: 'Username and email are required' });
    }
    
    // Check if username or email already exists (but not for the current user)
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: userId } },
        { $or: [{ username }, { email }] }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username or email already in use by another account' 
      });
    }
    
    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { 
        username,
        email,
        'profile.age': age ? parseInt(age) : undefined,
        'profile.height': height
      },
      { new: true, runValidators: true }
    );
    
    // Update session data
    req.session.user = {
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profile: updatedUser.profile
    };
    
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Change password
router.post('/change-password', isAuthenticated, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.session.user.id;
    
    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'All password fields are required' 
      });
    }
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'New passwords do not match' 
      });
    }
    
    // Get user with password
    const user = await User.findById(userId);
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save(); // This will trigger the pre-save hook to hash the password
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;