
## Configure

To configure, you need to create a .env.local file with the following lines:

```bash
SHOPIFY_ACCESS_TOKEN='<your-store-token>'
SHOPIFY_STORE_DOMAIN='https://<your-store-handle>.myshopify.com/admin/api/2025-01/graphql.json'
```

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

