// feed.js — renders projects.json into a scroll-fed list.
//
// The page sets data-kind="gallery" or "tool" on <main class="feed">. Items
// arrive in small batches as the reader scrolls (IntersectionObserver on a
// sentinel), fading in as they land. When the list is spent the sentinel
// says so and points at the full archives, so the end is visible, not silent.

(async function () {
  const main = document.querySelector('main.feed');
  if (!main) return;
  const kind = main.dataset.kind;
  const BATCH = 3;

  let items = [], earlier = [];
  try {
    const res = await fetch('projects.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('projects.json ' + res.status);
    const all = (await res.json()).items.filter((it) => it.kind === kind);
    items = all.filter((it) => it.era !== 'earlier');     // the AI-era work carries the page
    earlier = all.filter((it) => it.era === 'earlier');   // the rest folds up at the end
  } catch (err) {
    main.innerHTML = `<p class="lede">The list did not load (${err.message}). The archives are at
      <a data-site="github" href="${SITE.github}"></a> and <a data-site="gitlab" href="${SITE.gitlab}"></a>.</p>`;
    return;
  }

  const sentinel = document.createElement('div');
  sentinel.className = 'sentinel';
  main.after(sentinel);

  const statusText = { live: 'live', repo: 'source', private: 'private · walkthrough on request' };
  let cursor = 0;

  function renderOne(it) {
    const el = document.createElement('article');
    el.className = 'item';
    const title = it.url
      ? `<a href="${it.url}"${it.url.startsWith('http') ? ' rel="noopener"' : ''}>${it.name}</a>`
      : `<span class="private">${it.name}</span>`;
    const meta = it.meta.map((m) => `<span>${m}</span>`).join('');
    el.innerHTML = `
      <div class="title">${title}</div>
      <p class="line">${it.line}</p>
      <div class="meta">${meta}<span class="status ${it.status}">${statusText[it.status] || it.status}</span></div>`;
    main.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
  }

  function more() {
    const end = Math.min(cursor + BATCH, items.length);
    for (; cursor < end; cursor++) renderOne(items[cursor]);
    if (cursor >= items.length) {
      observer.disconnect();
      if (earlier.length) {
        const fold = document.createElement('details');
        fold.className = 'earlier';
        fold.innerHTML = `<summary>earlier work · ${earlier.length}</summary><ul>` + earlier.map((it) =>
          `<li>${it.url ? `<a href="${it.url}" rel="noopener">${it.name}</a>` : it.name}
             <span class="meta">${it.meta.join(' · ')}</span> <span class="line">${it.line}</span></li>`).join('') + '</ul>';
        main.appendChild(fold);
      }
      sentinel.innerHTML = `that is the better-baked ${kind === 'gallery' ? 'art' : 'tooling'} ·
        the rest lives at <a href="${SITE.github}">${SITE.github.replace(/^https?:\/\//, '')}</a>
        and <a href="${SITE.gitlab}">${SITE.gitlab.replace(/^https?:\/\//, '')}</a>`;
      return;
    }
    // If the sentinel is still in view after this batch, the observer will not
    // fire again on its own (no change of state), so re-observe to ask once more.
    requestAnimationFrame(() => { observer.unobserve(sentinel); observer.observe(sentinel); });
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) more();
  }, { rootMargin: '240px 0px' });

  more();
  observer.observe(sentinel);
})();

// Donation addresses: short form shown, full address copied on click; an
// empty address is shown as pending so a missing value is never silent.
(function donations() {
  const host = document.querySelector('.addr');
  if (!host) return;
  host.innerHTML = SITE.donations.map(({ chain, address }) => {
    if (!address) return `<span><span class="chain">${chain}</span><span class="pending">address pending</span></span>`;
    const short = address.length > 16 ? address.slice(0, 8) + '…' + address.slice(-6) : address;
    return `<span><span class="chain">${chain}</span><button type="button" data-copy="${address}" title="copy ${chain} address">${short}</button></span>`;
  }).join('');
  host.addEventListener('click', async (ev) => {
    const b = ev.target.closest('button[data-copy]');
    if (!b) return;
    try {
      await navigator.clipboard.writeText(b.dataset.copy);
      const was = b.textContent;
      b.textContent = 'copied';
      setTimeout(() => { b.textContent = was; }, 1400);
    } catch (_) {
      b.textContent = b.dataset.copy;  // fall back to showing it in full
    }
  });
})();
