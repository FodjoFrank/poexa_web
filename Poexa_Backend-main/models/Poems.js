const mongoose = require('mongoose');

const PoemsSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"usermodels"
    },
    body:{
        type:String,
        required:true
    },
    category:{
        type:String,
        default:"story",
        enum:['romance','fantasy','comedy','story','horror']
    },
    title:{
        type:String,
        required: true,
        
    },
    
    date:{
        type:Date,
        default:Date.now
    },

})

module.exports = mongoose.model("PoemsModel",PoemsSchema)