import joi from "joi";
import ApiError from "../utils/ApiError";

const userSchema = joi.object({
    profilePicture: joi.string().messages({
        "string.empty": "Please add a picture url to upload",
        "string.base": "Invalid picture url",
    }),
    bio: joi.string().min(10).max(400).messages({
        "string.min": "Bio should be at least 10 characters long",
        "string.max": "Bio should not be longer than 400 charactesr",
        "string.empty": "Bio cannot be empty",
        "string.base": "Bio should be a text value",
    }),
});

export default function userUpdatedValidator(changes) {
    const { error } = userSchema.validate(changes);
    if (error) {
        throw new ApiError(error.message, 400);
    }
}
