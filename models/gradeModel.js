const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  submission_file: {
    type: mongoose.Types.ObjectId,
    ref: 'Submission',
  },

  mark: Number,
  
  mentor: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },

});


const Grade = mongoose.model('Grade', gradeSchema);


module.exports = Grade;