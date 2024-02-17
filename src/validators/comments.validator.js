import joi from "joi";
import ApiError from "../utils/ApiError.js";

const commentsValidationSchema = joi
    .string()
    .required()
    .min(2)
    .max(500)
    .messages({
        "any.required": "Please enter your comment",
        "string.empty": "An empty comment cannot be created",
        "string.min": "Comment should contain 2 characters at least",
        "string.max": "Comment cannot be longer than 500 characters",
        "string.base": "Invalid comment",
    });

export default function commentDataValidator(string) {
    const { error } = commentsValidationSchema.validate(string);
    if (error) {
        throw new ApiError(error.message, 400);
    }
}
