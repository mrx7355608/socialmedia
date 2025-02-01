const mongoose = require("mongoose");

async function connectDB(url) {
    await mongoose.connect(url, {
        maxPoolSize: 1,
        minPoolSize: 1,
        socketTimeoutMS: 3000,
    });
    console.log("Connected to database");
}

async function disconnectDB() {
    await mongoose.disconnect();
    console.log("Disconnected from database");
}

module.exports = { connectDB, disconnectDB };
