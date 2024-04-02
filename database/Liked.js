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

async function refresh() {
    try {
        await Liked.deleteMany({});
        console.log("Refreshed schema.");

        await Liked.insertMany([
            {userId: 1001, postId: 2001},
            {userId: 1001, postId: 2002}
        ])
        console.log("Data inserted successfully.");
    } catch (error) {
        console.error("Error:", error);
    }
};

refresh();

module.exports = Liked;
