import { $ } from 'bun';
import { parseArgs } from 'util';
import yocto from 'yocto-spinner';
import { WranglerConfig } from './src/interfaces/wrangler-config';
import config from './wrangler.toml';

const wranglerConfig = config as WranglerConfig;
const { values: { action, name = '', remote = false } } = parseArgs({
  args: Bun.argv,
  options: {
    action: { type: 'string' },
    name: { type: 'string' },
    remote: { type: 'boolean', default: false },
  },
  strict: true,
  allowPositionals: true,
});

const spinner = yocto({ text: 'Applying database migrations' }).start();

async function runMigrations(): Promise<void> {
  if (!action || !['apply', 'create', 'list'].includes(action)) {
    throw new Error('Action must be one of: apply, create, list');
  }

  if (action === 'create' && name === '') {
    throw new Error('Please provide a name for the migration.');
  }

  const dbName = wranglerConfig.d1_databases[0].database_name;

  if (action === 'create') {
    if (remote) {
      await $`wrangler d1 migrations create ${dbName} ${name} --remote`.text();
    } else {
      await $`wrangler d1 migrations create ${dbName} ${name}`.text();
    }
    return;
  }

  if (action === 'apply') {
    if (remote) {
      await $`wrangler d1 migrations apply ${dbName} --remote`.text();
    } else {
      await $`wrangler d1 migrations apply ${dbName} --local`.text();
    }
    return;
  }

  if (remote) {
    await $`wrangler d1 migrations list ${dbName} --remote`.text();
  } else {
    await $`wrangler d1 migrations list ${dbName} --local`.text();
  }
}

try {
  await runMigrations();
  spinner.success('Database migrations applied.');

  if (action === 'create' && name) {
    const capitalizedName = name
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
      .replace(/^./, (char) => char.toUpperCase());

    const entityTemplate = `import {BaseEntity} from "./base";\n\nexport class ${capitalizedName}Entity extends BaseEntity {}`;
    const repositoryTemplate = `export class ${capitalizedName}Repository {\n\tprivate readonly DB: D1Database;\n\n\tconstructor(db: D1Database) {\n\t\tthis.DB = db;\n\t}\n}`;

    await Promise.all([
      Bun.write(`../entities/${name}.ts`, entityTemplate),
      Bun.write(`../repositories/${name.toLowerCase()}.ts`, repositoryTemplate),
    ]);
  }
} catch (err: unknown) {
  const error = err as { exitCode?: number; message?: string; stdout?: Buffer; stderr?: Buffer };
  spinner.error(`Failed with code ${error?.exitCode ?? 1}. Message: ${error?.message ?? String(err)}`);
  if (error?.stdout) console.log(error.stdout.toString());
  if (error?.stderr) console.log(error.stderr.toString());
  process.exit(error?.exitCode ?? 1);
}
