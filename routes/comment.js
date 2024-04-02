
const express = require('express');
const router = express.Router();

//Get comments
router.get('/', function (req, res) {
    //Return all comments
    res.json();
});

//Get a comment.
//Find the correct route.
router.get('/', function (req, res) {
    const found = true; //Find a comment.

    if (found) {
        res.json(); //return the comment.
    } else {
        //Error message.
        res.status(400);
    }
});

//Create a comment.
//Find the correct route.
router.post('/', function (req, res) {
    console.log(req.body.content);

    /*
    const newPost = {
        user: {
            username: req.body.username
        },
        content: req.body.content,
    }

    if (!newPost.user.username || !newPost.content) {
        //Error message.
        req.statusCode(400);
    } else {
        //Create comment and store it to the database.
    
    }
    */
});

//Update / edit a comment
//Find the correct route.
router.put('', function (req, res) {
    const found = true; //Find a comment.

    if (found) {
        //Edit a comment and update the database.
    } else {
        res.status(400);
    }
});

//Delete a comment
//Find the correct route.
router.delete('', function (req, res) {
    const found = true; //Find a comment.

    if (found) {
        //Delete a comment.
    } else {
        res.status(400);
    }
});

module.exports = router;
