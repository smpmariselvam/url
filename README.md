# URL Shortener - Full Stack Application

A simple full-stack URL shortening service like bit.ly

## Features
- Shorten any long URL
- Custom alias option (optional)
- Click tracking / analytics
- URL history with stats
- One-click copy to clipboard
- Redirect to original URL when visiting short link

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express + MongoDB
- **Short ID:** nanoid (6 characters)

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file (copy from `.env.example`):
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
BASE_URL=http://localhost:5000
```

Start server:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`
Backend runs on `http://localhost:5000`

### 3. MongoDB Setup
- Create free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create cluster and get connection string
- Replace in `.env` file

## How It Works
1. User enters long URL → Backend generates 6-char short ID
2. Stores mapping: shortId → originalUrl in MongoDB
3. Visiting `yourdomain.com/abc123` → Backend finds original URL → Redirects
4. Each visit increments click count

## Deployment
- **Backend:** [Render.com](https://render.com) or [Railway.app](https://railway.app)
- **Frontend:** [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- **Database:** MongoDB Atlas (free tier)
- **Important:** Update BASE_URL in production to your backend domain

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/urls/shorten | Create short URL |
| GET | /api/urls/all | Get all URLs |
| GET | /api/urls/stats/:shortId | Get URL stats |
| DELETE | /api/urls/:shortId | Delete URL |
| GET | /:shortId | Redirect to original URL |
