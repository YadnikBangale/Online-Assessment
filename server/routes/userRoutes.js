const express = require("express");

const router = express.Router();

const {
  getStores,
  submitRating,
  modifyRating,
} = require("../controllers/userController");

const {
  authenticateUser,
} = require("../middleware/authMiddleware");

router.get("/stores", authenticateUser, getStores);

router.post("/ratings", authenticateUser, submitRating);

router.patch("/ratings", authenticateUser, modifyRating);

module.exports = router;