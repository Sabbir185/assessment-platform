const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  file: {
    type: String,
    trim: true,
    required: [true, 'file missing!'],
  },
  date: {
    type: Date,
    default: new Date().toLocaleString()
  },

  grades: {
    mark: {
      type: Number
    },
    mentor: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    }
  }

});


const Submission = mongoose.model('Submission', submissionSchema);


module.exports = Submission;