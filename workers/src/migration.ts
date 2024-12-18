import {parseArgs} from "util";
import {$} from "bun";

const {values} = parseArgs({
  args: Bun.argv,
  options: {
    action: {
      type: 'string',
    },
    db: {
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
  const output = values.action === 'create'
    ? await $`wrangler d1 migrations ${values.action} ${values.db} ${values.name} ${values.remote ? '--remote' : ''}`.text()
    : await $`wrangler d1 migrations ${values.action} ${values.db} ${values.remote ? '--remote' : ''}`.text();

  console.log(output);

  // @ts-expect-error Avoid ts error
} catch (err: Error) {
  console.log(`Failed with code ${err.exitCode}`);
  console.log(err.stdout.toString());
  console.log(err.stderr.toString());
}
