const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');
const {signup}=require('../../controllers/auth');

// @route       Post api/users
// @desc        Register Route
// @access      Public
//always use camel case so as to make it a standard
//eg: companyName instead of companyname
router.post(
  '/signup',
  [
    check('firstName', 'First Name is required').not().isEmpty(),
    check('lastName', 'Last Name is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    check('companyName', 'Company Name is required').not().isEmpty(),
    check('rangeEmployee', 'Employee Range is required'),
  ],
  signup
);

module.exports = router;
