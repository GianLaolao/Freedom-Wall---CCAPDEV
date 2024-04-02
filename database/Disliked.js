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

async function refresh() {
    try {
        await Disliked.deleteMany({});
        console.log("Refreshed schema.");

        await Disliked.insertMany([
            {userId: 1001, postId: 2003}
        ])
        console.log("Data inserted successfully.");
    } catch (error) {
        console.error("Error:", error);
    }
};

refresh();

module.exports = Disliked
