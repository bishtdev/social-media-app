const express = require("express");
const {createPost, getPosts, getPostById, updatePost, deletePost, likePost, commentPost, getUserProfile, replyToComment, toggleLikeComment, toggleBookmark} = require("../controllers/postController")
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.route("/")
    .get(getPosts)
    
router.post("/", protect, upload.single("image"), createPost)
router.post("/:id/like",protect, likePost)
router.post("/:id/comment", protect, commentPost)
router.post("/:id/comment/:commentId/reply", protect, replyToComment)
router.post("/:id/comment/:commentId/like", protect, toggleLikeComment)
router.post("/:id/bookmarks", protect, toggleBookmark)


router.route("/:id")
    .get(getPostById)
    .put(protect, updatePost)
    .delete(protect, deletePost)



module.exports = router;