import { Router } from "express";
import passport from "passport";
import { validateSignupData } from "../validators/auth.validators";

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
    } catch (err) {
        next(err);
    }
});

export default router;
