# Screenshots — captured ✅

All 3 Devpost screenshots were captured on 2026-10-26 from the real running app
(`node server.js`, port 4319) using Chrome Headless Shell
(`/opt/hatch/assets/artifacts/headless-shell/chrome-headless-shell`,
`--no-sandbox --virtual-time-budget=5000`), via the app's purpose-built
`?sample=` links that auto-run a check on page load. Each capture was visually
verified against the live app output.

- `01-home.png` — homepage (1280×1000): paste box, one check button, built-in examples
- `02-grandparent-scam-result.png` — "Likely a scam — do not act on it" (warning score 66/100, 3 warning signs), each warning explained in plain language
- `03-legitimate-reminder-result.png` — legitimate dentist reminder correctly cleared: "No warning signs found" (0/100), with the reassuring signs credited

To regenerate (any machine with Chrome/Chromium):

```bash
bash make-screenshots.sh
```

(The build sandbox's original `/opt/meta-chromium/chrome` hangs on headless
screenshots; the headless-shell binary above works — set
`CHROME=/opt/hatch/assets/artifacts/headless-shell/chrome-headless-shell`.)
