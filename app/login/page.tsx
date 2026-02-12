import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import GoogleSignInButton from '@/components/GoogleSignInButton'

export default async function Login() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-primary-100">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Smart Bookmark
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Save and organize your favorite links
          </p>

          {/* Sign In Button */}
          <GoogleSignInButton />

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Sign in with your Google account to get started
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="text-center mt-8 text-white text-sm opacity-90">
          <p>✨ Real-time updates • 🔒 Private bookmarks • 🚀 Fast & Simple</p>
        </div>
      </div>
    </main>
  )
}
