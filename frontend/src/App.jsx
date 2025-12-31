import React, { useEffect, useState } from 'react'
import PostForm from './components/PostForm'
import PostList from './components/PostList'

//const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const API_BASE = 'https://mini-social-app-5qk9.onrender.com';

export default function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/posts`)
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (err) {
      console.error('Failed to fetch posts', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <>
      {/* Inline CSS */}
      <style>
        {`
          body {
            margin: 0;
            background: #f3f4f6;
            font-family: 'Inter', sans-serif;
          }

          .container {
            max-width: 900px;
            margin: auto;
            padding: 30px 20px;
          }

          .app-title {
            text-align: center;
            font-size: 32px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 20px;
          }

          .section-title {
            font-size: 22px;
            font-weight: 600;
            color: #111827;
            margin: 30px 0 15px;
          }

          .divider {
            border: none;
            height: 1px;
            background: #e5e7eb;
            margin: 40px 0;
          }

          .loading-text {
            text-align: center;
            color: #6b7280;
            font-size: 15px;
          }
        `}
      </style>

      <div className="container">
        <h1 className="app-title">Mini Social</h1>

        <PostForm apiBase={API_BASE} onPosted={fetchPosts} />

        <hr className="divider" />

        <h2 className="section-title">Feed</h2>

        {loading ? (
          <p className="loading-text">Loading posts...</p>
        ) : (
          <PostList
            posts={posts}
            apiBase={API_BASE}
            onRefresh={fetchPosts}
          />
        )}
      </div>
    </>
  )
}
