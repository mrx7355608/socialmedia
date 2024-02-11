import { Router } from "express";
import UserModel from "../models/user.model.js";
import {
    searchQueryValidator,
    userUpdatesValidator,
} from "../validators/user.validators.js";

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

router.patch("/", async (req, res, next) => {
    try {
        const changes = req.body;
        const userID = req.user._id;

        userUpdatesValidator(changes);

        const updatedUser = await UserModel.findByIdAndUpdate(userID, changes, {
            new: true,
        });
        return res.status(200).json({
            ok: true,
            data: updatedUser,
        });
    } catch (err) {
        next(err);
    }
});

router.get("/search", async (req, res, next) => {
    try {
        const { name } = req.query;
        searchQueryValidator(name);

        const [fname, lname] = name.split(" ");
        const users = await UserModel.find({
            $or: [
                {
                    firstname: {
                        $regex: new RegExp(fname),
                        $options: "i",
                    },
                    lastname: {
                        $regex: new RegExp(lname),
                        $options: "i",
                    },
                },
            ],
        });
        return res.status(200).json({
            ok: true,
            data: users,
        });
    } catch (err) {
        next(err);
    }
});

export default router;
