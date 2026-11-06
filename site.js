// site.js — the one place the site's identity lives.
//
// Change the name here and every page follows: the landing, gallery, tools,
// the letter, and any CV edition that includes this file. `name` carries the
// same name in three scripts; the landing drifts through `nameCycle`, every
// other page shows `name.en`. To pin the landing to one script, set
// `nameCycle` to a single key, e.g. ['en'].

window.SITE = {
  name: {
    en: 'Pavel Vasilyev',
    ru: 'Павел Васильев',
    he: 'פבל וסילייב',
  },
  nameCycle: ['en', 'ru', 'he'],
  handle: 'marchdown',
  email: 'uprootiny@gmail.com',
  telegram: 'uprootiny',
  github: 'https://github.com/marchdown',
  gitlab: 'https://gitlab.com/uprootiny',
  art: 'https://dissemblage.art',
  // Donation addresses for the art. An empty address renders as "pending"
  // rather than vanishing, so a missing value is visible, not silent.
  donations: [
    { chain: 'BTC', address: '' },
    { chain: 'ETH', address: '' },
    { chain: 'XMR', address: '' },
  ],
};

// Fill every element carrying data-site="<key>" from the config above.
// Keys: name, email, telegram, github, gitlab, art, handle.
(function fill() {
  const S = window.SITE;
  const values = {
    name: S.name.en,
    handle: S.handle,
    email: S.email,
    telegram: '@' + S.telegram,
    github: S.github.replace(/^https?:\/\//, ''),
    gitlab: S.gitlab.replace(/^https?:\/\//, ''),
    art: S.art.replace(/^https?:\/\//, ''),
  };
  const hrefs = {
    email: 'mailto:' + S.email,
    telegram: 'https://t.me/' + S.telegram,
    github: S.github,
    gitlab: S.gitlab,
    art: S.art,
  };
  document.querySelectorAll('[data-site]').forEach((el) => {
    const key = el.dataset.site;
    if (key in values) el.textContent = values[key];
    if (el.tagName === 'A' && key in hrefs && !el.getAttribute('href')) el.href = hrefs[key];
  });
  if (document.title.includes('{{name}}')) {
    document.title = document.title.replace('{{name}}', S.name.en);
  }
})();
