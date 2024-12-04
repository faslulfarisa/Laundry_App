
const multer = require('multer');

// Define custom storage logic
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the upload destination
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Generate unique filename
  },
});

// Export the configured multer instance with custom storage
const upload = multer({ storage });

module.exports = upload;