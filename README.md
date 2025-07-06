# 🌌 AstroRPG — Astrology Storytelling Adventure

AstroRPG is a multiplayer astrology-themed RPG storytelling app built with Next.js and React. Players collaborate in a mystical world where zodiac signs shape character traits, storylines, and interactive choices.

## 🚀 Tech Stack
(All are flexible)

- **Framework:** [Next.js](https://nextjs.org/)
- **UI:** React + Tailwind CSS + ShadCN/UI
- **State Management:** Zustand (or Redux if needed)
- **Real-time:** WebSockets (Socket.IO or custom)
- **Database:** Supabase or Firebase (TBD)
- **Auth:** NextAuth.js or Clerk (TBD)
- **Platform:** Web-first, React Native compatible

## 🧱 Features

- Zodiac-based character creation
- Collaborative storytelling sessions
- Real-time multiplayer chat and choices
- Dynamic branching narratives
- Session-based progression & saves
- Cross-platform-ready codebase

## 📁 Project Structure
(Proposed, could change)
```
/
├── app/                  # Next.js App Router structure
│   ├── api/              # Route handlers
│   └── (routes)/         # Pages and layouts
├── components/           # Reusable UI components
├── lib/                  # Utils, API clients, socket handlers
├── stores/               # Zustand stores
├── styles/               # Tailwind and global styles
└── public/               # Static assets
```

## 🛠️ Getting Started

1. **Clone the repo:**

   ```bash
   git clone https://github.com/astro-stories/chat-poc.git
   cd astrorpg
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the dev server:**

   ```bash
   npm dev
   ```

4. **Visit:**

   ```
   http://localhost:3000
   ```

## 🔐 Environment Variables

Create a `.env.local` file and configure:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXTAUTH_SECRET=
...
```

## 🧪 Testing

Coming soon

## 🗺️ Roadmap

- Story engine module
- Persistent player profiles
- Mobile app with React Native

## 🤝 Contributing

Contributions welcome! Please open an issue or pull request.