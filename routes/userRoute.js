const express = require("express");
const router = express.Router();

const { protect } = require('../middlewares/protectAuth');
const { signup, login, userUpdate, userDelete } = require('../controllers/userController');

// user routes
router.post("/signup", signup);
router.post("/login", login);

router.patch("/update/:id", protect, userUpdate);

router.delete("/delete/:id", protect, userDelete);


// module export
module.exports = router;
