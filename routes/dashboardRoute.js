const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/authMiddleware");

const {
  dashboardGetController,
} = require("../controllers/dashboardController");

router.get("/", isAuthenticated, dashboardGetController);

module.exports = router;
