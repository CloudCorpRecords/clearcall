/*
 * ClearCall Scam Checker — detection engine
 * Pure, deterministic, zero-dependency. Works in the browser (window.ScamEngine)
 * and in Node (module.exports) so the exact logic judges see is the logic tested.
 *
 * Design principle: explainable rules, not a black box. Every point in the score
 * comes with a plain-language reason a senior (or their family) can understand.
 */
(function (root) {
  'use strict';

  var RULES = [
    {
      id: 'urgency',
      label: 'Pressure to act right now',
      weight: 14,
      explain: 'Scammers rush you so you do not have time to think or ask family. Real banks and government offices almost never demand instant action by text or email.',
      patterns: [
        /\burgent(ly)?\b/i, /\bact now\b/i, /\bimmediately\b/i, /\bwithin (24|48) hours\b/i,
        /\bfinal (warning|notice)\b/i, /\baccount (will be|is being) (closed|suspended|locked|terminated)\b/i,
        /\bexpires? (today|in \d+ hours)\b/i, /\bdo not delay\b/i, /\bright now or\b/i
      ]
    },
    {
      id: 'giftcard',
      label: 'Asks for gift cards, crypto, wire, or cash apps',
      weight: 26,
      explain: 'No real company, bank, or government agency will ever ask you to pay with gift cards, Bitcoin, a wire transfer, Zelle, Venmo, or Cash App. This request alone is almost always a scam.',
      patterns: [
        /\bgift cards?\b/i, /\bitunes card\b/i, /\bgoogle play card\b/i, /\bbitcoin\b/i, /\bcrypto(currency)?\b/i,
        /\bwire (transfer|the money|funds)\b/i, /\bzelle\b/i, /\bvenmo\b/i, /\bcash ?app\b/i,
        /\bpurchase .* cards? and (send|read|share)\b/i, /\bprepaid card\b/i
      ]
    },
    {
      id: 'impersonation',
      label: 'Claims to be a bank, the IRS, police, or a big company',
      weight: 14,
      explain: 'Scammers pretend to be organisations you trust. The real IRS never texts or emails first, and your bank will never ask for your password or code.',
      patterns: [
        /\b(irs|internal revenue)\b/i, /\bsocial security (administration|office)\b/i,
        /\bthis is (your )?bank\b/i, /\bbank of america\b/i, /\bwells fargo\b/i, /\bchase bank\b/i,
        /\bamazon (security|customer)\b/i, /\bmicrosoft (support|security)\b/i, /\bapple (support|security)\b/i,
        /\bpolice department\b/i, /\bsheriff'?s office\b/i, /\bfbi\b/i, /\bmedicare\b/i,
        /\bfraud department\b/i, /\bsecurity department\b/i
      ]
    },
    {
      id: 'family-emergency',
      label: 'A family member in trouble who needs money or secrecy',
      weight: 24,
      explain: 'The "grandparent scam": a caller pretends to be a grandchild in jail or in hospital and begs you not to tell anyone. Always hang up and call your family member on the number you already have.',
      patterns: [
        /\bgrand(ma|pa|mother|father)\b,?\s+(it'?s|this is) me\b/i, /\bi'?m in (jail|trouble|the hospital)\b/i,
        /\bneed bail\b/i, /\bdon'?t tell (mom|dad|anyone|your)\b/i, /\bplease don'?t tell\b/i,
        /\bi was arrested\b/i, /\bmy voice sounds (different|funny)\b/i
      ]
    },
    {
      id: 'secrecy',
      label: 'Tells you to keep it secret',
      weight: 16,
      explain: 'Keeping you isolated is the point. A real prize, bank, or agency will never mind if you talk to family first — a scammer always does.',
      patterns: [
        /\bkeep (this|it) (a )?secret\b/i, /\bdon'?t tell anyone\b/i, /\bconfidential\b/i,
        /\bstay on the (phone|line)\b/i, /\bdo not hang up\b/i, /\bdo not contact\b/i
      ]
    },
    {
      id: 'links',
      label: 'Suspicious link or look-alike address',
      weight: 16,
      explain: 'Shortened or misspelled links can take you to a fake website that steals your password. Type the real address yourself instead of tapping a link in a message.',
      patterns: [
        /\b(bit\.ly|tinyurl\.com|t\.co\/[a-z0-9]+|goo\.gl|rb\.gy|shorturl)\b/i,
        /https?:\/\/[^\s]*\d{1,3}(\.\d{1,3}){3}[^\s]*/i,
        /\b[a-z]+-(secure|verify|login|account|support|update)\.(com|net|xyz|top|click|info)\b/i,
        /\b(verify|confirm|unlock|restore) your account at\b/i, /\bclick (here|the link) (to|now)\b/i
      ]
    },
    {
      id: 'codes-passwords',
      label: 'Asks for a code, PIN, password, or Social Security number',
      weight: 22,
      explain: 'The 6-digit code sent to your phone is a key to your account. Nobody legitimate will ever ask you to read it out or forward it — ever.',
      patterns: [
        /\b(share|send|tell|read|give)( me| us)? (your|the) (code|pin|password|otp|verification)\b/i,
        /\bverification code\b/i, /\bone[- ]time (code|passcode)\b/i,
        /\bsocial security number\b/i, /\bfull ssn\b/i, /\bbank (login|password|details)\b/i,
        /\bconfirm your (password|pin|identity)\b/i
      ]
    },
    {
      id: 'prize',
      label: 'You "won" a prize, lottery, or refund you never entered',
      weight: 16,
      explain: 'You cannot win a contest you did not enter. Any prize that asks you to pay a fee, tax, or shipping charge first is a scam.',
      patterns: [
        /\byou (have )?won\b/i, /\blottery\b/i, /\bsweepstakes\b/i, /\bprize winner\b/i,
        /\bclaim your (prize|reward|refund)\b/i, /\brefund of \$?\d/i, /\bselected (winner|to receive)\b/i,
        /\bfree (iphone|gift|vacation|cruise)\b/i
      ]
    },
    {
      id: 'threats',
      label: 'Threatens arrest, a lawsuit, or losing benefits',
      weight: 18,
      explain: 'Threats are theatre. Police do not warn you by text before an arrest, and benefits are never cut off without a letter you can verify.',
      patterns: [
        /\bwarrant for your arrest\b/i, /\byou will be arrested\b/i, /\blegal action\b/i,
        /\blawsuit\b/i, /\bbenefits (will be )?(suspended|terminated|cut off)\b/i,
        /\bdeport/i, /\bcriminal charges\b/i
      ]
    },
    {
      id: 'unusual-payment-or-delivery',
      label: 'Parcel, payment, or account problem you do not recognise',
      weight: 10,
      explain: 'Fake delivery and payment alerts are the most common text scam. If you were not expecting a parcel or payment, treat the message as fake until you check the real company app or website yourself.',
      patterns: [
        /\bpackage (could not|was not|failed).*deliver/i, /\bdelivery (failed|attempt|fee)\b/i,
        /\bpayment (declined|failed|on hold)\b/i, /\bunusual (activity|sign[- ]?in|transaction)\b/i,
        /\bparcel\b.*\bfee\b/i, /\bredelivery\b/i
      ]
    },
    {
      id: 'money-too-good',
      label: 'Money that sounds too good to be true',
      weight: 14,
      explain: 'Guaranteed high returns, secret investments, and strangers offering easy money are classic fraud. Real investments can lose money and are never guaranteed.',
      patterns: [
        /\bguaranteed (returns?|profit|income)\b/i, /\bdouble your money\b/i,
        /\bearn \$\d[\d,]* (a|per) (day|week|month)\b/i, /\bwork from home.*\$\d/i,
        /\binvestment opportunity\b/i, /\brisk[- ]free\b.*\bprofit\b/i
      ]
    },
    {
      id: 'generic-greeting',
      label: 'No name, strange sender, or sloppy wording',
      weight: 6,
      explain: 'On its own this proves nothing — but combined with other warnings it matters. Real companies usually use your name and write carefully.',
      patterns: [
        /\bdear (customer|user|client|sir\/madam|beneficiary)\b/i,
        /\bkindly (do|provide|send|verify)\b/i
      ]
    }
  ];

  var REASSURING = [
    { pattern: /\bappointment (reminder|on|at)\b/i, note: 'Names a specific appointment, which is typical of real reminders.' },
    { pattern: /\bdo not reply\b.*\bautomated\b/i, note: 'Says it is automated and asks for no reply, payment, or code.' },
    { pattern: /\bno action (is )?needed\b/i, note: 'Explicitly says no action is needed.' }
  ];

  function analyse(text) {
    var input = String(text || '').trim();
    if (input.length < 8) {
      return { score: 0, verdict: 'too-short', label: 'Too short to check', flags: [], reassuring: [],
        summary: 'Paste the whole message — a few more words will give a much better check.' };
    }
    var score = 0;
    var flags = [];
    RULES.forEach(function (rule) {
      var hit = rule.patterns.some(function (p) { return p.test(input); });
      if (hit) { score += rule.weight; flags.push({ id: rule.id, label: rule.label, weight: rule.weight, explain: rule.explain }); }
    });
    // A link on its own is common in real messages; urgency + money together compound.
    if (flags.some(function (f) { return f.id === 'urgency'; }) &&
        flags.some(function (f) { return f.id === 'giftcard' || f.id === 'codes-passwords'; })) {
      score += 8;
    }
    var reassuring = [];
    REASSURING.forEach(function (r) { if (r.pattern.test(input)) reassuring.push(r.note); });
    if (flags.length === 0 && reassuring.length > 0) score = Math.max(0, score - 5);
    score = Math.min(100, score);

    var verdict, label;
    if (score >= 45) { verdict = 'likely-scam'; label = 'Likely a scam — do not act on it'; }
    else if (score >= 20) { verdict = 'caution'; label = 'Be careful — several warning signs'; }
    else if (score >= 1) { verdict = 'low'; label = 'A few mild signs — check before you act'; }
    else { verdict = 'no-flags'; label = 'No warning signs found'; }

    var summary;
    if (verdict === 'likely-scam') summary = 'This message shows strong scam patterns. Do not reply, do not tap any link, and do not send money or codes. Use the checklist below.';
    else if (verdict === 'caution') summary = 'This message has warning signs seen in real scams. Pause, and verify using a number or website you already trust — never one from the message itself.';
    else if (verdict === 'low') summary = 'Nothing decisive, but stay careful. If it asks for money, codes, or personal details, verify it independently first.';
    else summary = 'We found no known scam patterns in this message. That is reassuring, not a guarantee — if anything in it asks for money, codes, or passwords, verify it independently.';

    return { score: score, verdict: verdict, label: label, flags: flags, reassuring: reassuring, summary: summary };
  }

  var SAMPLES = {
    grandparent: {
      title: '“Grandma, it’s me — I’m in trouble”',
      text: "Grandma, it's me. I was arrested last night and I need bail money right away. Please don't tell Mom and Dad. My voice sounds different because I broke my nose. A man will call you about sending gift cards to get me out. Keep this secret, please, I'm so scared."
    },
    bank: {
      title: 'Fake bank text with a link',
      text: "URGENT: Chase Bank Fraud Department. Unusual activity detected. Your account will be suspended within 24 hours. Verify your account at chase-secure-verify.xyz and confirm your password and verification code to restore access. Act now."
    },
    delivery: {
      title: 'Fake parcel fee text',
      text: "Your package could not be delivered. A $1.99 redelivery fee is required. Click here to pay and schedule redelivery: bit.ly/3xparcel — your parcel will be returned in 48 hours if you do not act immediately."
    },
    legitimate: {
      title: 'A normal appointment reminder',
      text: "Reminder: You have a dentist appointment on Tuesday at 10:30 AM with Dr. Lee's office. This is an automated message, please do not reply. No action is needed unless you need to reschedule — call the office number on your appointment card."
    }
  };

  var api = { analyse: analyse, RULES: RULES, SAMPLES: SAMPLES };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.ScamEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
