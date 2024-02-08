import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({
            ok: true,
            data: req.user,
        });
    } else {
        res.status(401).json({
            ok: false,
            error: "Not authenticated",
        });
    }
});

export default router;
