# CampusConnect — Modern Full-Stack College Community Platform

CampusConnect is a centralized, digital student ecosystem engineered to enhance daily campus interactions, resource distributions, and career preparation. This full-stack application integrates sharing notes, locating lost belongings, dorm trading, anonymous venting, placement guides, and real-time chatting on a streamlined, responsive React + Node.js foundation.

## 🚀 Key Modules & Capabilities

1. **Authentication System**: Secures the user through credential tokens, automated session recovery, email validation flags, and institutional `.edu` lock guidelines.
2. **Academic Notes Exchange**: Standardizes lecture summaries categorized by course area and semester. Features a server-side **AI Note Summarizer powered by Gemini 3.5 Core** to construct bullet outlines from notes in one click.
3. **Student Dorm Marketplace**: Catalog of dorm gear, scientific tools, or textbook listings with price logs, status markers ("Declare Sold"), and seller contact cards.
4. **Lost & Found Loggers**: Organized board for missing items with map pins, reported timestamps, status loops (Resolved vs. Active), and claim instructions.
5. **Anonymous Confessional**: Secure, unlogged vent deck with a built-in interactive writing helper. Employs real-time admin moderation filters, reports queues, and community support ratings.
6. **Career Placement Hub**: Peer collection of questions asked in assessments at Google, Microsoft, Stripe, and Adobe. Includes two powerful **Gemini AI tools**:
   - **AI Interview Advisor**: High-density markdown guidelines constructed based on custom company topics.
   - **AI Milestone Roadmaps**: Step-by-step prep schedules spanning custom timelines (e.g. 4 weeks sprint vs. 3 months full-tier).
7. **Real-time Courtyard Lounge**: Instantly transmitted notifications, unread notification counts, and server-wide messaging streams driven by **Socket.IO**.
8. **Moderator Admin Room**: Detailed bento-grid analytics charts, complete student rosters with ban controls, reports loggers, and a draft confession approvals queue.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Single Page Application built on **React 18/19**, managed with **React Context Hooks** and styled using mobile-first **Tailwind CSS**. Custom icons imported via `lucide-react`.
- **Backend**: Restful gateway API built with **Express (Node.js)**, utilizing JSON body parsing, CORS middleware, and custom request handlers.
- **Real-Time Integration**: Synchronous broadcasts mapped dynamically across standard server ports via **Socket.IO**.
- **AI Infrastructure**: Fully decoupled server proxy API leveraging `@google/genai` to safeguard secret keys and serve high-speed summaries.
- **Database**: Extensible, persistent database interfaces currently utilizing structured memory mappings (`JSONDatabase`) with complete fallback support for MongoDB Atlas schemas.

---

## 📦 Setting Up Locally

Ensure you have [Node.js (v18+)](https://nodejs.org/) installed.

### 1. Configure Secrets

Create a `.env` file in the root directory based on the `.env.example`:

```env
GEMINI_API_KEY="YOUR_GOOGLE_AI_STUDIO_API_KEY"
APP_URL="http://localhost:3000"
```

### 2. Install Dependencies

Install all pre-configured client-side and full-stack modules:

```bash
npm install
```

### 3. Run the Development Server

Start the fast development runner (tsx + Vite Express middleware mode):

```bash
npm run dev
```

The application client and API gateway will run concurrently on:
👉 **`http://localhost:3000`**

### 4. Build and Package for Production

Compile front-end assets to `dist/`, bundle the TypeScript server using `esbuild` down to a single CommonJS package (`dist/server.cjs`), and run standalone Node production:

```bash
npm run build
npm run start
```

---

## 🔒 Security & Code Policies

- All external API request handlers run **server-side** to ensure your `GEMINI_API_KEY` remains completely invisible to client browsers.
- Strictly modular structure (all layouts, pages, and components abstracted cleanly inside the modular `/src` folder) to optimize token efficiency and scalability.
- Clean typography utilizing modern *Plus Jakarta Sans* pairing alongside *JetBrains Mono* data indicators.
