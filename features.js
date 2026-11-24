// Selectors are best-effort: YouTube renames elements often, fix them here.
const FEATURES = [
  { key: 'home', label: 'Hide home feed', on: true, css: 'ytd-browse[page-subtype="home"] #primary' },
  { key: 'sidebar', label: 'Hide video sidebar', on: true, css: '#secondary #related, ytd-watch-next-secondary-results-renderer' },
  { key: 'endscreen', label: 'Hide end-screen video wall', on: true, css: '.ytp-endscreen-content, .ytp-fullscreen-grid' },
  { key: 'cards', label: 'Hide end-screen cards', on: false, css: '.ytp-ce-element' },
  { key: 'shorts', label: 'Hide Shorts', on: true, css: 'ytd-reel-shelf-renderer, ytd-rich-shelf-renderer[is-shorts], grid-shelf-view-model:has(a[href^="/shorts/"]), ytd-rich-section-renderer:has(a[href^="/shorts/"]), ytd-video-renderer:has(a[href^="/shorts/"]), ytd-guide-entry-renderer:has(a[title="Shorts"]), ytd-mini-guide-entry-renderer[aria-label="Shorts"]' },
  { key: 'shortsPage', label: 'Block Shorts pages', on: true, css: '' }, // handled in content.js
  { key: 'mixes', label: 'Hide mixes', on: true, css: 'ytd-radio-renderer, yt-lockup-view-model:has(a[href*="start_radio=1"])' },
  { key: 'comments', label: 'Hide comments', on: false, css: 'ytd-comments#comments' },
  { key: 'chat', label: 'Hide live chat', on: false, css: '#chat-container, ytd-live-chat-frame' },
  { key: 'playlist', label: 'Hide playlist panel', on: false, css: 'ytd-playlist-panel-renderer' },
  { key: 'description', label: 'Hide video description', on: false, css: 'ytd-watch-metadata #description' },
  { key: 'merch', label: 'Hide merch, tickets, offers', on: false, css: 'ytd-merch-shelf-renderer, ytd-ticket-shelf-renderer' },
  { key: 'search', label: 'Hide search-result shelves', on: false, css: 'ytd-search ytd-shelf-renderer, ytd-search ytd-horizontal-card-list-renderer' },
  { key: 'explore', label: 'Hide Explore & Trending', on: false, css: 'ytd-guide-entry-renderer:has(a[href^="/feed/trending"], a[href^="/feed/explore"])' },
  { key: 'notifications', label: 'Hide notifications bell', on: false, css: 'ytd-notification-topbar-button-renderer' },
  { key: 'header', label: 'Hide top header', on: false, css: '#masthead-container' },
  { key: 'autoplay', label: 'Disable autoplay', on: false, css: '' }, // handled in content.js
];

const DEFAULTS = { enabled: true, minutes: 15, hide: Object.fromEntries(FEATURES.map(f => [f.key, f.on])) };

// One rule per feature so a selector YouTube breaks (or a browser rejects) can't take the others down.
function buildCss(s) {
  if (!s.enabled) return '';
  return FEATURES.filter(f => f.css && s.hide[f.key]).map(f => `${f.css}{display:none!important}`).join('\n');
}

const blocksShorts = (s, path) => s.enabled && s.hide.shortsPage && path.startsWith('/shorts/');

async function loadSettings() {
  const s = await browser.storage.local.get(DEFAULTS);
  s.hide = { ...DEFAULTS.hide, ...s.hide }; // features added in later versions get their defaults
  return s;
}

if (typeof module !== 'undefined') module.exports = { FEATURES, DEFAULTS, buildCss, blocksShorts };
