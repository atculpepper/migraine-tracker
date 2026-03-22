# migraine-tracker
simple web based migraine tracker


## Features

- **Daily logging** — answer two quick questions each day
  - Did you have a headache?
  - Did you have a migraine?
  - What medication did you take? (Triptan, Naproxen, or Nothing)
- **History view** — calendar heatmap showing your patterns at a glance
- **Insights dashboard** — charts and trends over time
- **Streak tracking** — see how many headache-free days in a row you've had
- **CSV export** — download all your data anytime
- **Secure login** — GitHub and Google OAuth via Supabase
- **Private data** — each user can only see their own entries

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Auth & Database | Supabase (Postgres + Row Level Security) |
| Hosting | Vercel |
| PWA | vite-plugin-pwa |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (LTS version)
- A [Supabase](https://supabase.com) account
- A [Vercel](https://vercel.com) account

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/atculpepper/migraine-tracker.git
   cd migraine-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables template:
   ```bash
   cp .env.example .env.local
   ```

4. Fill in your Supabase credentials in `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

5. Set up the database by running `supabase-schema.sql` in your Supabase SQL editor

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:5173](http://localhost:5173)

### Deployment

This app is deployed on Vercel. Any push to `main` triggers an automatic redeployment.

To deploy your own instance:
1. Import the repository into [Vercel](https://vercel.com)
2. Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables
3. Deploy

See `SETUP.md` for the full step-by-step deployment guide.

## Project Structure

```
migraine-tracker/
├── src/
│   ├── components/       # Layout, navigation
│   ├── hooks/            # useAuth, useEntries
│   ├── lib/              # Supabase client
│   ├── pages/            # Log, History, Analytics, Login
│   └── utils/            # Analytics calculations, CSV export
├── supabase-schema.sql   # Database schema + RLS policies
├── SETUP.md              # Full deployment guide
└── vercel.json           # Vercel routing config
```

## Privacy & Security

- All data is stored in a private Supabase Postgres database
- Row Level Security (RLS) ensures users can only access their own data
- Authentication is handled by Supabase Auth (GitHub / Google OAuth)
- No data is ever sold or shared

## License

Private — all rights reserved.
