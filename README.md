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
npm run preview
```

Deploy the generated `dist` directory to any static hosting provider. There are no server-side dependencies or external asset requests.

## Contact configuration

Copy `.env.example` to `.env` and set `VITE_CONTACT_EMAIL` to a verified business inbox before deployment. The current default, `hello@makeable.io`, is an assumed address and must be confirmed by the company.

The inquiry form validates the visitor's brief and opens a prefilled email in their email app. It does not send messages or store personal information on a server. The visitor must send the email to complete the inquiry. To accept submissions directly, connect the form to a backend or a form delivery service.

## Content and styling

Service descriptions, solution examples, and process content live in `src/App.vue`. The examples show potential solutions, not claimed customer projects. The colors, layout, animations, and mobile breakpoints are in `src/style.css`. The illustration is in `src/components/InfrastructureArt.vue`. All graphics are local SVG or CSS.
