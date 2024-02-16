import { Router } from "express";
import PostModel from "../models/post.model.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import postDataValidator from "../validators/posts.validator.js";

const router = Router();

router.use(isAuthenticated);

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

        // Return response
        return res.status(201).json({
            ok: true,
            data: newPost,
        });
    } catch (err) {
        next(err);
    }
});

export default router;
