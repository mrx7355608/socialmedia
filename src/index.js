import "dotenv/config";
import app from "./app.js";
import connectDB from "./utils/db.js";

const port = process.env.PORT || 8000;

async function startServer() {
    await connectDB(process.env.DB_URL);
    app.listen(port, () => {
        console.log("express server started on port", port);
    });
}

startServer();
