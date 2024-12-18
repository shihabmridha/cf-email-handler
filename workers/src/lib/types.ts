import { Context } from "hono";

export type ApiContext = Context<{ Bindings: CloudflareBindings }>;
