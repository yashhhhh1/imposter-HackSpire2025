// db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri =
      "mongodb+srv://yash:biGPQ6i7xhAiWYfD@yash.zhuoo9j.mongodb.net/?retryWrites=true&w=majority&appName=yash";
    await mongoose.connect(uri);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error(error.message);
    // Exit process on failure
    process.exit(1);
  }
};

module.exports = connectDB;
