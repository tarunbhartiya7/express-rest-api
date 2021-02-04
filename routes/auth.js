import express from "express";
import { body } from "express-validator";

import User from "../models/users.js";
import { login, signUp } from "../controllers/auth.js";

const router = express.Router();

// POST /auth/signup
router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            throw new Error("Email address already exists!");
          }
          return true;
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  signUp
);

// POST /auth/login
router.post("/login", login);

export default router;
