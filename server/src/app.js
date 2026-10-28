import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { existsSync } from "node:fs";
import path from "node:path";
import { config } from "./config.js";
import { publicRouter } from "./routes/public.js";
import { adminRouter } from "./routes/admin.js";

export function createApp() {
  const app = express();
  app.set("trust proxy", 1);   // behind nginx: real client IP for rate limits
  app.disable("x-powered-by");

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
        "font-src": ["'self'", "data:", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
        "img-src": ["'self'", "data:", "https://cdn.jsdelivr.net"],
        "connect-src": ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false
  }));
  app.use(express.json({ limit: "200kb" }));
  app.use(cookieParser());

  app.use("/api", (req, res, next) => { res.set("Cache-Control", "no-store"); next(); });
  app.use("/api", publicRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

  // Production: serve the built React app; every other path is a page of the app.
  if (existsSync(config.clientDist)) {
    app.use(express.static(config.clientDist, { index: false, maxAge: "1h" }));
    app.get(/^(?!\/api\/).*/, (req, res) => res.sendFile(path.join(config.clientDist, "index.html")));
  }

  app.use((err, req, res, next) => {
    console.error(err);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({ error: err.expose ? err.message : "Something went wrong. Please try again." });
  });
  return app;
}
