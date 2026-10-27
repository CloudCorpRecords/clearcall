# Devpost Submission — Next Byte Hacks V5 — ClearCall
*Ready to paste. Deadline: Oct 31, 2026, 5:00 PM ET. Hackathon: https://next-byte-hacks-v5.devpost.com/*

---

## Project name
ClearCall — Is This Message a Scam?

## Tagline (one line)
A scam-message checker built for seniors: paste any text, email, or letter and get a plain-language verdict, every warning explained, and exactly what to do next — entirely on your device.

## (1) Project description — what it does, the problem, key features

**The problem.** Older adults lose billions of dollars a year to text, email, and phone scams, and every script is engineered for a single moment: the rush. “Your account will be suspended in 24 hours.” “Grandma, it's me, I'm in jail — don't tell Mom.” Panic first, questions never. Generic advice (“watch out for scams!”) is useless inside that moment. What helps is a pause button that a non-technical person can actually use, that explains itself, and that never asks them to upload a private message to a stranger's server.

**What ClearCall does.** Paste any suspicious message and press one button. ClearCall checks it against 12 explainable scam patterns — urgency pressure, gift-card/crypto/wire/cash-app payment requests, impersonation of banks, the IRS, police or Medicare, the family-emergency “grandparent” script, secrecy demands, look-alike links, requests for codes, PINs, passwords or SSNs, fake prizes, threats of arrest or lost benefits, fake delivery alerts, too-good-to-be-true money, and sloppy generic greetings — with extra weight on the urgency + money/code combination that real scripts rely on.

**Key features**
- A 0–100 warning score and one of four unmissable verdicts, from *“Likely a scam — do not act on it”* to *“No warning signs found”* (always with the honest caveat that no-signs is reassuring, not a guarantee)
- Every warning explained in plain language — what the pattern is *and why scammers use it* — so users learn the tells permanently
- A “what to do next” checklist that changes with the verdict: don't reply, don't call numbers in the message, call the number on your bank card, show family, delete and block
- Reassuring-sign detection, so normal messages (a dentist reminder that names the appointment and asks for nothing) don't cry wolf — enforced by an automated test
- Built for the person at risk: very large type, an A+ bigger-text toggle, **Listen** (read-aloud), **Print** (a paper copy to hand to family), full keyboard support, screen-reader announcements
- Four built-in one-tap teaching examples (grandparent scam, fake bank text, fake parcel fee, legitimate reminder), also reachable as shareable `?sample=` links
- **Private by architecture:** zero backend, zero dependencies, zero tracking — the message never leaves the device

## (2) Demo video
1–3 minute screen recording following `DEMO.md` in the repo: homepage → grandparent-scam sample flagged with explained warnings → fake bank text → legitimate reminder correctly cleared → Listen / A+ / Print accessibility pass. *(Parent to record/upload and paste the video URL here before submitting.)*

## (3) Public GitHub repository
Public repo with full setup instructions in the README — one command, no install:
```
node server.js   →   http://localhost:4173
node test.js     →   8/8 smoke tests
```
**https://github.com/CloudCorpRecords/clearcall** — Screenshots are in the repo under `screenshots/` and uploaded to this page (see below).

## Screenshots (upload 2–3)
*✅ Captured 2026-10-26 from the real running app via Chrome Headless Shell and the app's `?sample=` links (see `screenshots/README.md`); upload these 3 PNGs to the Devpost page.*
1. `screenshots/01-home.png` — ClearCall homepage: paste box, one check button, built-in examples
2. `screenshots/02-grandparent-scam-result.png` — the grandparent-scam sample flagged “Likely a scam,” with each warning explained and the do-not-act checklist
3. `screenshots/03-legitimate-reminder-result.png` — a normal appointment reminder correctly cleared, showing the reassuring signs

## (5) Devpost page info

**Team info.** Solo entry by Rene Turcios (Devpost: CloudCorpRecords), San Francisco. Direction, product choices, and review by Rene; design, code, tests, and documentation by his AI-agent fleet (see disclosure).

**Tools used.** Vanilla JavaScript, HTML, and CSS (no framework, no build step, no dependencies); Node.js standard library only, for the static server and test runner; the Web Speech API for read-aloud and native print CSS for the paper handout; an AI-agent build workflow (Tree / Muse fleet) with a custom Node smoke-test harness; headless Chrome for screenshots.

**Challenges.** (1) *Calibration without crying wolf* — a checker that flags a real dentist reminder loses all trust in one use, so scoring is two-sided: reassuring signals are detected explicitly, single weak signals can't produce a “likely scam” verdict, and the test suite treats the legitimate sample as a must-pass case. (2) *Explaining, not just scoring* — writing each “why scammers do this” line short enough to read under stress but specific enough to teach took more iterations than the detection rules. (3) *Stress + low vision* — big type fights information density; the page resolves it by sequencing: paste, verdict, reasons, actions — never competing.

**What we learned.** The most dangerous signal is a *combination* — urgency plus an irreversible payment or a code — not any single phrase. Accessibility features aren't extras for this audience; for many seniors the printed result handed to family **is** the product. And a legitimate-message test is as safety-critical as any scam test: precision is a safety feature.

**Future plans.** On-device photo/OCR “letter mode” for paper mail; an optional, user-initiated share sheet to send a result to a trusted contact (never automatic); a reviewed library of current scam scripts from public FTC/AARP alerts as teaching examples, in English and Spanish; a phone-call variant of the checker; and packaging as an installable PWA for home screens.

## Build Disclosure
**Build Disclosure: AI-built. Built by AI agents (Tree / Muse fleet) directed by Rene Turcios during the hackathon period; Rene set the direction and reviewed; agents designed, coded, tested, and documented.**
