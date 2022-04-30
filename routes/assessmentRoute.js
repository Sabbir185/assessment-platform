const express = require("express");
const router = express.Router();

const { protect } = require('../middlewares/protectAuth');
const {
  addAssessment, assessmentUpdate, assessmentDelete,
} = require('../controllers/assessmentController');


// user routes
router.post('/create-assessment', protect, addAssessment);

router.patch('/update', protect, assessmentUpdate);

router.delete('/delete/:id', protect, assessmentDelete);


// module export
module.exports = router;
