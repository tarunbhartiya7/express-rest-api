const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/users");

const signUp = (req, res, next) => {
  // validate the incoming request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    error.data = errors.array();
    throw error; // since this is not inside any promise throw will work
  }
  const { email, name, password } = req.body;
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email,
        name,
        password: hashedPassword,
      });
      return user.save();
    })
    .then((result) =>
      res.status(201).json({ message: "User created!", userId: result._id })
    )
    .catch((err) => next(err));
};

module.exports = {
  signUp,
};
