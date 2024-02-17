import validator from "validator";
import ApiError from "../utils/ApiError.js";
import CommentsModel from "../models/comment.model.js";

export default async function validateComment(req, res, next) {
    const { commentID } = req.params;
    // Validate comment id
    if (validator.isMongoId(commentID) == false) {
        return next(new ApiError("Invalid comment id", 400));
    }
    // Check if comment exists
    const comment = await CommentsModel.findById(commentID);
    if (comment == null) {
        return next(new ApiError("Comment not found", 404));
    }
    // Check if comment belongs to user
    const userID = String(req.user._id);
    const authorID = String(comment.author);
    if (userID !== authorID) {
        return next(
            new ApiError("Only the author can perform this action", 403)
        );
    }

    return next();
}
