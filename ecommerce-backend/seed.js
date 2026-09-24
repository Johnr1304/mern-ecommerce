/**
 * Simple seed script for local development/testing.
 * Usage: npm run seed
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnection");
const User = require("./models/user");
const Product = require("./models/product");
const Order = require("./models/order");

const sampleProducts = [
  { name: "Wireless Headphones", description: "Over-ear Bluetooth headphones with noise cancellation.", price: 59.99, category: "Electronics", brand: "SoundPro", imageUrl: "", stock: 50, ratings: 4.5, numReviews: 20, tags: ["audio", "wireless", "bluetooth"] },
  { name: "Running Shoes", description: "Lightweight running shoes with breathable mesh.", price: 79.99, category: "Footwear", brand: "SprintX", imageUrl: "", stock: 30, ratings: 4.2, numReviews: 15, tags: ["shoes", "sports", "running"] },
  { name: "Smart Watch", description: "Fitness tracking smart watch with heart rate monitor.", price: 129.99, category: "Electronics", brand: "TechFit", imageUrl: "", stock: 25, ratings: 4.7, numReviews: 40, tags: ["wearable", "fitness", "smart"] },
  { name: "Yoga Mat", description: "Non-slip eco-friendly yoga mat.", price: 24.99, category: "Fitness", brand: "ZenFlex", imageUrl: "", stock: 100, ratings: 4.3, numReviews: 12, tags: ["yoga", "fitness", "mat"] },
  { name: "Backpack", description: "Durable travel backpack with laptop compartment.", price: 45.5, category: "Accessories", brand: "TrailPack", imageUrl: "", stock: 40, ratings: 4.1, numReviews: 8, tags: ["travel", "bag", "laptop"] },
  { name: "Bluetooth Speaker", description: "Portable waterproof speaker with deep bass.", price: 39.99, category: "Electronics", brand: "SoundPro", imageUrl: "", stock: 60, ratings: 4.4, numReviews: 22, tags: ["audio", "speaker", "wireless"] },
  { name: "Coffee Maker", description: "Programmable drip coffee maker, 12-cup capacity.", price: 34.99, category: "Home", brand: "BrewMaster", imageUrl: "", stock: 20, ratings: 4.0, numReviews: 10, tags: ["kitchen", "coffee", "home"] },
  { name: "Desk Lamp", description: "LED desk lamp with adjustable brightness.", price: 19.99, category: "Home", brand: "BrightHome", imageUrl: "", stock: 70, ratings: 4.2, numReviews: 18, tags: ["home", "lighting", "desk"] },
];

const seed = async () => {
  await connectDB();

  await Product.deleteMany();
  await User.deleteMany();
  await Order.deleteMany();

  const admin = await User.create({
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  });

  const demoUser = await User.create({
    name: "Demo User",
    email: "user@example.com",
    password: "user1234",
    role: "user",
  });

  const products = await Product.insertMany(
    sampleProducts.map((p) => ({ ...p, createdBy: admin._id }))
  );

  console.log(`Seeded ${products.length} products`);
  console.log(`Admin login -> email: admin@example.com / password: admin123`);
  console.log(`User login  -> email: user@example.com  / password: user1234`);

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
