const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require('../models/userModel');


const signToken = (id, firstName, lastName, email, role) => {
  return jwt.sign({ id, firstName, lastName, email, role }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRE_IN}`,
  });
};


// new user signup
exports.signup = async (req, res, next) => {
  const { firstName, lastName, email, password, confirmPassword, role } = req.body;

  const userEmail = await User.findOne({ email });

  if (userEmail)
    return res.status(406).json({
      status: false,
      message: "Email already exist!"
    });

  if (password !== confirmPassword) {
    return res.status(400).json({
      status: false,
      message: "Password invalid",
    });
  }

  try {
    const newUser = await User.create({
      firstName, lastName, email, password, confirmPassword, role
    });

    const token = signToken(newUser._id, newUser.firstName, newUser.lastName, newUser.email, newUser.role);

    res.status(201).json({
      token,
      message: "New user created successfully",
      status: true
    });

  } catch (error) {
    if (error.code == 11000) {
      return res.status(406).json({
        status: false,
        message: "Email already exist!"
      });

    } else {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  }
};


// user login
exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (isPasswordValid) {
      // hide password from user
      user.password = undefined;

      const token = signToken(user._id, user.firstName, user.lastName, user.email, user.role);

      return res.status(200).json({
        token
      });

    } else {
      return res.status(400).json({
        status: false,
        message: "Login failed!",
      });
    }

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


// user update
exports.userUpdate = async (req, res, next) => {
  const { role } = req.user;
  const { firstName, lastName, email } = req.body;
  const { id } = req.params;

  if (role === 'admin') {
    try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ status: false, message: "User Not Found!" });

      await User.findByIdAndUpdate(id, { $set: { firstName, lastName, email } });

      res.status(200).json({
        status: true,
        message: "successfully updated!"
      })

    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      })
    }

  } else {
    return res.status(403).json({
      status: false,
      message: "You're Not Permitted to this action."
    })
  }
}


// user delete by admin
exports.userDelete = async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.user;
  if (role === 'admin') {
    try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: "User Not Found!" });

      await User.findByIdAndDelete(id);

      return res.status(200).json({
        status: true,
        message: "User deleted successfully!"
      });

    } catch (error) {
      return res.status(500).json({ status: false, message: error.message })
    }

  } else {
    return res.status(403).json({
      status: false,
      message: "You're Not Permitted to this action."
    })
  }
}

