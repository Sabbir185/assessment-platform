const Assessment = require('../models/assessmentModel');
const ObjectId = require('mongodb').ObjectId;


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


// grade update by admin 
exports.assessmentUpdate = async (req, res, next) => {
  const { role } = req.user;
  // const { id, title, description, deadline, mentor } = req.body;

  if (role === 'admin') {
    try {
      const assessmentUpdated = await Assessment.updateOne(
        { _id: ObjectId(req.body.id) }, req.body
      );

      if (!assessmentUpdated) return res.status(500).json({ status: false, message: 'Failed!' });

      if (assessmentUpdated.matchedCount === 1)
        return res.status(200).json({
          status: true,
          message: 'Assessment has updated!'
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


// grade delete by admin 
exports.assessmentDelete = async (req, res, next) => {
  const { role } = req.user;
  const { id } = req.params;

  const isFile = await Assessment.findOne({ _id: ObjectId(id) });

  if (!isFile) return res.status(404).json({ status: false, message: 'Not Found!' })

  if (role === 'admin') {
    try {
      const deleteAssessment = await Assessment.deleteOne({ _id: ObjectId(id) });

      if (deleteAssessment.deletedCount === 1) {
        return res.status(200).json({
          status: true,
          message: 'delete successful!',
        })

      } else {
        return res.status(500).json({ status: false, message: 'Failed!' })
      }


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