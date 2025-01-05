const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    summary : String,
    content : String,
    cover : String,
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    }
},{
    timestamps : true
});

const postModel = mongoose.model('Post', postSchema);
module.exports = postModel;