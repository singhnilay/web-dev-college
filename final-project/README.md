# The Common Room

**A digital campus community for conversations that matter.**

The Common Room is a college-focused community platform designed to bring campus conversations into one organized space. Instead of important questions, event updates, academic discussions, and campus moments getting buried in noisy group chats, students can explore topic-based communities, browse a shared feed, and engage with posts.

The project follows the product direction described in [PRD.md](./PRD.md): a campus “digital town square” combining community-based discussions with a social feed, styled as a modern campus editorial rather than a clone of an existing social network.

## Product goals

- Give students one place to ask questions, share updates, and start discussions.
- Organize campus posts around communities and topics.
- Help useful conversations stand out through sorting and upvotes.
- Offer a welcoming, readable interface across desktop and mobile.

## Features and interface

The current project includes front-end pages and interactions for the following areas:

- **Landing page** — introduces the platform and directs visitors to sign in or join.
- **Sign-up and login pages** — provides the entry points for users.
- **Campus feed** — presents sample posts with feed controls, search, and sorting.
- **Communities** — groups discussions into topics such as Campus Life, Academics, Events, Memes, Opportunities, and Questions.
- **Post detail and create-post pages** — UI for reading a discussion and composing a post.
- **User profiles** — a dedicated profile interface.
- **Feed interactions** — client-side post filtering, sorting, and upvote-count toggling.
- **Responsive navigation** — a collapsible mobile menu.
- **Visual design** — warm neutral surfaces, a burgundy-style editorial direction, and DM Serif Display / DM Sans typography.

> **Implementation note:** The front-end is HTML, CSS, and vanilla JavaScript. Express serves those files and the existing `/api/signup`, `/api/login`, and `/api/posts` endpoints. Feed search, sort, and upvote interactions remain client-side. MongoDB, sessions, and production authentication are not part of this milestone.

## Tech stack

- **HTML5** for page structure
- **CSS3** for layout, visual styling, and responsive behavior
- **Vanilla JavaScript** for client-side interactions
- **Node.js** and **Express** for the HTTP server and APIs
- **Google Fonts** — DM Serif Display and DM Sans

## Project structure

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
└── reference/
    ├── campus_feed/
    ├── event_directory/
    ├── login_page/
    └── signup_page/
```

## Run locally

```bash
git clone https://github.com/singhnilay/web-dev-college.git
cd web-dev-college/final-project
npm install
npm start
```

For auto-reload during development:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). Check [http://localhost:3000/api/health](http://localhost:3000/api/health) to confirm the server is running.

## Usage

1. Open the landing page.
2. Use **Join the room** or **Sign in** to explore the authentication screens.
3. Browse the campus feed and community pages.
4. Try the available client-side search, sort, and upvote interactions.
5. Explore post details and profile layouts.

Sign-up and login still use the existing `/api/signup` and `/api/login` routes and write to `data/users.json`. New and existing passwords are stored as bcrypt hashes, not plaintext. Create-post still posts to `/api/posts`. Feed and voting interactions remain client-side demonstrations.

## Design direction

The interface takes a **modern campus editorial** approach: part student magazine, part community space, and part campus noticeboard.

- **Warm background:** `#F7F5F2`
- **Primary text:** `#1C1C1C`
- **Secondary text:** `#6B6B6B`
- **Card surfaces:** `#FFFFFF`
- **Borders:** `#E8E4DF`
- **Typography:** DM Serif Display for expressive headings and DM Sans for interface text

The goal is to keep the product minimal, approachable, and focused on campus conversations.

## Roadmap

The PRD describes a fuller MVP. Potential next steps include:

- Connect authentication to a backend and persist user profiles.
- Add a database for users, communities, posts, upvotes, and comments.
- Implement create, edit, and delete operations with authorization.
- Persist feed sorting and voting state.
- Add post comments and community-specific feeds.
- Add validation, loading/error states, accessibility checks, and further responsive testing.
- Consider optional features such as anonymous posts, saved posts, image uploads, search across users/communities, and reporting after the core flow is complete.

The proposed product requirements and future backend outline are documented in [PRD.md](./PRD.md). Planned functionality should not be taken as implemented until it is connected and tested end to end.

## Project status

**Current stage:** Front-end prototype with an Express server that serves static pages and the existing sign-up, login, and post-creation APIs. MongoDB is not connected yet.

The UI provides a foundation for the broader product idea. Database persistence and production-ready authentication remain future implementation work.

## License

No license has been specified yet. Add a `LICENSE` file if you intend to publish the project for reuse.
