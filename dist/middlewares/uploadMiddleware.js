import multer from 'multer';

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// File filter - allow only specific file types
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PNG, JPG, JPEG, and PDF files are allowed'));
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export const uploadSingle = upload.single('file');
