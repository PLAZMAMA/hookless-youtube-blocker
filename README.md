# Hookless

A Firefox extension that hides YouTube distractions: the home feed, recommended videos, Shorts, end-screen walls and more. Turning it off takes a deliberate wait, so a moment of weakness isn't enough.

## How the lock works

- While Hookless is on, you can always hide **more**, but un-hiding a feature or turning the extension off needs an unlock.
- To unlock, click **Unlock** and keep the popup open for the wait time (15 minutes by default). Closing the popup resets the countdown.
- Once unlocked, you can change anything until you close the popup, then it locks again.
- The wait time can be raised anytime, but lowered only while unlocked.

## Features

| Feature | Default |
|---|---|
| Hide home feed | on |
| Hide video sidebar | on |
| Hide end-screen video wall | on |
| Hide Shorts | on |
| Block Shorts pages (redirects `/shorts/…` to the home page) | on |
| Hide mixes | on |
| Hide end-screen cards | off |
| Hide comments | off |
| Hide live chat | off |
| Hide playlist panel | off |
| Hide video description | off |
| Hide merch, tickets, offers | off |
| Hide search-result shelves | off |
| Hide Explore & Trending | off |
| Hide notifications bell | off |
| Hide top header | off |
| Disable autoplay | off |

## Install (temporary, for development)

1. Open `about:debugging#/runtime/this-firefox` in Firefox (142 or newer).
2. Click **Load Temporary Add-on…** and pick `manifest.json`.

Or with [web-ext](https://github.com/mozilla/web-ext): `npx web-ext run`.

## Development

| File | Purpose |
|---|---|
| `features.js` | Feature list, CSS selectors, defaults, settings loading |
| `content.js` | Injects the hiding CSS, blocks Shorts pages, turns off autoplay |
| `popup.html`, `popup.js` | Toolbar popup with the lock and feature toggles |
| `test.js` | Tests for the CSS builder and Shorts blocking |

Run the tests:

```sh
node test.js
```

YouTube renames its elements often. If something stops being hidden, fix its selector in `features.js`.
