const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required: [true, 'mail required'],
        unique:true
    },
    password:{
        type:String,
        required: [true, 'password required'],
    },
    occupation:{
        type:String,
        default:null
    },
    bio:{
        type:String,
        default:null
    },
    gender:{
        type: String,
        enum: ['male', 'female'],
        required: [true, 'gender required'],
    },

})

module.exports = mongoose.model("UserModel",UserSchema)