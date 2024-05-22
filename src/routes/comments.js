const { Router } = require("express");
const CommentsModel = require("../models/comment.model.js");
const validatePostID = require("../middlewares/validatePostID.js");
const isAuthenticated = require("../middlewares/isAuthenticated.js");
const validateComment = require("../middlewares/validateComment.js");
const commentDataValidator = require("../validators/comments.validator.js");

const router = Router();

router.use(isAuthenticated);

// GET COMMENTS
router.get("/:postID", validatePostID, async (req, res, next) => {
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

// CREATE COMMENT
router.post("/:postID", validatePostID, async (req, res, next) => {
    try {
        const { postID } = req.params;
        const { text } = req.body;
        // Validate comment
        commentDataValidator(text);

        const newComment = await CommentsModel.create({
            author: req.user._id,
            text: text,
            postID: postID,
        });
        const populatedComment = await newComment.populate(
            "author",
            "profilePicture firstname lastname"
        );

        return res.status(201).json({
            ok: true,
            data: populatedComment,
        });
    } catch (err) {
        next(err);
    }
});

// EDIT COMMENT
router.patch("/:commentID", validateComment, async (req, res, next) => {
    try {
        const { commentID } = req.params;
        const change = req.body.text;

        // Validate new comment
        commentDataValidator(change);

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

// DELETE COMMENT
router.delete("/:commentID", validateComment, async (req, res, next) => {
    try {
        const { commentID } = req.params;
        await CommentsModel.findByIdAndDelete(commentID);
        return res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;
