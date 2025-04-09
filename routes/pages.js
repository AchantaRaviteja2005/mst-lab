const express = require('express');
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  // For contact page, redirect to login-required page
  if (req.path === '/contact') {
    return res.render('login-required', { title: 'Login Required' });
  }
  // For other protected routes, redirect to login
  res.redirect('/login');
};

// Home page
router.get('/', (req, res) => {
  res.render('home', { title: 'FITRACKER' });
});

// Login page
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('login', { title: 'Login' });
});

// Sign up page
router.get('/signup', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('signup', { title: 'Sign Up' });
});

// About page
router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

// Contact page - require authentication
router.get('/contact', isAuthenticated, (req, res) => {
  res.render('contact', { 
    title: 'Contact Us',
    user: req.session.user
  });
});

// Training page
router.get('/training', (req, res) => {
  res.render('training', { title: 'Training' });
});

// Fitness hub page
router.get('/fitness-hub', isAuthenticated, (req, res) => {
  res.render('fitness-hub', { 
    title: 'Fitness Hub',
    user: req.session.user
  });
});

// Fitness videos pages
router.get('/fitness-videos/30-day-yoga', isAuthenticated, (req, res) => {
  res.render('fitness_videos/30dayyoga', { title: '30 Day Yoga' });
});

router.get('/fitness-videos/beginner-fitness', isAuthenticated, (req, res) => {
  res.render('fitness_videos/beginner_fitness', { title: 'Beginner Fitness' });
});

router.get('/fitness-videos/pilates-strength', isAuthenticated, (req, res) => {
  res.render('fitness_videos/pilates_strength', { title: 'Pilates Strength' });
});

router.get('/fitness-hub/advanced', isAuthenticated, (req, res) => {
  res.render('fitness-soon/advanced', { title: 'Advanced Fitness' });
});

router.get('/fitness-hub/nutrition', isAuthenticated, (req, res) => {
  res.render('fitness-soon/nutrition', { title: 'Nutrition Masterclass' });
});

router.get('/fitness-hub/cardio', isAuthenticated, (req, res) => {
  res.render('fitness-soon/cardio', { title: 'Cardio Bootcamp' });
});

module.exports = router;