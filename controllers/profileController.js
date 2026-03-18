const User = require('../models/User');
const Dataset = require('../models/Dataset');
const Evaluation = require('../models/Evaluation');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// GET /profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/auth/logout');
    }

    const [myDatasets, myEvaluations] = await Promise.all([
      Dataset.find({ uploadedBy: user._id }).sort({ createdAt: -1 }),
      Evaluation.find({ evaluatedBy: user._id })
        .populate('dataset', 'title')
        .sort({ createdAt: -1 }),
    ]);

    res.render('profile/index', {
      title: 'My Profile',
      profileUser: user,
      myDatasets,
      myEvaluations,
    });
  } catch (err) {
    console.error('Profile error:', err);
    req.flash('error', 'Error loading profile.');
    res.redirect('/dashboard');
  }
};

// PUT /profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, institution, bio } = req.body;
    const user = await User.findById(req.session.userId);

    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/profile');
    }

    // Check if email is taken by another user
    if (email !== user.email) {
      const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
      if (existing) {
        req.flash('error', 'This email is already in use.');
        return res.redirect('/profile');
      }
    }

    user.name = name.trim();
    user.email = email.toLowerCase().trim();
    user.institution = institution || '';
    user.bio = bio || '';

    // Handle avatar upload
    if (req.file) {
      // Delete old avatar
      if (user.avatar) {
        const oldPath = path.join(__dirname, '../public', user.avatar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.avatar = '/uploads/avatars/' + req.file.filename;
    }

    await user.save({ validateBeforeSave: false });

    // Update session
    req.session.userName = user.name;
    req.session.userEmail = user.email;
    req.session.userAvatar = user.avatar;

    req.flash('success', 'Profile updated successfully!');
    res.redirect('/profile');
  } catch (err) {
    console.error('Update profile error:', err);
    req.flash('error', 'Error updating profile.');
    res.redirect('/profile');
  }
};

// PUT /profile/password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.session.userId);

    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/profile');
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      req.flash('error', 'All password fields are required.');
      return res.redirect('/profile');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      req.flash('error', 'Current password is incorrect.');
      return res.redirect('/profile');
    }

    if (newPassword !== confirmPassword) {
      req.flash('error', 'New passwords do not match.');
      return res.redirect('/profile');
    }

    if (newPassword.length < 6) {
      req.flash('error', 'New password must be at least 6 characters.');
      return res.redirect('/profile');
    }

    user.password = newPassword;
    await user.save();

    req.flash('success', 'Password changed successfully!');
    res.redirect('/profile');
  } catch (err) {
    console.error('Change password error:', err);
    req.flash('error', 'Error changing password.');
    res.redirect('/profile');
  }
};
