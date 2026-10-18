const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, enrollment, department, semester, email, mobile, password } = req.body;

    if (!name || !enrollment || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, enrollment, email, password)'
      });
    }

    // Check if user already exists with email or enrollment
    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'A student with this email address already exists.'
      });
    }

    const existingEnrollment = await User.findOne({ enrollment: enrollment.trim() });
    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: 'A student with this enrollment number already exists.'
      });
    }

    // Create user
    const newUser = new User({
      name: name.trim(),
      enrollment: enrollment.trim(),
      department: department ? department.trim() : 'Computer Science Engineering',
      semester: semester ? semester.trim() : 'Semester 1',
      email: email.toLowerCase().trim(),
      mobile: mobile ? mobile.trim() : '',
      password: password
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'Registration successful! 🎉',
      user: newUser.toSafeObject()
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during registration.'
    });
  }
});

// POST /api/auth/login - Log in an existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Verify password
    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful! 🎉',
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during login.'
    });
  }
});

module.exports = router;