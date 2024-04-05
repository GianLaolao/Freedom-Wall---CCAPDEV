const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    _id: Number,
    postId: Number,
    userId: Number,
    content: String,
});

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment
