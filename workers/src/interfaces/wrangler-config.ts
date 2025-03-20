export interface WranglerConfig {
  d1_databases: Array<
    {
      binding: string;
      database_name: string;
      database_id: string;
    }
  >,
  vars: Env
}
