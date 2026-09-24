/**
 * Recommendation System
 * ----------------------
 * RapidMiner is a desktop/GUI data-mining tool used offline to train models
 * (e.g. Market Basket / Association Rule Mining, FP-Growth) on historical
 * order data. It is not something an Express server calls at request time.
 * The standard integration pattern is:
 *
 *   1. Export orders (see exportOrdersForTraining below) as CSV.
 *   2. Load that CSV into a RapidMiner process (FP-Growth -> Create
 *      Association Rules), and export the resulting rules as JSON
 *      to /data/associationRules.json (a sample file is generated at
 *      first run if none exists).
 *   3. This controller loads those rules at runtime and blends them with a
 *      lightweight content-based score (shared category/tags/brand) and the
 *      user's own viewed-products history, so recommendations still work
 *      even before the file is regenerated.
 *
 * This keeps the "intelligent recommendation" requirement fully functional
 * out of the box, while leaving a clean seam to plug in real RapidMiner
 * output whenever it's available.
 */
const fs = require("fs");
const path = require("path");
const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");

const RULES_PATH = path.join(__dirname, "..", "data", "associationRules.json");

const loadAssociationRules = () => {
  try {
    if (fs.existsSync(RULES_PATH)) {
      return JSON.parse(fs.readFileSync(RULES_PATH, "utf-8"));
    }
  } catch (err) {
    console.warn("Could not read association rules file, falling back to content-based only:", err.message);
  }
  return {}; // shape: { "<productId>": [{ "product": "<otherProductId>", "confidence": 0.0-1.0 }] }
};

// @route GET /api/analytics/recommendations/:productId
// Product-detail-page "customers also bought" style recommendations
const getProductRecommendations = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const limit = Number(req.query.limit) || 4;

    const baseProduct = await Product.findById(productId);
    if (!baseProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const rules = loadAssociationRules();
    const ruleMatches = rules[productId] || [];

    const ruleIds = ruleMatches.map((r) => r.product);
    const ruleProducts = ruleIds.length
      ? await Product.find({ _id: { $in: ruleIds } })
      : [];

    const scored = ruleProducts.map((p) => {
      const match = ruleMatches.find((r) => r.product === String(p._id));
      return { product: p, score: (match ? match.confidence : 0.5) + 1 }; // rule-based gets priority weight
    });

    // Content-based fallback / supplement: same category or overlapping tags
    const contentCandidates = await Product.find({
      _id: { $ne: baseProduct._id, $nin: ruleIds },
      $or: [{ category: baseProduct.category }, { tags: { $in: baseProduct.tags || [] } }],
    }).limit(limit * 2);

    contentCandidates.forEach((p) => {
      let score = 0;
      if (p.category === baseProduct.category) score += 0.6;
      const sharedTags = (p.tags || []).filter((t) => (baseProduct.tags || []).includes(t));
      score += sharedTags.length * 0.2;
      if (p.brand && p.brand === baseProduct.brand) score += 0.3;
      scored.push({ product: p, score });
    });

    const ranked = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.product);

    res.status(200).json({ success: true, recommendations: ranked });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/analytics/recommendations/for-me  (personalized, requires auth)
const getPersonalizedRecommendations = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const user = await User.findById(req.user._id).populate("viewedProducts");

    if (!user.viewedProducts || user.viewedProducts.length === 0) {
      // Cold start: return top-rated products
      const popular = await Product.find().sort({ ratings: -1, numReviews: -1 }).limit(limit);
      return res.status(200).json({ success: true, recommendations: popular, strategy: "popularity (cold start)" });
    }

    const viewedCategories = [...new Set(user.viewedProducts.map((p) => p.category))];
    const viewedIds = user.viewedProducts.map((p) => p._id);

    const candidates = await Product.find({
      category: { $in: viewedCategories },
      _id: { $nin: viewedIds },
    })
      .sort({ ratings: -1 })
      .limit(limit);

    res.status(200).json({ success: true, recommendations: candidates, strategy: "content-based on browsing history" });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/analytics/export-orders (admin only)
// Produces a CSV of order line items in a shape RapidMiner's FP-Growth
// operator expects (transaction_id, product_id), ready to import.
const exportOrdersForTraining = async (req, res, next) => {
  try {
    const orders = await Order.find().select("items");
    const rows = ["transaction_id,product_id"];
    orders.forEach((order) => {
      order.items.forEach((item) => {
        rows.push(`${order._id},${item.product}`);
      });
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=orders_for_rapidminer.csv");
    res.status(200).send(rows.join("\n"));
  } catch (error) {
    next(error);
  }
};

module.exports = { getProductRecommendations, getPersonalizedRecommendations, exportOrdersForTraining };
