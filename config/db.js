const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "bandhanDB",
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);

    // ❗ DEV MODE: server ko crash mat hone do
    console.log("⚠️ MongoDB not connected. Server running without DB.");
  }
};

module.exports = connectDB;
