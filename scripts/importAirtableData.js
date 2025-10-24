// scripts/importAirtableData.js
import { MongoClient } from "mongodb";
import csv from "csvtojson";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = "jonam";
const DATA_DIR = path.resolve("data");

async function importCSV(client, fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  const collectionName = path.basename(fileName, ".csv");

  console.log(`\n📦 Importing ${collectionName}...`);
  const jsonArray = await csv().fromFile(filePath);
  if (!jsonArray.length) {
    console.log(`⚠️ Skipping ${collectionName} (no data found)`);
    return;
  }

  const db = client.db(DB_NAME);
  const collection = db.collection(collectionName);

  await collection.deleteMany({});
  await collection.insertMany(jsonArray);
  console.log(
    `✅ Imported ${jsonArray.length} records into '${collectionName}'`
  );
}

// 🧩 STEP 2: Add this function here
async function mapLinkedRecords(client) {
  const db = client.db(DB_NAME);

  // Example 1: link products → handymen
  const handymen = await db.collection("handymen").find().toArray();
  const handymanMap = {};
  handymen.forEach((h) => {
    handymanMap[h.airtableId] = h._id; // assuming 'airtableId' exists in CSV
  });

  const products = await db.collection("products").find().toArray();
  for (const product of products) {
    if (product.handyman_id && handymanMap[product.handyman_id]) {
      await db
        .collection("products")
        .updateOne(
          { _id: product._id },
          {
            $set: { handyman: handymanMap[product.handyman_id] },
            $unset: { handyman_id: "" },
          }
        );
    }
  }

  console.log("🔗 Linked handymen updated in products!");

  // Example 2: link orders → products
  const productsMap = {};
  const allProducts = await db.collection("products").find().toArray();
  allProducts.forEach((p) => {
    productsMap[p.airtableId] = p._id;
  });

  const orders = await db.collection("orders").find().toArray();
  for (const order of orders) {
    if (order.product_id && productsMap[order.product_id]) {
      await db
        .collection("orders")
        .updateOne(
          { _id: order._id },
          {
            $set: { product: productsMap[order.product_id] },
            $unset: { product_id: "" },
          }
        );
    }
  }

  console.log("🔗 Linked products updated in orders!");
}

// 🧩 STEP 3: Call it at the end of your main() function
async function main() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    console.log("🧩 Connected to MongoDB");

    // Step 1: Import CSVs
    const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".csv"));
    for (const file of files) {
      await importCSV(client, file);
    }

    console.log("\n🎉 All CSV files imported successfully!");

    // Step 2: Map linked records
    await mapLinkedRecords(client);

    console.log("\n🔗 All relationships mapped successfully!");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
  }
}

main();
