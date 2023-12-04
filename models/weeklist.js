const mongoose = require('mongoose');


const weeklistSchema = new mongoose.Schema({
    weekname:{
        type:String,
        required:true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    locked:{
        type:Boolean,
        default:false,
    },


    tasks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'WeekTask'
    }]
})

module.exports = mongoose.model("WeekList" , weeklistSchema)