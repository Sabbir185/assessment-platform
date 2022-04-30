const express = require("express");
const router = express.Router();

const { protect } = require('../middlewares/protectAuth');
const { signup, login } = require('../controllers/authController');

// user routes
router.post("/signup", signup);
router.post("/login", login);

// module export
module.exports = router;
