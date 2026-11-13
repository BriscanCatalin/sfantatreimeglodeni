# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Automatic deployment

The GitHub Actions workflow in `.github/workflows/deploy.yml` deploys the site
to Cloudflare Workers whenever a commit is pushed to `main`. Before the first
push, add these repository secrets in **Settings → Secrets and variables →
Actions**:

- `CLOUDFLARE_API_TOKEN`: an account token with the **Edit Cloudflare Workers**
  permission.
- `CLOUDFLARE_ACCOUNT_ID`: the ID of the Cloudflare account that hosts the
  Worker.

The workflow installs dependencies, runs the tests, builds the site, and
deploys the prebuilt Worker. Do not put the API token in the repository.
The Worker name is defined in `wrangler.json` and should match the existing
Cloudflare Worker.

## Events and event manager setup

The public **Evenimente** page pins the permanent children's program (every
Saturday from 10:00 to 13:00) first, followed by dated events in newest-first
order. It also includes a special invitation for people with visual impairments
on 22 November 2026 and the Rugul Aprins event on 14 November 2026. New events
and uploaded images are stored in the `glodeni-events` Workers KV namespace.
`wrangler.json` binds it as `EVENTS_KV`. The namespace is
on the Workers Free plan: it includes up to 1 GB of storage and 1,000 writes
per day; requests beyond Free limits are rejected rather than billed.

The add-event page uses a password instead of Cloudflare Access so it does not
require a Zero Trust subscription or payment authorization. Before deployment,
add `EVENTS_ADMIN_PASSWORD` as a **secret** in Cloudflare Workers & Pages →
`tanstack-start-ts` → Settings → Variables and Secrets. Use a unique random
password with at least 32 characters, store it in a password manager, and do
not put it in this repository or share it in chat. The Worker creates an
eight-hour, signed `HttpOnly`, `SameSite=Strict` session cookie and requires
HTTPS in production.

The event form accepts JPEG, PNG, and WebP images up to 5 MB. When no local KV
binding is available, development uses temporary in-memory storage and those
local submissions disappear when the dev server restarts. Production events
and images persist in Workers KV.
