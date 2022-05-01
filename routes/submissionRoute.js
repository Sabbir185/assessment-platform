const express = require("express");
const router = express.Router();


const { protect } = require('../middlewares/protectAuth');
const { submitAssessment, submissionUpdate, submissionDelete } = require('../controllers/submissionController');
const { fileUpload } = require("../middlewares/fileUpload");


// user routes
router.post('/assessment-submit', protect, fileUpload, submitAssessment);

router.patch('/update', protect, fileUpload, submissionUpdate);

router.delete('/delete/:id', protect, submissionDelete);


// module export
module.exports = router;
