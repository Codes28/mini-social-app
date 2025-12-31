# Backend - Mini Social Media

Requirements
- Node.js (16+ recommended)

Install

1. cd backend
2. npm install

Run

- Development: npm run dev (uses nodemon)
- Production: npm start

API Endpoints

- POST /api/posts
  - multipart/form-data
  - fields: image (file, jpg/png), caption (string)
  - returns: { post }
- GET /api/posts
  - returns: { posts }
- POST /api/posts/:id/comments
  - JSON body: { text }
  - returns: { comment }

Notes
- Uploaded images are stored in `uploads/` and served statically at `/uploads/<filename>`.
- Data is stored in memory and will reset on server restart.
