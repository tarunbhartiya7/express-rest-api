const express = require("express");
const { body } = require("express-validator");

const feedController = require("../controllers/feed");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// GET /feed/posts/
router.get("/posts", isAuth, feedController.getPosts);

// POST /feed/post
router.post(
  "/post",
  isAuth,
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
      .matches(/^[a-z0-9 ]+$/i)
      .withMessage("Please enter only alpha numeric characters"),
  ],
  feedController.createPost
);

// GET /feed/post/:postId
router.get("/post/:postId", isAuth, feedController.getPost);

// Update /feed/post
router.put(
  "/post/:postId",
  isAuth,
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
router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
