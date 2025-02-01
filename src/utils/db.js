const mongoose = require("mongoose");

async function connectDB(url) {
    await mongoose.connect(url);
    console.log("Connected to database");
}

async function disconnectDB() {
    await mongoose.disconnect();
    console.log("Disconnected from database");
}

module.exports = { connectDB, disconnectDB };
