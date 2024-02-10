import { Router } from "express";
import UserModel from "../models/user.model.js";

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

// TODO: add validations
router.patch("/", async (req, res) => {
    const changes = req.body;
    const userID = req.user._id;
    const updatedUser = await UserModel.findByIdAndUpdate(userID, changes, {
        new: true,
    });
    return res.status(200).json({
        ok: true,
        data: updatedUser,
    });
});

export default router;
