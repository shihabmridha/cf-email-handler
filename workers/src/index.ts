import hono from './http';
import email from './email';

// noinspection JSUnusedGlobalSymbols
export default {
  ...hono,
  ...email,
}