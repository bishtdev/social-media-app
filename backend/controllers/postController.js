const Post = require("../models/Post");
const User = require("../models/User");
const { profilePicture } = require("./userController");

//create post
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }
    const newPost = await Post.create({
      title,
      content,
      image,
      author: req.user._id,
      likes: [],
      comments: [],
    });
    res.status(201).json(newPost);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username profilePicture")
      .populate("comments.user", "username profilePicture") // FIXED
      .sort({ createdAt: 1 });

    res.json(posts);
  } catch (error) {
    res.statu(500).json({ message: error.message });
  }
};

//get a single post
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username profilePicture")
      .populate("comments.user", "username profilePicture")
      .populate("comments.replies.user", "username profilePicture")
      .sort({ createdAt: 1 });

    if (!post) return res.status(404).json({ message: "post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "post not found" });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "not authrized" });
    }

    const { title, content, image } = req.body;
    post.title = title || post.title;
    post.content = content || post.content;
    post.image = image || post.image;
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "post not found" });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "not authrized" });
    }
    await Post.deleteOne({ _id: post._id });
    res.json({ message: "post deleted sucessfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
    }

    // Fetch the updated post and return it
    const updatedPost = await Post.findById(req.params.id)
      .populate("author", "username")
      .populate("comments.user", "username profilePicture")
      .populate("comments.replies.user", "username profilePicture");

    res.status(200).json({ post: updatedPost });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      user: req.user._id,
      text: req.body.text,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    // Re-fetch the post with populated user in comments
    const updatedPost = await Post.findById(req.params.id)
      .populate("author", "username profilePicture") // populate author for post
      .populate({
        path: "comments.user",
        select: "username profilePicture",
      });
    console.log(updatedPost.comments);

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error in commentPost:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.replyToComment = async (req, res) => {
  const { id, commentId } = req.params;
  const { text } = req.body;

  try {
    const post = await Post.findById(id);
    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "comment not found" });

    const reply = {
      user: req.user._id,
      text,
      createdAt: new Date(),
    };

    comment.replies.push(reply);
    await post.save();

    // ❗ Re-fetch the post and properly populate nested fields
    const updatedPost = await Post.findById(id)
      .populate("author", "username")
      .populate("comments.user", "username profilePicture")
      .populate("comments.replies.user", "username profilePicture");

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleLikeComment = async (req, res) => {
  const { id, commentId } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findById(id);
    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }

    const index = comment.likes.indexOf(userId);
    if (index === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(index, 1);
    }

    await post.save();

    const updatedPost = await Post.findById(id)
      .populate("author", "username profilePicture")
      .populate("comments.user", "username profilePicture")
      .populate("comments.replies.user", "username profilePicture");

    res.json(updatedPost); // full updated post with user data
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleBookmark = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.bookmarks.indexOf(postId);
    if (index === -1) {
      user.bookmarks.push(postId);
    } else {
      user.bookmarks.splice(index, 1);
    }
    await user.save();

    // Populate bookmarks if you want, or just return bookmarks array
    const updatedUser = await User.findById(userId).select("bookmarks");
    res.json({ bookmarks: updatedUser.bookmarks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
