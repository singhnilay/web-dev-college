"use strict";

var express = require("express");
var config = require("./config");
var corsMiddleware = require("./middleware/cors");
var errorHandler = require("./middleware/errorHandler");
var userModel = require("./models/userModel");
var healthRoutes = require("./routes/healthRoutes");
var signupRoutes = require("./routes/signupRoutes");
var loginRoutes = require("./routes/loginRoutes");
var postRoutes = require("./routes/postRoutes");

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
app.use(errorHandler.jsonParseError);

app.use("/api/health", healthRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/posts", postRoutes);

app.use(express.static(config.PUBLIC_DIR));

app.use(errorHandler.errorHandler);

userModel.hashLegacyPasswords().then(function (upgraded) {
  if (upgraded) {
    console.log("Existing account passwords hashed.");
  }
  app.listen(config.PORT, function () {
    console.log("http://localhost:" + config.PORT);
  });
}).catch(function (err) {
  console.error("Could not prepare user data.");
  console.error(err);
  process.exit(1);
});
