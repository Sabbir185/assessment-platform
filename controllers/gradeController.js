const { ObjectId } = require('mongodb');
const Grade = require('../models/gradeModel')
const Submission = require('../models/submissionModel')


// grade assign by mentor or admin 
exports.gradeAssign = async (req, res, next) => {
  const { role, id } = req.user;
  const { submission_file, mark } = req.body;

  if (role === 'admin' || role === 'mentor') {
    try {
      const gradeAssigned = await Grade.create(
        {
          submission_file, mark, mentor: ObjectId(id)
        }
      );

      if (!gradeAssigned) return res.status(500).json({ status: false, message: 'Failed!' })

      await Submission.updateOne(
        { _id: ObjectId(submission_file) },
        {
          $push: { grades: ObjectId(gradeAssigned._id) }
        }
      )

      return res.status(200).json({
        status: true,
        message: 'Grade has assigned!',
        gradeAssigned
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
exports.gradeUpdate = async (req, res, next) => {
  const { role } = req.user;
  const { id, mark } = req.body;

  if (role === 'admin') {
    try {
      const gradeAssigned = await Grade.updateOne(
        {
          _id: ObjectId(id)
        },
        {
          $set: { mark }
        }
      );

      if (!gradeAssigned) return res.status(500).json({ status: false, message: 'Failed!' });

      if (gradeAssigned.matchedCount === 1)
        return res.status(200).json({
          status: true,
          message: 'Grade has updated!'
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
exports.gradeDelete = async (req, res, next) => {
  const { role } = req.user;
  const { id } = req.params;

  const isFile = await Grade.findOne({ _id: ObjectId(id) });

  if (!isFile) return res.status(404).json({ status: false, message: 'Not Found!' })

  if (role === 'admin') {
    try {
      const deleteGrade = await Grade.deleteOne({ _id: ObjectId(id) });

      if (deleteGrade.deletedCount === 1) {
        await Submission.updateOne(
          { grades: ObjectId(id) },
          {
            $pull: { grades: ObjectId(id) }
          }
        )


        return res.status(200).json({
          status: true,
          message: 'delete success!',
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