const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    _id: Number,
    username: String,
    profile: {
      type: String,
      default: "pfp.jpg"
    },
    bio: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    birthday: Date,
    dateCreated: {
        type: Date,
        default: () => Date.now(),
    },
})

const User = mongoose.model('User', UserSchema)

module.exports = User