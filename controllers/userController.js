const User = require('../models/userModel');
const Submission = require('../models/submissionModel');
const Assessment = require('../models/assessmentModel');
const bcrypt = require("bcrypt");
const ObjectId = require('mongodb').ObjectId;


// submit an assessment by student or admin
exports.submitAssessment = async (req, res, next) => {
  const { id, role } = req.user;

  const destination = (req.files[0].destination)
  const filename = (req.files[0].filename)
  const imagePath = destination + filename;

  if (role === 'mentor') return res.status(401).json({ status: false, message: 'Only admin or students are allowed!' })

  try {
    const assessment = await Submission.create({
      student: ObjectId(id),
      assessment: req.body.assessment,
      file: imagePath
    })

    if (!assessment) return res.status(500).json({ status: false, message: 'Failed!' })

    return res.status(200).json({
      status: true,
      assessment
    })

  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message
    })
  }
}


// create or add an assessment by mentor or admin
exports.addAssessment = async (req, res, next) => {
  const { role } = req.user;
  const { title, description, deadline, mentor: id } = req.body;

  if (role === 'admin' || role === 'mentor') {
    try {
      const assessment = await Assessment.create({
        title, description, deadline, mentor: ObjectId(id)
      })

      if (!assessment) return res.status(500).json({ status: false, message: 'Failed!' })

      return res.status(200).json({
        status: true,
        assessment
      })

    } catch (error) {
      return res.status(500).json({
        status: false,
        error: error.message
      })
    }

  } else {
    return res.status(403).json({
      status: false,
      message: "You're Not Permitted to this action."
    })
  }
}


// Submission Model
// grade an assessment by mentor or admin 
exports.grade = async (req, res, next) => {
  const { role } = req.user;
  const { submissionId, mark, mentor: id } = req.body;

  if (role === 'admin' || role === 'mentor') {
    try {
      const assessment = await Submission.updateOne(
        { _id: ObjectId(submissionId) },
        {
          $push: { grades: { mark, mentor: ObjectId(id) } }
        }
      );

      if (!assessment) return res.status(500).json({ status: false, message: 'Failed!' })

      if (assessment.matchedCount === 1)
        return res.status(200).json({
          status: true,
          message: 'Grade has set!'
        })

    } catch (error) {
      return res.status(500).json({
        status: false,
        error: error.message
      })
    }

  } else {
    return res.status(403).json({
      status: false,
      message: "You're Not Permitted to this action."
    })
  }
}