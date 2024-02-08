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
        pendingRequests: [
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

userSchema.pre("save", async function (next) {
    if (this.isNew || this.isModified("password")) {
        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
        next();
    } else {
        next();
    }
});

userSchema.virtual("fullname").get(function () {
    const capitalizedFirstName = capitalizeFirstLetter(this.firstname);
    const capitalizedLastName = capitalizeFirstLetter(this.lastname);
    const fullname = `${capitalizedFirstName} ${capitalizedLastName}`;
    return fullname;
});

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
