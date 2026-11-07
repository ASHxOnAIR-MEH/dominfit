# Domainfit deployment guide

## Project folder

This folder is the Next.js project root. It contains `package.json`, `app/`, `components/`, and `public/`. Deploy this folder, or set it as the project root when importing a repository that contains the surrounding workspace.

## Vercel

1. Import the repository containing this project.
2. Set **Root Directory** to `outputs/domainfit-website` if the repository includes the whole workspace; use `.` if the repository contains only this folder's files.
3. Keep the detected Next.js framework settings. Vercel uses `npm ci` and `npm run build` from the lockfile and project scripts.
4. Use Node.js 20.9 or newer.
5. Add `ORIENTATION_WEBHOOK_URL` and, if needed, `ORIENTATION_WEBHOOK_TOKEN` in the project environment settings only when orientation requests should be sent to a live booking service. The endpoint must use HTTPS.
6. After deployment, connect `domainfit.in` in the hosting dashboard and apply its DNS instructions.

No webhook is required to build or deploy. Without one, the orientation form remains in preview mode and does not store or send visitor details.

## Other Node.js hosting

Run these commands from the project folder:

```sh
npm ci
npm run build
npm start
```

The production server binds to `0.0.0.0` and uses the host's `PORT` setting. Configure any booking secrets in the host's environment-variable settings; do not commit `.env.local` or production secrets.

## Before launch

- Replace generated concept photography with licensed, approved brand imagery. The team image is illustrative, not a verified staff portrait.
- Confirm prices, service inclusions, specialist roster, clinical copy, privacy notice, and contact details.
- Connect and verify the booking webhook if the live site should receive orientation requests.
- Check the deployed site on desktop and mobile after connecting the domain.
