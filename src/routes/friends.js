import { Router } from "express";
import UserModel from "../models/user.model.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import ApiError from "../utils/ApiError.js";
import validator from "validator";

const router = Router();

router.use(isAuthenticated);

// GET FRIEND LIST
router.get("/", async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user._id)
            .populate("friends", "profilePicture firstname lastname")
            .sort("-createdAt");
        return res.status(200).json({
            ok: true,
            data: user.friends,
        });
    } catch (err) {
        next(err);
    }
});

// GET PENDING REQUEST
router.get("/pending-requests", async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user._id).populate(
            "pending_requests",
            "profilePicture firstname lastname"
        );
        return res.status(200).json({
            ok: true,
            data: user.pending_requests,
        });
    } catch (err) {
        next(err);
    }
});

// SEND FRIEND REQUEST
router.post("/send-request/:id", async (req, res, next) => {
    try {
        const followingID = req.params.id; // the user, to whome friend req is being sent
        const followerID = String(req.user._id); // the user who is sending friend req

        // Check if user is sending request to himself
        if (followerID === followingID) {
            throw new ApiError("You cannot send request to yourself", 400);
        }
        // Check if user exists
        const followingUserExists = await UserModel.findById(followingID);
        if (!followingUserExists) {
            throw new ApiError("Friend not found", 404);
        }
        // Check if the request has been sent previously
        if (followingUserExists.pending_requests.includes(followerID)) {
            throw new ApiError("A request is already pending", 400);
        }
        // Check if user is already friends with him/her
        if (followingUserExists.friends.includes(followerID)) {
            throw new ApiError("You are already friends with the user", 400);
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

// ACCEPT FRIEND REQUEST
router.patch("/accept-request/:id", async (req, res, next) => {
    try {
        const requestID = req.params.id;
        const userID = String(req.user._id);

        if (!requestID) {
            throw new ApiError("Request id is missing", 400);
        }
        // Validate request id
        if (validator.isMongoId(requestID) === false) {
            throw new ApiError("Invalid request id", 400);
        }
        // Check if request still exists
        const user = await UserModel.findById(userID);
        if (user.pending_requests.includes(requestID) == false) {
            throw new ApiError("Request no longer exists", 404);
        }

        // Update friend list of both users
        const updatedUser = await UserModel.findByIdAndUpdate(
            userID,
            {
                $push: { friends: requestID },
                $pull: { pending_requests: requestID },
            },
            { new: true }
        ).populate("pending_requests", "profilePicture firstname lastname");

        await UserModel.findByIdAndUpdate(requestID, {
            $push: { friends: userID },
        });
        // return response
        return res.status(200).json({
            ok: true,
            data: updatedUser.pending_requests,
        });
    } catch (err) {
        next(err);
    }
});

// REJECT FRIEND REQUEST
router.patch("/reject-request/:id", async (req, res, next) => {
    try {
        const requestID = req.params.id;
        const userID = String(req.user._id);

        if (!requestID) {
            throw new ApiError("Request id is missing", 400);
        }
        // Validate request id
        if (validator.isMongoId(requestID) === false) {
            throw new ApiError("Invalid request id", 400);
        }
        // Check if request still exists
        const user = await UserModel.findById(userID);
        if (user.pending_requests.includes(requestID) == false) {
            throw new ApiError("Request no longer exists", 404);
        }

        // Update friend list of both users
        const updatedUser = await UserModel.findByIdAndUpdate(
            userID,
            {
                $pull: { pending_requests: requestID },
            },
            { new: true }
        ).populate("pending_requests", "profilePicture firstname lastname");
        // return response
        return res.status(200).json({
            ok: true,
            data: updatedUser.pending_requests,
        });
    } catch (err) {
        next(err);
    }
});

// REMOVE FRIEND
router.patch("/remove-friend/:id", async (req, res, next) => {
    try {
        const friendID = req.params.id;
        const userID = String(req.user._id);

        // Check if id is valid
        if (validator.isMongoId(friendID) === false) {
            throw new ApiError("Invalid friend id", 400);
        }
        // Check if friend exists
        const user = await UserModel.findById(userID);
        if (user.friends.includes(userID)) {
            throw new ApiError("Friend not found", 404);
        }

        // Remove friend
        const updatedUser = await UserModel.findByIdAndUpdate(
            userID,
            {
                $pull: { friends: friendID },
            },
            { new: true }
        ).populate("friends", "profilePicture firstname lastname");
        await UserModel.findByIdAndUpdate(friendID, {
            $pull: { friends: userID },
        });

        return res.status(200).json({
            ok: true,
            data: updatedUser.friends,
        });
    } catch (err) {
        next(err);
    }
});

export default router;
