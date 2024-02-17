import { Router } from "express";
import CommentsModel from "../models/comment.model.js";

const router = Router();

router.get("/:postID", async (req, res, next) => {
    try {
        const { postID } = req.params;
        const comments = await CommentsModel.find({ postID })
            .populate("author", "profilePicture firstname lastname")
            .sort("-createdAt");
        return res.status(200).json({
            ok: true,
            data: comments,
        });
    } catch (err) {
        next(err);
    }
});

router.post("/:postID", async (req, res, next) => {
    try {
        const { postID } = req.params;
        const { text } = req.body;
        const newComment = await CommentsModel.create({
            author: req.user._id,
            text: text,
            postID: postID,
        });
        return res.status(201).json({
            ok: true,
            data: newComment,
        });
    } catch (err) {
        next(err);
    }
});

router.patch("/:commentID", async (req, res, next) => {
    try {
        const { commentID } = req.params;
        const change = req.body.text;
        const updatedComment = await CommentsModel.findByIdAndUpdate(
            commentID,
            {
                text: change,
            },
            { new: true }
        ).populate("author", "profilePicture firstname lastname");
        return res.status(200).json({
            ok: true,
            data: updatedComment,
        });
    } catch (err) {
        next(err);
    }
});

router.delete("/:commentID", async (req, res, next) => {
    try {
        const { commentID } = req.params;
        await CommentsModel.findByIdAndDelete(commentID);
        return res.status(204).end();
    } catch (err) {
        next(err);
    }
});

export default router;
