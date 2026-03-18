const User = require('../models/User');
const Dataset = require('../models/Dataset');
const Evaluation = require('../models/Evaluation');

// GET /users (Admin only)
exports.index = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.render('users/index', { title: 'Researcher Management', users });
  } catch (err) {
    console.error('Users index error:', err);
    req.flash('error', 'Error loading users.');
    res.redirect('/dashboard');
  }
};

// PUT /users/:id/role (Admin only)
exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ['admin', 'researcher'];

    if (!allowedRoles.includes(role)) {
      req.flash('error', 'Invalid role.');
      return res.redirect('/users');
    }

    // Prevent admin from changing their own role
    if (req.params.id === req.session.userId) {
      req.flash('error', 'You cannot change your own role.');
      return res.redirect('/users');
    }

    await User.findByIdAndUpdate(req.params.id, { role });
    req.flash('success', 'User role updated successfully.');
    res.redirect('/users');
  } catch (err) {
    console.error('Update role error:', err);
    req.flash('error', 'Error updating user role.');
    res.redirect('/users');
  }
};

// DELETE /users/:id (Admin only)
exports.destroy = async (req, res) => {
  try {
    if (req.params.id === req.session.userId) {
      req.flash('error', 'You cannot delete your own account from here.');
      return res.redirect('/users');
    }

    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    req.flash('success', 'Researcher account deactivated successfully.');
    res.redirect('/users');
  } catch (err) {
    console.error('Delete user error:', err);
    req.flash('error', 'Error deactivating researcher.');
    res.redirect('/users');
  }
};

// GET /users/:id (Admin - view single user activity)
exports.show = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'Researcher not found.');
      return res.redirect('/users');
    }

    const [datasets, evaluations] = await Promise.all([
      Dataset.find({ uploadedBy: user._id }).sort({ createdAt: -1 }).limit(10),
      Evaluation.find({ evaluatedBy: user._id })
        .populate('dataset', 'title')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    res.render('users/show', { title: user.name + ' - Activity', targetUser: user, datasets, evaluations });
  } catch (err) {
    console.error('User show error:', err);
    req.flash('error', 'Error loading researcher details.');
    res.redirect('/users');
  }
};
