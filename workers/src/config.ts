export class Configuration {
  public readonly discordHookUrl: string;
  public readonly emailForwardTo: string;
  public readonly geminiKey: string;
  public readonly jwtSecret: string;
  public readonly adminEmail: string;
  public readonly adminPassword: string;

  constructor(env: Env) {
    this.discordHookUrl = env.DISCORD_HOOK_URL;
    this.emailForwardTo = env.EMAIL_FORWARD_TO;
    this.geminiKey = env.GEMINI_KEY;
    this.jwtSecret = env.JWT_SECRET;
    this.adminEmail = env.ADMIN_EMAIL;
    this.adminPassword = env.ADMIN_PASSWORD;
  }
}
