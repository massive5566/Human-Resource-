const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route       Post api/users
// @desc        Register Route
// @access      Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    check('companyname', 'Company Name is required').not().isEmpty(),
    check('rangeofemployee', 'Employee Range is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      name,
      email,
      companyname,
      rangeofemployee,
      logo,
      password,
    } = req.body;

    try {
      let user = await User.findOne({ email });
      // See if users exist
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exist' }] });
      }
      // Create instance of the User
      user = new User({
        name,
        email,
        companyname,
        rangeofemployee,
        logo,
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
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
