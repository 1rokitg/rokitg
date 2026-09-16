const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, globals = {}, imports = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const context = { exports: {}, require: name => imports[name], URL, Date, Intl, Set, ...globals };
  vm.runInNewContext(code, context, { filename: file });
  return context.exports;
}
const events = load('src/lib/analytics/events.ts');
for (const [url, expected] of [
  ['https://discord.gg/abc', 'Discord Click'], ['https://discord.com/invite/abc', 'Discord Click'],
  ['https://t.me/rok1tg', 'Telegram Click'], ['https://youtu.be/abc', 'YouTube Click'],
  ['https://www.youtube.com/watch?v=abc', 'YouTube Click'], ['https://cal.com/rokitg/community', 'Calendar Click'],
  ['https://whop.com/rokitg', 'Whop Click'], ['https://fomo.family/r/rokitg', 'Fomo Referral Click'],
  ['https://fomo.family/r/', undefined], ['https://youtube.com.evil.test/watch', undefined],
  ['javascript:alert(1)', undefined], ['https://rokitg.com/about', undefined],
]) assert.equal(events.classifyOutbound(new URL(url)), expected);
assert.equal(events.returnVisit(null, new Date('2026-09-15T12:00Z')), undefined);
assert.equal(events.returnVisit('2026-09-15', new Date('2026-09-15T23:59Z')), undefined);
assert.equal(events.returnVisit('2026-09-16', new Date('2026-09-15T23:59Z')), undefined);
assert.equal(events.returnVisit('2026-09-14', new Date('2026-09-15T00:00Z')).days_since_last_visit, 1);
const store = new Map(); const delivered = []; const diagnostics = [];
const window = { location: { href: 'https://rokitg.com/about?waid=ad_123&utm_source=ig&email=private', pathname: '/about' },
  __whopContext: { enabled: true, live: true }, whop: { track: (name, payload) => delivered.push({ name, payload }) },
  dispatchEvent: event => diagnostics.push(event.detail) };
const analytics = load('src/lib/whop.ts', { window, document: { referrer: '', documentElement: { lang: 'es' } }, navigator: { language: 'es' },
  sessionStorage: { getItem: key => store.get(key) || null, setItem: (key, value) => store.set(key, value) },
  crypto: { randomUUID: () => require('node:crypto').randomUUID() }, CustomEvent: class { constructor(name, options) { this.detail = options.detail; } },
}, { './analytics/events': events });
analytics.captureAttribution();
window.location.href = 'https://rokitg.com/retention'; window.location.pathname = '/retention';
const click = { source: 'test', destination: 'https://discord.gg/abc', link_label: 'Discord', interaction: 'open', event_id: 'same-action' };
analytics.trackWhopEvent('Discord Click', click); analytics.trackWhopEvent('Discord Click', click);
assert.equal(delivered.length, 1); assert.equal(delivered[0].payload.waid, 'ad_123');
assert.equal(delivered[0].payload.page, '/retention'); assert.ok(!delivered[0].payload.landing_url.includes('email'));
analytics.trackWhopEvent('Return Visit', { source: 'session', days_since_last_visit: 1, visit_day: '2026-09-15' });
assert.equal(delivered.length, 1); assert.equal(window.dataLayer.length, 1);
window.__whopContext.live = false;
analytics.trackWhopEvent('Discord Click', { ...click, event_id: 'preview' });
assert.equal(delivered.length, 1); assert.equal(diagnostics.at(-1).delivery, 'preview');
window.__whopContext.enabled = false;
window.__whopContext.live = true;
const count = diagnostics.length; analytics.trackWhopEvent('Discord Click', { ...click, event_id: 'excluded' });
assert.equal(diagnostics.length, count);
console.log('Analytics checks passed: host matching, return-day rules, attribution across navigation, query filtering, deduplication, preview isolation, and exclusions.');
