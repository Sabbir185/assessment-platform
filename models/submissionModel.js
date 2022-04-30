const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  assessment: {
    type: mongoose.Types.ObjectId,
    ref: 'Assessment',
  },

  file: {
    type: String,
    trim: true,
    required: [true, 'file missing!'],
  },
  date: {
    type: String,
    default: new Date().toLocaleString()
  },
  mentor: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },

  grades: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Grade',
    }
  ]

});


const Submission = mongoose.model('Submission', submissionSchema);


module.exports = Submission;