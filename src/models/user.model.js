const mongoose = require("mongoose");
const capitalizeFirstLetter = require("../utils/capitalizeFirstLetter.js");

const userSchema = new mongoose.Schema(
    {
        googleId: String,
        firstname: String,
        lastname: String,
        email: String,
        password: String,
        bio: String,
        profilePicture: {
            type: String,
            default: process.env.DEFAULT_PROFILE_PICTURE,
        },
        coverPicture: {
            type: String,
            default: process.env.DEFAULT_COVER_PICTURE,
        },
        friends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        pending_requests: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);

userSchema.virtual("fullname").get(function () {
    const capitalizedFirstName = capitalizeFirstLetter(this.firstname);
    const capitalizedLastName = capitalizeFirstLetter(this.lastname);
    const fullname = `${capitalizedFirstName} ${capitalizedLastName}`;
    return fullname;
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
