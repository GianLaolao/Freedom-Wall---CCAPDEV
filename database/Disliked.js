const mongoose = require('mongoose');

const DislikedSchema = mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    postId: {
        type: Number,
        required: true
    }
});

DislikedSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Disliked = mongoose.model('Disliked', DislikedSchema);

module.exports = Disliked
