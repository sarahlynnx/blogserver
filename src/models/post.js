const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    images: [{type: String}],
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    date: {type: Date, default: Date.now},
    likes: {type: Number, default: 0},
    views: {type: Number, default: 0},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
})

module.exports = mongoose.model('Post', postSchema);