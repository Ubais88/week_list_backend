const mongoose = require("mongoose")

const weekTaskSchema = new mongoose.Schema({
    week:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'WeekList',
        // required: true
    },
    desc:{
        type:String,
        required:true,
    },
    active:{
        type:Boolean,
        default:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
        default:Date.now,
    },
})

module.exports = mongoose.model("WeekTask" , weekTaskSchema)