const User = require("../models/User");
const Post = require("../models/Post");
const multer = require('multer');
const fs = require('fs');
const path = require('path');


exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch user from the correct model
    const user = await User.findById(userId).select("-password")
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch all posts authored by the user
    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 }).populate("author", "username profilePicture").populate("comments.user", "username");

    res.status(200).json({ user, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchUsers = async (req, res) =>{
  try {
    const query = req.query.username;
    if(!query) return res.status(400).json({message: "please provide a username to search"})

    const users = await User.find({
      username: { $regex: query, $options: "i" },
    }).select("username _id profilePicture")
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

//middleware for user bookmarks
exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const bookmarks = await Post.find({
      _id: { $in: user.bookmarks },
    }).populate("author", "username profilePicture _id"); // <-- populate author

    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.profilePicture = async (req, res) => {
  try {
    console.log("req.user:", req.user); // Check if req.user is defined
    console.log("req.file:", req.file); // Check if file is uploaded

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user._id;

    // Fetch the user to get the current profile picture
    const user = await User.findById(userId);

    if (user.profilePicture) {
      // Construct the full path of the old profile picture
      const oldProfilePicturePath = path.join(
        __dirname,
        '..',
        user.profilePicture
      );

      console.log("Old profile picture path:", oldProfilePicturePath);

      // Check if the file exists and delete it
      if (fs.existsSync(oldProfilePicturePath)) {
        try {
          fs.unlinkSync(oldProfilePicturePath);
          console.log("Old profile picture deleted:", oldProfilePicturePath);
        } catch (err) {
          console.error("Error deleting old profile picture:", err);
        }
      } else {
        console.log("File does not exist:", oldProfilePicturePath);
      }
    }

    // Save the new profile picture
    const userProfilePicture = `/uploads/profilePic/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: userProfilePicture },
      { new: true }
    );

    res.json(updatedUser);
    console.log("Updated user:", updatedUser);
  } catch (error) {
    console.error("Error in profilePicture:", error);
    res.status(500).json({ message: "Error uploading the profile picture" });
  }
};