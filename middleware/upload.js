const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `upload_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
<<<<<<< HEAD
=======
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only images allowed'), false);
    } else {
      cb(null, true);
    }
>>>>>>> b3944d855d79f698b693205c23e372a3cb52160d
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only images allowed'), false);
    } else {
      cb(null, true);
    }
  }
});

module.exports = upload;