// Unlock state lives only in this popup: closing it (Firefox closes popups on blur) re-locks and resets the countdown.
let s, unlocked = false, end = 0, timer;
const lock = document.getElementById('lock');
const minutes = document.getElementById('minutes');

const boxes = FEATURES.map(f => {
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.onchange = () => { s.hide[f.key] = box.checked; save(); };
  const label = document.createElement('label');
  label.append(box, ' ' + f.label);
  document.getElementById('features').append(label);
  return [f.key, box];
});

const isLocked = () => s.enabled && !unlocked;

function save() {
  browser.storage.local.set(s);
  render();
}

function button(text, onclick) {
  const b = document.createElement('button');
  b.textContent = text;
  b.onclick = onclick;
  return b;
}

function render() {
  // Hiding more is always allowed; un-hiding needs the unlock.
  for (const [key, box] of boxes) {
    box.checked = s.hide[key];
    box.disabled = isLocked() && box.checked;
  }
  const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
  const status = document.createElement('p');
  if (!s.enabled) {
    status.textContent = 'Off: YouTube is unfiltered.';
    lock.replaceChildren(status, button('Turn on', () => { s.enabled = true; unlocked = false; save(); }));
  } else if (unlocked) {
    status.textContent = 'Unlocked until you close this popup.';
    lock.replaceChildren(status, button('Turn off', () => { s.enabled = false; save(); }));
  } else if (end) {
    status.textContent = `Keep this popup open: ${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    lock.replaceChildren(status);
  } else {
    status.textContent = 'On';
    lock.replaceChildren(status, button(`Unlock (keep this open ${s.minutes} min)`, startCountdown));
  }
}

function startCountdown() {
  end = Date.now() + s.minutes * 60e3;
  timer = setInterval(tick, 1000);
  tick();
}

// Uses the wall clock, so throttled timers can't shorten or stretch the wait.
function tick() {
  if (Date.now() >= end) {
    clearInterval(timer);
    unlocked = true;
    end = 0;
  }
  render();
}

minutes.onchange = () => {
  const v = Math.max(0, Math.floor(Number(minutes.value)) || 0);
  if (v >= s.minutes || !isLocked()) {
    s.minutes = v;
    save();
  }
  minutes.value = s.minutes; // a lowered value snaps back while locked
};

loadSettings().then(v => {
  s = v;
  minutes.value = s.minutes;
  render();
});
