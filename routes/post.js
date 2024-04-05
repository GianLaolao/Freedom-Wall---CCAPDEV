
const express = require('express');
const router = express.Router();

const User = require('../database/User');
const Post = require('../database/Post');
const Comment = require('../database/Comment');
const Liked = require('../database/Liked');
const Disliked = require('../database/Disliked');

router.get('/create-post', checkAuthenticated,  async function(req, res) {

    const user = req.user;

    res.render('create_post', { user });
});

router.post('/create-post', checkAuthenticated, async function(req, res) {

    const user = req.user;
    const title = req.body.title;
    const post = req.body.content;
    const tag = req.body.tag_type;

    const lastId = await Post.findOne().sort({ _id: -1 });
    const newId = lastId ? Number(lastId.id) + 1 : 2000; 

    await Post.create({_id: newId, userId: user.id, title: title, content: post, tag: tag});

    res.redirect('/forum');
})

router.get('/:id', checkAuthenticated, async function(req, res) {
    const id = req.params.id;
    const user = req.user
    const post = await Post.findById(id);
    const comment = await Comment.find({postId: id});

    const allId = comment.map(c => c.userId);

    const users = await User.find({ $or: [{_id: post.userId}, {_id: {$in: allId}}]});

    const liked = await Liked.find({postId: id});
    const disliked = await Disliked.find({postId: id})

    res.render('post', { post, comment, user, users, liked, disliked });
});

router.get('/:id/edit', checkAuthenticated, async function(req, res) {
    const id = req.params.id;
    const user = req.user
    const post = await Post.findById(id);
    const comment = await Comment.find({postId: id});

    const allId = comment.map(c => c.userId);
    const users = await User.find({ $or: [{_id: post.userId}, {_id: {$in: allId}}]});

    res.render('edit-post', { post, comment, user, users});
});

router.post('/:id/edit', checkAuthenticated, async function(req, res) {
    const id = req.params.id;
    const content = req.body.content;
    
    await Post.updateOne({_id: id}, {content: content});

    res.redirect(`/post/${id}`);
});

router.get('/:id/delete', checkAuthenticated, async function(req, res) {

    const id = req.params.id;   

    await Post.findByIdAndDelete(id);

    res.redirect('/forum');
});

router.get('/:id/add', checkAuthenticated, async function(req, res) {

    const type = req.query.icon;
    const id = req.params.id;
    const user = req.user;
    const loc = req.query.l;

    switch (type) {
        case "up": {
            await Liked.create({postId: id, userId: user._id })
            break;
        }
        case "down": {
            await Disliked.create({postId: id, userId: user._id })
            break;
        }
    }
    if (loc === 'forum') {
        res.redirect('/forum');
    }
    else {
        res.redirect(`/post/${id}`)
    }
});

router.get('/:id/remove', checkAuthenticated, async function(req, res) {

    const type = req.query.icon;
    const id = req.params.id;
    const user = req.user;
    const loc = req.query.l;

    switch (type) {
        case "up": {
            await Liked.findOneAndDelete({postId: id, userId: user._id})
            break;
        }
        case "down": {
            await Disliked.findOneAndDelete({postId: id, userId: user._id })
            break;
        }
    }
    if (loc === 'forum') {
        res.redirect('/forum');
    }
    else {
        res.redirect(`/post/${id}`)
    }
});

router.post('/:id/comment/add', checkAuthenticated, async function(req, res) {

    const id = req.params.id;
    const user = req.user;

    const comment = req.body.content;

    if(comment.length !== 0) {
        const lastId = await Comment.findOne().sort({ _id: -1 });
        const newId = lastId ? Number(lastId.id) + 1 : 3000; 
    
        await Comment.create({_id: newId, postId: id, userId: user.id, content: comment})
    }

    res.redirect(`/post/${id}`);
})

router.get('/:id1/comment/:id2/edit', checkAuthenticated, async function(req, res) {

    const postId = req.params.id1;
    const commId = req.params.id2;
    const user = req.user;  
    const post = await Post.findById(postId);
    const comment = await Comment.find({postId: postId});

    const allId = comment.map(c => c.userId);
    const users = await User.find({ $or: [{_id: post.userId}, {_id: {$in: allId}}]});

    const liked = await Liked.find({postId: postId, userId: user.id});
    const disliked = await Disliked.find({postId: postId, userId: user.id})

    res.render('edit-comment', {  post, comment, user, users, liked, disliked, editCom: commId})
});

router.post('/:id1/comment/:id2/edit', checkAuthenticated, async function(req, res) {

    const postId = req.params.id1;
    const commId = req.params.id2;
    const comment = req.body.comment;

    await Comment.updateOne({_id: commId}, {content: comment});

    res.redirect('/post/' + postId);
});

router.get('/:id1/comment/:id2/delete', checkAuthenticated, async function(req, res) {

    const postId = req.params.id1;
    const commId = req.params.id2;

    await Comment.findByIdAndDelete(commId);

    res.redirect('/post/' + postId);
});

    
function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/');
}

module.exports = router;

