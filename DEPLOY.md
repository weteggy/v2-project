# Design System V2 — Project Hub

A React app for presenting the DS V2 project to stakeholders.

## Deploy to Vercel (recommended)

### Option A: Connect via GitHub (auto-deploys on every push)

1. **Push to GitHub**
   ```bash
   cd ds-v2-hub
   git init
   git add .
   git commit -m "Initial commit — DS V2 Project Hub"
   git remote add origin https://github.com/YOUR_USERNAME/ds-v2-hub.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Sign in with GitHub
   - Import the `ds-v2-hub` repo
   - Vercel auto-detects Vite — no settings to change
   - Click **Deploy**
   - Done! You'll get a URL like `ds-v2-hub.vercel.app`

### Option B: Drag & drop (no GitHub needed)

1. Run `npm run build` locally (or use the `dist/` folder already built)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Drag the `dist/` folder onto the page
4. Done!

### Option C: Vercel CLI (one command)

```bash
npm i -g vercel
cd ds-v2-hub
vercel
```

Follow the prompts. Takes ~30 seconds.

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Tech stack

- **React 18** — UI
- **Vite 5** — Build tool
- **Tailwind CSS 3** — Styling
- **Lucide React** — Icons
- Zero backend, fully static
