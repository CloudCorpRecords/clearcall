# 🛡️ ClearCall — Is This Message a Scam?

**A scam-message checker designed for seniors, in big plain language, that works entirely on the device — no account, no upload, nothing sent anywhere.**

Paste any suspicious text, email, or letter. ClearCall checks it against known scam patterns, explains *every* warning in words a non-technical person can act on, gives a clear verdict, and lists exactly what to do next. It ships with one-tap examples (the “grandparent in trouble” call, a fake bank text, a fake parcel fee, and a normal appointment reminder) so a family member can teach with it in two minutes.

Built for **Next Byte Hacks V5** (open-ended, beginner-friendly, online).

---

## The problem

Older adults in the US lose billions of dollars a year to text, email, and phone scams — and the scripts are engineered for one moment: the rush. A message that says *“your account will be suspended in 24 hours”* or *“Grandma, it's me, I'm in jail, don't tell Mom”* is designed to stop the victim from doing the one thing that would save them: pausing and asking someone.

Existing advice (“watch out for scams!”) doesn't help in that moment. A checker only helps if it is:

1. **Usable by the person at risk** — very large text, one paste box, one button, a verdict you can't misread, a listen-aloud button, and a print button so the result can be shown to family.
2. **Explainable, not a black box** — “87% scam (AI)” teaches nothing and earns no trust. Every ClearCall warning names the pattern *and why scammers use it*, so users learn the tells permanently.
3. **Private by architecture** — the exact people targeted by scams should never be asked to upload a private message to a stranger's server. ClearCall runs 100% locally; there is no backend and no data to leak.

## Key features

- **Explainable risk score (0–100)** from 12 weighted, human-readable rules: urgency pressure, gift-card / crypto / wire / cash-app payment requests, impersonation of banks / IRS / police / Medicare, the family-emergency (“grandparent”) script, secrecy demands, suspicious or look-alike links, requests for codes / PINs / passwords / SSN, fake prizes and refunds, threats of arrest or lost benefits, fake delivery & payment alerts, too-good-to-be-true money, and generic sloppy greetings. Compounding bonus when urgency is combined with a money/code request — the highest-risk combination in real scripts.
- **Four verdicts in plain words:** *Likely a scam — do not act on it* / *Be careful* / *A few mild signs* / *No warning signs found* — always with the honest caveat that “no signs” is reassuring, not a guarantee.
- **A “what to do next” checklist that changes with the verdict** — stop/don't reply/don't call numbers in the message, call the number on your bank card, show a family member, delete and block.
- **Reassuring-sign detection** — e.g. a message that names a specific appointment, says it's automated, and asks for nothing gets credited, so normal reminders don't cry wolf (verified by test: the legitimate sample scores < 20 with no scam verdict).
- **Accessibility first:** large default type (Verdana, 20px base), an **A+ bigger-text toggle**, high-contrast focus rings, **🔊 Listen** (reads the verdict and warnings aloud via speech synthesis), **🖨️ Print** (a clean paper copy to hand to family), full keyboard use, and `aria-live` result announcements.
- **Four built-in teaching examples** — one tap fills and checks a real-style scam script or a legitimate reminder. Also available as shareable links: `?sample=grandparent`, `?sample=bank`, `?sample=delivery`, `?sample=legitimate`.
- **Zero dependencies, zero backend, zero tracking.** One HTML page + one detection engine in vanilla JS. The optional Node server is ~30 lines of standard library.

## Setup — one command

Requires Node.js (any recent version). No `npm install` — there are no dependencies.

```bash
node server.js
```

Then open **http://localhost:4173**

That's it. (You can also open `index.html` directly in a browser — the checker works fully offline either way. `PORT=8080 node server.js` changes the port. Health check: `http://localhost:4173/health`.)

## Run the tests

```bash
node test.js
```

8 smoke tests run against the *exact* engine file the browser loads: all three scam samples must flag, the legitimate reminder must not, every warning must carry a plain-language explanation, and empty/short input must be handled gracefully.

## How it works

```
index.html       The whole app: paste box, verdict, explanations, checklist, accessibility tools
scam-engine.js   The detection engine — pure functions, 12 explainable rules + reassuring signs.
                 Loads in the browser (window.ScamEngine) and in Node (module.exports),
                 so what is tested is literally what ships.
server.js        Zero-dependency static file server (+ /health) — only for convenience
test.js          Smoke tests for the engine
screenshots/     Screenshots of the running app for the Devpost page
```

Scoring is deliberately conservative in both directions: a single mild signal never produces a “likely scam” verdict, and the strongest real-world signals (gift-card payment, family-emergency script, code/password requests) carry the heaviest weights because in real scripts they are near-conclusive.

## Tech & tools used

- **Vanilla JavaScript, HTML, CSS** — no framework, no build step, no dependencies
- **Node.js** (standard library only) for the static server and the test runner
- **Web Speech API** (`speechSynthesis`) for read-aloud, native print CSS for the paper handout
- Built with an AI-agent workflow (see disclosure below); tested with a custom Node smoke-test harness and verified end-to-end by serving the app and fetching every route

## Challenges

- **Calibrating without crying wolf.** A checker that flags Grandma's real dentist reminder destroys its own credibility in one use. The fix was two-sided scoring: reassuring signals are detected explicitly, single weak signals cap out at “mild”, and the test suite includes a legitimate message that *must not* flag — treated with the same seriousness as the scams that must.
- **Explaining, not just scoring.** Writing the “why scammers do this” line for each rule — short enough to read under stress, specific enough to teach — took more iterations than the detection patterns themselves.
- **Designing for stress + low vision at the same time.** Big type fights with information density. The layout resolves it by sequencing: one paste box, then verdict, then reasons, then actions — never everything competing at once.

## What we learned

- The most dangerous scam signal isn't any single phrase — it's the *combination* of urgency + an irreversible payment or a code. Scoring combinations, not just keywords, is what separates a useful checker from a word list.
- Accessibility features (read-aloud, print-for-family) aren't extras for this audience; for many seniors the printed sheet handed to a daughter or son **is** the product.
- A legitimate-message test case is as important as scam test cases. Precision is a safety feature.

## Future plans

- **Letter mode:** photograph a paper letter and check the OCR'd text the same way (still fully on-device).
- **Family link:** an optional, user-initiated “send this result to my trusted contact” share sheet — never automatic, never silent.
- **Community script library:** a reviewed, growing set of current scam scripts (from FTC / AARP public alerts) as one-tap teaching examples, in English and Spanish.
- **Phone-call script checker:** the same explainable rules adapted for “the caller said…” notes after a suspicious call.
- Package as an installable PWA so it lives on a home screen with no app store and works with no signal.

## Build Disclosure

**Build Disclosure: AI-built. Built by AI agents (Tree / Muse fleet) directed by Rene Turcios during the hackathon period; Rene set the direction and reviewed; agents designed, coded, tested, and documented.**

## License

MIT — see [LICENSE](LICENSE). Free for anyone to use, copy, and improve. If you run a senior center, library, or family group chat: please do.
