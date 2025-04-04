import { $ } from 'bun';
import { parseArgs } from 'util';
import yocto from "yocto-spinner";
import { generateSalt, hashText } from './src/lib/utils';
import { WranglerConfig } from './src/interfaces/wrangler-config';
import config from './wrangler.toml';
import { Settings } from './src/enums/settings';

const wranglerConfig = config as WranglerConfig;
const { values: { remote = false } } = parseArgs({
  args: Bun.argv,
  options: { remote: { type: 'boolean' } },
  strict: true,
  allowPositionals: true,
});

const remoteFlag = remote ? '--remote' : '';

if (remote && !wranglerConfig.env?.production?.d1_databases?.length) {
  console.error('d1_databases PRODUCTION binding not found in wrangler.toml.');
  process.exit(1);
}

if (!wranglerConfig.d1_databases?.length) {
  console.error('d1_databases binding not found in wrangler.toml.');
  process.exit(1);
}

const dbName = remote
  ? wranglerConfig.env?.production?.d1_databases?.[0]?.database_name
  : wranglerConfig.d1_databases?.[0]?.database_name;

const envVars = remote && wranglerConfig.env?.production?.vars
  ? wranglerConfig.env.production.vars
  : wranglerConfig.vars;

const { ADMIN_EMAIL, ADMIN_PASSWORD, EMAIL_FORWARD_TO } = envVars;

const spinner = yocto({ text: 'Applying database migrations' }).start();

await $`wrangler d1 migrations apply ${dbName} ${remoteFlag}`.text();
spinner.success(' Database migrations applied.');

spinner.start(' Creating admin user');
const userQuery = await $`wrangler d1 execute ${dbName} --command "SELECT * FROM users WHERE email = '${ADMIN_EMAIL}'" --json ${remoteFlag}`.text();
const existingUser = JSON.parse(userQuery)[0]?.results;

if (existingUser?.length) {
  spinner.start().info(' Admin user already exists.');
} else {
  const salt = generateSalt();
  const hashedPassword = hashText(ADMIN_PASSWORD, salt);
  await $`wrangler d1 execute ${dbName} --command "INSERT INTO users (email, password, salt, isAdmin) VALUES ('${ADMIN_EMAIL}', '${hashedPassword}', '${salt}', true)" ${remoteFlag}`.text();
  spinner.success(' Admin user created.');
}

spinner.start(' Creating default settings');
const settingQuery = await $`wrangler d1 execute ${dbName} --command "SELECT * FROM settings WHERE key = '${Settings.EMAIL_FORWARD_TO}'" --json ${remoteFlag}`.text();
const existingSetting = JSON.parse(settingQuery)[0]?.results;

if (existingSetting?.length) {
  spinner.start().info(' Default settings already exists.');
} else {
  await $`wrangler d1 execute ${dbName} --command "INSERT INTO settings (key, value, description) VALUES ('${Settings.EMAIL_FORWARD_TO}', '${EMAIL_FORWARD_TO}', 'Default email address to forward emails to')" ${remoteFlag}`.text();
  spinner.success(' Default settings created.');
}

spinner.start().success(' Done');
