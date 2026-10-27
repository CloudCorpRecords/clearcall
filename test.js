#!/usr/bin/env node
/* Smoke tests for the exact engine shipped in the browser. Run: node test.js */
'use strict';
const assert = require('assert');
const engine = require('./scam-engine.js');

let passed = 0;
function check(name, fn) { fn(); passed++; console.log('  PASS  ' + name); }

console.log('ClearCall engine smoke tests');

check('grandparent sample is flagged likely-scam', () => {
  const r = engine.analyse(engine.SAMPLES.grandparent.text);
  assert.strictEqual(r.verdict, 'likely-scam', 'got ' + r.verdict + ' score ' + r.score);
  assert.ok(r.score >= 45);
  assert.ok(r.flags.some(f => f.id === 'family-emergency'));
  assert.ok(r.flags.some(f => f.id === 'giftcard'));
});

check('fake bank sample is flagged likely-scam', () => {
  const r = engine.analyse(engine.SAMPLES.bank.text);
  assert.strictEqual(r.verdict, 'likely-scam', 'got ' + r.verdict + ' score ' + r.score);
  assert.ok(r.flags.some(f => f.id === 'codes-passwords' || f.id === 'links'));
});

check('fake delivery sample is flagged at least caution', () => {
  const r = engine.analyse(engine.SAMPLES.delivery.text);
  assert.ok(['caution', 'likely-scam'].includes(r.verdict), 'got ' + r.verdict + ' score ' + r.score);
});

check('legitimate appointment reminder has no warning flags driving a scam verdict', () => {
  const r = engine.analyse(engine.SAMPLES.legitimate.text);
  assert.ok(['no-flags', 'low'].includes(r.verdict), 'got ' + r.verdict + ' score ' + r.score);
  assert.ok(r.score < 20);
});

check('every flag carries a plain-language explanation', () => {
  for (const key of Object.keys(engine.SAMPLES)) {
    const r = engine.analyse(engine.SAMPLES[key].text);
    for (const f of r.flags) { assert.ok(f.explain && f.explain.length > 30, 'flag ' + f.id + ' lacks explanation'); assert.ok(f.label.length > 3); }
  }
});

check('too-short input is handled, not scored', () => {
  const r = engine.analyse('hi');
  assert.strictEqual(r.verdict, 'too-short');
});

check('empty input does not throw', () => {
  assert.doesNotThrow(() => engine.analyse(''));
  assert.doesNotThrow(() => engine.analyse(null));
});

check('gift-card request alone scores as a serious warning', () => {
  const r = engine.analyse('Please purchase gift cards and read me the numbers on the back to pay your tax bill.');
  assert.ok(r.score >= 20, 'score was ' + r.score);
});

console.log('\n' + passed + '/' + passed + ' tests passed');
