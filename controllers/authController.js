const User = require('../models/User');

// GET /auth/login
exports.getLogin = (req, res) => {
  res.render('auth/login', { title: 'Login', layout: false });
};

// POST /auth/login
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash('error', 'Email and password are required.');
      return res.redirect('/auth/login');
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.isActive) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Set session
    req.session.userId = user._id.toString();
    req.session.userName = user.name;
    req.session.userEmail = user.email;
    req.session.userRole = user.role;
    req.session.userAvatar = user.avatar;

    req.flash('success', `Welcome back, ${user.name}!`);
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect('/auth/login');
  }
};

// GET /auth/register
exports.getRegister = (req, res) => {
  res.render('auth/register', { title: 'Register', layout: false });
};

// POST /auth/register
exports.postRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role, institution, bio } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      req.flash('error', 'All required fields must be filled.');
      return res.redirect('/auth/register');
    }

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('/auth/register');
    }

    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters.');
      return res.redirect('/auth/register');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      req.flash('error', 'An account with this email already exists.');
      return res.redirect('/auth/register');
    }

    const allowedRoles = ['admin', 'researcher'];
    const userRole = allowedRoles.includes(role) ? role : 'researcher';

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: userRole,
      institution: institution || '',
      bio: bio || '',
    });

    req.flash('success', 'Account created successfully! Please log in.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error('Register error:', err);
    if (err.code === 11000) {
      req.flash('error', 'An account with this email already exists.');
    } else {
      req.flash('error', 'Registration failed. Please try again.');
    }
    res.redirect('/auth/register');
  }
};

// POST /auth/logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/auth/login');
  });
};
