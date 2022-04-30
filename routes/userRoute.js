const express = require("express");
const router = express.Router();

const { protect } = require('../middlewares/protectAuth');
const { signup, login } = require('../controllers/authController');
const { submitAssessment, addAssessment, grade } = require('../controllers/userController');
const { fileUpload } = require("../middlewares/fileUpload");

// user routes
router.post("/signup", signup);
router.post("/login", login);

router.post('/assessment-submit', protect, fileUpload, submitAssessment);
router.post('/create-assessment', protect, addAssessment);

router.patch('/add-grade', protect, grade);

// module export
module.exports = router;
