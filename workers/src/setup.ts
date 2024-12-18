import {generateSalt, hashText} from "./lib/utils";

const configFile = Bun.file('./wrangler.toml');
const fileExists = await configFile.exists();

if (!fileExists) {
  console.error('wrangler.toml file not found.');
  process.exit(1);
}

// @ts-expect-error Bypass error
import config from '../wrangler.toml';
import {WranglerConfig} from "./interfaces/wrangler.config";
import {$} from 'bun';

const wranglerConfig = config as WranglerConfig;
if (!Array.isArray(wranglerConfig.d1_databases) || wranglerConfig.d1_databases.length === 0) {
  console.error('d1_databases binding not found in wrangler.toml.');
  process.exit(1);
}

const migrationOutput = await $`wrangler d1 migrations apply ${wranglerConfig.d1_databases[0].database_name}`.text();
console.log(migrationOutput);

const salt = generateSalt();
const hashedPassword = hashText(wranglerConfig.vars.ADMIN_PASSWORD, salt);
const createAdminOutput = await $`wrangler d1 execute ${wranglerConfig.d1_databases[0].database_name} --command "INSERT INTO users (email, password, salt, isAdmin) VALUES ('${wranglerConfig.vars.ADMIN_EMAIL}', '${hashedPassword}', '${salt}', true)"`.text();
console.log(createAdminOutput);
