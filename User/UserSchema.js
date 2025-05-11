const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
      
    },
    googleId: {type: String},
    phone: {
        type: String,
    },
    profileImg: {type: String},
    address: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },

    role:{
        type: String,
        required: true,
        default: 'user',
        enum: ['admin', 'owner', 'user']
    },
    isEmailVerified:{
        type: Boolean,
        default: false
    },
    refreshToken: String,
}, {timestamps: true});

const UserModel = model('users', userSchema);
module.exports = UserModel;