const mongoose = require("mongoose");

async function connectDB(url) {
    await mongoose.connect(url);
    console.log("Connected to database");
}

module.exports = connectDB;
