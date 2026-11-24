const style = document.createElement('style');
document.documentElement.append(style);
let settings;

async function apply() {
  settings = await loadSettings();
  style.textContent = buildCss(settings);
  blockShorts();
}
apply();
browser.storage.onChanged.addListener(apply);

// Shorts also open by in-page navigation; YouTube has already set the URL when yt-navigate-start fires.
function blockShorts() {
  if (settings && blocksShorts(settings, location.pathname)) location.replace('/');
}
document.addEventListener('yt-navigate-start', blockShorts);

// YouTube turns autoplay back on per session, so keep switching it off.
setInterval(() => {
  if (settings?.enabled && settings.hide.autoplay)
    document.querySelector('.ytp-autonav-toggle-button[aria-checked="true"]')?.click();
}, 1000);
