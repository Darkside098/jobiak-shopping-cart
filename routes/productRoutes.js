const express = require("express");
const router = express.Router();
const { getDb } = require("../db");

//ADD SINGLE PRODUCT
router.post("/", async (req, res) => {
  let { name, price, count, category, imageUrl } = req.body;

  // Trim string fields
  name = name?.trim();
  category = category?.trim();
  imageUrl = imageUrl?.trim();

  // Validate empty fields
  if (!name || !category || !imageUrl) {
    return res.status(400).json({
      message: "Name, category and imageUrl cannot be empty"
    });
  }

  // Validate numbers
  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({
      message: "Price must be a positive number"
    });
  }

  if (!Number.isInteger(count) || count < 0) {
    return res.status(400).json({
      message: "Count must be a non-negative integer"
    });
  }

  const db = getDb();

  await db.collection("products").insertOne({
    name,
    category,
    price,
    count,
    imageUrl,
    createdAt: new Date()
  });

  res.status(201).json({ message: "Product added successfully" });
});

//ADD BULK PRODUCTS
router.post("/bulk", async (req, res) => {
  const products = req.body;

  // Check if request body is an array
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({
      message: "Products array is required"
    });
  }

  const formattedProducts = [];

  for (const product of products) {
    let { name, price, count, category, imageUrl } = product;

    // Trim string fields
    name = name?.trim();
    category = category?.trim();
    imageUrl = imageUrl?.trim();

    // Validate empty fields
    if (!name || !category || !imageUrl) {
      return res.status(400).json({
        message: "Name, category and imageUrl cannot be empty"
      });
    }

    // Validate numbers
    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({
        message: "Price must be a positive number"
      });
    }

    if (!Number.isInteger(count) || count < 0) {
      return res.status(400).json({
        message: "Count must be a non-negative integer"
      });
    }

    formattedProducts.push({
      name,
      category,
      price,
      count,
      imageUrl,
      createdAt: new Date()
    });
  }

  const db = getDb();
  await db.collection("products").insertMany(formattedProducts);

  res.status(201).json({
    message: "Bulk products added successfully",
    insertedCount: formattedProducts.length
  });
});

// GET ALL PRODUCTS
  
router.get("/", async (req, res) => {
  const db = getDb();
  const products = await db.collection("products").find().toArray();
  res.json(products);
});

module.exports = router;

