import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import { Category } from "./models/categorymodel.js";

const defaultCategories = [
  "Technology",
  "Programming",
  "Architecture",
  "Design",
  "Database",
  "Cloud",
  "AI & Machine Learning",
  "Web Development",
  "Mobile Development",
  "DevOps"
];

async function seedCategories() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Connected to MongoDB");

    // Check if categories already exist
    const existingCategories = await Category.find();
    if (existingCategories.length > 0) {
      console.log(`⚠️  ${existingCategories.length} categories already exist. Skipping...`);
      console.log("Existing categories:");
      existingCategories.forEach(cat => console.log(`  - ${cat.category_name}`));
    } else {
      // Insert default categories
      const categories = defaultCategories.map(name => ({ category_name: name }));
      await Category.insertMany(categories);
      console.log(`✅ Successfully added ${defaultCategories.length} categories:`);
      defaultCategories.forEach(cat => console.log(`  - ${cat}`));
    }

    console.log("\n🎉 Seed completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding categories:", error.message);
    process.exit(1);
  }
}

seedCategories();

