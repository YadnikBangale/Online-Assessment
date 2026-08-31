const express = require("express");

const {
  signup,
  login,
  changePassword,
} = require("../controllers/authController");

const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.patch("/change-password", authenticateUser, changePassword);

module.exports = router;
