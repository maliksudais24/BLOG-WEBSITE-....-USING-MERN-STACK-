import mongoose from "mongoose";

const connectdb = async () => {
  try {
    const mongoUri = process.env.MONGODB_URL;
    
    console.log("🔍 DEBUG - MONGODB_URL value:", mongoUri ? "SET ✓" : "UNDEFINED ✗");
    console.log("🔍 DEBUG - Full URI:", mongoUri);
    
    if (!mongoUri) {
      throw new Error("❌ MONGODB_URL is not defined in .env file");
    }

    const options = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      appName: 'BlogSite',
      retryWrites: true,
      w: 'majority',
    };

    console.log("🔍 DEBUG - Attempting MongoDB connection...");
    await mongoose.connect(mongoUri, options);
    console.log("✅ Database is connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("❌ Full error:", error);
    process.exit(1);
  }
};

export { connectdb };

