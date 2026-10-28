import { config } from "./config.js";
import { connectDb } from "./db.js";
import { createApp } from "./app.js";
import { Department } from "./models/index.js";
import { seed } from "../scripts/seed.js";

await connectDb();

// First run on an empty database: load the department content from docs/content
if (!(await Department.estimatedDocumentCount())) {
  console.log("Empty database: seeding content from docs/content …");
  await seed();
}

createApp().listen(config.port, "127.0.0.1", () => {
  console.log(`API listening on http://127.0.0.1:${config.port}`);
});
