const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        content: {
            type: String,
            required: true,
        },
        likes: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const PostModel = mongoose.model("Post", postSchema);

module.exports = PostModel;
