# ClearCall — Demo Video Script (target: ~2 minutes, within the 1–3 min requirement)

**Format:** Screen recording, 1280×1000 or larger, browser at 100% zoom (ClearCall's type is already large). Narrate live or add captions — captions help this project's audience, so caption every line below. No face cam needed.

**Before recording:** Run `node server.js`, open http://localhost:4173, run each sample once so you know the timing.

---

### [0:00–0:20] The problem
*On screen: the ClearCall homepage, untouched.*
> "Every day, seniors get messages engineered to panic them — a suspended bank account, a grandchild in jail. The scam works in the rush, before they can ask anyone. ClearCall is the pause button. You paste the message *before* you reply, pay, or tap anything — and it tells you, in big plain language, whether it looks like a scam and exactly what to do next."

### [0:20–0:55] The grandparent scam — the strongest demo
*Click the sample button “Grandma, it's me — I'm in trouble”. The result appears.*
> "One tap on a built-in example. This is the grandparent scam — and look at the verdict: **Likely a scam**, score near the top. And it doesn't just score it, it *teaches*: a family member in trouble, gift cards requested, secrecy demanded — each warning explains why scammers use it. Then the checklist: don't reply, don't send money, call family on a number you already have."

### [0:55–1:20] A fake bank text, and why combinations matter
*Click the “Fake bank text with a link” sample.*
> "A fake bank text: urgency, a look-alike link, and a request for a password and a code. ClearCall weights that combination heaviest, because in real scripts it's almost conclusive. Notice the advice — call the number on the back of your card, never the number in the message."

### [1:20–1:40] It does NOT cry wolf
*Click the “normal appointment reminder” sample.*
> "And here's the test most checkers fail: a perfectly normal dentist reminder. **No warning signs found** — it even credits the reassuring signs. A tool that flags everything gets ignored; ClearCall is calibrated both ways, and that's enforced by its test suite — 8 automated tests, including this exact case."

### [1:40–2:00] Built for the person actually at risk
*Click 🔊 Listen, let one sentence play. Then click A+, then hover Print.*
> "For this audience, accessibility *is* the product: read-aloud results, bigger text, and a printable sheet to hand to family. And it all runs on the device — the message is never uploaded anywhere. ClearCall is free, open source under MIT, and in the repo now. Thank you."

---

**Recording checklist**
- [ ] Server running, page loaded fresh, no dev tools / personal tabs visible
- [ ] Each sample click lands and the verdict is readable on screen for ≥3 seconds
- [ ] Captions on every spoken line
- [ ] Total runtime between 1:00 and 3:00
- [ ] End frame holds on the homepage + repo URL for 2 seconds
