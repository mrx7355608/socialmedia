import mongoose from "mongoose";

const commentsSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    text: {
        type: String,
        required: true,
    },
});

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
        comments: {
            type: [commentsSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const PostModel = mongoose.model("Post", postSchema);

export default PostModel;
