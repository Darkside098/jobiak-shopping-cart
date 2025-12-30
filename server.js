//server.js
const express = require("express");
const { connectDB } = require("./db");

// IMPORT ROUTES (DO NOT CALL THEM)
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Shopping API is running");
});

app.use("/products", productRoutes);
app.use("/cart", cartRoutes);

async function startServer() {
  try {
    await connectDB();

    app.listen(1237, () => {
      console.log("Server running on port 1237");
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

startServer();
