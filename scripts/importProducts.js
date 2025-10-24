// scripts/importProducts.js
import { MongoClient } from "mongodb";
import csv from "csvtojson";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = "jonam";
const PRODUCTS_FILE = path.resolve("data/products.csv");

async function importProducts(client) {
  const db = client.db(DB_NAME);
  const collection = db.collection("products");

  console.log("📦 Importing products from CSV...");

  const jsonArray = await csv().fromFile(PRODUCTS_FILE);

  // --- Transform raw CSV data ---
  const cleanedData = jsonArray.map((item) => ({
    product_number: item.product_number,
    quantity: parseInt(item.quantity) || 0,
    price: parsePrice(item.price), // convert "₦50000" → 50000
    discount: parseDiscount(item.discount), // convert "3%" → 3
    featured: item.featured?.toLowerCase() === "true",
    name: item.name,
    description: item.description?.trim(),
    images: parseImages(item.images),
    variants: parseList(item.variants),
    category_link: item.category_link || null,
    category: item.category || null,
    product_colors: parseList(item.product_colors),
    brand_link: item.brand_link || null,
    brand_name: item.brand_name || null,
  }));

  // Clear old products
  await collection.deleteMany({});
  const result = await collection.insertMany(cleanedData);
  console.log(`✅ Imported ${result.insertedCount} products`);

  // After import, normalize category & brand fields
  await normalizeLinkedRecords(client);
  console.log("🔗 Linked brand/category references and normalized data!");
}

// ------------------- Helpers -------------------
function parsePrice(str) {
  if (!str) return 0;
  const num = str.replace(/[₦,]/g, "").trim();
  return parseFloat(num) || 0;
}

function parseDiscount(str) {
  if (!str) return 0;
  const num = str.replace("%", "").trim();
  return parseFloat(num) || 0;
}

function parseImages(imagesStr) {
  if (!imagesStr) return [];
  return imagesStr.split("),").map((part) => {
    const match = part.match(/(.*?)\s*\((.*?)\)/);
    return match
      ? { name: match[1].trim(), url: match[2].trim() }
      : { name: part.trim(), url: "" };
  });
}

function parseList(str) {
  if (!str) return [];
  return str.split(",").map((v) => v.trim());
}

// ------------------- Relationship normalization -------------------
async function normalizeLinkedRecords(client) {
  const db = client.db(DB_NAME);
  const productsCollection = db.collection("products");

  // --- Static mappings ---
  const categories = [
    { _id: "68f88f5218f2d463c8c1c763", name: "P.P.R Product" },
    { _id: "68f88f5218f2d463c8c1c765", name: "Kitchen Equipments" },
    { _id: "68f88f5218f2d463c8c1c75e", name: "pumps" },
    { _id: "68f88f5218f2d463c8c1c760", name: "mirrors" },
    { _id: "68f88f5218f2d463c8c1c764", name: "Water Tanks" },
    { _id: "68f88f5218f2d463c8c1c75c", name: "pipes" },
    { _id: "68f88f5218f2d463c8c1c75f", name: "Bathroom Fixtures" },
    { _id: "68f88f5218f2d463c8c1c75d", name: "faucets" },
    { _id: "68f88f5218f2d463c8c1c761", name: "P.V.C Fittings" },
    { _id: "68f88f5218f2d463c8c1c762", name: "Gums" },
    { _id: "68f8feb658f2a2096bcd0e92", name: "Test Caption" },
  ];

  const brands = [
    { _id: "68f88f5218f2d463c8c1c72c", name: "Interdap" },
    { _id: "68f88f5218f2d463c8c1c72d", name: "Whales" },
    { _id: "68f88f5218f2d463c8c1c72e", name: "Kohler" },
    { _id: "68f88f5218f2d463c8c1c72f", name: "CSWL" },
    { _id: "68f88f5218f2d463c8c1c730", name: "Tonobo" },
    { _id: "68f88f5218f2d463c8c1c731", name: "Venus" },
    { _id: "68f88f5218f2d463c8c1c732", name: "T.U.K" },
    { _id: "68f88f5218f2d463c8c1c733", name: "Poland" },
    { _id: "68f88f5218f2d463c8c1c734", name: "S.F" },
    { _id: "68f88f5218f2d463c8c1c735", name: "England" },
    { _id: "68f88f5218f2d463c8c1c736", name: "Golden" },
    { _id: "68f88f5218f2d463c8c1c737", name: "SweetHome" },
    { _id: "68f88f5218f2d463c8c1c738", name: "Dap" },
    { _id: "68f88f5218f2d463c8c1c739", name: "Rorenzo" },
    { _id: "68f88f5218f2d463c8c1c73a", name: "Pedrolo" },
    { _id: "68f88f5218f2d463c8c1c73b", name: "U.S.K" },
    { _id: "68f88f5218f2d463c8c1c73c", name: "Mataya" },
    { _id: "68f88f5218f2d463c8c1c73d", name: "Atlas" },
    { _id: "68f88f5218f2d463c8c1c73e", name: "StrongDab" },
    { _id: "68f88f5218f2d463c8c1c73f", name: "H-Power" },
    { _id: "68f88f5218f2d463c8c1c740", name: "GeePee" },
    { _id: "68f88f5218f2d463c8c1c741", name: "Heart" },
    { _id: "68f88f5218f2d463c8c1c742", name: "Karisma" },
    { _id: "68f88f5218f2d463c8c1c743", name: "Storex" },
    { _id: "68f88f5218f2d463c8c1c744", name: "TwyFord England" },
    { _id: "68f88f5218f2d463c8c1c745", name: "Twyford" },
    { _id: "68f88f5218f2d463c8c1c746", name: "VStar" },
    { _id: "68f88f5218f2d463c8c1c747", name: "Golden Diamond" },
    { _id: "68f88f5218f2d463c8c1c748", name: "Maxilon" },
    { _id: "68f88f5218f2d463c8c1c749", name: "Harmony" },
    { _id: "68f88f5218f2d463c8c1c74a", name: "Ford" },
    { _id: "68f88f5218f2d463c8c1c74b", name: "Abro" },
    { _id: "68f88f5218f2d463c8c1c74c", name: "Zuma" },
    { _id: "68f88f5218f2d463c8c1c74d", name: "TopGit" },
    { _id: "68f88f5218f2d463c8c1c74e", name: "Alteco" },
    { _id: "68f88f5218f2d463c8c1c74f", name: "Seebest" },
    { _id: "68f88f5218f2d463c8c1c750", name: "Safe Dignity" },
    { _id: "68f88f5218f2d463c8c1c751", name: "Sarvin" },
    { _id: "68f88f5218f2d463c8c1c752", name: "Ronex" },
    { _id: "68f88f5218f2d463c8c1c753", name: "Darger" },
    { _id: "68f88f5218f2d463c8c1c754", name: "Nigerian Copper" },
    { _id: "68f88f5218f2d463c8c1c755", name: "Italian Copper" },
    { _id: "68f88f5218f2d463c8c1c756", name: "HDP" },
    { _id: "68f88f5218f2d463c8c1c757", name: "Bencho" },
    { _id: "68f88f5218f2d463c8c1c758", name: "O.G.S" },
  ];

  // Build lookup maps for quick matching
  const categoryByName = Object.fromEntries(
    categories.map((c) => [c.name.toLowerCase(), c])
  );
  const categoryById = Object.fromEntries(categories.map((c) => [c._id, c]));
  const brandByName = Object.fromEntries(
    brands.map((b) => [b.name.toLowerCase(), b])
  );
  const brandById = Object.fromEntries(brands.map((b) => [b._id, b]));

  const products = await productsCollection.find().toArray();
  let fixedCount = 0;

  for (const product of products) {
    const updates = {};

    // --- Category normalization ---
    const cat = product.category;
    const catLink = product.category_link;
    const matchedCategory =
      categoryById[catLink] ||
      categoryByName[(cat || "").toLowerCase()] ||
      categoryByName[(catLink || "").toLowerCase()];

    if (matchedCategory) {
      updates.category = matchedCategory.name;
      updates.category_link = matchedCategory._id;
    }

    // --- Brand normalization ---
    const brand = product.brand_name;
    const brandLink = product.brand_link;
    const matchedBrand =
      brandById[brandLink] ||
      brandByName[(brand || "").toLowerCase()] ||
      brandByName[(brandLink || "").toLowerCase()];

    if (matchedBrand) {
      updates.brand_name = matchedBrand.name;
      updates.brand_link = matchedBrand._id;
    }

    if (Object.keys(updates).length > 0) {
      await productsCollection.updateOne(
        { _id: product._id },
        { $set: updates }
      );
      fixedCount++;
    }
  }

  console.log(`✅ Normalization complete. Fixed ${fixedCount} products.`);
}

// ------------------- Run the importer -------------------
async function main() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    console.log("🧩 Connected to MongoDB");

    await importProducts(client);

    console.log("\n🎉 Product import complete!");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
  }
}

main();
