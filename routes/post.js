
const express = require('express');
const router = express.Router();

//Get posts
router.get('/', function (req, res) {
    //Return all posts
    res.json();
});

//Get a post.
//Find the correct route.
router.get('/', function (req, res) {
    const found = true; //Find a post.

    if (found) {
        res.json(); //return the post.
    } else {
        //Error message.
        res.status(400);
    }
});

//Create a post.
//Find the correct route.
router.post('/', function (req, res) {
    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.body.tag);

    /*
    const newPost = {
        user: {
            username: req.body.username
        },
        title: req.body.title,
        content: req.body.content,
        tag: req.body.tag,
        datePosted: new Date(),
        upVote: 0,
        downVote: 0
    }
    
    if (!newPost.user.username || !newPost.title || !newPost.content || !newPost.tag) {
        //Error message.
        req.statusCode(400);
    } else {
        //Create post and store it to the database.
        
    }
    */
});

//Update / edit a post
//Find the correct route.
router.put('', function (req, res) {
    const found = true; //Find a post.

    if (found) {
        //Edit a post and update the database.
    } else {
        res.status(400);
    }
});

//Delete a post
//Find the correct route.
router.delete('', function (req, res) {
    const found = true; //Find a post.

    if (found) {
        //Delete a post.
    } else {
        res.status(400);
    }
});

module.exports = router;
