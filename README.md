# Hafiz Muhammad Hassan Mustafa Portfolio

Personal portfolio web app built with React, TypeScript, Vite, Tailwind, shadcn/ui, and Supabase.

## Features

- Public portfolio sections: Hero, About, Engineering Services, Experience, Projects, Research, Team, Certificates, Blog, Contact
- Admin dashboard for managing content, including dynamic Blog and Services editors
- Supabase Auth for admin login
- Supabase database-backed content with real-time updates
- Responsive design and animated UI

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui + Radix UI
- Supabase
- React Query
- Framer Motion
- Vitest + Testing Library
- Playwright

## Requirements

- Node.js 18+ (recommended)
- npm 9+ (or compatible)

## Local Setup

1. Clone the repository
2. Open the project directory
3. Install dependencies

Commands:

npm install

4. Apply the Supabase migrations to the connected project

Commands:

npx supabase db push

## Environment Variables

Create a .env file in the project root and set:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_FORMSPREE_FORM_ID=your_formspree_form_id
ADMIN_SECRET=long_random_admin_secret
JWT_SECRET=long_random_jwt_secret

Notes:

- The app can fall back to a default Formspree form id, but using VITE_FORMSPREE_FORM_ID is recommended.
- Keep .env out of version control.

## Available Scripts

Development:

- npm run dev
	Starts the Vite dev server with HMR.

Production Build:

- npm run build
	Builds optimized production files into the dist folder.

Build (development mode):

- npm run build:dev
	Builds using Vite development mode.

Preview Production Build Locally:

- npm run preview
	Serves the built dist output locally so you can test production behavior.

Lint:

- npm run lint
	Runs ESLint across the project.

Run Tests:

- npm run test
	Executes Vitest test suite once.

Test Watch Mode:

- npm run test:watch
	Runs Vitest in watch mode.

## Recommended Local Workflow

For day-to-day local changes:

1. npm run dev
2. Make your code changes
3. npm run lint
4. npm run test
5. npm run build
6. npm run preview

Why build + preview matters:

- Catches production-only issues (routing, lazy loading, env usage, asset paths)
- Validates the exact output that will be deployed

## Project Structure

- src/components: Public sections and shared UI
- src/components/admin: Admin content management panels
- src/hooks: Auth, portfolio data, utility hooks
- src/integrations/supabase: Supabase client and generated DB types
- src/pages: Route-level pages
- supabase/migrations: Database schema migrations
- scripts: SQL helper scripts

## Deploy

This project includes Vercel configuration.

Basic deploy flow:

1. Push changes to your repository
2. Import project in Vercel
3. Set environment variables in Vercel
4. Deploy

Important:

- Ensure SPA rewrites are active (already configured in vercel.json)
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in deployment environment

## Troubleshooting

If npm run dev fails:

- Delete node_modules and reinstall dependencies
- Confirm Node.js version is compatible

If contact form does not submit:

- Check VITE_FORMSPREE_FORM_ID value
- Inspect browser network request for Formspree response
- Disable strict privacy extensions and retest

If admin login fails:

- Confirm Supabase auth is enabled
- Verify URL and publishable key in .env

If production works differently from dev:

- Always run npm run build then npm run preview and test again locally

## License

Private portfolio project. Update this section if you want to add an open-source license.
