const express = require("express");
const router = express.Router();

const { protect } = require('../middlewares/protectAuth');
const { signup, login } = require('../controllers/authController');
const { submitAssessment } = require('../controllers/userController');
const { fileUpload } = require("../middlewares/fileUpload");

// user routes
router.post("/signup", signup);
router.post("/login", login);


// module export
module.exports = router;
