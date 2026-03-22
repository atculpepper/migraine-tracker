# Migraine Tracker — Setup & Deployment Guide

Everything you need to go from zero to live app. Should take about 20–30 minutes.

---

## Prerequisites

- Node.js installed (https://nodejs.org — download the LTS version)
- Your GitHub account
- A code editor (VS Code recommended: https://code.visualstudio.com)

---

## Step 1 — Install dependencies locally

Open a terminal in the `migraine-tracker` folder and run:

```bash
npm install
```

---

## Step 2 — Create your Supabase project

1. Go to https://supabase.com
2. Click **Start your project** → sign in with GitHub
3. Click **New Project**
4. Fill in:
   - **Name:** migraine-tracker
   - **Database password:** choose something strong (save it!)
   - **Region:** pick the one closest to you
5. Click **Create new project** — wait about 2 minutes for it to spin up

---

## Step 3 — Set up the database

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Open the file `supabase-schema.sql` from this project
4. Copy the entire contents and paste it into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

---

## Step 4 — Enable GitHub & Google login in Supabase

**For GitHub login:**
1. In Supabase: go to **Authentication → Providers → GitHub**
2. Toggle it **on**
3. You'll need a GitHub OAuth App:
   - Go to https://github.com/settings/developers → **OAuth Apps → New OAuth App**
   - Application name: `Migraine Tracker`
   - Homepage URL: `http://localhost:5173` (update later after deploy)
   - Authorization callback URL: copy this from the Supabase GitHub provider page
   - Click **Register application**, then copy the **Client ID** and generate a **Client Secret**
4. Paste both back into Supabase and click **Save**

**For Google login (optional):**
1. In Supabase: go to **Authentication → Providers → Google**
2. Follow the on-screen instructions to create a Google OAuth app

---

## Step 5 — Get your Supabase API keys

1. In Supabase: go to **Settings → API**
2. Copy:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon / public key** (long string starting with `eyJ...`)

---

## Step 6 — Configure your local environment

1. In the project folder, copy `.env.example` to a new file called `.env.local`
2. Fill it in with your values:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Step 7 — Run the app locally

```bash
npm run dev
```

Open http://localhost:5173 in your browser. You should see the login screen!

Test logging in with GitHub and adding an entry. If it works locally, you're ready to deploy.

---

## Step 8 — Push to GitHub

1. Go to https://github.com/new and create a new **private** repository called `migraine-tracker`
2. In your terminal, inside the project folder:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/migraine-tracker.git
git push -u origin main
```

---

## Step 9 — Deploy to Vercel

1. Go to https://vercel.com → sign in with GitHub
2. Click **Add New → Project**
3. Find and import your `migraine-tracker` repository
4. Before clicking Deploy, click **Environment Variables** and add:
   - `VITE_SUPABASE_URL` → your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` → your Supabase anon key
5. Click **Deploy**
6. Wait ~1 minute — Vercel will give you a live URL like `https://migraine-tracker-abc123.vercel.app`

---

## Step 10 — Update your GitHub OAuth callback URL

Now that you have a live URL, update GitHub so login works on the deployed app:

1. Go to https://github.com/settings/developers → your OAuth App
2. Update **Homepage URL** to your Vercel URL
3. The **Authorization callback URL** stays the same (it points to Supabase)

Also update Supabase:
1. Supabase → **Authentication → URL Configuration**
2. Add your Vercel URL to **Redirect URLs**

---

## You're live! 🎉

Share the Vercel URL with your family/friends. They can log in with GitHub or Google and their data is completely private to them.

---

## Updating the app later

Whenever you make changes:

```bash
git add .
git commit -m "describe your change"
git push
```

Vercel automatically redeploys on every push to `main`. Usually live within 60 seconds.

---

## Troubleshooting

**"Invalid API key" error** → double-check your `.env.local` values match Supabase exactly

**Login redirects to wrong place** → make sure your Vercel URL is in Supabase's Redirect URLs

**Data not saving** → check the Supabase SQL ran successfully (Table Editor → entries table should exist)

**White screen on load** → open browser DevTools (F12) → Console tab for error details
