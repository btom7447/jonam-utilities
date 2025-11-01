// scripts/importLogistics.js
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = "jonam";

// ✅ Your stateOptions object
const stateOptions = {
  Abia: 3000,
  Adamawa: 4500,
  "Akwa Ibom": 3000,
  Anambra: 2500,
  Bauchi: 4000,
  Bayelsa: 3000,
  Benue: 3500,
  Borno: 5000,
  "Cross River": 3000,
  Delta: 3000,
  Ebonyi: 2800,
  Edo: 2500,
  Ekiti: 2500,
  Enugu: 2700,
  "FCT - Abuja": 2000,
  Gombe: 4500,
  Imo: 2600,
  Jigawa: 5000,
  Kaduna: 3800,
  Kano: 4000,
  Katsina: 5000,
  Kebbi: 5000,
  Kogi: 3000,
  Kwara: 2800,
  Lagos: 1500,
  Nasarawa: 2500,
  Niger: 3000,
  Ogun: 2000,
  Ondo: 2500,
  Osun: 2300,
  Oyo: 2200,
  Plateau: 3600,
  Rivers: 3200,
  Sokoto: 5000,
  Taraba: 4800,
  Yobe: 5200,
  Zamfara: 5000,
};

async function importLogistics() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    console.log("🧩 Connected to MongoDB");

    const db = client.db(DB_NAME);
    const logistics = db.collection("logistics");

    // Convert stateOptions into array of objects
    const logisticsData = Object.entries(stateOptions).map(([state, price]) => ({
      state,
      price,
      createdAt: new Date(),
    }));

    // Clear old records first (optional)
    await logistics.deleteMany({});
    console.log("🧹 Cleared old logistics data");

    // Insert new data
    await logistics.insertMany(logisticsData);
    console.log(`✅ Imported ${logisticsData.length} logistics records`);
  } catch (err) {
    console.error("❌ Error importing logistics data:", err);
  } finally {
    await client.close();
    console.log("🔒 MongoDB connection closed");
  }
}

importLogistics();
