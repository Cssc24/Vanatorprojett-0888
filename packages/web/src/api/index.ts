import type { RouterClient } from "@orpc/server";
import { createApp } from "./__core/app";
import { ping } from "./routes/ping";
import { auth } from "./auth";
import { exam } from "./routes/exam";
import { progress } from "./routes/progress";
import { catalog } from "./routes/catalog";
import { account } from "./routes/account";

// API features are oRPC procedures, one file per feature in ./routes/,
// composed into this router — typed end-to-end via the clients
// (web: src/web/lib/api.ts, mobile: lib/api.ts).
export const router = {
  ping,
  exam,
  progress,
  catalog,
  account,
};

export type AppRouter = typeof router;
/** Typed client for the router — used by the web and mobile api clients. */
export type AppRouterClient = RouterClient<AppRouter>;

const app = createApp(router);
app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));

export default app;
