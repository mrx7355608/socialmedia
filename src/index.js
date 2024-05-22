require("dotenv/config");
const app = require("./app");
const connectDB = require("./utils/db");

const port = process.env.PORT || 8000;

async function startServer() {
    await connectDB(process.env.DB_URL);
    app.listen(port, () => {
        console.log("express server started on port", port);
    });
}

startServer();
