### Frontend

This UI is fully created with the help of generative AI.

### Environment configuration

- Use `.env.development` for local work (loaded by `next dev`).
- Use `.env.production` for builds (`bun run deploy` runs `next build` under the hood).
- Each file should expose the same `NEXT_PUBLIC_API_URL` key pointing to the correct backend for that environment.

Example:

```bash
# .env.development
NEXT_PUBLIC_API_URL=http://localhost:8787/api

# .env.production
NEXT_PUBLIC_API_URL=https://email.anotherdev.xyz/api
```

Next.js automatically picks the right file based on the `NODE_ENV`, so you no longer need to hand-edit the value before deploying.
