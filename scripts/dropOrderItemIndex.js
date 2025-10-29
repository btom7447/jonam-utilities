import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function dropIndex() {
  await mongoose.connect(process.env.MONGODB_URI);
  const collection = mongoose.connection.collection("order-items");

  try {
    await collection.dropIndex("product_number_1");
    console.log("✅ Dropped index: product_number_1");
  } catch (err) {
    console.log("⚠️ Could not drop index:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

dropIndex();
