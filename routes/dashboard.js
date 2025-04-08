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

// Dashboard page
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    res.render('dashboard', {
      title: 'Fitness Dashboard',
      user: user
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Failed to load dashboard' 
    });
  }
});

// Update fitness data
router.post('/update', isAuthenticated, async (req, res) => {
  try {
    const { type, value } = req.body;
    const userId = req.session.user.id;
    
    // Validate input
    if (!type || !value || isNaN(value)) {
      return res.status(400).json({ success: false, message: 'Invalid input' });
    }
    
    // Update the specific fitness data field
    const updateData = {};
    updateData[`fitnessData.${type}`] = parseFloat(value);
    
    await User.findByIdAndUpdate(userId, { $set: updateData });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Calculate fitness score
router.post('/calculate-score', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await User.findById(userId);
    
    // Simple score formula: normalized value out of 10
    const water = user.fitnessData.water || 0;
    const calIn = user.fitnessData.caloriesIn || 0;
    const calOut = user.fitnessData.caloriesOut || 0;
    
    const waterScore = Math.min((water / 3) * 3, 3.3); // Max 3.3 for 3L
    const calorieBalanceScore = Math.min((calOut / calIn) * 3.3, 3.3); // Max 3.3
    const balanceBonus = calOut > calIn ? 3.4 : 1.6;
    
    const total = Math.min((waterScore + calorieBalanceScore + balanceBonus), 10).toFixed(1);
    
    // Update fitness score in database
    await User.findByIdAndUpdate(userId, { 
      $set: { 'fitnessData.fitnessScore': parseFloat(total) } 
    });
    
    res.json({ success: true, score: total });
  } catch (error) {
    console.error('Score calculation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;