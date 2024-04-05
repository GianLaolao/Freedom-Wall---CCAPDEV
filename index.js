 
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const { sessionKey, envPort, dbURL  } = require('./config');

const express = require('express');
const app = new express();

const mongoose = require('mongoose');
mongoose.connect(dbURL);

const PORT = envPort;

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
    secret: sessionKey,
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

const userRouter = require('./routes/user');
app.use('/user', userRouter);

const postRouter = require('./routes/post');
app.use('/post', postRouter);


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

hbs.registerHelper('color', function (data, user, post, type) {

    const inData = data.some(d => (d.postId == post && d.userId == user._id));

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
    
    const liked = await Liked.find();
    const disliked = await Disliked.find();

    res.render('forum', { post, user, users, liked, disliked})
});

app.delete('/logout', checkAuthenticated, function(req, res) {
    req.logOut((err) => {
        if (err) {
          return next(err);
        };
    });
    res.redirect('/');
})

app.get('/forum/search', checkAuthenticated, async function(req, res) {

    const user = req.user;

    var query = req.query.query.toString();
    var post = await Post.find({}).sort({ datePosted: -1 });

    if (query.length > 0) {
        post = await Post.find({
            $or: [
                { "user.username": { $regex: query, $options: 'i' } },
                { "title": { $regex: query, $options: 'i' } },
                { "content": { $regex: query, $options: 'i' } },
                { "tag": { $regex: query, $options: 'i' } }
            ]
        }).sort({dateCreated: -1});
    }
    else {
        res.redirect('/forum');
    }

    const allId = post.map(p => p.userId);
    const users = await User.find({_id: {$in: allId}});

    const liked = await Liked.find({userId: user.id});
    const disliked = await Disliked.find({userId: user.id});

    res.render('forum', { post, user, users, liked, disliked });
});

app.post('/settings/submit', checkAuthenticated, async function(req, res) {

    res.redirect('/forum');

});

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
        req.logOut((err) => {
            if (err) {
              return next(err);
            };
        });
        res.redirect('/');
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

const server = app.listen(PORT, function() {
    console.log("Running at Node 3000");
});

