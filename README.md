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

Install dependencies, build the website, and deploy the `dist` folder to a static host. Alternatively, use a host that runs Node.js 20.19 or newer and run `npm start` to serve `dist`. Use `npm run preview` for local build checks.

Set `PORT` and `HOST` for your host as needed when using `npm start`.

## Contact configuration

The inquiry form lets visitors open their default email app using a `mailto:` link or choose “Open in Gmail” to open Gmail in a new browser tab, addressed to `makeable.io@gmail.com`. Both options include their name, email address, optional company, selected service, and project description in the subject and message. The visitor reviews the draft and sends it from their email account.

To change the recipient, set `VITE_CONTACT_EMAIL` in `.env`, then restart the development server or rebuild for production. This address is public in the website's client code. No SMTP settings or email delivery server are required.

The form validates the required fields before preparing a draft. It keeps the visitor's details so they can edit their brief or use “Open email again.” The email app option needs a configured default email app or browser mail handler. The Gmail option uses [Google's documented mailto handler](https://developer.chrome.com/blog/getting-gmail-to-handle-all-mailto-links-with-registerprotocolhandler/) and requires signing in to Gmail if needed. Drafts belong to the account the visitor sends from; `makeable.io@gmail.com` is the recipient. The website does not send or store submissions and cannot confirm that an email was sent.

## Content and styling

Service descriptions, solution examples, and process content live in `src/App.vue`. The examples show potential solutions, not claimed customer projects. The colors, layout, animations, and mobile breakpoints are in `src/style.css`. The illustration is in `src/components/InfrastructureArt.vue`. All graphics are local SVG, PNG, or CSS.

The clients section features DOST-IX and NCMB 9. Their logos are stored locally in `public/clients` and keep their original colors and proportions. The DOST mark is from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:DOST_seal.svg), and the NCMB mark is from [NCMB's official website](https://ncr.ncmb.gov.ph/wp-content/uploads/2015/08/ncmb-logo.png).
