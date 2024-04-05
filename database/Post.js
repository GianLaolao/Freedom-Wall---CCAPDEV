const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    _id: Number,
    userId: Number,
    title: String,
    content: String,
    tag: String,
    datePosted: {
        type: Date,
        default: Date.now()
    },
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post