import React from 'react'
import PostItem from './PostItem'

export default function PostList({ posts, apiBase, onRefresh }) {
  if (!posts || posts.length === 0) {
    return (
      <>
        {/* Inline CSS */}
        <style>
          {`
            .empty-state {
              text-align: center;
              padding: 40px 20px;
              color: #6b7280;
              font-size: 15px;
              background: #ffffff;
              border-radius: 14px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
              font-family: 'Inter', sans-serif;
            }
          `}
        </style>

        <div className="empty-state">No posts yet.</div>
      </>
    )
  }

  return (
    <>
      {/* Inline CSS */}
      <style>
        {`
          .post-list {
            display: flex;
            flex-direction: column;
            gap: 30px;
          }
        `}
      </style>

      <div className="post-list">
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            apiBase={apiBase}
            onRefresh={onRefresh}
          />
        ))}
      </div>
    </>
  )
}
