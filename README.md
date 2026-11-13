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
