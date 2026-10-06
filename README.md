# CS Career, for new Computer Science students at Hormuud University

A static website (HTML, CSS, JavaScript only, no build step, no backend) that guides new Computer Science students: what CS is, the 7 programmes of the Faculty of Computer Science & IT, careers, learning roadmaps, free and paid resources, a "which department fits me?" quiz, and a contact page. Available in English, Somali and Arabic (right-to-left), with light and dark themes.

## Pages

- `index.html`: home (hero, what is CS, department cards, quiz, learning resources)
- `department.html?d=cs` (also `it`, `se`, `ds`, `ai`, `cy`, `iot`): one page per department, opened from the navbar dropdown or the cards
- `contact.html`: contact page
- `assets/student.webp`: the hero photo of the student, a transparent cutout (background removed) of `assets/student-original.webp`. To change the person, replace both files, or just `student.webp` with another cutout of the same 4:5 size, with the pointing hand at the left edge.
- Logo: the "CS career" wordmark with a cursor bar. It is plain HTML and CSS (`.logo` in `css/style.css`, markup in `js/core.js`), so it follows light and dark mode. `assets/favicon.svg` is the tab icon.
- `assets/hero-bg.svg`: the earlier illustrated hero art. It is no longer used on the page; keep or delete it.

## Edit your details

Open `js/data.js` and change `CONFIG`:

- `name`, `email`, `phone`, `whatsapp` (digits only)
- `linkedin` and `github`: replace `YOUR-USERNAME` with your real profile URL. The buttons stay hidden until you do.

Text in every language lives in `js/lang-en.js`, `js/lang-so.js`, `js/lang-ar.js`. Resource links are in `js/data.js` (`RESOURCES`).

## Run it locally

Just double-click `index.html`, or:

```bash
python -m http.server 5173
```

then open http://localhost:5173

## Host it

Everything uses relative paths, so it works from the root of a domain or from a sub-folder.

**On your own server (nginx):**

```nginx
server {
    listen 80;
    server_name guide.yourdomain.com;
    root /var/www/cs-guide;      # copy this whole folder here
    index index.html;
}
```

Then add HTTPS with `sudo certbot --nginx -d guide.yourdomain.com`.

**Free alternatives (any one is enough):**

- GitHub Pages: push the folder to a repository, then Settings → Pages → deploy from the main branch. Add your domain under "Custom domain" if you want.
- Netlify or Cloudflare Pages: drag and drop the folder, no setup.

**Custom domain:** point a `CNAME` record of `guide.yourdomain.com` to the host, or an `A` record to your server's IP.

## Orientation day tip

Make a QR code of the final URL (for example at https://www.qr-code-generator.com or any free QR tool), put it on your slide, and students can open the guide on their phones.

## Notes

- Department names come from hu.edu.so (Computer Science, Information Technology, Software Engineering, Data Science, Artificial Intelligence, Cybersecurity, Internet of Things).
- Fonts load from Google Fonts. Offline, the site falls back to system fonts and still works.
- Please re-check the resource links before the event, because websites sometimes move pages.
- Have a Somali and an Arabic speaker proofread the translations once.
