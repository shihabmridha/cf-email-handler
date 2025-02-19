## Cloudflare Email Handler
Send and route email for your domain using cloudflare.

### Roadmap
- [x] Email Handler (receives email)
- [x] Generate summary of the email using Gemini 2.0 API
- [x] Send summary to the discord server
- [x] Forward email to the user's destination email
- [ ] UI: Email Sending
- [ ] UI: Email Routing
- [ ] UI: Email SMTP/API Setup

### Supported email provider:
- [x] MailTrap
- [x] Resend

### Prerequisites
- [Bun](https://bun.sh)
- Cloudflare account with your domain configured.
- MailTrap/Resend account configured for your domain.
- Create a D1 database in Cloudflare.

### Installation
1. Clone the repository.
2. Go to `pages` and `workers` directory and run `bun install` to install dependencies.
3. Go back to root directory and run `bun build:pages` to build static asset for WebUI.
4. Go to `workers` folder and rename `wranger-example.toml` to `wrangler.toml` and fill in the values.
5. Run `bun cf-typegn` to generate types from `wrangler.toml`.
6. Run `bun setup` to execute db migration and create default user locally.
7. Run `bun dev` to start the server locally.

### Production:
Follow the same steps as above until step 5.
1. Run `bun setup --remote` to execute db migration and create default user in cloudflare.
2. Run `bun deploy` to deploy the worker to cloudflare.
