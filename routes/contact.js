const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const User = require('../models/User');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Submit contact form
router.post('/submit', isAuthenticated, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const userId = req.session.user.id;
    
    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    // Create new contact submission
    const newContact = new Contact({
      userId,
      name,
      email,
      subject,
      message
    });
    
    await newContact.save();
    
    res.json({ 
      success: true, 
      message: 'Your message has been sent successfully! We will get back to you soon.' 
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while submitting your message. Please try again.' 
    });
  }
});

// Admin route to view all contact submissions
router.get('/admin', isAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    // Get user details for each contact
    const contactsWithUserDetails = await Promise.all(
      contacts.map(async (contact) => {
        const user = await User.findById(contact.userId, 'username email');
        return {
          ...contact.toObject(),
          userDetails: user
        };
      })
    );
    
    res.render('contact-admin', { 
      title: 'Contact Submissions',
      contacts: contactsWithUserDetails,
      user: req.session.user
    });
  } catch (error) {
    console.error('Contact admin error:', error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Failed to load contact submissions',
      user: req.session.user
    });
  }
});

// Mark message as read
router.post('/admin/mark-read/:id', isAdmin, async (req, res) => {
  try {
    const contactId = req.params.id;
    await Contact.findByIdAndUpdate(contactId, { status: 'read' });
    res.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Mark message as replied
router.post('/admin/mark-replied/:id', isAdmin, async (req, res) => {
  try {
    const contactId = req.params.id;
    await Contact.findByIdAndUpdate(contactId, { status: 'replied' });
    res.json({ success: true });
  } catch (error) {
    console.error('Mark replied error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete message
router.delete('/admin/delete/:id', isAdmin, async (req, res) => {
  try {
    const contactId = req.params.id;
    await Contact.findByIdAndDelete(contactId);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;