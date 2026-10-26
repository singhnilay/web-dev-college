"use strict";

var http = require("http");
var fs = require("fs");
var path = require("path");
var PORT = 3000;
var PUBLIC_DIR = path.join(__dirname, "public");
var DATA_FILE = path.join(__dirname, "data", "users.json");
var POSTS_FILE = path.join(__dirname, "data", "posts.json");

var COMMUNITIES = [
  "Campus Life",
  "Academics",
  "Events",
  "Memes",
  "Opportunities",
  "Questions"
];

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

function readJsonArray(filePath) {
  if (!fs.existsSync(filePath)) return [];
  try {
    var parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function appendJsonRecord(filePath, record) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  var records = readJsonArray(filePath);
  records.push(record);
  fs.writeFileSync(filePath, JSON.stringify(records, null, 2));
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

    appendJsonRecord(DATA_FILE, record);
    send(res, 201, JSON.stringify({ ok: true }), "application/json; charset=utf-8");
  });
}

function savePost(req, res) {
  readBody(req, function (raw) {
    var payload;
    try {
      payload = JSON.parse(raw);
    } catch (err) {
      send(res, 400, "Invalid JSON");
      return;
    }

    var record = {
      id: Date.now().toString(),
      title: String(payload.title || "").trim(),
      community: String(payload.community || "").trim(),
      content: String(payload.content || "").trim(),
      anonymous: Boolean(payload.anonymous),
      createdAt: new Date().toISOString()
    };

    if (!record.title || !record.community || !record.content) {
      send(res, 400, "Title, community, and content are required.");
      return;
    }

    if (COMMUNITIES.indexOf(record.community) === -1) {
      send(res, 400, "Invalid community.");
      return;
    }

    appendJsonRecord(POSTS_FILE, record);
    send(res, 201, JSON.stringify({ ok: true, post: record }), "application/json; charset=utf-8");
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
  if (pathname === "/api/posts") {
    setCors(res);
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }
    if (req.method === "POST") {
      savePost(req, res);
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
