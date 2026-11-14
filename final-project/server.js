"use strict";

require("dotenv").config();

var express = require("express");
var cookieParser = require("cookie-parser");
var config = require("./config");
var connectDb = require("./config/db");
var corsMiddleware = require("./middleware/cors");
var errorHandler = require("./middleware/errorHandler");
var healthRoutes = require("./routes/healthRoutes");
var authRoutes = require("./routes/authRoutes");
var signupRoutes = require("./routes/signupRoutes");
var loginRoutes = require("./routes/loginRoutes");
var usersRoutes = require("./routes/usersRoutes");
var postsRoutes = require("./routes/postsRoutes");
var commentsRoutes = require("./routes/commentsRoutes");
var communitiesRoutes = require("./routes/communitiesRoutes");

var app = express();

app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(corsMiddleware);
app.use(errorHandler.jsonParseError);

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/communities", communitiesRoutes);

app.use(express.static(config.PUBLIC_DIR));

app.use(errorHandler.errorHandler);

connectDb()
  .then(function () {
    app.listen(config.PORT, function () {
      console.log("http://localhost:" + config.PORT);
    });
  })
  .catch(function (err) {
    console.error("Could not connect to MongoDB Atlas. Server not started.");
    console.error(err.message || err);
    process.exit(1);
  });
