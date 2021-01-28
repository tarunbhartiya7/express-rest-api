const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const feedRoutes = require("./routes/feed");
const app = express();
const port = 3000;

app.use(bodyParser.json()); // parse json data

// enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/feed", feedRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use((error, req, res, next) => {
  const { statusCode, message } = error;
  if (!statusCode) {
    statusCode = 500; // 500 is server side error
  }
  res.status(statusCode).json({
    message,
  });
});

mongoose
  .connect(
    "mongodb+srv://sam:CLguEEdLPjyNTBZg@cluster0.3iiam.mongodb.net/shop?retryWrites=true&w=majority"
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
