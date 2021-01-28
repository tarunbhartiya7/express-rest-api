const express = require("express");
const { body } = require("express-validator");

const feedController = require("../controllers/feed");

const router = express.Router();

// GET /feed/posts/
router.get("/posts", feedController.getPosts);

// POST /feed/post
router.post(
  "/post",
  [
    body("title")
      .isLength({ min: 3 })
      .withMessage("Please enter valid title")
      .trim()
      .custom((value) => {
        if (value === "test") {
          throw new Error("This value is invalid");
        }
        return true;
      }),
    body("description")
      .isAlphanumeric()
      .withMessage("Please enter only alpha numeric characters"),
  ],
  feedController.createPost
);

// GET /feed/post/:postId
router.get("/post/:postId", feedController.getPost);

// Update /feed/post
router.put(
  "/post/:postId",
  [
    body("title")
      .isLength({ min: 3 })
      .withMessage("Please enter valid title")
      .trim()
      .custom((value) => {
        if (value === "test") {
          throw new Error("This value is invalid");
        }
        return true;
      }),
    body("description")
      .isAlphanumeric()
      .withMessage("Please enter only alpha numeric characters"),
  ],
  feedController.editPost
);

// DELETE /feed/post/:postId
router.delete("/post/:postId", feedController.deletePost);

module.exports = router;
