
const express = require('express');
const router = express.Router();

const path = require('path');

const User = require('../database/User');
const Post = require('../database/Post');
const Comment = require('../database/Comment');
const Liked = require('../database/Liked');
const Disliked = require('../database/Disliked');

router.get('/:id', checkAuthenticated, async function (req, res) {
    const id = req.params.id;
    const user = await User.findById(id);
    const post = await Post.find({userId: id});
    const curUser = req.user;

    res.render('profile', { user, post, curUser });
});

router.get('/:id/edit', checkAuthenticated, function (req, res) {
    const user = req.user;

    res.render('edit_profile', { user });
});

router.post('/:id/edit', checkAuthenticated, async function(req, res) {
       
    const id = req.params.id;
    const user = req.user;
    const username = req.body.username;
    var bio = req.body.bio;
    let image;
    let imageName;

    if (req.files && req.files.profilePicInput) {
        image = req.files.profilePicInput;
        image.mv(path.resolve(__dirname,'public/images', image.name),(error) => {
            if (error)
            {
                console.log ("Error!")
            }
        });
        imageName = image.name;
    } else {
        imageName,e = user.profile;
    }

    bio = bio.trim().length === 0 ? "This is my profile." : bio;

    bio = bio.replace(/(?:\r\n|\r|\n)/g, "<br>");

    await User.findOneAndUpdate({_id: id}, { username: username, bio: bio, profile: imageName});
       
    res.redirect(`/user/`+id);
});

router.post('/:id/delete', checkAuthenticated, async function(req, res) {

    const id = req.params.id;

    await Liked.deleteMany({userId: id});
    await Disliked.deleteMany({userId: id});
    await Comment.deleteMany({userId: id});
    await Post.deleteMany({userId: id});
    await User.findByIdAndDelete(id);

    res.redirect('/');
});

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/');
}

module.exports = router;
