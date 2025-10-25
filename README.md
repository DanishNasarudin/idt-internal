This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API: public-navbar

This repository exposes an internal management API at `/api/public-navbar` used to manage the site's navigation items. The route supports GET, POST, PATCH and DELETE. The route expects an Authorization header and will only respond when the header matches the server environment variable `CLERK_SECRET_KEY` (the code currently checks `Authorization: Bearer ${process.env.CLERK_SECRET_KEY}`).

Summary

- Endpoint: `/api/public-navbar`
- Authentication: Header `Authorization: Bearer <SECRET>` (must equal server env `CLERK_SECRET_KEY`)
- Responses: JSON. Successful GET and PATCH (reorder) return `{ items, tree }` where `items` is a flat list and `tree` is a nested tree.

Example: Server-side (Node / server-to-server) GET

```js
// server-side (recommended)
const res = await fetch("https://your-domain.com/api/public-navbar", {
  headers: {
    Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
  },
});
const data = await res.json();
console.log(data);
```

Notes & Security

- The route implements a simple header check against `process.env.CLERK_SECRET_KEY`. Do not expose that secret to client-side/browser code. Prefer server-to-server calls (store the secret in environment variables on the server). If you must call from front-end code, create a server-side proxy endpoint that performs the call and hides the secret.
- The response includes both a flat `items` list and a nested `tree`. Use whichever shape you need. The server also tries to keep `order` values compact after updates/deletes.

Local testing

1. Create a `.env.local` (or use your local environment) with:

```
CLERK_SECRET_KEY=some-local-secret
```

2. Start the dev server and call the API from another service using the same secret in the Authorization header.

If you want a more robust production API, replace this header-check with a proper API key system or an authenticated service-to-service flow (e.g., OAuth2 client credentials, signed JWTs, or mutual TLS).
