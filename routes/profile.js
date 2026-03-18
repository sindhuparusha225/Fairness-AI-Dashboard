const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isAuthenticated } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/multer');

router.get('/', isAuthenticated, profileController.getProfile);
router.put('/', isAuthenticated, uploadAvatar.single('avatar'), profileController.updateProfile);
router.put('/password', isAuthenticated, profileController.changePassword);

module.exports = router;
