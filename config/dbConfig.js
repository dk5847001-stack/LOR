const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      console.warn("MONGO_URL is missing. Database connection skipped.");
      return;
    }

    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
