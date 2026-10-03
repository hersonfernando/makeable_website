# Makeable.IO Information Technology Solutions

A responsive Vue 3 website for a technology startup specializing in cloud, network infrastructure, IT consulting, and information systems. Built with Vite, with a custom SVG infrastructure illustration, service detail dialogs, solution filters, and a project inquiry form.

## Run locally

```sh
npm install
npm run dev
```

Visit `http://127.0.0.1:5173/` after Vite starts.

### Use `http://makeable.test/` with Herd

Open Herd, then run `npm run dev` and visit `http://makeable.test/`.
Herd forwards this address to Vite on port 5173, so keep both running.
On Windows, Vite polls for file changes to avoid crashes when new assets are temporarily locked while being copied.

To register the proxy on another machine, run this once with Herd open:

```powershell
herd proxy makeable http://127.0.0.1:5173
```

If Windows does not resolve the address after registration, run this in the
project terminal and approve the Windows administrator prompt:

```sh
npm run setup:domain
```

This adds `127.0.0.1 makeable.test` to the local Windows hosts file,
clears the DNS cache, and verifies the address resolves to this computer.
If setup fails, its error is recorded in `.playwright/domain-setup.log`.
If Windows denies access to the hosts file after administrator approval,
check whether security software blocked the change and allow that specific
edit. The site is also available at `http://127.0.0.1:5173/` while Vite runs.
The `.test` address is for this computer's local development environment.

## Production

```sh
npm run build
npm start
```

Deploy the project to a host that runs Node.js 20.19 or newer. Install dependencies, build the website, configure the SMTP environment variables, and run `npm start`. The server serves `dist` and handles `/api/contact` on the same origin. A static-only deployment cannot deliver inquiries. `npm run preview` also supports the contact endpoint for local build checks.

Set `PORT` and `HOST` for your host as needed. If you run behind a reverse proxy, set `TRUST_PROXY_HOPS` to the number of trusted proxy hops so the inquiry rate limit can distinguish visitors. The default trusts no proxy headers. The rate limit is held in memory per server process; use shared rate limiting when running multiple instances.

## Contact configuration

The inquiry form sends directly to `makeable.io@gmail.com` by default, without opening the visitor's email application. Copy `.env.example` to `.env` and set `SMTP_PASS` to the sending account's [Google app password](https://support.google.com/accounts/answer/185833). App passwords require 2-Step Verification. Restart the development or production server after changing SMTP settings. Keep `.env` private; it is ignored by Git.

To use another SMTP provider, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` with that provider's settings. `SMTP_FROM` must be a permitted sender email address. Use `SMTP_SECURE=true` for port 465; for port 587, use `false` (STARTTLS is required). Set `CONTACT_EMAIL` to change the receiving inbox. Existing `VITE_CONTACT_EMAIL` configurations are still accepted as a fallback, but SMTP credentials must never use a `VITE_` prefix.

The endpoint validates and limits submissions, includes all project details in the email, and sets Reply-To to the visitor's address. The form shows confirmation only after SMTP accepts the receiving address. SMTP acceptance does not guarantee inbox placement. If sending fails or SMTP is not configured, the form keeps the visitor's details and shows an error so they can retry. Submissions are not stored in a database.

Run `npm test` for contact delivery, validation, failure, and rate-limit checks.

## Content and styling

Service descriptions, solution examples, and process content live in `src/App.vue`. The examples show potential solutions, not claimed customer projects. The colors, layout, animations, and mobile breakpoints are in `src/style.css`. The illustration is in `src/components/InfrastructureArt.vue`. All graphics are local SVG, PNG, or CSS.

The clients section features DOST-IX and NCMB 9. Their logos are stored locally in `public/clients` and keep their original colors and proportions. The DOST mark is from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:DOST_seal.svg), and the NCMB mark is from [NCMB's official website](https://ncr.ncmb.gov.ph/wp-content/uploads/2015/08/ncmb-logo.png).
