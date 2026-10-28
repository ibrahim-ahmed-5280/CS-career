import "dotenv/config";
import { fileURLToPath } from "node:url";

const isProd = process.env.NODE_ENV === "production";

export const config = {
  isProd,
  port: Number(process.env.PORT) || 4000,
  /* Empty in development: an embedded MongoDB is started instead (see db.js). */
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || (isProd ? "" : "dev-only-secret-change-me"),
  /* Folder with the built React app, served by Express in production. */
  clientDist: process.env.CLIENT_DIST || fileURLToPath(new URL("../../client/dist", import.meta.url))
};

if (isProd && (!config.mongoUri || !config.jwtSecret)) {
  throw new Error("MONGODB_URI and JWT_SECRET must be set in production");
}
