# CS Career, for Computer Science students at Hormuud University

A MERN app (MongoDB, Express, React, Node.js) that guides students who are already in one of the 7 departments of the Faculty of Computer Science & IT:

- **Tracks:** each department has 5–7 tracks (for example Backend & APIs, SOC & Blue Team, Edge AI). Each track has a guide: a day in the job, how AI is changing the work, a three-level roadmap, projects, free and paid resources, certifications and careers.
- **Track quiz:** 12 statements and 3 level questions per department. The server scores the answers, shows the student's best tracks with the reasons, and saves the result.
- **Admin dashboard** (`/admin`): where students are, their best-match tracks, starting levels, every student's answers, CSV export, and editors for the track content and quiz questions.
- The general "Which department fits me?" quiz for new students stays at `/quiz`.

English, Somali and Arabic (right-to-left), with light and dark themes. Track content starts in English; staff translate it from the admin.

## Project layout

```
client/          React app (Vite): public pages and the admin dashboard
  src/i18n/      Interface text in en / so / ar (tracks.js holds the track and quiz text)
  src/data.js    Contact details (CONFIG), department list, department resources
  public/assets/ Images
server/          Express API + MongoDB (Mongoose)
  src/models/    Department, Track, Question, Student, Attempt, Admin
  src/routes/    public.js (pages, quiz) and admin.js (dashboard, editing)
  scripts/       seed.js (load docs/content into the database), create-admin.js
docs/content/    The reviewed content drafts the database is seeded from
deploy/          Server setup, nginx and the auto-update script
design/          Logo options and source images (not served)
```

## Run it on your computer

You need Node.js 20 or newer. MongoDB is optional: without `MONGODB_URI`, the server starts an embedded MongoDB that keeps its data in `server/.data` (the first start downloads it, about 600 MB).

```bash
npm run install:all
```

```bash
npm run dev:api
```

```bash
npm run dev:web
```

Open http://localhost:5173. On the first start the database is filled from `docs/content/`.

Create a dashboard account (you will be asked for a password of at least 10 characters), then sign in at http://localhost:5173/admin:

```bash
npm --prefix server run create-admin -- you@example.com "Your Name"
```

Add `viewer` at the end for an account that can see data but not edit content.

Tests for the quiz scoring:

```bash
npm test
```

## Content

- Track pages and quiz questions live in MongoDB and are edited in the admin (**Tracks** and **Quiz questions**). Pages not reviewed for 6 months are flagged there.
- `docs/content/*-draft.md` is the starting content. `npm run seed` adds anything missing and keeps admin edits; `npm run seed -- --force` overwrites the English track text and quiz questions with the files.
- Department overviews (fields, prerequisites, department roadmap) and the interface text are in `client/src/i18n/`. Contact details are in `client/src/data.js` (`CONFIG`).
- Changing quiz questions starts a new quiz version; old answers stay stored with their version.

## Privacy

Before the quiz, students give their name and student ID (phone, email and class are optional) and tick a consent box. Only signed-in staff can see this data. Passwords are hashed with bcrypt, the session cookie is HTTP-only, and logins and quiz submissions are rate-limited.

## Put it online

The server at `cscareer.onepercenttech.com` runs the Node app behind nginx with HTTPS, and pulls `master` from GitHub every 30 seconds (install, build, restart).

1. Push to `master`, then run the one-time setup from this folder (it asks for the root password twice):

   ```bash
   bash deploy/deploy.sh
   ```

   It installs Node.js and MongoDB on the server (MongoDB only listens on the server itself), creates `/etc/cscareer.env` with a random `JWT_SECRET`, builds the app and switches nginx to it. To use MongoDB Atlas instead, put its address in `MONGODB_URI` in `/etc/cscareer.env` before running the script.
2. Create a dashboard account on the server (it asks for the root password, then the new account's password):

   ```bash
   ssh -t root@104.237.2.66 "cd /opt/cscareer/server && set -a && . /etc/cscareer.env && npm run create-admin -- you@example.com 'Your Name'"
   ```

After that, every push to `master` goes live within about a minute.

Old links (`department.html?d=cs`, `quiz.html`, `contact.html`) redirect to the new pages, so printed QR codes keep working.

## Notes

- Department names come from hu.edu.so.
- Check the resource links in the track guides before each semester, because websites move pages.
- Have a Somali and an Arabic speaker proofread the translations once.
