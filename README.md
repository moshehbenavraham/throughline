# Continuum

Continuum is a calm habit tracker for building daily routines with streaks, reminders, insights, local backups, and optional Supabase cloud sync.

## Development

Install dependencies and start the Vite development server:

```sh
npm install
npm run dev
```

## Environment

Cloud sync uses Supabase. Set these values for local development and deployment:

```sh
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Google sign-in is handled through Supabase Auth provider settings.
