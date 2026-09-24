const express = require("express");
const router = express.Router();
const {
  getProductRecommendations,
  getPersonalizedRecommendations,
  exportOrdersForTraining,
} = require("../controllers/analyticsController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/recommendations/for-me", protect, getPersonalizedRecommendations);
router.get("/recommendations/:productId", getProductRecommendations);
router.get("/export-orders", protect, authorize("admin"), exportOrdersForTraining);

module.exports = router;
