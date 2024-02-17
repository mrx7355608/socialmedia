import joi from "joi";
import ApiError from "../utils/ApiError.js";

const postSchema = joi.string().required().min(2).max(1500).messages({
    "any.required": "Please enter your post content",
    "string.empty": "An empty post cannot be created",
    "string.min": "Post should contain 2 characters at least",
    "string.max": "Post cannot be longer than 1500 characters",
    "string.base": "Invalid post content",
});

export default function postDataValidator(string) {
    const { error } = postSchema.validate(string);
    if (error) {
        throw new ApiError(error.message, 400);
    }
}
