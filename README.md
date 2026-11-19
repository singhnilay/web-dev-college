# 🏫 UniHub

### Your campus. Your people. Your conversations.

**UniHub** is a digital hangout for college life — a place to ask the questions you’re too shy to ask in the class group, find out what’s happening around campus, share opportunities, drop a meme, or start a proper discussion.

Think of it as your college’s **digital common room**: part community board, part student feed, and very much *not another chaotic WhatsApp group*.

> 💬 **One digital space where the entire campus can talk.**

---

## ✨ What's inside?

| 🧩 Space | 💡 What's the vibe? |
|---|---|
| 🏡 **Campus Life** | Everything happening around campus, big or small. |
| 📚 **Academics** | Notes, doubts, resources, and the occasional academic SOS. |
| 🎉 **Events** | Find events, announcements, and things worth leaving your room for. |
| 😂 **Memes** | Because college life is a little unserious sometimes. |
| 🚀 **Opportunities** | Internships, research, competitions, and other cool finds. |
| 🙋 **Questions** | Ask away. Someone probably has the answer. |

### 🛠️ What you can explore

- 📰 **Campus feed** — browse posts from different communities.
- 🔥 **Feed sorting** — switch between Trending, New, and Top.
- 🔎 **Search** — find posts by matching their content.
- ⬆️ **Upvotes** — give a post a little boost.
- ✍️ **Create a post** — choose a community and share what's on your mind.
- 👤 **Profiles** — dedicated spaces for student profiles.
- 🌗 **Dark mode** — for the late-night scrollers.
- 📱 **Responsive layout** — works across desktop and mobile screens.

> **Implementation note:** The front-end is HTML, CSS, and vanilla JavaScript. Express serves those files and JSON APIs. Users, posts, comments, communities, memberships, and upvotes persist only in MongoDB Atlas. Cookie sessions (and optional Bearer tokens) protect mutating routes.

*See [What's working right now?](#-whats-working-right-now) for the current status.*

---

## 🎨 The look & feel

We went for **modern campus editorial** — imagine a student magazine met a community noticeboard and they decided to build an app together.

- 🥛 Warm cream backgrounds instead of sterile white.
- 🍷 Deep burgundy accents for a little character.
- 📰 DM Serif Display headings paired with clean DM Sans interface text.
- 🧼 Spacious layouts that keep conversations easy to read.

The idea: a product that feels welcoming, thoughtful, and just playful enough.

---

## 🧰 Built with

| Tech | Job |
|---|---|
| **HTML5** | Page structure |
| **CSS3** | Styling and responsive layouts |
| **Vanilla JavaScript** | Front-end interactions |
| **Node.js** and **Express** | HTTP server and REST APIs |
| **MongoDB Atlas** and **Mongoose** | Only persistent database |
| **dotenv** | Loads `MONGODB_URI` from `.env` |
| **Google Fonts** | DM Serif Display and DM Sans |

No React, no framework avalanche. Just the fundamentals doing their thing. 🤝

---

## 🚀 Get it running

Ready to take a look? Let's go.

### 1. Clone the repo

```bash
git clone https://github.com/singhnilay/web-dev-college.git
cd web-dev-college/final-project
```

### 2. Install dependencies and start the server

You’ll need **Node.js** installed. From the `final-project` directory, copy the env example, paste your Atlas connection string, then install and start:

```bash
cp .env.example .env
```

Set `MONGODB_URI` in `.env` to your MongoDB Atlas SRV URI. Do not commit `.env`.

```bash
npm install
npm start
```

For auto-reload during development:

```bash
npm run dev
```

The server starts at:

👉 **http://localhost:3001**

Check [http://localhost:3001/api/health](http://localhost:3000/api/health) to confirm the server is running and Atlas is connected. The process exits on startup if `MONGODB_URI` is missing or the connection fails.

### 3. Open the app

Visit [http://localhost:3001](http://localhost:3000) in your browser. The server serves the files inside `public/` and handles the project's current API endpoints.

### 4. Want to serve only the static pages?

You can also open `public/index.html` directly, or use a simple local server:

```bash
cd public
python3 -m http.server 8000
```

Then head to [http://localhost:8000](http://localhost:8000).

> ⚠️ The create-post, signup, and login flows send requests to the Express API on `http://localhost:3001`, so run the Node server for those flows. Opening the pages with a static server alone won't provide the API.

---

## 🗂️ Project map

Here's where the magic lives:

```text
final-project/
├── server.js
├── package.json
├── .env.example
├── PRD.md
├── README.md
├── config/
│   ├── index.js
│   └── db.js
├── controllers/
│   ├── healthController.js
│   ├── signupController.js
│   ├── loginController.js
│   ├── usersController.js
│   ├── postsController.js
│   ├── commentsController.js
│   └── communitiesController.js
├── middleware/
│   ├── cors.js
│   ├── errorHandler.js
│   ├── httpError.js
│   └── refs.js
├── models/
│   ├── userModel.js
│   ├── postModel.js
│   ├── commentModel.js
│   └── communityModel.js
├── routes/
│   ├── healthRoutes.js
│   ├── signupRoutes.js
│   ├── loginRoutes.js
│   ├── usersRoutes.js
│   ├── postsRoutes.js
│   ├── commentsRoutes.js
│   └── communitiesRoutes.js
├── data/
│   ├── users.json
│   └── posts.json
├── public/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── pages/
│       ├── login.html
│       ├── signup.html
│       ├── feed.html
│       ├── community.html
│       ├── create-post.html
│       ├── post.html
│       └── profile.html
└── reference/
    ├── campus_feed/
    ├── event_directory/
    ├── login_page/
    └── signup_page/
```

---

## 🧪 What's working right now?

A README should set expectations, not sell imaginary features. Here's the current state of the project:

| Feature | Current status |
|---|---|
| Landing page and navigation | ✅ Implemented |
| Signup / login / logout | ✅ MongoDB users + httpOnly JWT cookie (Bearer token also accepted) |
| Home feed from Atlas | ✅ `GET /api/posts` with newest / popularity / trending sort |
| Filter by community | ✅ `?community=` or `GET /api/communities/:id/posts` |
| Create / edit / delete own posts | ✅ Auth + ownership. Join the community before posting. |
| Anonymous posts | ✅ Public author is **Anonymous Student**; Atlas still stores `author` |
| Comments | ✅ Nested under posts; edit/delete own comments only |
| Upvotes | ✅ One per user, stored on the post, toggle to remove |
| Communities | ✅ Seeded rooms, join/leave, membership counts |
| Production moderation | 🚧 Not this milestone |

**A quick heads-up:** `data/users.json` and `data/posts.json` are leftover backups from an earlier milestone. The app does not read or write them.

---

## API architecture

Atlas is the only persistent store. `config/index.js` loads `.env`. `server.js` connects with `connectDb()` (`mongoose.connect`), seeds the six campus rooms if they are missing, then listens. A missing `MONGODB_URI` or a failed Atlas connection exits with code 1.

Layers:

| Layer | Role |
|---|---|
| `routes/` | REST paths and middleware order |
| `middleware/auth.js` | Cookie or `Authorization: Bearer` JWT; post/comment ownership |
| `controllers/` | Validation, queries, response shaping |
| `models/` | Mongoose schemas and indexes |
| `utils/sanitize.js` | Public JSON (hides passwords, upvote id lists, anonymous authors) |

Public reads use `optionalAuth` so logged-in viewers get `upvoted`, `joined`, and `isOwner`. Creates, edits, deletes, votes, and membership changes use `requireAuth`. Edit/delete of posts and comments also use `requirePostOwner` / `requireCommentOwner` (**403** if another user's document).

Author on create is always `req.user.id` from the token. Clients cannot spoof another author.

### REST map

| Method | Path | Auth |
|---|---|---|
| GET | `/api/posts` | optional; `?community=` `?author=` `?sort=new\|popular\|top\|trending` |
| GET | `/api/posts/:id` | optional |
| POST | `/api/posts` | required; must be a member of the community |
| PUT / DELETE | `/api/posts/:id` | owner |
| GET / POST | `/api/posts/:id/comments` | GET optional; POST required |
| PUT / DELETE | `/api/comments/:id` | owner |
| POST / DELETE | `/api/posts/:id/upvote` | required; `$addToSet` / `$pull` |
| GET | `/api/communities` | optional |
| GET | `/api/communities/:id` | optional |
| GET | `/api/communities/:id/posts` | optional; same sort query as feed |
| POST / DELETE | `/api/communities/:id/join` | required; duplicate join is **409** |

### Collection relationships

```text
User  <────── author ──────  Post  ── community ──>  Community
  ^                          |  ^                       |
  |                          |  |                       |
  +── members[] ─────────────┘  +── post ── Comment     +── members[] (User)
  +── upvotes[] on Post
  +── author on Comment
```

- **User** → many **Post** and **Comment** (`author`).
- **Community** → many **Post** (`community`); `members[]` is a unique list of User ids. `memberCount` is `members.length`.
- **Post** → one User, one Community; `upvotes[]` is User ids (one vote per user).
- **Comment** → one Post and one User.
- Anonymous posts still store `author` in Atlas. Public JSON uses `{ "username": "Anonymous Student" }` with no author id. Other people's anonymous posts are omitted from `GET /api/posts?author=`.

Invalid ObjectIds return **400**. Missing documents return **404**. Duplicate unique fields return **409**.

### Postman

Base URL: `http://localhost:3000`

1. **Register** `POST /api/auth/register` with JSON `{ "username": "campus_user", "email": "student@college.edu", "password": "longenough" }`.
2. Copy `token` from the body. In Postman: Authorization → Bearer Token (or enable cookie capture for `tcr_token`).
3. Header `Content-Type: application/json` on every POST/PUT.

Suggested sequence:

| # | Request | Body / notes | Expect |
|---|---|---|---|
| 1 | GET `/api/communities` | — | Seeded rooms + `memberCount` |
| 2 | POST `/api/communities/:id/join` | empty | `joined: true`, count + 1 |
| 3 | POST same join again | empty | **409** already a member |
| 4 | POST `/api/posts` without joining another room | `{ "title": "Hi", "content": "Hello campus", "community": "Memes" }` | **403** join first |
| 5 | POST `/api/posts` | `{ "title": "Library hours", "content": "Open past 10?", "community": "Campus Life", "anonymous": true }` | **201**; `author.username` is Anonymous Student |
| 6 | GET `/api/posts?sort=new` | — | Includes the post; no author id |
| 7 | GET `/api/posts?community=Campus Life` | name or ObjectId | Only that room |
| 8 | GET `/api/posts/:id` | — | Single post |
| 9 | PUT `/api/posts/:id` as the owner | `{ "title": "Library hours — updated" }` | **200** |
| 10 | PUT `/api/posts/:id` as a second user | same | **403** |
| 11 | POST `/api/posts/:id/comments` | `{ "content": "Until 11 on weekdays." }` | **201** |
| 12 | GET `/api/posts/:id/comments` | — | Array for that post |
| 13 | PUT `/api/comments/:id` | `{ "content": "Until midnight during finals." }` | owner only |
| 14 | POST `/api/posts/:id/upvote` twice | — | Count stays 1 |
| 15 | DELETE `/api/posts/:id/upvote` | — | Count 0, `upvoted: false` |
| 16 | GET `/api/communities/:id/posts?sort=popular` | — | That community, by upvote count |
| 17 | DELETE `/api/communities/:id/join` | — | `joined: false` |
| 18 | DELETE `/api/comments/:id` then `/api/posts/:id` | owner | `{ "ok": true }` |

Unauthenticated POST/PUT/DELETE should return **401**.

### Inspect records in Atlas

1. Open [MongoDB Atlas](https://cloud.mongodb.com) and select the cluster in `MONGODB_URI`.
2. Click **Browse Collections** (or **Data Explorer**).
3. Open the database name from the URI path (for example `the-common-room`).
4. Confirm:
   - `users` — bcrypt `password`, no plaintext.
   - `communities` — `members` ObjectId arrays; counts match join/leave.
   - `posts` — `author`, `community`, `anonymous`, `upvotes`.
   - `comments` — `post` and `author` match the API ids.
5. For an anonymous post, the document still has a real `author` ObjectId even though GET JSON does not.

---

## 🧭 Where the project could go next

This milestone stops at posts, comments, upvotes, and communities. The product direction in [PRD.md](./PRD.md) still has later work (not started here):

- 🖼️ Image uploads and saved posts
- 🚩 Reporting and moderation tools
- ✨ Extra polish: loading/error states, accessibility passes

One step at a time. We’re building a common room, not the entire internet. 😌

---

## 🎓 About this project

Made as a **college web development project** to explore how a campus community platform could look and work — from the UI and responsive layouts to basic JavaScript interactions and an Express server.

Have feedback, ideas, or a feature you think belongs in UniHub? Open an issue or start a discussion!

**Now grab a chai, pull up a chair, and join the room.** ☕
