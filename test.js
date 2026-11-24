const assert = require('assert');
const { FEATURES, DEFAULTS, buildCss, blocksShorts } = require('./features.js');

const all = { enabled: true, hide: Object.fromEntries(FEATURES.map(f => [f.key, true])) };
const css = buildCss(all);

assert.strictEqual(buildCss({ ...all, enabled: false }), '', 'master off hides nothing');
for (const f of FEATURES) if (f.css) assert(css.includes(f.css), `${f.key} missing`);
assert(!css.includes('undefined') && !/^\{/m.test(css), 'no empty rules (autoplay has no css)');

const home = buildCss({ enabled: true, hide: { home: true, bogus: true } });
assert.strictEqual(home, `${FEATURES[0].css}{display:none!important}`, 'only enabled, known features');

assert.strictEqual(new Set(FEATURES.map(f => f.key)).size, FEATURES.length, 'unique keys');
assert.strictEqual(DEFAULTS.hide.home, true);
assert.strictEqual(DEFAULTS.hide.comments, false);

assert(blocksShorts(DEFAULTS, '/shorts/PQxN0zDElzA'), 'blocks Shorts by default');
assert(!blocksShorts(DEFAULTS, '/watch'), 'leaves normal videos alone');
assert(!blocksShorts(DEFAULTS, '/@someone/shorts'), 'leaves channel Shorts tab alone (its cards are hidden by CSS)');
assert(!blocksShorts({ ...DEFAULTS, enabled: false }, '/shorts/x'), 'master off allows Shorts');
assert(!blocksShorts({ ...DEFAULTS, hide: { ...DEFAULTS.hide, shortsPage: false } }, '/shorts/x'), 'toggle off allows Shorts');
console.log('ok');
