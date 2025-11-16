import { loadContent } from '../content.js';
import { renderMarkdown, renderInlineMarkdown, renderMermaidIn } from '../markdown.js';

function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }

export async function renderAbout(root) {
  const data = await loadContent();
  const about = data.about || {};
  const name = about.name || 'About Me';
  const tagline = about.tagline || '';
  const bio = renderMarkdown(about.bio || '');
  const img = about.image || 'assets/images/placeholder.svg';

  root.innerHTML = '';

  const hero = el(`
    <section class="hero hero-stacked full-bg">
      <div class="card glass hero-copy">
        <div class="kicker">Hello</div>
        <h1 class="title">${name}</h1>
        <p class="subtitle">${tagline}</p>
        <div class="chips"></div>
      </div>
      <div class="hero-media">
        <img src="${img}" alt="${name}" />
      </div>
      <div class="card glass about-body">
        ${bio}
      </div>
    </section>
  `);
  root.appendChild(hero);

  const chips = hero.querySelector('.chips');
  (about.highlights || []).slice(0, 6).forEach(t => {
    const c = el(`<span class="chip">${t}</span>`);
    chips.appendChild(c);
  });

  if (about.interests && about.interests.length) {
    const roles = el(`
      <section class="section">
        <h2>Open to roles in:</h2>
        <div class="chips wrap">
          ${(about.interests || []).map(i => `<span class="chip chip-muted">${renderInlineMarkdown(i)}</span>`).join('')}
        </div>
      </section>
    `);
    root.appendChild(roles);
  }

  renderMermaidIn(root);
}
