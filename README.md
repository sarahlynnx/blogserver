# BlogServer

REST API backend for the Playful Pathways blog. Provides authentication, blog posts (with image uploads), and comments. Built with Express and MongoDB (Mongoose), deployed on Render.

## Related repos

- **blog-server** (this repo) — API backend
- **blog-react-app** — React frontend
- **playful-pathways** — site that consumes the API

## Tech stack

- Node.js + Express
- MongoDB Atlas via Mongoose
- JWT auth (`jsonwebtoken`, `bcryptjs`)
- `multer` for image uploads
- `@sendgrid/mail` for password-reset emails
- `cors` with an allow-list driven by env vars
- Docker (Node 21) for Render deploy

## Project structure

```
src/
  server.js          # entry — connects to Mongo, starts Express
  app.js             # Express app, CORS, route mounting, error handler
  config/db.js       # Mongoose connection
  routes/            # userRoutes, postRoutes, commentRoutes
  controllers/       # UserController, PostController, CommentController
  models/            # user, post, comment (Mongoose schemas)
  middleware/        # auth + file upload
uploads/             # local upload target (dev)
Dockerfile
```

## Environment variables

Create a `.env` in the project root for local dev. On Render, set the same vars under the service's Environment tab.

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB Atlas connection string |
| `PORT` | Port to listen on (Render injects this; defaults to 5001 locally, Render uses 3001) |
| `ALLOWED_CORS_ORIGINS` | Comma-separated list of allowed origins (e.g. `https://playfulpathways.com,https://blog-react-app.onrender.com`) |
| `JWT_SECRET` | Secret used to sign auth tokens |
| `SENDGRID_API_KEY` | SendGrid key for password-reset emails |
| `GOOGLE_MAPS_API_KEY` | Served to the frontend via `/api/maps-config` |
| `GOOGLE_MAPS_API_VERSION` | Maps JS API version string |

Localhost origins (any port) are always allowed by the CORS middleware in addition to `ALLOWED_CORS_ORIGINS`.

## Running locally

```bash
npm install
npm start
```

Server listens on `PORT` (default `5001` locally).

## API routes

Base URL: `/`

### Health
- `GET /` → `"Server is running."`
- `GET /api/maps-config` → `{ mapsURL }` for the frontend Google Maps loader

### Auth (`/api/auth`)
- `POST /register`
- `POST /login`
- `POST /forgot-password`
- `POST /reset-password`

### Posts (`/api/posts`)
- `GET /` — list all posts
- `GET /:id` — get post by id
- `GET /:postId/image/:imageId` — fetch an uploaded image
- `POST /` — create post (role: `author`, multipart upload)
- `PUT /:id` — update post (role: `author`)
- `DELETE /:id` — delete post (role: `author`)
- `PUT /:id/like` — like a post (auth required)

### Comments (`/api/comments`)
- `GET /` — list comments by post (query param)
- `POST /` — create comment (auth required)
- `PUT /:id` — update comment (auth required)
- `DELETE /:id` — delete comment (auth required)

## Deployment (Render)

The repo is deployed as a Render Web Service using the included `Dockerfile`. Render sets `PORT` automatically; the service exposes 3001 in the container.
