const mongoose = require("mongoose");

async function connectDB(url) {
    await mongoose.connect(url);
}

module.exports = connectDB;
