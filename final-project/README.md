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

> **Implementation note:** The repository currently contains a static front-end built with HTML, CSS, and vanilla JavaScript. The sign-up form performs client-side password-length validation, and feed interactions are client-side demonstrations. A persistent backend, database-backed accounts, and server-side post/comment operations are not configured in the current project.

## Tech stack

- **HTML5** for page structure
- **CSS3** for layout, visual styling, and responsive behavior
- **Vanilla JavaScript** for client-side interactions
- **Google Fonts** — DM Serif Display and DM Sans

No frontend framework or package manager is required for the current static version.

## Project structure

```text
final-project/
├── PRD.md
├── README.md
├── public/
│   ├── index.html
│   ├── css/
│   │   ├── style.css
│   │   ├── index.css
│   │   ├── login.css
│   │   ├── signup.css
│   │   ├── community.css
│   │   ├── create-post.css
│   │   ├── post.css
│   │   └── profile.css
│   ├── js/
│   │   ├── app.js
│   │   ├── index.js
│   │   └── signup.js
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

## Run locally

Since this is a static website, you can run it without installing dependencies.

1. Clone the repository:

   ```bash
   git clone https://github.com/singhnilay/web-dev-college.git
   ```

2. Move into the project directory:

   ```bash
   cd web-dev-college/final-project
   ```

3. Open `public/index.html` in your browser.

For a more consistent local development experience, serve the `public` directory with a simple local HTTP server. For example, if Python 3 is installed:

```bash
cd public
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## Usage

1. Open the landing page.
2. Use **Join the room** or **Sign in** to explore the authentication screens.
3. Browse the campus feed and community pages.
4. Try the available client-side search, sort, and upvote interactions.
5. Explore post details and profile layouts.

Because this version is a front-end prototype, form submissions and interactions do not represent persistent account or community data.

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

**Current stage:** Static front-end prototype for a web development college final project.

The UI provides a foundation for the broader product idea. Database persistence, production authentication, and backend API routes remain future implementation work.

## License

No license has been specified yet. Add a `LICENSE` file if you intend to publish the project for reuse.
