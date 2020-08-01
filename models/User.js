const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  companyname: {
    type: String,
    required: true,
  },
  rangeofemployee: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  date: {
    type: String,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
