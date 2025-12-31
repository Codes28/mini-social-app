import React, { useState } from 'react'

export default function PostItem({ post, apiBase, onRefresh }) {
  const [commentText, setCommentText] = useState('')
  const [posting, setPosting] = useState(false)

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    setPosting(true)
    try {
      const res = await fetch(`${apiBase}/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to add comment')
      }

      setCommentText('')
      onRefresh && onRefresh()
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to add comment')
    } finally {
      setPosting(false)
    }
  }

  return (
    <>
      {/* Inline CSS */}
      <style>
        {`
          .post-item {
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            margin-bottom: 30px;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
          }

          .post-meta {
            padding: 12px 16px;
            font-size: 12px;
            color: #6b7280;
            border-bottom: 1px solid #e5e7eb;
          }

          .post-image img {
            width: 100%;
            max-height: 450px;
            object-fit: cover;
            display: block;
          }

          .post-caption {
            padding: 14px 16px;
            font-size: 15px;
            color: #111827;
            border-bottom: 1px solid #e5e7eb;
          }

          .comments {
            padding: 14px 16px;
          }

          .comments h4 {
            margin: 0 0 10px;
            font-size: 15px;
            color: #111827;
          }

          .no-comments {
            font-size: 13px;
            color: #9ca3af;
            margin-bottom: 10px;
          }

          .comment {
            background: #f9fafb;
            border-radius: 10px;
            padding: 8px 10px;
            margin-bottom: 8px;
          }

          .comment-text {
            font-size: 14px;
            color: #111827;
          }

          .comment-time {
            font-size: 11px;
            color: #6b7280;
            margin-top: 2px;
            text-align: right;
          }

          .comment-form {
            display: flex;
            gap: 10px;
            margin-top: 12px;
          }

          .comment-form input {
            flex: 1;
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid #d1d5db;
            font-size: 14px;
            outline: none;
          }

          .comment-form input:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
          }

          .comment-form button {
            padding: 10px 14px;
            border-radius: 10px;
            border: none;
            background: #6366f1;
            color: white;
            font-weight: 600;
            cursor: pointer;
          }

          .comment-form button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}
      </style>

      {/* Post Card */}
      <div className="post-item">
        <div className="post-meta">
          {new Date(post.createdAt).toLocaleString()}
        </div>

        <div className="post-image">
          <img src={post.imageUrl} alt={post.caption || 'post image'} />
        </div>

        {post.caption && (
          <div className="post-caption">{post.caption}</div>
        )}

        <div className="comments">
          <h4>Comments</h4>

          {(!post.comments || post.comments.length === 0) && (
            <div className="no-comments">No comments yet</div>
          )}

          {post.comments &&
            post.comments.map((c) => (
              <div key={c.id} className="comment">
                <div className="comment-text">{c.text}</div>
                <div className="comment-time">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              </div>
            ))}

          <form className="comment-form" onSubmit={handleComment}>
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
            />
            <button type="submit" disabled={posting}>
              {posting ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
