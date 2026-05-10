# &gt; private_chat

A minimal, ephemeral chat app — create a secure room, share the link, talk freely. When the timer ends (or you hit destroy), every message is gone for good.

> _A private, self-destructive chat room._

---

## Features

- **Instant rooms** — spin up a private room with one click
- **Self-destruct timer** — rooms auto-expire and wipe themselves
- **Manual destroy** — nuke the room on demand
- **Realtime messaging** — powered by Upstash Realtime + Redis
- **No accounts** — your identity lives only for the session
- **Friendly errors** — clear notifications for `room-not-found`, `room-full`, and `destroyed` rooms

---

## Tech Stack

| Layer         | Tool                                |
| ------------- | ----------------------------------- |
| Framework     | Next.js 16 (App Router) + React 19  |
| Styling       | Tailwind CSS v4                     |
| Realtime      | `@upstash/realtime` + Upstash Redis |
| API           | Elysia + Eden                       |
| Data fetching | TanStack Query                      |
| Validation    | Zod + TypeBox                       |
| Language      | TypeScript                          |

---

## Getting Started

```bash
# install
yarn install

# run dev server
yarn run dev
```

Open [http://localhost:3000](http://localhost:3000) and create your first room.

### Environment

Create a `.env.local` with your Upstash credentials:

```env
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

---

## Scripts

| Command         | What it does         |
| --------------- | -------------------- |
| `yarn run dev`   | Start the dev server |
| `yarn run build` | Build for production |
| `yarn run start` | Run the built app    |
| `yarn run lint`  | Lint the codebase    |

---

## Project Structure

```
src/
├── app/            # Next.js routes
├── components/     # UI components (Lobby, ChatUI, Notification, ...)
├── hooks/          # Custom React hooks
└── lib/            # Helpers and shared utilities
```

---

## Author

Built with care by **Subham**.

---

_Talk freely. Leave nothing behind._

<img width="1536" height="1024" alt="Mockuo_01" src="https://github.com/user-attachments/assets/31748693-0529-4d6b-93e1-a1f4370799f7" />


<img width="1536" height="1024" alt="Mockup_02" src="https://github.com/user-attachments/assets/64499f90-14e4-473c-868e-44a74cc6cdf9" />
