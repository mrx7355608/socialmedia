import { Router } from "express";
import passport from "passport";

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

export default router;
