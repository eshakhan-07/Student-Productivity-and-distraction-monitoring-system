const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/user/profile/:id - Get user profile by ID or email
router.get('/profile/:id', async (req, res) => {
  try {
    const param = req.params.id;
    let user;

    // Check if param is a valid MongoDB ObjectId or fallback to query by email / enrollment
    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(param);
    }
    
    if (!user) {
      user = await User.findOne({
        $or: [{ email: param.toLowerCase() }, { enrollment: param }]
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    return res.status(200).json({
      success: true,
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Fetch profile error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user profile.'
    });
  }
});

// PUT /api/user/profile/:id - Update user profile
router.put('/profile/:id', async (req, res) => {
  try {
    const param = req.params.id;
    const { name, department, semester, mobile, email } = req.body;

    let query = {};
    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = param;
    } else {
      query = { $or: [{ email: param.toLowerCase() }, { enrollment: param }] };
    }

    const updates = {};
    if (name) updates.name = name.trim();
    if (department) updates.department = department.trim();
    if (semester) updates.semester = semester.trim();
    if (mobile !== undefined) updates.mobile = mobile.trim();
    if (email) updates.email = email.toLowerCase().trim();

    const updatedUser = await User.findOneAndUpdate(query, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser.toSafeObject()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile.'
    });
  }
});

module.exports = router;
