const express = require('express');
const router = express.Router();

const datasetController = require('../controllers/datasetController');
const { isAuthenticated } = require('../middleware/auth');
const { uploadDataset } = require('../middleware/multer');

// DATASETS
router.get('/', isAuthenticated, datasetController.index);
router.get('/new', isAuthenticated, datasetController.newForm);

router.post(
  '/',
  isAuthenticated,
  uploadDataset.fields([
    { name: 'paperFile', maxCount: 1 },
    { name: 'datasetFile', maxCount: 1 },
  ]),
  datasetController.create
);

router.get('/:id', isAuthenticated, datasetController.show);
router.get('/:id/edit', isAuthenticated, datasetController.editForm);

router.put(
  '/:id',
  isAuthenticated,
  uploadDataset.fields([
    { name: 'paperFile', maxCount: 1 },
    { name: 'datasetFile', maxCount: 1 },
  ]),
  datasetController.update
);

router.delete('/:id', isAuthenticated, datasetController.destroy);

// 🔥 IMPORTANT FIX
router.get('/:id/evaluations/new', isAuthenticated, datasetController.newEvaluationForm);
router.post('/:id/evaluations', isAuthenticated, datasetController.addEvaluation);

module.exports = router;