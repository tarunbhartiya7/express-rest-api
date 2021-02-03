const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  // Assuming Token has bearer syntax -> Bearer <jwt>
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecretkey");
  } catch (err) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  next();
};
