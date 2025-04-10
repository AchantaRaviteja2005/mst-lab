const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get current user
router.get('/user', auth.isAuthenticated, async (req, res) => {
  try {
    // Check if user exists in session and has an id
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const user = await User.findById(req.session.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.post('/user', auth.isAuthenticated, async (req, res) => {
  try {
    const { name, email, age, height, weight, primaryGoal, weeklyTarget } = req.body;
    
    // Check if user exists in session and has an id
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Find user and update
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (age) user.age = age;
    if (height) user.height = height;
    if (weight) user.weight = weight;
    if (primaryGoal) user.primaryGoal = primaryGoal;
    if (weeklyTarget) user.weeklyTarget = weeklyTarget;
    
    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mock data for dashboard - replace with actual database queries later
router.get('/dashboard', auth.isAuthenticated, (req, res) => {
  // This is mock data - in a real app, you would fetch from database
  const mockData = {
    stats: {
      totalWorkouts: 24,
      weeklyWorkouts: 3,
      currentStreak: 2
    },
    workouts: [
      {
        _id: '1',
        type: 'Running',
        duration: 30,
        date: new Date(Date.now() - 86400000) // yesterday
      },
      {
        _id: '2',
        type: 'Strength Training',
        duration: 45,
        date: new Date(Date.now() - 86400000 * 3) // 3 days ago
      },
      {
        _id: '3',
        type: 'Yoga',
        duration: 60,
        date: new Date(Date.now() - 86400000 * 5) // 5 days ago
      }
    ]
  };
  
  res.json(mockData);
});

// Mock workouts API endpoints
router.get('/workouts', auth.isAuthenticated, (req, res) => {
  // Mock data - replace with database query
  const workouts = [
    {
      _id: '1',
      type: 'Running',
      duration: 30,
      date: new Date(Date.now() - 86400000)
    },
    {
      _id: '2',
      type: 'Strength Training',
      duration: 45,
      date: new Date(Date.now() - 86400000 * 3)
    }
  ];
  
  res.json(workouts);
});

router.post('/workouts', auth.isAuthenticated, (req, res) => {
  // In a real app, save to database
  const newWorkout = {
    _id: Date.now().toString(), // Mock ID
    ...req.body,
    date: new Date()
  };
  
  res.status(201).json(newWorkout);
});

router.put('/workouts/:id', auth.isAuthenticated, (req, res) => {
  // In a real app, update in database
  const updatedWorkout = {
    _id: req.params.id,
    ...req.body
  };
  
  res.json(updatedWorkout);
});

router.delete('/workouts/:id', auth.isAuthenticated, (req, res) => {
  // In a real app, delete from database
  res.json({ message: 'Workout deleted' });
});

// Mock stats endpoint
router.get('/stats', auth.isAuthenticated, (req, res) => {
  const stats = {
    totalWorkouts: 24,
    weeklyWorkouts: 3,
    currentStreak: 2,
    monthlyProgress: [
      { week: 1, count: 4 },
      { week: 2, count: 5 },
      { week: 3, count: 3 },
      { week: 4, count: 2 }
    ]
  };
  
  res.json(stats);
});

module.exports = router;