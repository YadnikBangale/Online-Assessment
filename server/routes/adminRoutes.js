const express = require("express");

const {
  getDashboard,
  createUser,
  createStore,
  getStores,
  getUsers,
  getUserDetails,
} = require("../controllers/adminController");

const { authenticateUser } = require("../middleware/authMiddleware");

const { authorizeRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authenticateUser);
router.use(authorizeRole("ADMIN"));

router.get("/dashboard", getDashboard);

router.post("/users", createUser);

router.post("/stores", createStore);

router.get("/stores", getStores);

router.get("/users", getUsers);

router.get("/users/:id", getUserDetails);

module.exports = router;
