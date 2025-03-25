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
    remote: { type: 'boolean' }
  },
  strict: true,
  allowPositionals: true
});

const spinner = yocto({text: 'Applying database migrations'}).start();

try {
  if (action === 'create' && name === '') {
    throw new Error('Please provide a name for the migration.');
  }

  const dbName = wranglerConfig.d1_databases[0].database_name;
  const remoteFlag = remote ? '--remote' : '';

  await $`wrangler d1 migrations ${action} ${dbName} ${action === 'create' ? name : ''} ${remoteFlag}`.text();
  spinner.success(' Database migrations applied.');

  if (action === 'create') {
    const capitalizedName = name
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase()) // Replace special characters and capitalize next
      .replace(/^./, (char) => char.toUpperCase());

    const entityTemplate = `import {BaseEntity} from "./base";\n\nexport class ${capitalizedName}Entity extends BaseEntity {}`;
    const repositoryTemplate = `export class ${capitalizedName}Repository {\n\tprivate readonly DB: D1Database;\n\n\tconstructor(db: D1Database) {\n\t\tthis.DB = db;\n\t}\n}`;

    await Promise.all([
      Bun.write(`../entities/${name}.ts`, entityTemplate),
      Bun.write(`../repositories/${name.toLowerCase()}.ts`, repositoryTemplate)
    ]);
  }

  // @ts-expect-error - To ignore linting error
} catch (err: Error) {
  spinner.error(`Failed with code ${err?.exitCode}. Message: ${err?.message}`);
  console.log(err?.stdout?.toString());
  console.log(err?.stderr?.toString());
}
