const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  req.flash('error', 'Please log in to access this page.');
  res.redirect('/auth/login');
};

const isNotAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return next();
  }
  res.redirect('/dashboard');
};

module.exports = { isAuthenticated, isNotAuthenticated };
