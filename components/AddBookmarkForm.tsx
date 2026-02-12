'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'

export default function AddBookmarkForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !url.trim()) return

    setLoading(true)

    const { error } = await supabase
      .from('bookmarks')
      .insert([
        {
          title: title.trim(),
          url: url.trim(),
          user_id: userId,
        },
      ])

    if (error) {
      console.error('Error adding bookmark:', error)
      alert('Failed to add bookmark')
    } else {
      setTitle('')
      setUrl('')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter bookmark title"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
        />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-medium hover:from-primary-600 hover:to-accent-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Adding...' : 'Add Bookmark'}
      </button>
    </form>
  )
}
