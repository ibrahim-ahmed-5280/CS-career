/* Create or reset a dashboard account. The password is asked for, never passed on the command line.
     npm run create-admin -- admin@example.com "Full Name" [viewer] */
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDb } from "../src/db.js";
import { Admin } from "../src/models/index.js";

const [email, name = "", role = "admin"] = process.argv.slice(2);
if (!email || !/^\S+@\S+\.\S+$/.test(email) || !["admin", "viewer"].includes(role)) {
  console.error('Usage: npm run create-admin -- <email> "<name>" [admin|viewer]');
  process.exit(1);
}

const password = process.env.ADMIN_PASSWORD || await (async () => {
  const rl = createInterface({ input: stdin, output: stdout });
  const p = await rl.question("Password (at least 10 characters): ");
  rl.close();
  return p;
})();
if (password.length < 10) { console.error("Password must be at least 10 characters."); process.exit(1); }

await connectDb();
await Admin.findOneAndUpdate(
  { email: email.toLowerCase() },
  { name, role, passwordHash: await bcrypt.hash(password, 12) },
  { upsert: true }
);
console.log(`Account ready: ${email} (${role})`);
await mongoose.disconnect();
process.exit(0);
