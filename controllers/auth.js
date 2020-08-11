const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route       Post api/auth
// @desc        Authenticate user and get token
// @access      Public
// Registration Users Route
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //i just need the first error so ican display
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  //im sending logo as its own route and is to be stored
  //in companys model
  console.log(req.body);
  const {
    firstName,
    lastName,
    email,
    companyName,
    rangeEmployee,
    //logo,
    password,
  } = req.body;

  //save company name first then use the id returned to save in user model
  try {
    let user = await User.findOne({ email });
    // See if users exist
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exist' }] });
    }
    // Create instance of the User
    user = new User({
      firstName,
      lastName,
      email,
      companyName,
      rangeEmployee,
      //logo,
      password,
    });
    // Ecrypt Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    // Save User
    await user.save();

    // Pass in jsonwebtoken

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 36000 },
      (err, token) => {
        if (err) throw err;
        //u should also send user also not just token, i added it.
        res.json({ token, user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route       Post api/auth
// @desc        Authenticate user and get token
// @access      Public
// Login Users Route
exports.login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    // See if users exist

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // check if password match user req

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // Pass in jsonwebtoken

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 36000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
