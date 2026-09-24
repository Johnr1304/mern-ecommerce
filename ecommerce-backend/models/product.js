const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"], trim: true },
    description: { type: String, required: [true, "Description is required"] },
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    category: { type: String, required: [true, "Category is required"], trim: true, index: true },
    brand: { type: String, trim: true },
    imageUrl: { type: String, default: "" },
    stock: { type: Number, required: true, default: 0, min: 0 },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    tags: [{ type: String, trim: true, lowercase: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Text index enables keyword search across name, description, category, tags
productSchema.index({ name: "text", description: "text", category: "text", tags: "text" });

module.exports = mongoose.model("Product", productSchema);
