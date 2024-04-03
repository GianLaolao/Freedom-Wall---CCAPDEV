const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    _id: Number,
    postId: Number,
    userId: Number,
    content: String,
});

const Comment = mongoose.model('Comment', CommentSchema)

async function refresh() {
    try {
        await Comment.deleteMany({});
        console.log("Refreshed schema.");

        await Comment.insertMany([
            { _id: 3001, postId: 2001, userId: 1001, content: 'Sorry guys, I just love the color green...'},
            { _id: 3002, postId: 2001, userId: 1004, content: 'Let\'s be friends, btw do you play Pekken 8?'},
            { _id: 3003, postId: 2001, userId: 1005, content: 'Hello OP, I\'m also studying Computer Science... Want to collaborate on some projects?'},
            { _id: 3004, postId: 2002, userId: 1006, content: 'I can now pass my Chemistry exam tomorrow.'},
            { _id: 3005, postId: 2002, userId: 1007, content: 'There is also another type of sugar called Galactose, it fought the Avengers.'},
            { _id: 3006, postId: 2002, userId: 1008, content: 'How can I use this knowledge to make ice cream?'},
            { _id: 3007, postId: 2003, userId: 1009, content: 'Please stop, Elon... I\'m buying this website.'},
            { _id: 3008, postId: 2003, userId: 1010, content: 'How about let\'s chat about it first... I\'ll treat you a burger.'},
            { _id: 3009, postId: 2003, userId: 1011, content: 'Come over here and we\'ll do a challenge. Let\'s play Chess, first to 3 points gets the right to buy the website.'},
        ]);
        console.log("Data inserted successfully.");
    } catch (error) {
        console.error("Error:", error);
    }
};

refresh();

module.exports = Comment
