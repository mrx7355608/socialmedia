import { Router } from "express";
import UserModel from "../models/user.model.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    searchQueryValidator,
    userUpdatesValidator,
} from "../validators/user.validators.js";

const router = Router();

router.use(isAuthenticated);

// TODO: remove sensitive fields from req.user object
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

// Returns ten random users from database
// Used in signup completion step when user is asked to
// send request to people he may know
router.get("/random-users", async (req, res, next) => {
    try {
        // returns ten random people
        const randomUsers = await UserModel.aggregate([
            { $sample: { size: 10 } },
        ]);
        return res.status(200).json({
            ok: true,
            data: randomUsers,
        });
    } catch (err) {
        next(err);
    }
});

export default router;
