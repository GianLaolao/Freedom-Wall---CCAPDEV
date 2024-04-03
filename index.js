 
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/freedomWallDB');

const express = require('express');
const app = new express();


const fileUpload = require('express-fileupload');
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const initializePassport = require('./passport-config');
initializePassport(passport);

app.use(express.json());
app.use(express.urlencoded( {extended: true})); 
app.use(express.static(__dirname + '/public'));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(fileUpload());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

const User = require('./database/User');
const Post = require('./database/Post');
const Comment = require('./database/Comment');
const Liked = require('./database/Liked');
const Disliked = require('./database/Disliked');

const hbs = require('hbs');
const { cp } = require('fs');
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views/layouts'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// const userRouter = require('/routes/users');
// app.use('/user', userRouter);

// const postRouter = require('/routes/posts');
// app.use('/post', postRouter);

// const commentRouter = require('/routes/comments');
// app.use('/comment', commentRouter);


hbs.registerHelper('toString', function(objectId) {
    return objectId.toString();
});

hbs.registerHelper('formatDate', function(date) {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});

hbs.registerHelper('eq', function (user, curUser) {
    return user === curUser;
});

hbs.registerHelper('displayUser', function(userId, users, type) {

    const user = users.find(u => u._id === userId);
    switch (type) {
        case 1: return user.profile;
        case 2: return user.username;
    } 
})

hbs.registerHelper('color', function (data, post, type) {

    const inData = data.some(d => d.postId == post);

    switch(type) {
        case "up": {
            if (inData) {
                return `<svg class="icon clicked thumb-up" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" width="24" height="24" color="#FFFFFF"><defs><style>.cls-637b715ef95e86b59c579e6f-1{stroke:currentColor;stroke-miterlimit:10;}</style></defs><path class="cls-637b715ef95e86b59c579e6f-1" d="M.5,12H5.28l6.11-7.06A2,2,0,0,0,12,3.51a2,2,0,0,1,2-2,2.74,2.74,0,0,1,2,.8,2.79,2.79,0,0,1,.8,2c0,2-2.87,5.86-2.87,5.86h6A2.61,2.61,0,0,1,22.5,12.7a2.94,2.94,0,0,1-.05.51L20.89,21A1.91,1.91,0,0,1,19,22.52H11.25a9.13,9.13,0,0,1-4-.95h0a9.08,9.08,0,0,0-4.06-1H.5"></path></svg>`
            }
            else {
                return `<svg class="icon notClicked thumb-up" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" width="24" height="24" color="#FFFFFF"><defs><style>.cls-637b715ef95e86b59c579e6f-1{stroke:currentColor;stroke-miterlimit:10;}</style></defs><path class="cls-637b715ef95e86b59c579e6f-1" d="M.5,12H5.28l6.11-7.06A2,2,0,0,0,12,3.51a2,2,0,0,1,2-2,2.74,2.74,0,0,1,2,.8,2.79,2.79,0,0,1,.8,2c0,2-2.87,5.86-2.87,5.86h6A2.61,2.61,0,0,1,22.5,12.7a2.94,2.94,0,0,1-.05.51L20.89,21A1.91,1.91,0,0,1,19,22.52H11.25a9.13,9.13,0,0,1-4-.95h0a9.08,9.08,0,0,0-4.06-1H.5"></path></svg>`
            }
        }
        case "down": {
            if(inData) {
                return `<svg class="icon clicked thumb-down" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" width="24" height="24" color="#FFFFFF"><defs><style>.cls-637b715ef95e86b59c579e6e-1{stroke:currentColor;stroke-miterlimit:10;}</style></defs><path class="cls-637b715ef95e86b59c579e6e-1" d="M.5,12H5.28l6.11,7.06A2,2,0,0,1,12,20.49a2,2,0,0,0,2,2,2.74,2.74,0,0,0,2-.8,2.79,2.79,0,0,0,.8-1.95c0-2-2.87-5.86-2.87-5.86h6A2.61,2.61,0,0,0,22.5,11.3a2.94,2.94,0,0,0-.05-.51L20.89,3A1.91,1.91,0,0,0,19,1.48H11.25a9.13,9.13,0,0,0-4,1h0a9.08,9.08,0,0,1-4.06,1H.5"></path></svg>`
            }
            else {
                return `<svg class="icon notClicked thumb-down" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" width="24" height="24" color="#FFFFFF"><defs><style>.cls-637b715ef95e86b59c579e6e-1{stroke:currentColor;stroke-miterlimit:10;}</style></defs><path class="cls-637b715ef95e86b59c579e6e-1" d="M.5,12H5.28l6.11,7.06A2,2,0,0,1,12,20.49a2,2,0,0,0,2,2,2.74,2.74,0,0,0,2-.8,2.79,2.79,0,0,0,.8-1.95c0-2-2.87-5.86-2.87-5.86h6A2.61,2.61,0,0,0,22.5,11.3a2.94,2.94,0,0,0-.05-.51L20.89,3A1.91,1.91,0,0,0,19,1.48H11.25a9.13,9.13,0,0,0-4,1h0a9.08,9.08,0,0,1-4.06,1H.5"></path></svg>`
            }
        }
    }
});

hbs.registerHelper('forumNum', function(data, id) {

    const num = data.filter(d => d.postId == id).length
    return num;
})

hbs.registerHelper('postNum', function(data) {
    return data.length;
});

hbs.registerHelper('postColor', function(data, user, type) {

    const inData = data.some(d => d.userId == user._id);

    switch(type) {
        case 1: {
            if (inData) {
                return `<svg id="like-icon" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" width="24" height="24" color="#00703C"><defs><style>.cls-637b715ef95e86b59c579e6f-1{fill:#00703C;stroke:currentColor;stroke-miterlimit:10;}</style></defs><path class="cls-637b715ef95e86b59c579e6f-1" d="M.5,12H5.28l6.11-7.06A2,2,0,0,0,12,3.51a2,2,0,0,1,2-2,2.74,2.74,0,0,1,2,.8,2.79,2.79,0,0,1,.8,2c0,2-2.87,5.86-2.87,5.86h6A2.61,2.61,0,0,1,22.5,12.7a2.94,2.94,0,0,1-.05.51L20.89,21A1.91,1.91,0,0,1,19,22.52H11.25a9.13,9.13,0,0,1-4-.95h0a9.08,9.08,0,0,0-4.06-1H.5"></path></svg>`
            }
            else {
                return `<svg id="like-icon" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" width="24" height="24" color="#00703C"><defs><style>.cls-637b715ef95e86b59c579e6f-1{fill:#FFFFFF;stroke:currentColor;stroke-miterlimit:10;}</style></defs><path class="cls-637b715ef95e86b59c579e6f-1" d="M.5,12H5.28l6.11-7.06A2,2,0,0,0,12,3.51a2,2,0,0,1,2-2,2.74,2.74,0,0,1,2,.8,2.79,2.79,0,0,1,.8,2c0,2-2.87,5.86-2.87,5.86h6A2.61,2.61,0,0,1,22.5,12.7a2.94,2.94,0,0,1-.05.51L20.89,21A1.91,1.91,0,0,1,19,22.52H11.25a9.13,9.13,0,0,1-4-.95h0a9.08,9.08,0,0,0-4.06-1H.5"></path></svg>`
            }
        }
        case 2: {
            if (inData) {
                return `<svg id="dislike-icon" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" width="24" height="24" color="#00703C"><defs><style>.cls-637b715ef95e86b59c579e6e-1{fill:#00703C;stroke:currentColor;stroke-miterlimit:10;}</style></defs><path class="cls-637b715ef95e86b59c579e6e-1" d="M.5,12H5.28l6.11,7.06A2,2,0,0,1,12,20.49a2,2,0,0,0,2,2,2.74,2.74,0,0,0,2-.8,2.79,2.79,0,0,0,.8-1.95c0-2-2.87-5.86-2.87-5.86h6A2.61,2.61,0,0,0,22.5,11.3a2.94,2.94,0,0,0-.05-.51L20.89,3A1.91,1.91,0,0,0,19,1.48H11.25a9.13,9.13,0,0,0-4,1h0a9.08,9.08,0,0,1-4.06,1H.5"></path></svg>`
            }
            else {
                return `<svg id="dislike-icon" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" width="24" height="24" color="#00703C"><defs><style>.cls-637b715ef95e86b59c579e6e-1{fill:#FFFFFF;stroke:currentColor;stroke-miterlimit:10;}</style></defs><path class="cls-637b715ef95e86b59c579e6e-1" d="M.5,12H5.28l6.11,7.06A2,2,0,0,1,12,20.49a2,2,0,0,0,2,2,2.74,2.74,0,0,0,2-.8,2.79,2.79,0,0,0,.8-1.95c0-2-2.87-5.86-2.87-5.86h6A2.61,2.61,0,0,0,22.5,11.3a2.94,2.94,0,0,0-.05-.51L20.89,3A1.91,1.91,0,0,0,19,1.48H11.25a9.13,9.13,0,0,0-4,1h0a9.08,9.08,0,0,1-4.06,1H.5"></path></svg>`
            }
        }   
    }
})

app.get('/', checkNotAuthenticated, function(req, res) {
    res.render('login', { messages: req.flash('error') });
})

app.get('/signup', checkNotAuthenticated, function(req, res) {
    res.render('signup');
});

app.post('/signup', checkNotAuthenticated, async function(req, res) {
    try {
        const lastId = await User.findOne().sort({ _id: -1 });
        const id = lastId ? Number(lastId.id) + 1 : 1000; 
        const hashPass = await bcrypt.hash(req.body.password, 10);
    
        await User.create({
            _id: id,
            username: req.body.username,
            bio: "This is my profile.",
            email: req.body.email,
            password: hashPass,
            birthday: req.body.birthday,
        })
        res.redirect('/');
    } catch(e) {
        console.log(e)
        res.redirect('/signup')
    }
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/forum',
    failureRedirect: '/',
    failureFlash: true
}));

app.get('/about', function(req, res) {

    res.render('about');
});

app.get('/forum', checkAuthenticated, async function(req,res) {

    const user = req.user;

    const filter = req.query.filter;
    var post = await Post.find({}).sort({ datePosted: -1});

    if(filter === "new") {
        post = await Post.find({}).sort({ datePosted: -1});
    }
    else if(filter === "old") {
        post = await Post.find({}).sort({ datePosted: 1});
    }
    else if(filter === "top") {
        post = await Post.find({}).sort({ upVote: -1});
    }

    var allId = post.map(post => post.userId);
    var users = await User.find({ _id: {$in: allId}});
    
    const liked = await Liked.find({userId: user._id});
    const disliked = await Disliked.find({userId: user._id});

    res.render('forum', { post, user, users, liked, disliked})
});

app.get('/post/:id/add', checkAuthenticated, async function(req, res) {

    const type = req.params.icon;
    const id = req.param.id;
    const user = req.user;

    console.log(type);

    switch (type) {
        case "up": {
            await Liked.create({postId: id, userId: user._id })
        }
        case "down": {
            await Disliked.create({postId: id, userId: user._id })
        }
    }
    res.redirect('/forum');
});

app.get('/post/:id/remove', checkAuthenticated, async function(req, res) {

    const type = req.params.icon;
    const id = req.param.id;
    const user = req.user;

    switch (type) {
        case "up": {
            await Liked.findOneAndDelete({postId: id, userId: user._id})
        }
        case "down": {
            await Disliked.findOneAndDelete({postId: id, userId: user._id })
        }
    }
    res.redirect('/forum');
});


app.delete('/logout', checkAuthenticated, function(req, res) {
    req.logOut((err) => {
        if (err) {
          return next(err);
        };
    });
    res.redirect('/');
})

    // const email = req.body.email;
    // const password = req.body.password;

    // const user = await User.find({email: email, password: password })
    //     if (user.length > 0) {
    //         currentUser = user[0];
    //         res.redirect('/forum');
    //         console.log("User confirmed");
    //     }
    //     else {
    //         res.status(401).send("<h1>Invalid Email or Password.</h1>");
    //     }

//         currentUser = await User.findById(1001);

//         res.redirect('/forum');
// }); 

app.get('/forum/search', checkAuthenticated, async function(req, res) {

    const user = req.user;

    var query = req.query.query.toString();
    var post = await Post.find({}).sort({ datePosted: -1 });

    if (query.length > 0) {
        post = await Post.find({
            $or: [
                { "user.username": { $regex: query, $options: 'i' } },
                { "title": { $regex: query, $options: 'i' } },
                { "content": { $regex: query, $options: 'i' } }
            ]
        }).sort({dateCreated: -1});
    }
    else {
        res.redirect('/forum');
    }

    const allId = post.map(p => p.user.userId);
    const users = await User.find({_id: {$in: allId}});

    const liked = await Liked.find({userId: user.id});
    const disliked = await Disliked.find({userId: user.id});

    res.render('forum', { post, user, users, liked, disliked });
});

app.post('/settings/submit', checkAuthenticated, async function(req, res) {

    res.redirect('/forum');

});

app.get('/post/:id', checkAuthenticated, async function(req, res) {
    const id = req.params.id;
    const user = req.user
    const post = await Post.findById(id);
    const comment = await Comment.find({postId: id });

    const allId = comment.map(c => c.user.userId);

    const users = await User.find({ $or: [{_id: post.userId}, {_id: {$in: allId}}]});

    const liked = await Liked.find({postId: id});
    const disliked = await Disliked.find({postId: id})

    res.render('post', { post, comment, user, users, liked, disliked });
});

app.get('/post/:id/edit', checkAuthenticated, async function(req, res) {
    const id = req.params.id;
    const user = req.user
    const post = await Post.findById(id);
    const comment = await Comment.find({postId: id});

    const allId = comment.map(c => c.user.userId);
    const users = await User.find({ $or: [{_id: post.userId}, {_id: {$in: allId}}]});

    res.render('edit-post', { post, comment, user, users});
});

app.post('/post/:id/edit', checkAuthenticated, async function(req, res) {
    const id = req.params.id;
    const user = req.user
    const post = await Post.findById(id);
    const content = req.body.content;
    
    await Post.updateOne({_id: id}, {content: content});

    
    res.redirect(`/post/${id}`);
});

app.get('/post/:id/delete', checkAuthenticated, async function(req, res) {

    const id = req.params.id;   

    await Post.findByIdAndDelete(id);

    res.redirect('/forum');
});

app.post('/post/:id/comment', checkAuthenticated, async function(req, res) {

    const id = req.params.id;
    const user = req.user;

    const comment = req.body.content;

    const lastId = await Comment.findOne().sort({ _id: -1 });
    const newId = lastId ? Number(lastId.id) + 1 : 3000; 


    await Comment.create({_id: newId, postId: id, user: { userId: user.id, username: user.username}, content: comment})

    res.redirect(`/post/${id}`);
})

app.get('/post/:id1/comment/:id2/edit', checkAuthenticated, async function(req, res) {

    const postId = req.params.id1;
    const commId = req.params.id2;
    const user = req.user;  
    const post = await Post.findById(postId);
    const comment = await Comment.find({postId: postId});

    const allId = comment.map(c => c.user.userId);
    const users = await User.find({ $or: [{_id: post.userId}, {_id: {$in: allId}}]});

    const liked = await Liked.find({postId: postId, userId: user.id});
    const disliked = await Disliked.find({postId: postId, userId: user.id})

    res.render('edit-comment', {  post, comment, user, users, liked, disliked, editCom: commId})
});

app.post('/post/:id1/comment/:id2/edit', checkAuthenticated, async function(req, res) {

    const postId = req.params.id1;
    const commId = req.params.id2;
    const comment = req.body.comment;

    await Comment.updateOne({_id: commId}, {content: comment});

    res.redirect('/post/' + postId);
});

app.get('/post/:id1/comment/:id2/delete', checkAuthenticated, async function(req, res) {

    const postId = req.params.id1;
    const commId = req.params.id2;

    await Comment.findByIdAndDelete(commId);

    res.redirect('/post/' + postId);
});

app.get('/user/:id', checkAuthenticated, async function(req, res) {
    const id = req.params.id;
    const user = await User.findById(id);
    const post = await Post.find({'user.userId': id});
    const curUser = req.user;

    res.render('profile', { user, post, curUser });
});

app.get('/user/:id/edit', checkAuthenticated, async function(req, res) {

    const user = req.user;

    res.render('edit_profile', { user });
});

app.post('/user/:id/edit', checkAuthenticated, async function(req, res) {
       
    const id = req.params.id;
    const user = req.user;
    const username = req.body.username;
    var bio = req.body.bio;
    const image = req.files.profilePicInput;

    bio = bio.trim().length === 0 ? "This is my profile." : bio;

    image.mv(path.resolve(__dirname,'public/images', image.name),(error) => {
        if (error)
        {
            console.log ("Error!")
        }
    });

    await User.findOneAndUpdate({_id: id}, { username: username, bio: bio, profile: image.name});
       
    res.redirect(`/user/`+id);
});

app.post('/user/:id/delete', checkAuthenticated, async function(req, res) {

    const id = req.params.id;

    await Liked.deleteMany({user: id});
    await Disliked.deleteMany({user: id});
    await Comment.deleteMany({'user.userId': id});
    await Post.deleteMany({'user.userId': id});
    await User.findByIdAndDelete(id);

    res.redirect('/');
});


app.get('/create-post', checkAuthenticated,  async function(req, res) {

    const user = req.user;

    res.render('create_post', { user });
});

app.post('/create-post', checkAuthenticated, async function(req, res) {

    console.log(req.body.title);
    console.log(req.body.content);
    console.log(req.body.tag_type);

    const user = req.user;
    const title = req.body.title;
    const post = req.body.content;
    const tag = req.body.tag_type;

    const lastId = await Post.findOne().sort({ _id: -1 });
    const newId = lastId ? Number(lastId.id) + 1 : 2000; 

    await Post.create({_id: newId, user: { userId: user.id, username: user.username}, title: title, 
                        content: post, tag: tag});

    res.redirect('/forum');
})

app.get('/settings', checkAuthenticated, async function(req, res) {

    const user = req.user;
    const error = req.query.error
    
    res.render('settings', { user, error });
});


app.post('/settings', checkAuthenticated, async function(req, res) {

    const user = req.user;
    const oldPass = req.body.oldPassword;
    const newPass = req.body.newPassword;

    if(await bcrypt.compare(oldPass, user.password)) {
        const hashPass = await bcrypt.hash(newPass, 10);
        await User.updateOne({_id: user.id},
            { password: hashPass })
        res.redirect('/logout?_method=DELETE');
    } 
    else {
        res.redirect('/settings?error=Incorrect Password')
    }
});

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/');
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/forum');
    }
    next()
}

const server = app.listen(3000, function() {
    console.log("Running at Node 3000");
});




//TODO About Page