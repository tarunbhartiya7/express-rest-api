import express from "express";
import { body } from "express-validator";

import {
  getPost,
  getPosts,
  deletePost,
  editPost,
  createPost,
} from "../controllers/feed.js";
import isAuth from "../middleware/is-auth.js";

const router = express.Router();

// GET /feed/posts/
router.get("/posts", isAuth, getPosts);

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
  createPost
);

// GET /feed/post/:postId
router.get("/post/:postId", isAuth, getPost);

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
  editPost
);

// DELETE /feed/post/:postId
router.delete("/post/:postId", isAuth, deletePost);

// module.exports = router; // this is default import

export default router;
