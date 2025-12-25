const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    userId: String,
    role: {
      type: String,
      enum: ['admin', 'editor', 'viewer'],
      default: 'viewer'
    },
    email: String,
    passwordHash: String,
    salt: String,
    isEnabled: Boolean,    
    createdAt: {
      type: Date,
      default: Date.now
    },
    modifiedAt: {
      type: Date,
      default: Date.now
    },
    version: Number
  });
  
const User = mongoose.model('User', userSchema);
module.exports = User;