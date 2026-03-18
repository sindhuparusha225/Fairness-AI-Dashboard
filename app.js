require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const sessionConfig = require('./config/session');

const app = express();

// Connect to MongoDB
connectDB();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsers
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// Method override (for PUT/DELETE from forms)
app.use(methodOverride('_method'));

// Session
app.use(session(sessionConfig));

// Flash messages
app.use(flash());

// Global locals for views
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentPath = req.path;
  next();
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/datasets', require('./routes/datasets'));
app.use('/users', require('./routes/users'));
app.use('/profile', require('./routes/profile'));

// Root redirect
app.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.redirect('/auth/login');
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('partials/404', { title: '404 - Page Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).render('partials/error', {
    title: 'Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
