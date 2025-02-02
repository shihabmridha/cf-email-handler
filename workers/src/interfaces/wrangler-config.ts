export interface WranglerConfig {
  d1_databases: Array<
    {
      binding: string;
      database_name: string;
      database_id: string;
    }
  >,
  vars: {
    DISCORD_HOOK_URL: string;
    EMAIL_FORWARD_TO: string;
    AI_ENDPOINT: string;
    JWT_SECRET: string;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
  }
}
