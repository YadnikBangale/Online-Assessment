const express = require("express");

const router = express.Router();

const {
  getStoreOwnerDashboard,
} = require("../controllers/storeOwnerController");

const {
  authenticateUser,
} = require("../middleware/authMiddleware");

const {
  authorizeRole,
} = require("../middleware/roleMiddleware");

router.use(authenticateUser);
router.use(authorizeRole("STORE_OWNER"));

router.get("/dashboard", getStoreOwnerDashboard);

module.exports = router;