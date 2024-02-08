import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";

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
            default: "/profile.jpg",
        },
        coverPicture: {
            type: String,
            default: "/cover.jpg",
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
export default UserModel;
