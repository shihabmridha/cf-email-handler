import hono from './api';
import email from './email';

export default {
  ...hono,
  ...email,
};
