import mongoose from "mongoose";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";

const DATA = fileURLToPath(new URL("../.data", import.meta.url));
const URI_FILE = fileURLToPath(new URL("../.data-uri", import.meta.url));

/* In development without MONGODB_URI, start an embedded MongoDB that keeps its
   data in server/.data, so nothing has to be installed to try the app. */
export async function connectDb() {
  let uri = config.mongoUri;
  if (!uri) {
    // Already started by another process (the dev server, or a script while it runs)?
    if (existsSync(URI_FILE)) {
      try {
        await mongoose.connect(readFileSync(URI_FILE, "utf8").trim(), { serverSelectionTimeoutMS: 1500 });
        return mongoose.connection;
      } catch { await mongoose.disconnect(); }
    }
    // One binary cache, whichever folder the server is started from
    process.env.MONGOMS_DOWNLOAD_DIR ||= fileURLToPath(new URL("../node_modules/.cache/mongodb-memory-server", import.meta.url));
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    mkdirSync(DATA, { recursive: true });
    const mem = await MongoMemoryServer.create({ instance: { dbPath: DATA, storageEngine: "wiredTiger" } });
    uri = mem.getUri("cscareer");
    writeFileSync(URI_FILE, uri);
    console.log("Using embedded MongoDB (development):", uri);
  }
  await mongoose.connect(uri);
  return mongoose.connection;
}
