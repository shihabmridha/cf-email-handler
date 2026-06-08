import { jwt } from 'hono/jwt';

export const JWT_ALGORITHM = 'HS256' as const;

export function createJwtAuth(secret: string) {
  return jwt({
    secret,
    alg: JWT_ALGORITHM,
  });
}
