const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});

function fileFilter(req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only jpg and png images are allowed'));
  }
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// In-memory data store
const posts = []; // { id, imageUrl, filename, caption, createdAt, comments: [{id, text, createdAt}] }

// Helpers
function makeImageUrl(req, filename) {
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
}

// Routes

// Create a post with image + caption
app.post('/api/posts', upload.single('image'), (req, res) => {
  try {
    const caption = req.body.caption || '';
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required (field name: image)' });
    }

    const post = {
      id: String(Date.now() + Math.round(Math.random() * 1e6)),
      filename: req.file.filename,
      imageUrl: makeImageUrl(req, req.file.filename),
      caption,
      createdAt: new Date().toISOString(),
      comments: []
    };

    posts.unshift(post);

    return res.status(201).json({ post });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get all posts
app.get('/api/posts', (req, res) => {
  // Return posts as-is (already newest-first)
  res.json({ posts });
});

// Add comment to a post
app.post('/api/posts/:id/comments', (req, res) => {
  try {
    const postId = req.params.id;
    const text = (req.body.text || '').trim();

    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = {
      id: String(Date.now() + Math.round(Math.random() * 1e6)),
      text,
      createdAt: new Date().toISOString()
    };
    post.comments.push(comment);

    res.status(201).json({ comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err && err.message ? err.message : err);
  res.status(400).json({ error: err.message || 'Bad Request' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
