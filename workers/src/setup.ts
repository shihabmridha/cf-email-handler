import { $ } from 'bun';
import { parseArgs } from "util";
import { generateSalt, hashText } from "./lib/utils";
import { WranglerConfig } from "./interfaces/wrangler-config";

import config from '../wrangler.toml';
const wranglerConfig = config as WranglerConfig;

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    remote: {
      type: 'boolean',
    }
  },
  strict: true,
  allowPositionals: true,
});

const isRemote = values.remote ?? false;

if (!Array.isArray(wranglerConfig.d1_databases) || wranglerConfig.d1_databases.length === 0) {
  console.error('d1_databases binding not found in wrangler.toml.');
  process.exit(1);
}

console.log('Applying database migrations...');
const dbName = wranglerConfig.d1_databases[0].database_name;
await $`wrangler d1 migrations apply ${dbName} ${isRemote ? '--remote' : ''}`.text();
console.log('Database migrations applied.');

console.log('Creating admin user...');
const existsQueryResultRaw = await $`wrangler d1 execute ${dbName} --command "SELECT * FROM users WHERE email = '${wranglerConfig.vars.ADMIN_EMAIL}'" --json ${isRemote ? '--remote' : ''}`.text();
const existsQueryResult = JSON.parse(existsQueryResultRaw);

if (Array.isArray(existsQueryResult) && existsQueryResult[0].results.length > 0) {
  console.log('Admin user already exists.');
  process.exit(0);
}

const salt = generateSalt();
const hashedPassword = hashText(wranglerConfig.vars.ADMIN_PASSWORD, salt);
await $`wrangler d1 execute ${dbName} --command "INSERT INTO users (email, password, salt, isAdmin) VALUES ('${wranglerConfig.vars.ADMIN_EMAIL}', '${hashedPassword}', '${salt}', true)" ${isRemote ? '--remote' : ''}`.text();

console.log('Admin user created.');
