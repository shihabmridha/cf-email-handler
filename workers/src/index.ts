import { parseEmail, processEmail } from './handlers/incoming-email';
import { Container } from './container';
import httpHandler from './api';

async function emailReceiver(message: ForwardableEmailMessage, env: Env, _ctx: ExecutionContext) {
  const parsedEmail = await parseEmail(message);

  const container = new Container(env);
  await processEmail(parsedEmail, container);
}

// Export the http and email handler for Cloudflare Workers
export default {
  ...httpHandler,
  email: emailReceiver,
};
