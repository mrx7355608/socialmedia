import { Router } from "express";
import UserModel from "../models/user.model.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import ApiError from "../utils/ApiError.js";

const router = Router();

router.use(isAuthenticated);

router.post("/add/:id", async (req, res, next) => {
    try {
        const followingID = req.params.id; // the user, to whome friend req is being sent
        const followerID = String(req.user._id); // the user who is sending friend req

        // Check if user exists
        const followingUserExists = await UserModel.findById(followingID);
        if (!followingUserExists) {
            throw new ApiError("Friend not found", 404);
        }

        // Check if the request has been sent previously
        if (followingUserExists.pending_requests.includes(followerID)) {
            throw new ApiError("A request is already pending", 400);
        }

        // Add follower in the pending requests of the following
        await UserModel.findByIdAndUpdate(followingID, {
            $push: { pending_requests: followerID },
        });
        return res.status(200).json({
            ok: true,
            data: null,
        });
    } catch (err) {
        next(err);
    }
});

export default router;
