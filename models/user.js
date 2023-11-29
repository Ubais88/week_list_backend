const mongoose = require('mongoose');

// user schema
const userSchema = new mongoose.Schema({
    name:{
        type:'String',
        required: true,
    },
    email:{
        type:'String',
        required: true,
    },
    password:{
        type:'String',
        required: true,
    },
    age:{
        type:'Number',
        required: true,
    },
    gender:{
        type:'String',
        required: true,
    },
    mobile:{
        type:'Number',
        required: true,
        maxLength:10
    },
})

module.exports = mongoose.model("User" , userSchema)