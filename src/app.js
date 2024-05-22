const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const morgan = require("morgan");
const { catch404, globalErrorHandler } = require("./utils/errorHandlers.js");
const passport = require("passport");
const sessions = require("express-session");
const connectMongo = require("connect-mongodb-session");
const passportSetup = require("./passportSetup.js");
const authRouter = require("./routes/auth.js");
const userRouter = require("./routes/user.js");
const friendsRouter = require("./routes/friends.js");
const postsRouter = require("./routes/posts.js");
const commentsRouter = require("./routes/comments.js");

const app = express();

app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
            "img-src": [
                "'self'",
                "https://res.cloudinary.com/",
                "data:",
                "https://lh3.googleusercontent.com/",
            ],
        },
    })
);
app.use(hpp());
app.use(morgan("common"));
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const MongoStore = connectMongo(sessions);
const mongoStore = new MongoStore({
    uri: process.env.DB_URL,
    collection: "sessions",
});

app.use(
    sessions({
        secret: process.env.SESSIONS_SECRET,
        resave: false,
        saveUninitialized: false,
        name: "sid",
        cookie: {
            maxAge: 24 * 3600 * 1000,
            secure: false,
            httpOnly: true,
        },
        store: mongoStore,
    })
);
app.use(passport.initialize());
app.use(passport.session());
passportSetup();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/friends", friendsRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/comments", commentsRouter);

app.use(catch404);
app.use(globalErrorHandler);

module.exports = app;
