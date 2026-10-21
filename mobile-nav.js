/* Mobile navigation — shared by index.html and world-map.html.
 *
 * Why this exists: the nav links were hidden below 640px from the very first
 * commit, with no replacement. On a phone there was no route to Philosophy,
 * Atlas, Reads or Work at all.
 *
 * The sheet is built from the existing <ul class="nav-links"> in the DOM, so
 * the two can never drift apart — change the desktop nav and the mobile menu
 * follows.
 *
 * Design: a full-height sheet in the site's own light palette, with a
 * two-bar button that morphs into a close mark. No new colour, no new font.
 */
(function () {
  'use strict';

  var doc = document;
  var nav = doc.querySelector('nav');
  var source = nav && nav.querySelector('.nav-links');
  if (!nav || !source) return;

  var CSS = [
    '.mn-btn {',
    '  display: none;',
    '  position: relative;',
    '  width: 40px; height: 40px;',
    '  margin: -10px -10px -10px 0;',
    '  border: 0; padding: 0;',
    '  background: transparent;',
    '  cursor: pointer;',
    '  -webkit-tap-highlight-color: transparent;',
    '}',

    /* The logo is a flex row with the tagline beside it. Without this the
       name breaks mid-word on a narrow phone ("Clarissa Chı" / "a"). */
    '.nav-logo-name { white-space: nowrap; }',

    '.mn-btn-bars {',
    '  position: absolute;',
    '  left: 10px; top: 50%;',
    '  width: 20px; height: 12px;',
    '  transform: translateY(-50%);',
    '}',
    '.mn-btn-bars i {',
    '  position: absolute;',
    '  left: 0;',
    '  width: 100%; height: 1.5px;',
    '  background: var(--text, var(--ink, #0f0e0c));',
    '  border-radius: 2px;',
    '  transition: transform .28s cubic-bezier(.4,0,.2,1), opacity .2s;',
    '}',
    '.mn-btn-bars i:nth-child(1) { top: 0; }',
    '.mn-btn-bars i:nth-child(2) { top: 10.5px; }',
    '.mn-btn[aria-expanded="true"] .mn-btn-bars i:nth-child(1) { transform: translateY(5.25px) rotate(45deg); }',
    '.mn-btn[aria-expanded="true"] .mn-btn-bars i:nth-child(2) { transform: translateY(-5.25px) rotate(-45deg); }',
    '',
    '.mn-sheet {',
    '  position: fixed; inset: 0;',
    '  z-index: 99;',
    '  background: rgba(242,243,245,.96);',
    '  -webkit-backdrop-filter: blur(20px) saturate(160%);',
    '  backdrop-filter: blur(20px) saturate(160%);',
    '  opacity: 0;',
    '  pointer-events: none;',
    '  transition: opacity .26s ease;',
    '}',
    '.mn-sheet[data-open="true"] { opacity: 1; pointer-events: auto; }',
    '.mn-sheet-inner {',
    '  display: flex;',
    '  flex-direction: column;',
    '  justify-content: center;',
    '  min-height: 100%;',
    '  padding: 96px 32px 40px;',
    '}',
    '.mn-sheet ul {',
    '  list-style: none;',
    '  margin: 0; padding: 0;',
    '  display: flex;',
    '  flex-direction: column;',
    '  gap: 4px;',
    '}',
    '.mn-sheet a {',
    '  display: flex;',
    '  align-items: baseline;',
    '  gap: 12px;',
    '  padding: 14px 0;',
    '  font-size: 1.5rem;',
    '  font-weight: 500;',
    '  letter-spacing: -.015em;',
    '  color: var(--text, var(--ink, #0f0e0c));',
    '  text-decoration: none;',
    '  border-bottom: 1px solid var(--border, #d4d7de);',
    '}',
    '.mn-sheet a:active { color: var(--accent, var(--ember, #ff5e1d)); }',
    '.mn-sheet a.on { color: var(--text, var(--ink, #0f0e0c)); }',
    '.mn-sheet a.on::before {',
    '  content: "";',
    '  width: 6px; height: 6px;',
    '  border-radius: 50%;',
    '  background: var(--accent, var(--ember, #ff5e1d));',
    '  flex: none;',
    '  transform: translateY(-6px);',
    '}',
    '.mn-sheet-foot {',
    '  margin-top: 40px;',
    '  font-size: .68rem;',
    '  letter-spacing: .16em;',
    '  text-transform: uppercase;',
    '  color: var(--text-muted, var(--ash, #6b6e75));',
    '}',
    '',
    '@media (max-width: 640px) {',
    '  .mn-btn { display: block; }',
    '  .nav-tagline { display: none; }',
    '  /* the sheet replaces the inline row below this width */',
    '  nav .nav-links { display: none; }',
    '}',
    '@media (prefers-reduced-motion: reduce) {',
    '  .mn-sheet, .mn-btn-bars i { transition: none; }',
    '}'
  ].join('\n');

  var style = doc.createElement('style');
  style.id = 'mobile-nav-css';
  style.textContent = CSS;
  doc.head.appendChild(style);

  /* ── markup ── */
  var button = doc.createElement('button');
  button.className = 'mn-btn';
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', 'Menu');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'mn-sheet');
  button.innerHTML = '<span class="mn-btn-bars"><i></i><i></i></span>';

  var sheet = doc.createElement('div');
  sheet.className = 'mn-sheet';
  sheet.id = 'mn-sheet';
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'true');
  sheet.setAttribute('aria-label', 'Site navigation');
  sheet.setAttribute('data-open', 'false');

  var list = source.cloneNode(true);
  list.removeAttribute('class');
  list.removeAttribute('id');

  var inner = doc.createElement('div');
  inner.className = 'mn-sheet-inner';
  inner.appendChild(list);

  var foot = doc.createElement('div');
  foot.className = 'mn-sheet-foot';
  var tagline = nav.querySelector('.nav-tagline');
  foot.textContent = tagline ? tagline.textContent.trim() : 'Clarissa Chia';
  inner.appendChild(foot);

  sheet.appendChild(inner);
  nav.appendChild(button);
  doc.body.appendChild(sheet);

  /* ── behaviour ── */
  var open = false;
  var lastFocus = null;

  function setOpen(next, restoreFocus) {
    if (next === open) return;
    open = next;
    button.setAttribute('aria-expanded', String(open));
    sheet.setAttribute('data-open', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    if (open) {
      lastFocus = doc.activeElement;
      doc.body.style.overflow = 'hidden';
      var first = sheet.querySelector('a');
      if (first) setTimeout(function () { first.focus(); }, 60);
    } else {
      doc.body.style.overflow = '';
      // Restoring focus cancels an in-flight smooth scroll, so only do it
      // when the sheet was dismissed deliberately (Escape or the button).
      // A link click must be left alone so the anchor can still navigate.
      if (restoreFocus !== false && lastFocus && lastFocus.focus) lastFocus.focus();
    }
  }

  button.addEventListener('click', function () { setOpen(!open); });

  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && open) { setOpen(false); return; }
    if (e.key !== 'Tab' || !open) return;
    var focusables = sheet.querySelectorAll('a, button');
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey && doc.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && doc.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });

  // A tap on a link closes the sheet. The unlock has to happen before the
  // browser handles the anchor, or the page will not scroll to it.
  sheet.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;
    setOpen(false, false);
    // The sheet is removed from the flow the moment it closes, which can
    // pull the anchor target out from under the browser's scroll. Navigate
    // explicitly once the sheet is gone.
    var href = link.getAttribute('href') || '';
    if (href.charAt(0) === '#' && href.length > 1) {
      var target = doc.getElementById(href.slice(1));
      if (target) {
        e.preventDefault();
        // Wait for the body to be scrollable again. The sheet locks the
        // body with overflow:hidden, and a scroll issued while it is still
        // locked is silently dropped. setTimeout, not rAF: rAF is paused
        // in a backgrounded tab, so an rAF-based scroll would never fire
        // if the visitor opened the link in a new tab.
        var tries = 0;
        (function scrollWhenUnlocked() {
          var locked = doc.body.style.overflow === 'hidden';
          if (locked && tries < 40) { tries++; setTimeout(scrollWhenUnlocked, 16); return; }
          // A smooth scroll is silently dropped when the page is not
          // visible (background tab, prerender). Fall back to instant so
          // the destination is always reached.
          var smooth = doc.visibilityState !== 'hidden';
          target.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'start' });
        })();
      }
    }
  });

  // Leaving the mobile range resets the sheet so it cannot reappear stale.
  var wide = window.matchMedia('(min-width: 641px)');
  var onChange = function (e) { if (e.matches) setOpen(false); };
  if (wide.addEventListener) wide.addEventListener('change', onChange);
  else if (wide.addListener) wide.addListener(onChange);
})();
