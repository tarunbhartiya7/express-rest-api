const { validationResult } = require("express-validator");
const Post = require("../models/post");
const ITEMS_PER_PAGE = 2;

const getPosts = async (req, res, next) => {
  try {
    const currentPage = parseInt(req.query.page) || 1;
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((currentPage - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    res.status(200).json({
      posts,
      totalItems,
      hasNextPage: ITEMS_PER_PAGE * currentPage < totalItems,
      hasPreviousPage: currentPage > 1,
      nextPage: currentPage + 1,
      previousPage: currentPage - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
    });
  } catch (error) {
    next(error); // pass this error to error handling middleware
  }
};

const getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ post });
  } catch (error) {
    next(error); // pass this error to error handling middleware
  }
};

const createPost = async (req, res, next) => {
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
  try {
    const result = await post.save();
    res.status(201).json({
      message: "Post created successfully",
      result,
    });
  } catch (error) {
    next(error); // pass this error to error handling middleware
  }
};

const editPost = async (req, res, next) => {
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
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }
    post.title = title;
    post.description = description;
    await post.save();
    res.status(200).json({ post });
  } catch (error) {
    next(error); // pass this error to error handling middleware
  }
};

const deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }
    await Post.findByIdAndRemove(post);
    res.status(200).json({
      message: "Post deleted successfully",
      post: {
        postId,
      },
    });
  } catch (error) {
    next(error); // pass this error to error handling middleware
  }
};

module.exports = {
  getPosts,
  createPost,
  getPost,
  deletePost,
  editPost,
};
