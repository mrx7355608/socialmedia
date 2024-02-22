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
        failureRedirect: "/auth/failure",
        successRedirect: "/",
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
        const newUser = await UserModel.create(userData);

        // Removing sensitive fields from user object
        newUser.password = undefined;
        newUser.__v = undefined;
        newUser.googleId = undefined;
        newUser.email = undefined;

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
router.post("/login", async (req, res, next) => {
    passport.authenticate("local", function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (user == false) {
            return res.status(400).json({ ok: false, error: info.message });
        }
        req.login(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.status(200).json({
                ok: true,
                data: user,
            });
        });
    })(req, res, next);
});

export default router;
