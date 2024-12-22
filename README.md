<h1 align="center">RupeeRush</h1>

### ER Diagram

[here](https://claude.site/artifacts/f9363611-1200-485c-8531-41fda91c7aa8)

**STACK**

- Frontend & Backend : NextJS
- Webhook : NodeJS & Express
- Bank BE : Cloudflare Workers
- Bank FE : Vite
- Database : Postgres

**Folder Structure**

```
RupeeRush
    ├── apps
    │   └── user-app (Nextjs)
    |   ├── webhook  (Node/Express)
    |   └── bank-api (Hono worker)
    |   └── bank-page (Vite)
    ├── .lintstagedrc.js
    ├── .eslintignore
    ├── package.json
    ├── packages
    │   ├── eslint-config
    │   ├── typescript-config
    │   ├── zod-schema
    │   ├── store
    │   ├── ui
    │   └── db (prisma)
    ├── turbo.json
    └── README.md
```
