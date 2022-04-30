const express = require("express");
const router = express.Router();

const { protect } = require('../middlewares/protectAuth');
const {
  gradeAssign,
  gradeUpdate,
  gradeDelete
} = require('../controllers/gradeController');


// user routes
router.post('/assign-grade', protect, gradeAssign);

router.patch('/update', protect, gradeUpdate);

router.delete('/delete/:id', protect, gradeDelete);


// module export
module.exports = router;
