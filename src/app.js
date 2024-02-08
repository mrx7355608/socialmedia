import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import { catch404, globalErrorHandler } from "./utils/errorHandlers.js";
import passport from "passport";
import passportSetup from "./passportSetup.js";

const app = express();

app.use(helmet());
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

app.use(passport.initialize());
app.use(passport.session());
passportSetup();

app.use(catch404);
app.use(globalErrorHandler);

export default app;
