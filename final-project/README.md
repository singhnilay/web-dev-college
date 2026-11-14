# 🏫 The Common Room

### Your campus. Your people. Your conversations.

**The Common Room** is a digital hangout for college life — a place to ask the questions you’re too shy to ask in the class group, find out what’s happening around campus, share opportunities, drop a meme, or start a proper discussion.

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

> **Implementation note:** The front-end is HTML, CSS, and vanilla JavaScript. Express serves those files and JSON APIs. Users, posts, comments, and communities persist only in MongoDB Atlas. Feed search, sort, and upvote clicks on the static pages remain client-side demonstrations. Sessions and production authentication are not part of this milestone.

*Some screens and interactions are currently prototype/demo experiences. See [What's working right now?](#-whats-working-right-now) for the honest status.*

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

👉 **http://localhost:3000**

Check [http://localhost:3000/api/health](http://localhost:3000/api/health) to confirm the server is running and Atlas is connected. The process exits on startup if `MONGODB_URI` is missing or the connection fails.

### 3. Open the app

Visit [http://localhost:3000](http://localhost:3000) in your browser. The server serves the files inside `public/` and handles the project's current API endpoints.

### 4. Want to serve only the static pages?

You can also open `public/index.html` directly, or use a simple local server:

```bash
cd public
python3 -m http.server 8000
```

Then head to [http://localhost:8000](http://localhost:8000).

> ⚠️ The create-post, signup, and login flows send requests to the Express API on `http://localhost:3000`, so run the Node server for those flows. Opening the pages with a static server alone won't provide the API.

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
| Login / signup screens | ✅ UI implemented |
| Signup form | 🧪 Client-side validation + MongoDB user create via `/api/signup` |
| Feed, community, post, and profile screens | ✅ UI pages present |
| Feed search, sorting, and upvote toggle | ✅ Client-side interactions |
| Users, posts, comments, communities CRUD | ✅ MongoDB Atlas REST APIs |
| Create-post form | 🧪 Needs a real `author` user id and community id/name from Atlas |
| Authentication / sessions | 🚧 Not implemented |
| Production moderation | 🚧 Not implemented |

**A quick heads-up:** `data/users.json` and `data/posts.json` are leftover backups from an earlier milestone. The app does not read or write them. Passwords are stored as bcrypt hashes. Login and signup hit MongoDB, but there are no sessions yet. Feed voting on the static pages is still a client-side demo.

---

## MongoDB Atlas and REST APIs

Atlas is the only persistent store. `config/index.js` loads `.env` with `dotenv`. `server.js` then calls `connectDb()` (`mongoose.connect`) and only runs `app.listen` after that promise resolves. A missing `MONGODB_URI` or a failed Atlas connection logs an error and exits with code 1; the HTTP server never starts.

### Collections and relationships

- **User:** `username`, `email`, `password`, `bio`, `profileImage`, `createdAt`, `updatedAt`. Unique indexes on `username` and `email`. Password is hashed and omitted from JSON responses.
- **Community:** `name`, `description`, `icon`, `members[]` (User), `createdAt`. Unique `name`.
- **Post:** `title`, `content`, `author` (User), `community` (Community), `anonymous`, `upvotes[]` (User), `createdAt`, `updatedAt`.
- **Comment:** `content`, `author` (User), `post` (Post), `createdAt`, `updatedAt`.

Deletes of a user, post, or community are rejected with **409** while related records still exist (posts, comments, upvotes, memberships). Invalid ObjectIds return **400**. Missing documents return **404**. Duplicate unique fields return **409**.

### Postman

Base URL: `http://localhost:3000`

Order: create a user, create a community, create a post with those ids, then create a comment.

| Action | Method | Path |
|---|---|---|
| List / get / create / update / delete users | GET POST PUT DELETE | `/api/users`, `/api/users/:id` |
| Same for posts | GET POST PUT DELETE | `/api/posts`, `/api/posts/:id` |
| Same for comments | GET POST PUT DELETE | `/api/comments`, `/api/comments/:id` |
| Same for communities | GET POST PUT DELETE | `/api/communities`, `/api/communities/:id` |

Set header `Content-Type: application/json`.

POST `/api/users`:

```json
{
  "username": "campus_user",
  "email": "student@college.edu",
  "password": "longenough",
  "bio": "Third year CSE",
  "profileImage": ""
}
```

PUT `/api/users/:id`:

```json
{
  "bio": "Updated bio",
  "profileImage": "https://example.com/me.jpg"
}
```

POST `/api/communities`:

```json
{
  "name": "Campus Life",
  "description": "Everything happening around campus.",
  "icon": "home",
  "members": ["USER_OBJECT_ID"]
}
```

PUT `/api/communities/:id`:

```json
{
  "description": "Updated description",
  "members": ["USER_OBJECT_ID"]
}
```

POST `/api/posts` (`community` may be an ObjectId or an existing community name):

```json
{
  "title": "Library hours this week",
  "content": "Does anyone know if the library stays open past 10?",
  "author": "USER_OBJECT_ID",
  "community": "COMMUNITY_OBJECT_ID",
  "anonymous": false,
  "upvotes": []
}
```

PUT `/api/posts/:id`:

```json
{
  "title": "Library hours — updated",
  "anonymous": true,
  "upvotes": ["USER_OBJECT_ID"]
}
```

POST `/api/comments`:

```json
{
  "content": "It stays open until 11 on weekdays.",
  "author": "USER_OBJECT_ID",
  "post": "POST_OBJECT_ID"
}
```

PUT `/api/comments/:id`:

```json
{
  "content": "Correction: until midnight during finals."
}
```

GET responses populate related `author`, `community`, `post`, `members`, and `upvotes` where those refs exist.

### Inspect records in Atlas

1. Open [MongoDB Atlas](https://cloud.mongodb.com) and select the cluster in `MONGODB_URI`.
2. Click **Browse Collections** (or **Data Explorer**).
3. Open the database name from the URI path (for example `the-common-room`).
4. Inspect `users`, `communities`, `posts`, and `comments`.
5. Confirm `_id` values match the ids returned by Postman.

---

## 🧭 Where the project could go next

The product direction is documented in [PRD.md](./PRD.md). Some possible next quests:

- 🔐 Build proper authentication and user sessions.
- 💬 Wire comments and post discussions into the front-end.
- 🏘️ Make communities dynamic, with their own feeds.
- 🖼️ Add image uploads and saved posts.
- 🚩 Add reporting and moderation tools.
- ✨ Polish accessibility, validation, and loading/error states.

One step at a time. We’re building a common room, not the entire internet. 😌

---

## 🎓 About this project

Made as a **college web development project** to explore how a campus community platform could look and work — from the UI and responsive layouts to basic JavaScript interactions and an Express server.

Have feedback, ideas, or a feature you think belongs in the Common Room? Open an issue or start a discussion!

**Now grab a chai, pull up a chair, and join the room.** ☕
