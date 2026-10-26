"use strict";

var http = require("http");
var fs = require("fs");
var path = require("path");
var PORT = 3000;
var PUBLIC_DIR = path.join(__dirname, "public");
var DATA_FILE = path.join(__dirname, "data", "users.json");

var MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon"
};

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function send(res, status, body, contentType) {
  res.writeHead(status, { "Content-Type": contentType || "text/plain; charset=utf-8" });
  res.end(body);
}

function readBody(req, callback) {
  var chunks = [];
  req.on("data", function (chunk) {
    chunks.push(chunk);
  });
  req.on("end", function () {
    callback(Buffer.concat(chunks).toString("utf8"));
  });
}

function requestPath(req) {
  return new URL(req.url, "http://localhost").pathname;
}

function serveStatic(req, res) {
  var pathname = requestPath(req);
  if (pathname === "/") pathname = "/index.html";
  var filePath = path.normalize(path.join(PUBLIC_DIR, pathname));
  if (filePath.indexOf(PUBLIC_DIR) !== 0) {
    send(res, 403, "Forbidden");
    return;
  }
  fs.readFile(filePath, function (err, data) {
    if (err) {
      send(res, 404, "Not found");
      return;
    }
    var ext = path.extname(filePath);
    send(res, 200, data, MIME[ext] || "application/octet-stream");
  });
}

function saveSignup(req, res) {
  readBody(req, function (raw) {
    var payload;
    try {
      payload = JSON.parse(raw);
    } catch (err) {
      send(res, 400, "Invalid JSON");
      return;
    }

    var record = {
      email: String(payload.email || "").trim(),
      username: String(payload.username || "").trim(),
      password: String(payload.password || "")
    };

    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    var users = [];
    if (fs.existsSync(DATA_FILE)) {
      try {
        users = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
        if (!Array.isArray(users)) users = [];
      } catch (err) {
        users = [];
      }
    }
    users.push(record);
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    send(res, 201, JSON.stringify({ ok: true }), "application/json; charset=utf-8");
  });
}

var server = http.createServer(function (req, res) {
  var pathname = requestPath(req);
  if (pathname === "/api/signup") {
    setCors(res);
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }
    if (req.method === "POST") {
      saveSignup(req, res);
      return;
    }
  }
  if (req.method === "GET" || req.method === "HEAD") {
    serveStatic(req, res);
    return;
  }
  send(res, 405, "Method not allowed");
});

server.listen(PORT, function () {
  console.log("http://localhost:" + PORT);
});
