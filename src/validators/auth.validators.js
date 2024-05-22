const joi = require("joi");
const ApiError = require("../utils/ApiError.js");

const signupSchema = joi.object({
    firstname: joi.string().required().min(3).max(15).messages({
        "any.required": "Firstname is required",
        "string.empty": "First name cannot be empty",
        "string.min": "First name should be 3 characters long",
        "string.max": "First name cannot be longer than 15 characters",
        "string.base": "First name should be a text value",
    }),
    lastname: joi.string().required().min(3).max(15).messages({
        "any.required": "Last name is required",
        "string.empty": "Last name cannot be empty",
        "string.min": "Last name should be 3 characters long",
        "string.max": "Last name cannot be longer than 15 characters",
        "string.base": "Last name should be a text value",
    }),
    email: joi.string().required().email().messages({
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty",
        "string.email": "Invalid email",
        "string.base": "Email should be a text value",
    }),
    password: joi.string().required().min(8).max(16).messages({
        "any.required": "Password is required",
        "string.empty": "Password cannot be empty",
        "string.min": "Password should be 8 characters long",
        "string.max": "Password cannot be longer than 16 characters",
        "string.base": "Password should be a text value",
    }),
    confirm_password: joi
        .string()
        .required()
        .valid(joi.ref("password"))
        .messages({
            "any.required": "Please confirm your password",
            "string.empty": "Please confirm your password",
            "any.only": "Passwords do not match",
        }),
});

function validateSignupData(data) {
    const { error } = signupSchema.validate(data);
    if (error) {
        throw new ApiError(error.message, 400);
    }
}

module.exports = { validateSignupData };
