const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
  text: String,
  createdAt: {type: Date, default: Date.now},
  likes: [{type: mongoose.Schema.Types.ObjectId, ref:"User"}]
})

const commentSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  text: String,
  createdAt:{type: Date, default: Date.now},
  likes:[{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  replies:[replySchema]
})

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: String,
  author: {type: mongoose.Schema.Types.ObjectId,ref: 'User',},
  likes: [{type: mongoose.Schema.Types.ObjectId,ref: 'User',}],
  comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
