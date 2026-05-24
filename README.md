# Idea Vault Server

A lightweight Node.js REST API for managing ideas and comments with JWT authorization and MongoDB storage.

## What it does
- Stores and retrieves idea entries
- Supports idea creation, update, delete, and detail retrieval
- Stores and retrieves user comments tied to ideas
- Protects key routes with JWT token verification via remote JWKS

## Tech stack
- Node.js
- Express
- MongoDB
- CORS
- dotenv
- jose-cjs

## Setup
1. Install dependencies
```bash
npm install
```
2. Create a `.env` file with:
```env
PORT=3000
MONGODB_URI=<your-mongodb-connection-string>
CLIENT_URL=<your-auth-provider-url>
```
3. Start the server
```bash
node index.js
```

## Key endpoints
- `GET /` - health check
- `POST /ideas` - create idea (protected)
- `GET /ideas` - list ideas
- `GET /ideas/:userId` - list ideas by creator (protected)
- `GET /ideas/details/:id` - get idea details (protected)
- `PATCH /ideas/:ideaId` - update idea (protected)
- `DELETE /ideas/:ideaId` - delete idea (protected)
- `POST /comments` - add comment (protected)
- `GET /comments/:ideaId` - fetch comments for an idea (protected)
- `GET /comments/myInteraction/:id` - fetch comments by user (protected)
- `PATCH /comments/:id` - update comment (protected)
- `DELETE /comments/:id` - delete comment (protected)

## Notes
- The project uses `jose-cjs` to verify JWTs against a remote JWKS endpoint.
- MongoDB collections: `ideas`, `comments`.
- Ensure `CLIENT_URL` points to an authentication provider that exposes `/api/auth/jwks`.
