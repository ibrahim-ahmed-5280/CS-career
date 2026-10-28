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

/* Reads a line without showing it (in a terminal); piped input is read as a normal line. */
async function askHidden(question) {
  if (!stdin.isTTY) {
    const rl = createInterface({ input: stdin });
    stdout.write(question);
    const [line = ""] = await rl[Symbol.asyncIterator]().next().then((r) => [r.value]);
    rl.close();
    stdout.write("\n");
    return line;
  }
  stdout.write(question);
  stdin.setRawMode(true);
  stdin.setEncoding("utf8");
  stdin.resume();
  return new Promise((resolve) => {
    let typed = "";
    const onData = (chunk) => {
      for (const c of chunk) {
        if (c === "\r" || c === "\n") {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off("data", onData);
          stdout.write("\n");
          return resolve(typed);
        }
        if (c === "\u0003") process.exit(130);                   // Ctrl+C
        if (c === "\u007f" || c === "\b") typed = typed.slice(0, -1);
        else typed += c;
      }
    };
    stdin.on("data", onData);
  });
}

const password = process.env.ADMIN_PASSWORD || await askHidden("Password (at least 10 characters, not shown): ");
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
