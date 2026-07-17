# UWB Hacks 2026 Website — Static Archive

This is an **archived, static snapshot** of the UWB Hacks 2026 website
(originally https://uwbhacks.com), adapted to deploy on GitHub Pages.

The live site was a full-stack app (Google OAuth, PostgreSQL, AWS S3/SES,
Upstash Redis, server actions on Vercel). All of that server-side code has been
removed. What remains is only static content:

- Next.js (static export via `output: "export"`)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

Dynamic data that used to come from the database — the leaderboard, the
Hackeroon Shop prizes, and the dashboard's user info — is now served from a
hardcoded snapshot in [`src/data/archive.ts`](src/data/archive.ts). Replace the
placeholder values there with real end-of-event data if you have it.

Interactive, backend-dependent features (login, applications, check-in, account
deletion, judging, staff/admin tooling) have been removed or stubbed out so the
pages still render but perform no server calls.

---

## Getting Started

Make sure you have the `pnpm` package manager installed
(see https://pnpm.io/installation), then install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it. No `.env.local`
is required — the archive has no backend.

## Building the static site

```bash
pnpm run build
```

This emits a fully static site into the `out/` directory.

## Deployment (GitHub Pages)

Deployment is automated by
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): on every push to
`main` it builds the static export and publishes it to GitHub Pages.

To enable it, in the repository settings go to **Settings → Pages** and set the
source to **GitHub Actions**.

Because the site is served from a project subpath
(`https://<user>.github.io/<repo>/`), the workflow sets the `PAGES_BASE_PATH`
environment variable to the repo name so all asset URLs resolve correctly. If
you instead deploy to a custom domain or a user/org root site, remove that env
var (or leave it empty) and add a `CNAME` file to `public/`.

## Formatting

Before pushing, format your changes:

```bash
npx prettier --write .
```
