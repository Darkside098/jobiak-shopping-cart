// cartRoutes
const express = require("express");
const router = express.Router();
const { getDb } = require("../db");
const { ObjectId } = require("mongodb");

// ADD TO CART
router.post("/add/:productId", async (req, res) => {
  const db = getDb();
  const userId = "user1"; 
  const productId = new ObjectId(req.params.productId);

  const product = await db.collection("products").findOne({ _id: productId });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.count <= 0) {
    return res.status(400).json({ message: "Out of stock" });
  }

  let cart = await db.collection("carts").findOne({ userId });

  if (!cart) {
    cart = { userId, items: [] };
    await db.collection("carts").insertOne(cart);
  }

  const itemIndex = cart.items.findIndex(
    item => item.productId.toString() === productId.toString()
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += 1;
  } else {
    cart.items.push({
      productId,
      quantity: 1,
      price: product.price
    });
  }

  await db.collection("carts").updateOne(
    { userId },
    { $set: { items: cart.items } }
  );

  await db.collection("products").updateOne(
    { _id: productId },
    { $inc: { count: -1 } }
  );

  res.json({ message: "Item added to cart" });
});

// REMOVE FROM CART
router.delete("/remove/:productId", async (req, res) => {
  const db = getDb();
  const userId = "user1";
  const productId = new ObjectId(req.params.productId);

  const cart = await db.collection("carts").findOne({ userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const itemIndex = cart.items.findIndex(
    item => item.productId.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not in cart" });
  }

  cart.items.splice(itemIndex, 1);

  await db.collection("carts").updateOne(
    { userId },
    { $set: { items: cart.items } }
  );

  await db.collection("products").updateOne(
    { _id: productId },
    { $inc: { count: 1 } }
  );

  res.json({ message: "Item removed from cart" });
});

router.get("/", async (req, res) => {
  const db = getDb();
  const cart = await db.collection("carts").findOne({ userId: "user1" });
  res.json(cart || { items: [] });
});

// CLEAR CART
router.delete("/clear", async (req, res) => {
  const db = getDb();
  const userId = "user1";

  const cart = await db.collection("carts").findOne({ userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  await db.collection("carts").updateOne(
    { userId },
    { $set: { items: [] } }
  );

  res.json({ message: "Cart cleared successfully" });
});


module.exports = router;