import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BookmarkList from '@/components/BookmarkList'
import AddBookmarkForm from '@/components/AddBookmarkForm'
import SignOutButton from '@/components/SignOutButton'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-primary-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Smart Bookmark Manager
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome, {user.user_metadata.full_name || user.email}
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>

        {/* Add Bookmark Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-primary-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Bookmark</h2>
          <AddBookmarkForm userId={user.id} />
        </div>

        {/* Bookmarks List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-primary-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Bookmarks</h2>
          <BookmarkList userId={user.id} />
        </div>
      </div>
    </main>
  )
}
