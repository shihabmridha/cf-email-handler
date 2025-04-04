export interface WranglerConfig {
  name: string;
  main: string;
  compatibility_flags: string[];
  compatibility_date: string;
  assets: { directory: string };
  workers_dev: boolean;
  routes: Array<{ pattern: string; custom_domain?: boolean }>;
  observability: { enabled: boolean };
  placement: { mode: string };
  d1_databases: Array<{
    binding: string;
    database_name: string;
    database_id: string;
    migrations_dir?: string;
  }>;
  vars: Env;
  env?: {
    production?: {
      d1_databases?: Array<{
        binding: string;
        database_name: string;
        database_id: string;
        migrations_dir?: string;
      }>;
      vars?: Env;
    };
  };
}
