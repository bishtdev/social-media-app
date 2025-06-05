const express = require("express");
const { getUserProfile, searchUsers, profilePicture } = require("../controllers/userController");
const multer = require("multer");
const protect = require("../middleware/authMiddleware");

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/profilePic',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const router = express.Router();

router.get("/search", searchUsers)
router.get("/:id/profile", getUserProfile)
router.put("/profile-pic",protect, upload.single("profilePicture"), profilePicture)

module.exports = router