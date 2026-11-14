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

> **Implementation note:** The front-end is HTML, CSS, and vanilla JavaScript. Express serves those files and the existing `/api/signup`, `/api/login`, and `/api/posts` endpoints. Feed search, sort, and upvote interactions remain client-side. MongoDB, sessions, and production authentication are not part of this milestone.

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
| **Node.js** and **Express** | HTTP server and APIs |
| **JSON files** | Simple local storage for signup and post records |
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

You’ll need **Node.js** installed. From the `final-project` directory, run:

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

Check [http://localhost:3000/api/health](http://localhost:3000/api/health) to confirm the server is running.

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
├── PRD.md
├── README.md
├── config/
│   └── index.js
├── controllers/
│   ├── healthController.js
│   ├── signupController.js
│   ├── loginController.js
│   └── postController.js
├── middleware/
│   ├── cors.js
│   └── errorHandler.js
├── models/
│   ├── jsonStore.js
│   ├── userModel.js
│   └── postModel.js
├── routes/
│   ├── healthRoutes.js
│   ├── signupRoutes.js
│   ├── loginRoutes.js
│   └── postRoutes.js
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
| Signup form | 🧪 Client-side validation + local API record write |
| Feed, community, post, and profile screens | ✅ UI pages present |
| Feed search, sorting, and upvote toggle | ✅ Client-side interactions |
| Create-post form | 🧪 Validates input and saves a post through the local API |
| Persistent database and secure authentication | 🚧 Not implemented |
| Full comments, account sessions, and production moderation | 🚧 Not implemented |

**A quick heads-up:** the current Express server writes signup and post records to JSON files under `data/`. New and existing passwords are stored as bcrypt hashes, not plaintext. It is a learning-project implementation, not production-ready authentication or secure user-data storage. The login screen is present, but a complete login/session system is not wired up yet. Feed and voting interactions remain client-side demonstrations.

---

## 🧭 Where the project could go next

The product direction is documented in [PRD.md](./PRD.md). Some possible next quests:

- 🔐 Build proper authentication and user sessions.
- 🗃️ Move users and posts from JSON files to a database.
- 💬 Bring comments and post discussions to life.
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
