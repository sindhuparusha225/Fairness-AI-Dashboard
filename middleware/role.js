const isAdmin = (req, res, next) => {
  if (req.session && req.session.userRole === 'admin') {
    return next();
  }
  req.flash('error', 'Access denied. Admin privileges required.');
  res.redirect('/dashboard');
};

const isResearcher = (req, res, next) => {
  if (
    req.session &&
    (req.session.userRole === 'researcher' || req.session.userRole === 'admin')
  ) {
    return next();
  }
  req.flash('error', 'Access denied. Researcher privileges required.');
  res.redirect('/dashboard');
};

module.exports = { isAdmin, isResearcher };
