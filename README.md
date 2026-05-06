<div align="center">
  <h1>🌐 LinguistPro</h1>
  <p>منصة تعلم اللغات التفاعلية | Interactive Language Learning Platform</p>

  ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
  ![Express](https://img.shields.io/badge/Express-4-000000?logo=express)
  ![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb)
  ![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?logo=socket.io)
  ![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)
</div>

---

## 📁 Project Structure

```
LinguistPro/
├── client/               # React (Vite) Frontend
│   └── src/
│       ├── api/          # Axios instances & typed API calls
│       ├── contexts/     # AuthContext, LanguageContext
│       ├── hooks/        # useSocket, useAgora, useAuth
│       ├── layouts/      # AuthLayout, MainLayout, VideoLayout
│       ├── pages/        # Onboarding, Explore, Chat, TikTok
│       └── components/   # Button, Input, Modal, BottomNav
├── server/               # Express + Socket.io Backend
│   └── src/
│       ├── config/       # MongoDB, Cloudinary, Agora setup
│       ├── controllers/  # Auth, User, Story, Chat logic
│       ├── middlewares/  # JWT guard, rate limiter, validator
│       ├── models/       # User, Story, Message, Badge schemas
│       ├── routes/       # REST API endpoints
│       ├── services/     # Email OTP, RAG AI engine (stub)
│       ├── sockets/      # Real-time chat via Socket.io
│       └── utils/        # OTP generator, JWT helpers
└── docker-compose.yml    # Orchestrates client + server + MongoDB
```

---

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ≥ 24
- [Node.js](https://nodejs.org/) ≥ 20 (for local dev without Docker)

### 1 — Clone & configure environment

```bash
git clone https://github.com/your-username/LinguistPro.git
cd LinguistPro

# Server env
cp server/.env.example server/.env
# → fill in MONGODB_URI, JWT_SECRET, SMTP_*, CLOUDINARY_*, AGORA_*

# Client env
cp client/.env.example client/.env
# → set VITE_API_URL and VITE_SOCKET_URL
```

### 2 — Run with Docker (recommended)

```bash
docker-compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Client   | http://localhost:3000       |
| Server   | http://localhost:5000/api   |
| MongoDB  | localhost:27017             |

### 3 — Run locally (development)

```bash
# Terminal 1 — Backend
cd server && npm install && npm run dev

# Terminal 2 — Frontend
cd client && npm install && npm run dev
```

---

## 🔑 Environment Variables

### `server/.env`

| Variable                  | Description                          |
|---------------------------|--------------------------------------|
| `PORT`                    | Express port (default `5000`)        |
| `MONGODB_URI`             | MongoDB connection string            |
| `JWT_SECRET`              | Long random secret for JWT signing   |
| `SMTP_HOST/PORT/USER/PASS`| Nodemailer OTP email config          |
| `CLOUDINARY_*`            | Cloudinary media upload credentials  |
| `AGORA_APP_ID`            | Agora App ID for video calls         |
| `AGORA_APP_CERTIFICATE`   | Agora certificate for token signing  |

### `client/.env`

| Variable           | Description                    |
|--------------------|-------------------------------|
| `VITE_API_URL`     | Backend REST API base URL     |
| `VITE_SOCKET_URL`  | Socket.io server URL          |

---

## 🛠️ Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, React Router v6        |
| Styling    | Cairo font, custom CSS (RTL-first)     |
| State      | Zustand + React Context                |
| HTTP       | Axios with JWT interceptors            |
| Realtime   | Socket.io v4                           |
| Video      | Agora RTC SDK                          |
| Backend    | Express 4, Node.js 20                  |
| Database   | MongoDB 7 via Mongoose                 |
| Auth       | JWT + bcryptjs + OTP email             |
| Media      | Cloudinary (images & videos)           |
| AI / RAG   | Pluggable service stub (OpenAI-ready)  |
| Container  | Docker + Docker Compose                |

---

## 📡 API Reference

### Auth  `POST /api/auth/`
| Endpoint        | Body                      | Description              |
|-----------------|---------------------------|--------------------------|
| `/register`     | `email, password`         | Create account + OTP     |
| `/verify-otp`   | `userId, otp`             | Verify email             |
| `/login`        | `email, password`         | Sign in, receive token   |
| `/resend-otp`   | `userId`                  | Re-send OTP code         |
| `/me`           | —                         | Get current user (auth)  |

### Users  `PATCH /api/users/`
| Endpoint        | Description               |
|-----------------|---------------------------|
| `/profile`      | Update onboarding data    |
| `/:id`          | Get public user profile   |

### Stories  `/api/stories`
| Method   | Endpoint     | Description          |
|----------|--------------|----------------------|
| GET      | `/`          | Feed (paginated)     |
| POST     | `/`          | Upload video/image   |
| POST     | `/:id/like`  | Toggle like          |
| DELETE   | `/:id`       | Delete own story     |

---

## 🔌 Socket.io Events

**Namespace: `/chat`**

| Event              | Direction        | Payload                              |
|--------------------|------------------|--------------------------------------|
| `conversation:join`| client → server  | `conversationId`                     |
| `message:send`     | client → server  | `{ conversationId, content, type }`  |
| `message:new`      | server → client  | Full message object                  |
| `typing:start`     | bidirectional    | `{ conversationId }`                 |
| `typing:stop`      | bidirectional    | `{ conversationId }`                 |

---

## 🗺️ Roadmap

- [ ] AI RAG engine integration (Pinecone + OpenAI)
- [ ] Agora video call rooms
- [ ] Badge & XP gamification system
- [ ] Push notifications (FCM)
- [ ] Admin dashboard

---

## 📄 License

MIT © LinguistPro Team
