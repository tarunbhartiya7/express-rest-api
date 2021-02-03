const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const app = express();
const port = 3000;

app.use(bodyParser.json()); // parse json data

// enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*"); // Explicitly GET, POST, PUT, DELETE, PATCH, OPTIONS
  res.setHeader("Access-Control-Allow-Headers", "*"); // Content-Type, Authorization
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((error, req, res, next) => {
  const { message, data } = error;
  // 500 is server side error
  res.status(error.statusCode || 500).json({
    message,
    data,
  });
});

mongoose
  .connect(
    "mongodb+srv://sam:CLguEEdLPjyNTBZg@cluster0.3iiam.mongodb.net/shop?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
    throw err;
  });
