import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import { catch404, globalErrorHandler } from "./utils/errorHandlers.js";
import passport from "passport";
import sessions from "express-session";
import connectMongo from "connect-mongodb-session";
import passportSetup from "./passportSetup.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import friendsRouter from "./routes/friends.js";
import postsRouter from "./routes/posts.js";
import commentsRouter from "./routes/comments.js";
import path from "path";
import { __dirname } from "./utils/dirName.js";

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
app.use(morgan("dev"));
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Serve react app
app.use(express.static(path.join(__dirname, "..", "..", "dist")));

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
        cookie: {
            maxAge: 24 * 3600 * 1000,
            secure: true,
            domain: process.env.SERVER_DOMAIN,
            path: "/",
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

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "dist", "index.html"));
});

app.use(catch404);
app.use(globalErrorHandler);

export default app;
