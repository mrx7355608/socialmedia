import { Router } from "express";
import passport from "passport";
import { validateSignupData } from "../validators/auth.validators.js";
import UserModel from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { hashString } from "../utils/hashAndVerify.js";

const router = Router();

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${process.env.CLIENT_URL}/auth/failure`,
        successRedirect: process.env.CLIENT_URL,
    })
);
router.post("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        // TODO: cookie is not being cleared in the browser fix it
        return res.status(200).json({ ok: true, data: null });
    });
});

router.post("/signup", async (req, res, next) => {
    try {
        const data = req.body;
        validateSignupData(data); // throws error if any

        // Check if user exists
        const user = await UserModel.findOne({ email: data.email });
        if (user) {
            throw new ApiError(
                "User is already registered, use a different email",
                400
            );
        }

        // Create a new user
        const hashedPassword = await hashString(data.password);
        const userData = {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            password: hashedPassword,
            bio: "",
            friends: [],
            pending_requests: [],
            googleId: null,
        };
        // TODO: remove sensitive fields from "newUser" object
        const newUser = await UserModel.create(userData);
        // Create session for newly created user
        req.login(newUser, function (err) {
            if (err) {
                return next(err);
            }
            return res.status(201).json({
                ok: true,
                data: newUser,
            });
        });
    } catch (err) {
        next(err);
    }
});

export default router;
