const Submission = require('../models/submissionModel');
const fs = require('fs');
const path = require('path');
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


// submission update by admin 
exports.submissionUpdate = async (req, res, next) => {
  const { role } = req.user;

  let filename = undefined;
  if (req.files.length > 0) {
    const destination = (req.files[0].destination)
    filename = (req.files[0].filename)
    const imagePath = destination + filename;

    req.body.file = imagePath;
  }

  if (role === 'admin') {
    try {
      const oldSubmission = await Submission.findById(req.body.submissionId);

      if (!oldSubmission) return res.status(400).json({ status: false, message: 'Not Found Previous Record!' });

      // get old file to delete next
      const fileNameOfSubmission = oldSubmission?.file?.split('/')

      const submissionUpdated = await Submission.updateOne(
        { _id: ObjectId(req.body.submissionId) }, req.body
      );

      if (!submissionUpdated) return res.status(500).json({ status: false, message: 'Failed to update!' });

      // to delete old file
      if (!!filename) {
        const filePath = path.resolve(`public`, `submissions`, `${fileNameOfSubmission[2]}`);
        try {
          fs.unlinkSync(filePath)

        } catch (err) {
          return res.status(500).json({
            status: false,
            message: err
          });
        }
      }


      if (submissionUpdated.matchedCount === 1) {
        return res.status(200).json({
          status: true,
          message: 'Submission has updated!'
        });
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


// submission delete by admin 
exports.submissionDelete = async (req, res, next) => {
  const { role } = req.user;
  const { id } = req.params;

  const isFile = await Submission.findOne({ _id: ObjectId(id) });
  if (!isFile) return res.status(404).json({ status: false, message: 'Not Found!' })

  if (role === 'admin') {
    try {
      const deleteSubmission = await Submission.deleteOne({ _id: ObjectId(id) });

      if (deleteSubmission.deletedCount === 1) {
        // to delete file from server
        const fileName = isFile.file.split('/')
        const filePath = path.resolve(`public`, `submissions`, `${fileName[2]}`);
        try {
          fs.unlinkSync(filePath)

        } catch (err) {
          return res.status(500).json({
            status: false,
            message: err
          });
        }

        // response to the client
        return res.status(200).json({
          status: true,
          message: 'delete successful!',
        })

      } else {
        return res.status(500).json({ status: false, message: 'Failed to delete!' })
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