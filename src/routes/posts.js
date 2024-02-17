import { Router } from "express";
import PostModel from "../models/post.model.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import postDataValidator from "../validators/posts.validator.js";
import validator from "validator";
import ApiError from "../utils/ApiError.js";

const router = Router();

router.use(isAuthenticated);

// GET POSTS OF CURRENT USER
router.get("/", async (req, res, next) => {
    try {
        const posts = await PostModel.find(
            {
                author: String(req.user._id),
            },
            "-__v"
        ).sort("-createdAt");
        return res.status(200).json({
            ok: true,
            data: posts,
        });
    } catch (err) {
        next(err);
    }
});

// TIMELINE
router.get("/timeline", async (req, res, next) => {
    try {
        // TODO: add pagination
        const friendIDs = req.user.friends;
        const userID = req.user._id;
        const authorIDs = [userID, ...friendIDs];
        const posts = await PostModel.find({ author: { $in: authorIDs } })
            .populate("author", "profilePicture firstname lastname")
            .sort("-createdAt");
        return res.status(200).json({
            ok: true,
            data: posts,
        });
    } catch (err) {
        next(err);
    }
});

// CREATE NEW POST
router.post("/", async (req, res, next) => {
    try {
        const { content } = req.body;
        // Validate post
        postDataValidator(content);

        // Create new post
        const postDTO = {
            author: req.user._id,
            content: content,
            likes: [],
            comments: [],
        };
        const newPost = await PostModel.create(postDTO);
        const populatedPost = await newPost.populate(
            "author",
            "profilePicture firstname lastname"
        );

        // Return response
        return res.status(201).json({
            ok: true,
            data: populatedPost,
        });
    } catch (err) {
        next(err);
    }
});

// UPDATE EXISTING POST
router.patch("/:id", async (req, res, next) => {
    try {
        const postID = req.params.id;

        // Validate post id
        if (validator.isMongoId(postID) === false) {
            throw new ApiError("Invalid post id", 400);
        }

        // Check if post exists
        const post = await PostModel.findById(postID);
        if (post === null) {
            throw new ApiError("Post not found", 404);
        }

        // Verify that post belongs to the user
        const userID = String(req.user._id);
        const postAuthorID = String(post.author);
        if (userID !== postAuthorID) {
            throw new ApiError("Only the post author can edit", 403);
        }

        // Validate new post changes
        const newContent = req.body.content;
        postDataValidator(newContent);

        // Update the post
        const updatedPost = await PostModel.findByIdAndUpdate(
            postID,
            { content: newContent },
            { new: true }
        );

        // Return response
        return res.status(200).json({
            ok: true,
            data: updatedPost,
        });
    } catch (err) {
        next(err);
    }
});

// DELETE EXISTING POST
router.delete("/:id", async (req, res, next) => {
    try {
        const postID = req.params.id;

        // Validate post id
        if (validator.isMongoId(postID) === false) {
            throw new ApiError("Invalid post id", 400);
        }

        // Check if post exists
        const post = await PostModel.findById(postID);
        if (post === null) {
            throw new ApiError("Post not found", 404);
        }

        // Verify that post belongs to the user
        const userID = String(req.user._id);
        const postAuthorID = String(post.author);
        if (userID !== postAuthorID) {
            throw new ApiError("Only the post author can delete", 403);
        }

        // Delete the post
        await PostModel.findByIdAndDelete(postID);

        // Return response
        return res.status(204).json({
            ok: true,
            data: null,
        });
    } catch (err) {
        next(err);
    }
});

export default router;
