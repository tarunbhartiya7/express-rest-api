const express = require("express");
const { body } = require("express-validator");
const User = require("../models/users");
const authController = require("../controllers/auth");

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
  authController.signUp
);

// POST /auth/login
router.post("/login", authController.login);

module.exports = router;
