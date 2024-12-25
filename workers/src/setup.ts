import {$} from 'bun';
import {parseArgs} from "util";
import {generateSalt, hashText} from "./lib/utils";
import {WranglerConfig} from "./interfaces/wranglerConfig";

const configFile = Bun.file('./wrangler.toml');
const fileExists = await configFile.exists();
if (!fileExists) {
  console.error('wrangler.toml file not found.');
  process.exit(1);
}

const {values} = parseArgs({
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

// @ts-expect-error Bypass error
import config from '../wrangler.toml';

const wranglerConfig = config as WranglerConfig;
if (!Array.isArray(wranglerConfig.d1_databases) || wranglerConfig.d1_databases.length === 0) {
  console.error('d1_databases binding not found in wrangler.toml.');
  process.exit(1);
}

console.log('Applying database migrations...');
await $`wrangler d1 migrations apply ${wranglerConfig.d1_databases[0].database_name} ${isRemote ? '--remote' : ''}`.text();
console.log('Database migrations applied.');

console.log('Creating admin user...');
const existsQueryResultRaw = await $`wrangler d1 execute ${wranglerConfig.d1_databases[0].database_name} --command "SELECT * FROM users WHERE email = '${wranglerConfig.vars.ADMIN_EMAIL}'" --json ${isRemote ? '--remote' : ''}`.text();
const existsQueryResult = JSON.parse(existsQueryResultRaw);

if (Array.isArray(existsQueryResult) && existsQueryResult[0].results.length > 0) {
  console.log('Admin user already exists.');
  process.exit(0);
}

const salt = generateSalt();
const hashedPassword = hashText(wranglerConfig.vars.ADMIN_PASSWORD, salt);
await $`wrangler d1 execute ${wranglerConfig.d1_databases[0].database_name} --command "INSERT INTO users (email, password, salt, isAdmin) VALUES ('${wranglerConfig.vars.ADMIN_EMAIL}', '${hashedPassword}', '${salt}', true)" ${isRemote ? '--remote' : ''}`.text();

console.log('Admin user created.');
