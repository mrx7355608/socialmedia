require("dotenv/config");

const { connectDB } = require("../src/utils/db");
const port = process.env.PORT || 8000;

function startServer() {
    connectDB(process.env.DB_URL).then(() => {
        require("../src/app").listen(port, () => {
            console.log("express server started on port", port);
        });
    });
}

startServer();
