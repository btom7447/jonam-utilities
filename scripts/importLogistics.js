import dotenv from "dotenv";
import connectDB from "../lib/mongodb.js";
import Logistics from "../models/Logistics.js";

dotenv.config();

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

async function seed() {
  try {
    await connectDB();

    const data = Object.entries(stateOptions).map(([state, price]) => ({
      state,
      price,
    }));

    await Logistics.deleteMany(); // Clear existing data
    await Logistics.insertMany(data);

    console.log("✅ Logistics data imported successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error importing logistics:", err);
    process.exit(1);
  }
}

seed();
