# Smart Bookmark Manager

A modern, real-time bookmark management application built with Next.js, Supabase, and Tailwind CSS. Users can sign in with Google, manage their personal bookmarks, and see updates in real-time across multiple browser tabs.

> **Built for**: Abstrait Micro Challenge Assignment  
> **Time Limit**: 72 hours  
> **Status**: ✅ Complete and Deployed

---

## 📑 Table of Contents

- [Assignment Requirements](#-assignment-requirements)
- [Tech Stack](#️-tech-stack)
- [Setup Instructions](#-setup-instructions)
- [Key Features](#-key-features-implemented)
- [Deployment](#-deployment-to-vercel)
- [Problems & Solutions](#-problems-encountered--how-i-solved-them)
- [Design Features](#-design-features)
- [Project Structure](#-project-structure)
- [Developer Contact](#-developer-contact)

---

## 📋 Assignment Requirements

This project fulfills all requirements for the Abstrait Micro Challenge:

1. ✅ **Google OAuth Login** - Users can sign up and log in using Google (no email/password)
2. ✅ **Add Bookmarks** - Logged-in users can add bookmarks with URL and title
3. ✅ **Private Bookmarks** - Bookmarks are private to each user (User A cannot see User B's bookmarks)
4. ✅ **Real-time Updates** - Bookmark list updates in real-time without page refresh (open two tabs and add a bookmark in one, it appears in the other instantly)
5. ✅ **Delete Bookmarks** - Users can delete their own bookmarks
6. ✅ **Deployed on Vercel** - App is deployed with a working live URL

## 🛠️ Tech Stack

**As Required:**
- **Next.js** - Using App Router (not Pages Router)
- **Supabase** - For Authentication, Database, and Realtime functionality
- **Tailwind CSS** - For styling
- **TypeScript** - For type safety
- **Vercel** - For deployment

## 📋 Prerequisites

Before you begin, make sure you have:
- Node.js 18+ installed
- A Supabase account ([signup here](https://supabase.com))
- A Google Cloud Console account for OAuth ([console](https://console.cloud.google.com))
- A Vercel account for deployment ([signup here](https://vercel.com))

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
# Navigate to your project directory
cd "Abstrait Micro Challenge Assignment"

# Install dependencies
npm install
```

### 2. Supabase Setup

#### Create Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details and create

#### Create Database Table
1. In your Supabase project, go to **SQL Editor**
2. Run this SQL to create the bookmarks table:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX bookmarks_user_id_idx ON bookmarks(user_id);
```

#### Enable Realtime
1. Go to **Database** → **Replication**
2. Find the `bookmarks` table
3. Toggle it ON to enable real-time updates

### 3. Google OAuth Setup

#### Create OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth Client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `https://[YOUR-PROJECT-ID].supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for local development)
7. Copy your **Client ID** and **Client Secret**

#### Configure in Supabase
1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Google** provider
3. Paste your Google **Client ID** and **Client Secret**
4. Save changes

### 4. Environment Variables

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Fill in your Supabase credentials in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these in Supabase Dashboard → **Settings** → **API**

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## ✨ Key Features Implemented

### 1. Google OAuth Authentication
- No traditional email/password signup
- Secure authentication using Supabase Auth
- Session management with middleware
- Automatic redirect to login for unauthenticated users

### 2. Bookmark Management
- **Add Bookmarks**: Simple form with URL and title fields
- **View Bookmarks**: Clean list view with timestamps
- **Delete Bookmarks**: One-click delete with trash icon
- All operations are user-specific and secure

### 3. Real-time Updates
- Uses Supabase Realtime with PostgreSQL CDC (Change Data Capture)
- Instant updates across all browser tabs/windows
- No manual refresh needed
- Efficient subscription management to prevent memory leaks

### 4. Privacy & Security
- Row Level Security (RLS) enforces data isolation
- Users can only see, add, and delete their own bookmarks
- Database-level security policies
- Secure cookie-based session management

### 5. Modern UI/UX
- Beautiful gradient color scheme (blue + purple)
- Smooth animations and transitions
- Responsive design for all screen sizes
- Loading states and empty states
- Accessible and user-friendly interface

---

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Smart Bookmark App"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click **Import Project**
3. Select your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**

### 3. Update Google OAuth

After deployment, add your Vercel URL to Google OAuth:
- Go to Google Cloud Console → Credentials
- Add `https://your-app.vercel.app/auth/callback` to authorized redirect URIs

## 🐛 Problems Encountered & How I Solved Them

### Problem 1: Project Folder Name with Spaces
**Issue**: The project folder "Abstrait Micro Challenge Assignment" contains spaces and capital letters, which violates npm naming restrictions. When running `create-next-app`, it failed with error: "name can only contain URL-friendly characters" and "name can no longer contain capital letters".

**Solution**: 
- Created the Next.js project structure manually instead of using `create-next-app`
- Manually created all configuration files: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`
- Set up proper folder structure for App Router (`app/`, `components/`, `utils/`)
- Named the package as "smart-bookmark-app" in `package.json` while keeping the folder name as required

**Learning**: When automated tools fail due to constraints, understanding the underlying file structure allows for manual setup.

---

### Problem 2: Supabase SSR Cookie Handling with Next.js 15
**Issue**: Next.js 15 introduced async `cookies()` API, requiring proper handling in server components. The Supabase documentation examples didn't match the latest Next.js async patterns, causing TypeScript errors and cookie session issues.

**Solution**: 
- Updated Supabase server client to properly await `cookies()` using `await cookies()`
- Implemented middleware for session management that correctly handles the cookie flow
- Created separate client/server Supabase utilities in `utils/supabase/`
- Added proper TypeScript types for cookie parameters to avoid `any` type errors

**Code Example**:
```typescript
// utils/supabase/server.ts
const cookieStore = await cookies()
// Proper async/await pattern for Next.js 15
```

**Learning**: Stay updated with framework API changes and understand the difference between client and server-side data fetching.

---

### Problem 3: Real-time Subscription Memory Leaks
**Issue**: Supabase real-time subscriptions, if not cleaned up properly, cause memory leaks. Initially, when navigating between pages or refreshing, multiple subscriptions were being created without cleanup, leading to duplicate bookmark displays and performance issues.

**Solution**:
- Implemented proper cleanup in `useEffect` return function
- Used Supabase's `removeChannel()` method to unsubscribe when component unmounts
- Filtered subscriptions by `user_id` for security and performance
- Set up channel with unique name to avoid conflicts

**Code Example**:
```typescript
useEffect(() => {
  const channel = supabase.channel('bookmarks-changes')
    .on('postgres_changes', { /* config */ }, callback)
    .subscribe()
  
  return () => {
    supabase.removeChannel(channel) // Cleanup on unmount
  }
}, [userId])
```

**Learning**: Always clean up subscriptions, event listeners, and side effects in React components to prevent memory leaks.

---

### Problem 4: Google OAuth Redirect URI Configuration
**Issue**: Google OAuth requires exact matches for redirect URIs. Initially faced "redirect_uri_mismatch" errors because:
- The URIs in Google Console didn't match Supabase's expected callback URL
- Needed different URIs for local development vs. production
- Confusion between "Authorized JavaScript origins" and "Authorized redirect URIs"

**Solution**:
- Documented exact redirect URI format required by Supabase
- Added **both** development and production URLs:
  - `https://[project-id].supabase.co/auth/v1/callback` (Supabase)
  - `http://localhost:3000/auth/callback` (local dev)
- Understood that JavaScript origins need base URL only, while redirect URIs need full callback path
- Created callback route at `app/auth/callback/route.ts` to handle OAuth response

**Learning**: OAuth is strict about URL matching - even trailing slashes matter. Always configure both development and production URLs.

---

### Problem 5: Row Level Security (RLS) Policy Implementation
**Issue**: Without proper RLS policies, users could potentially see each other's bookmarks. Initial database setup didn't enforce user-specific data access, creating a security vulnerability.

**Solution**:
- Enabled Row Level Security on the `bookmarks` table
- Created three specific policies:
  1. **SELECT policy**: Users can only view their own bookmarks using `auth.uid() = user_id`
  2. **INSERT policy**: Users can only insert bookmarks with their own user_id
  3. **DELETE policy**: Users can only delete their own bookmarks
- Used `auth.uid()` function in policies to automatically get the authenticated user's ID
- Tested by creating multiple accounts to verify isolation

**SQL Example**:
```sql
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);
```

**Learning**: Never rely on client-side checks for security. Database-level RLS policies provide true data isolation and security.

---

## 💡 Additional Challenges Overcome

- **TypeScript Strict Mode**: Fixed implicit `any` types in cookie handling functions
- **Build Optimization**: Resolved webpack cache warnings during production builds
- **Environment Variables**: Properly configured `.env.local` vs `.env.example` for security
- **Middleware Route Protection**: Implemented proper authentication checks before allowing access to protected routes

---

## 📁 Project Structure

```
├── app/
│   ├── auth/callback/      # OAuth callback route
│   ├── login/              # Login page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (dashboard)
├── components/
│   ├── AddBookmarkForm.tsx # Form to add bookmarks
│   ├── BookmarkList.tsx    # Display bookmarks with real-time updates
│   ├── GoogleSignInButton.tsx
│   └── SignOutButton.tsx
├── utils/supabase/
│   ├── client.ts           # Browser Supabase client
│   ├── server.ts           # Server Supabase client
│   └── middleware.ts       # Session management
├── middleware.ts           # Route protection
├── .env.local              # Environment variables (not in git)
└── package.json
```

## 🎨 Design Features

**Color Scheme:**
- **Primary Colors**: Blue gradients (#0ea5e9 → #0c4a6e) for main UI elements
- **Accent Colors**: Purple gradients (#d946ef → #701a75) for highlights
- **Backgrounds**: Soft gradient overlays (from-primary-50 via-white to-accent-50)
- **Cards**: Clean white backgrounds with subtle shadows and colored borders

**UI/UX Highlights:**
- Smooth hover animations and transitions
- Gradient buttons with shadow effects
- Custom scrollbar styling
- Loading spinner for better UX
- Empty state with helpful message
- Responsive layout that works on mobile and desktop
- Clean, modern typography using Inter font
- Accessible color contrasts

**Component Design:**
- Login page with centered card design and gradient background
- Dashboard with multiple card sections for organization
- Bookmark items with hover effects and delete buttons
- Form inputs with focus states and validation
- Consistent spacing and padding throughout

---

## 📚 How to Use This Project

### For Evaluators:
1. Visit the live Vercel URL (provided in submission)
2. Click "Continue with Google" to sign in
3. Add a few bookmarks with URLs and titles
4. Open the same URL in another browser tab
5. Add a bookmark in one tab - watch it appear instantly in the other tab (real-time!)
6. Delete bookmarks using the trash icon
7. Sign out and try with a different Google account - bookmarks are private

### For Developers:
1. Clone this repository
2. Follow the setup instructions above
3. Configure your own Supabase project and Google OAuth
4. Run locally and modify as needed

---

## 📄 License

This project was built for the Abstrait Micro Challenge Assignment and is available for educational purposes.

---

## 👨‍💻 Developer Contact

**Jay Joshi**

- **Email**: [joshijayy421@gmail.com](mailto:joshijayy421@gmail.com)
- **Phone**: +91 8875549960
- **LinkedIn**: [https://www.linkedin.com/in/jay-joshi](https://www.linkedin.com/in/jay-joshi)
- **GitHub**: [https://github.com/jayyx3](https://github.com/jayyx3)
- **Portfolio**: [https://jay-portfolio-ten-tawny.vercel.app/](https://jay-portfolio-ten-tawny.vercel.app/)

---

Built with ❤️ using Next.js, Supabase, and Tailwind CSS
