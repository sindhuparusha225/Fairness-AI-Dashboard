const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

router.get('/', isAuthenticated, isAdmin, userController.index);
router.get('/:id', isAuthenticated, isAdmin, userController.show);
router.put('/:id/role', isAuthenticated, isAdmin, userController.updateRole);
router.delete('/:id', isAuthenticated, isAdmin, userController.destroy);

module.exports = router;
