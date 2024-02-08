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
router.post("/logout", (req, res) => {
    req.logout();
    return res.status(200).json({ ok: true, data: null });
});

export default router;
