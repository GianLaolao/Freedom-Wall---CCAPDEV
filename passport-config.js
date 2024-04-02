
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy

const User = require('./database/User');

function initialize(passport) {
    
    const authenticateUser = async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: "Invalid User" });
            }
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Incorrect Password" });
            }
        } catch (error) {
            return done(error);
        }
    };
    
    passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser));
    passport.serializeUser(function(user, done) {
        done(null, user._id);
      });
    
    passport.deserializeUser(async (id, done) => {
        return done(null, await User.findById(id));
    }); 
}

module.exports = initialize;