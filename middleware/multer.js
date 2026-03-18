const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Storage for research papers (PDF)
const paperStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../public/uploads/papers');
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'paper-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Storage for dataset files (ZIP/CSV)
const datasetStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../public/uploads/datasets');
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'dataset-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Storage for avatars
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../public/uploads/avatars');
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for PDFs
const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for research papers'), false);
  }
};

// File filter for datasets
const datasetFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/zip',
    'application/x-zip-compressed',
    'text/csv',
    'application/vnd.ms-excel',
    'application/json',
  ];
  const allowedExts = ['.zip', '.csv', '.json'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only ZIP, CSV, or JSON files are allowed for datasets'), false);
  }
};

// File filter for images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for avatars'), false);
  }
};

// Combined upload for datasets (paper + dataset file)
const uploadDataset = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      let dir;
      if (file.fieldname === 'paperFile') {
        dir = path.join(__dirname, '../public/uploads/papers');
      } else {
        dir = path.join(__dirname, '../public/uploads/datasets');
      }
      ensureDir(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const prefix = file.fieldname === 'paperFile' ? 'paper-' : 'dataset-';
      cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'paperFile') {
      pdfFilter(req, file, cb);
    } else if (file.fieldname === 'datasetFile') {
      datasetFilter(req, file, cb);
    } else {
      cb(null, true);
    }
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: imageFilter,
});

module.exports = { uploadDataset, uploadAvatar };
