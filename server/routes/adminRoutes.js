const express = require("express");

const {
  getDashboard,
  getUsers,
  getUserDetails,
  createUser,
  getStores,
  createStore,
  getStoreOwners,
} = require("../controllers/adminController");

const { authenticateUser } = require("../middleware/authMiddleware");

const { authorizeRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  authenticateUser,
  authorizeRole("ADMIN"),
  getDashboard,
);

router.get("/users", authenticateUser, authorizeRole("ADMIN"), getUsers);

router.get(
  "/users/:id",
  authenticateUser,
  authorizeRole("ADMIN"),
  getUserDetails,
);

router.post("/users", authenticateUser, authorizeRole("ADMIN"), createUser);

router.get("/stores", authenticateUser, authorizeRole("ADMIN"), getStores);

router.post("/stores", authenticateUser, authorizeRole("ADMIN"), createStore);

router.get(
  "/store-owners",
  authenticateUser,
  authorizeRole("ADMIN"),
  getStoreOwners,
);

module.exports = router;
