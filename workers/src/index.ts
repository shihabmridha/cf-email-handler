import hono from './api';
import email from './email';

// noinspection JSUnusedGlobalSymbols
export default {
  ...hono,
  ...email,
};
