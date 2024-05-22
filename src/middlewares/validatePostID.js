const validator = require("validator");
const PostModel = require("../models/post.model.js");
const ApiError = require("../utils/ApiError.js");

async function validatePostID(req, res, next) {
    const { postID } = req.params;

    // Validate post id
    if (validator.isMongoId(postID) == false) {
        return next(new ApiError("Invalid post id", 400));
    }

    // Check if post exists
    const post = await PostModel.findById(postID);
    if (post == null) {
        return next(new ApiError("Post not found", 404));
    }

    req.post = post;
    return next();
}
module.exports = validatePostID;
