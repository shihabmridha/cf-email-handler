import {parseArgs} from "util";
import {$} from "bun";
import {WranglerConfig} from "./interfaces/wrangler-config";

// @ts-expect-error Bypass error
import config from '../wrangler.toml';
const wranglerConfig = config as WranglerConfig;

const {values} = parseArgs({
  args: Bun.argv,
  options: {
    action: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    remote: {
      type: 'boolean',
    }
  },
  strict: true,
  allowPositionals: true,
});


try {
  if (values.action === 'create' && !values.name) {
    throw new Error('Please provide a name for the migration.');
  }

  const dbName = wranglerConfig.d1_databases[0].database_name;
  console.log(`Running migration for database ${dbName}`);
  const output = values.action === 'create'
    ? await $`wrangler d1 migrations ${values.action} ${dbName} ${values.name} ${values.remote ? '--remote' : ''}`.text()
    : await $`wrangler d1 migrations ${values.action} ${dbName} ${values.remote ? '--remote' : ''}`.text();

  console.log(output);

  if (values.action === 'create') {
    const capitalizedName = values.name!.charAt(0).toUpperCase() + values.name!.slice(1);
    await Bun.write(`./src/entities/${values.name}.ts`, `import {BaseEntity} from "./base";\n\nexport class ${capitalizedName}Entity extends BaseEntity {}`);

    const repositoryTemplate = `export class ${capitalizedName}Repository {\n\tprivate readonly DB: D1Database;\n\n\tconstructor(db: D1Database) {\n\t\tthis.DB = db;\n\t}\n}`;
    await Bun.write(`./src/repositories/${values.name!.toLowerCase()}.ts`, repositoryTemplate);
  }

  // @ts-expect-error Avoid ts error
} catch (err: Error) {
  console.log(`Failed with code ${err?.exitCode}. Message: ${err?.message}`);
  console.log(err?.stdout?.toString());
  console.log(err?.stderr?.toString());
}
