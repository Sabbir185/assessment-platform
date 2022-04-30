const uploader = require('../utils/singleFileUpload');
const path = require('path');

function fileUpload(req, res, next) {
  const upload = uploader(
    'submissions',
    ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    80000000,
    'Only pdf and image files are allowed'
  );

  upload.any()(req, res, (err) => {
    if (err) {
      if (req.files.length > 0) {
        const { filename } = req.files[0];
        fs.unlink(path.join(__dirname, 'public', 'users'), filename, (err) => {
          if (err) {
            res.status(500).json({
              message: err.message
            });
          }
        })
      }

      res.status(500).json({
        message: err.message
      });

    } else {
      next()
    }
  })
}


module.exports = {
  fileUpload,
}