const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profile: {
    age: {
      type: Number,
      default: 25
    },
    height: {
      type: String,
      default: "5'9\""
    },
    accountType: {
      type: String,
      default: 'Standard'
    }
  },
  fitnessData: {
    water: {
      type: Number,
      default: 2.5
    },
    caloriesIn: {
      type: Number,
      default: 1800
    },
    caloriesOut: {
      type: Number,
      default: 500
    },
    fitnessScore: {
      type: Number,
      default: 8.2
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Validate that only one admin can exist
UserSchema.pre('save', async function(next) {
  // Only check when creating a new admin user or changing role to admin
  if (this.isNew && this.role === 'admin' || 
      this.isModified('role') && this.role === 'admin') {
    
    try {
      // Check if an admin already exists (excluding this document if it's being updated)
      const adminExists = await this.constructor.findOne({ 
        role: 'admin',
        _id: { $ne: this._id } // Exclude current document if it's being updated
      });
      
      if (adminExists) {
        const error = new Error('Only one admin user can exist in the system');
        return next(error);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);