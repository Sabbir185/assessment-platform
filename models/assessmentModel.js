const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    trim: true
  },
  description: {
    type: String,
    minlength: 10,
    trim: true
  },
  deadline: {
    type: String,
  },
  mentor: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },

}, {
  timestamps: true,
});


const Assessment = mongoose.model('Assessment', assessmentSchema);


module.exports = Assessment;