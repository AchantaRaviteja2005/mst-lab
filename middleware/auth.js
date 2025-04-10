const User = require('../models/User');

// Middleware to check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
};

// Middleware to check if user is NOT authenticated
exports.isNotAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  res.redirect('/');
};

// Middleware to check if user is admin
exports.isAdmin = async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  
  try {
    const user = await User.findById(req.session.user.id);
    
    if (user && user.role === 'admin') {
      return next();
    }
    
    res.status(403).render('error', {
      title: 'Access Denied',
      message: 'You do not have permission to access this page'
    });
  } catch (error) {
    console.error('Admin authorization error:', error);
    res.status(500).render('error', {
      title: 'Server Error',
      message: 'An error occurred while checking permissions'
    });
  }
};