import React, { useState } from 'react'

export default function PostForm({ apiBase, onPosted }) {
  const [image, setImage] = useState(null)
  const [caption, setCaption] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) return alert('Please choose an image')

    const form = new FormData()
    form.append('image', image)
    form.append('caption', caption)

    setSubmitting(true)
    try {
      const res = await fetch(`${apiBase}/api/posts`, {
        method: 'POST',
        body: form,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Upload failed')
      }

      setCaption('')
      setImage(null)
      onPosted && onPosted()
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to post')
    } finally {
      setSubmitting(false)
    }
  }

  const removeImage = () => {
    setImage(null)
  }

  return (
    <>
      {/* Inline CSS */}
      <style>
        {`
          .post-form {
            max-width: 640px;
            margin: 40px auto;
            padding: 28px;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
            display: flex;
            flex-direction: column;
            gap: 22px;
            font-family: 'Inter', sans-serif;
          }

          .post-title {
            text-align: center;
            font-size: 26px;
            font-weight: 700;
            color: #111827;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .form-label {
            font-size: 15px;
            font-weight: 600;
            color: #374151;
          }

          .upload-box {
            border: 2px dashed #c7d2fe;
            border-radius: 16px;
            background: #eef2ff;
            padding: 24px;
            text-align: center;
            cursor: pointer;
            transition: background 0.2s;
          }

          .upload-box:hover {
            background: #e0e7ff;
          }

          .upload-text {
            font-size: 15px;
            font-weight: 600;
            color: #4338ca;
          }

          .file-input {
            display: none;
          }

          .selected-file {
            margin-top: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #f9fafb;
            padding: 8px 12px;
            border-radius: 10px;
            font-size: 13px;
            color: #374151;
          }

          .remove-btn {
            background: none;
            border: none;
            color: #ef4444;
            font-size: 14px;
            cursor: pointer;
            font-weight: 600;
          }

          .text-area {
            min-height: 120px;
            padding: 14px 16px;
            border-radius: 14px;
            border: 1px solid #d1d5db;
            font-size: 16px;
            resize: vertical;
            outline: none;
          }

          .text-area:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.18);
          }

          .submit-btn {
            margin-top: 10px;
            padding: 16px;
            border-radius: 16px;
            background: linear-gradient(135deg, #6366f1, #4f46e5);
            color: #ffffff;
            font-size: 17px;
            font-weight: 700;
            border: none;
            cursor: pointer;
          }

          .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}
      </style>

      {/* Form */}
      <form className="post-form" onSubmit={handleSubmit}>
        <h3 className="post-title">Create New Post</h3>

        {/* Image Upload */}
        <div className="form-group">
          <label className="form-label">Upload Image</label>

          {!image && (
            <label className="upload-box">
              <span className="upload-text">Click to choose an image</span>
              <input
                type="file"
                accept="image/*"
                className="file-input"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          )}

          {image && (
            <div className="selected-file">
              <span>{image.name}</span>
              <button
                type="button"
                className="remove-btn"
                onClick={removeImage}
              >
                ✕ Remove
              </button>
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="form-group">
          <label className="form-label">Caption</label>
          <textarea
            className="text-area"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write something amazing..."
          />
        </div>

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Posting...' : 'Share Post'}
        </button>
      </form>
    </>
  )
}
