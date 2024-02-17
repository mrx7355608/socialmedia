import validator from "validator";
import PostModel from "../models/post.model.js";
import ApiError from "../utils/ApiError.js";

export default async function validatePost(req, res, next) {
    const { postID } = req.params;

    // Validate post id
    if (validator.isMongoId(postID) == false) {
        return next(new ApiError("Invalid post id", 400));
    }

    // Check if post exists
    const post = await PostModel.findById(postID);
    if (post == null) {
        next(new ApiError("Post not found", 404));
    }

    return next();
}
