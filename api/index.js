require("dotenv/config");
const connectDB = require("../src/utils/db");

const port = process.env.PORT || 8000;

async function startServer() {
    connectDB(process.env.DB_URL)
        .then(() => {
            console.log("Connected to database");
            require("../src/app").listen(port, () => {
                console.log("express server started on port", port);
            });
        })
        .catch((err) => {
            console.log(err);
            console.log("Connection to database failed");
            process.exit(0);
        });
}

startServer();
