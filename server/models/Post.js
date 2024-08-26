const mongoose = require("mongoose")

const commentSchema = mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    parentId: {
        type: String,
        default: null
    }
})

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    comments: {
        type: [commentSchema]
    },
    likes: {
        type: [String]
    },
    dislikes: {
        type: [String]
    }
}, {timestamps: true})

const Post = mongoose.model("Post", postSchema)

module.exports = Post;