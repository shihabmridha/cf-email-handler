import {parseArgs} from "util";
import {$} from "bun";
import {WranglerConfig} from "./interfaces/wrangler.config";

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
  const dbName = wranglerConfig.d1_databases[0].database_name;
  const output = values.action === 'create'
    ? await $`wrangler d1 migrations ${values.action} ${dbName} ${values.name} ${values.remote ? '--remote' : ''}`.text()
    : await $`wrangler d1 migrations ${values.action} ${dbName} ${values.remote ? '--remote' : ''}`.text();

  console.log(output);

  // @ts-expect-error Avoid ts error
} catch (err: Error) {
  console.log(`Failed with code ${err.exitCode}`);
  console.log(err.stdout.toString());
  console.log(err.stderr.toString());
}
