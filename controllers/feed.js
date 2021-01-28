const { validationResult } = require("express-validator");
const Post = require("../models/post");

const getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json({ posts });
    })
    .catch((err) => {
      next(err); // pass this error to error handling middleware
    });
};

const getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ post });
    })
    .catch((err) => {
      next(err); // pass this error to error handling middleware
    });
};

const createPost = (req, res, next) => {
  const { title, description } = req.body;
  const post = new Post({
    title,
    description,
    creator: {
      name: "Sam",
    },
  });

  // validate the incoming request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error; // since this is not inside any promise throw will work
  }

  // if request is validated then save in db and send the response
  post
    .save()
    .then((post) => {
      res.status(201).json({
        message: "Post created successfully",
        post,
      });
    })
    .catch((err) => {
      next(err); // pass this error to error handling middleware
    });
};

const editPost = (req, res, next) => {
  const { title, description } = req.body;
  const postId = req.params.postId;

  // validate the incoming request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error; // since this is not inside any promise throw will work
  }

  // if request is validated then save in db and send the response
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }
      post.title = title;
      post.description = description;
      return post.save();
    })
    .then((post) => {
      res.status(200).json({ post });
    })
    .catch((err) => {
      next(err); // pass this error to error handling middleware
    });
};

const deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }
      return Post.findByIdAndRemove(post);
    })
    .then(() => {
      res.status(200).json({
        message: "Post deleted successfully",
        post: {
          postId,
        },
      });
    })
    .catch((err) => {
      next(err); // pass this error to error handling middleware
    });
};

module.exports = {
  getPosts,
  createPost,
  getPost,
  deletePost,
  editPost,
};
