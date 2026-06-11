# ⚡ Mad Minute Math

A fast, friendly math-practice game: how many problems can you solve in 60
seconds? Pick the operations (× ÷ + −), number families, difficulty and timer,
then race the clock and build streaks for combo points.

Originally a single-file HTML prototype, now a small, properly structured
[Vite](https://vitejs.dev/) + TypeScript project. No frameworks, no runtime
dependencies — it builds to a handful of static files.

**Live site:** https://suzuenhasa.github.io/madmathminute/

---

## Getting started

Requires [Node.js](https://nodejs.org/) 20.19+ or 22+.

```bash
npm install      # install dev tooling (one time)
npm run dev      # start the dev server with hot-reload → http://localhost:5173
```

## Scripts

| Command             | What it does                                              |
| ------------------- | -------------------------------------------------------- |
| `npm run dev`       | Dev server with instant hot-reload.                      |
| `npm run build`     | Type-check, then build the production site into `dist/`. |
| `npm run preview`   | Serve the built `dist/` locally to sanity-check it.      |
| `npm test`          | Run the unit tests once.                                 |
| `npm run test:watch`| Re-run tests as you edit.                                |
| `npm run typecheck` | Type-check without building.                             |

## Project layout

```
index.html              Markup shell (no inline CSS/JS)
src/
  main.ts               Composition root: boots the app and wires up events
  types.ts              Shared TypeScript types
  config.ts             Constants: operations, defaults, palette, storage keys
  math.ts               Problem generator                 (pure · unit-tested)
  scoring.ts            Combo multipliers, ranks, points   (pure · unit-tested)
  settings-logic.ts     Settings validation + summary text (pure · unit-tested)
  storage.ts            Safe localStorage wrapper + persistence
  state.ts              All mutable runtime state in one place
  audio.ts              Web Audio sound effects + vibration
  confetti.ts           Canvas confetti
  engine.ts             Game loop, input handling, scoring, results
  dom.ts                Tiny typed getElementById helper
  screens/              router · home · hud · countdown · settings
  styles/               CSS split by section (imported via index.css)
tests/                  Vitest unit tests for the pure logic
```

The **pure logic** (`math`, `scoring`, `settings-logic`) has no DOM dependencies
and is covered by tests, so the rules of the game can't silently break. The DOM
code reads from a single shared `state` object.

## Deployment

Deployment is automated by GitHub Actions
([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)): every push to
**`main`** builds the site and publishes it to GitHub Pages. Work on other
branches never touches the live site.

### Going live with this rewrite for the first time

The current live site is still served the old way (directly from `main`). To
switch over to this built version:

1. Merge this branch into `main` (e.g. open a PR from `dev` → `main`).
2. **Required one-time step:** in the repo on GitHub, go to **Settings → Pages →
   Build and deployment → Source** and choose **GitHub Actions**. The workflow
   cannot change this setting itself — until you flip it, the deploy fails and the
   live site stays on the old version.
3. The Actions workflow builds and deploys; the site updates in a minute or two.

> **Note:** the site lives at a sub-path (`/madmathminute/`), which is set as
> `base` in `vite.config.ts`. If you ever move to a custom domain or the repo
> root, update that value.
