import { $ } from 'bun';
import { parseArgs } from 'util';
import yocto from "yocto-spinner";
import { generateSalt, hashText } from './src/lib/utils';
import { WranglerConfig } from './src/interfaces/wrangler-config';
import config from './wrangler.toml';

const wranglerConfig = config as WranglerConfig;
const { values: { remote = false } } = parseArgs({
  args: Bun.argv,
  options: { remote: { type: 'boolean' } },
  strict: true,
  allowPositionals: true,
});

const remoteFlag = remote ? '--remote' : '';

if (!wranglerConfig.d1_databases?.length) {
  console.error('d1_databases binding not found in wrangler.toml.');
  process.exit(1);
}

const dbName = wranglerConfig.d1_databases[0].database_name;
const { ADMIN_EMAIL, ADMIN_PASSWORD } = wranglerConfig.vars;

const spinner = yocto({text: 'Applying database migrations'}).start();

await $`wrangler d1 migrations apply ${dbName} ${remoteFlag}`.text();
spinner.success(' Database migrations applied.');

spinner.start(' Creating admin user');
const userQuery = await $`wrangler d1 execute ${dbName} --command "SELECT * FROM users WHERE email = '${ADMIN_EMAIL}'" --json ${remoteFlag}`.text();
const existingUser = JSON.parse(userQuery)[0]?.results;

if (existingUser?.length) {
  spinner.start().info(' Admin user already exists.');
  process.exit(0);
}

const salt = generateSalt();
const hashedPassword = hashText(ADMIN_PASSWORD, salt);
await $`wrangler d1 execute ${dbName} --command "INSERT INTO users (email, password, salt, isAdmin) VALUES ('${ADMIN_EMAIL}', '${hashedPassword}', '${salt}', true)" ${remoteFlag}`.text();

spinner
  .success(' Admin user created.')
  .start()
  .success(' Done');
