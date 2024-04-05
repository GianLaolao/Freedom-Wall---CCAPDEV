const mongoose = require('mongoose');

const LikedSchema = mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    postId: {
        type: Number,
        required: true
    }
});

LikedSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Liked = mongoose.model('Liked', LikedSchema);

module.exports = Liked;
