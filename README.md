# Verity Assessment — local desktop demo

Verity is a React + TypeScript desktop app built with Electron and Vite. Tailwind/CSS, Lucide React, and Recharts provide the interface. The app works offline: workspace records, exam answers, and review changes are saved in the Electron renderer's local storage on this computer. It does not require PostgreSQL, SQL, Prisma, Express, a cloud account, or environment variables.

## Run it

Install Node.js 20 or newer, then:

```sh
npm install
npm run dev
```

Create a distributable for the current computer with `npm run dist`. On Apple Silicon macOS this produces an arm64 `.dmg` and `.zip` under `artifacts/`. `npm run build` builds the app and checks its TypeScript. `npm test` runs the scoring checks.

## Publish a browser preview on Vercel

This repository includes `vercel.json` and `npm run build:web` for a static browser preview. Push the project to GitHub, import the repository in Vercel, and deploy with the default settings. The build command is `npm run build:web`; the output directory is `dist/web`; no environment variables are needed. Vercel will provide a shareable HTTPS URL. This URL hosts the React preview, not the Electron desktop app. The macOS `.dmg` remains a separate download under `artifacts/` and should be distributed through a release or file-hosting service.

## Demo workflow

Use **View as** to switch organizer, proctor, and candidate screens. The sign-in dialog only chooses a local preview role; it is not account authentication. Create programs, assessments, candidates, and questions in the demo workspace. Candidate answers and exam progress are saved locally in this browser profile.

## Desktop privacy and limitations

The Electron main process handles fullscreen mode, window focus signals, and OS permission requests. The renderer is sandboxed with context isolation enabled and Node integration disabled. Candidate-facing camera and screen-sharing prompts require explicit operating-system permission. The app does not record or stream media. Events are contextual observations for human review, not proof of misconduct.

This build is for a single-computer demo. Local data is not synchronized across devices and there are no real organization accounts, server-side access controls, invitations, remote monitoring, cloud backups, or database recovery. Electron cannot universally block other desktop apps, external devices, or websites; stronger kiosk controls require managed operating-system/device policies.
