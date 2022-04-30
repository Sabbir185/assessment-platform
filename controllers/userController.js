const Submission = require('../models/submissionModel');
const Assessment = require('../models/assessmentModel');
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
      file: imagePath,
      mentor: ObjectId(req.body.mentor)
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
