import { Router } from "express";

const router = Router();

router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({
        ok: false,
        error: "Not authenticated",
    });
});

router.get("/", (req, res) => {
    res.status(200).json({
        ok: true,
        data: req.user,
    });
});

router.patch("/", async (req, res) => {});

export default router;
