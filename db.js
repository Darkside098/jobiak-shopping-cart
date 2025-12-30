// db.js
const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

let db;

async function connectDB() {
  await client.connect();
  db = client.db("shoppingDB");
  console.log("MongoDB Connected");
}

function getDb() {
  return db;
}

module.exports = { connectDB, getDb };
