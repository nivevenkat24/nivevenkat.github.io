import { loadContent } from '../content.js';
import { renderMarkdown, renderInlineMarkdown, renderMermaidIn } from '../markdown.js';

function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }

export async function renderProjects(root) {
  const data = await loadContent();
  const projects = data.projects || [];

  root.innerHTML = '';
  const header = el(`
    <section class="section">
      <div class="kicker">Work</div>
      <h1 class="title">Projects</h1>
      <p class="muted">A selection of AI, automation, and engineering tools.</p>
    </section>
  `);
  root.appendChild(header);

  const grid = el(`<section class="grid"></section>`);
  root.appendChild(grid);

  projects.forEach(p => {
    const img = p.image || 'assets/images/project-placeholder.svg';
    const card = el(`
      <article class="card glass">
        <img class="project-image" loading="lazy" decoding="async" src="${img}" alt="${p.title || 'Project'}" />
        <h3>${p.title || 'Untitled Project'}</h3>
        ${p.subtitle ? `<p class="muted">${renderInlineMarkdown(p.subtitle)}</p>` : ''}
        <div class="chips">${(p.tags || []).map(t => `<span class='chip'>${t}</span>`).join('')}</div>
      </article>
    `);
    grid.appendChild(card);

    card.addEventListener('click', () => showProjectModal(p));
  });

  renderMermaidIn(root);
}

function showProjectModal(p) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(0,0,0,0.5)';
  overlay.style.backdropFilter = 'blur(4px)';
  overlay.style.zIndex = '100';
  overlay.style.overflowY = 'auto';

  const modal = el(`
    <div class="card glass" style="max-width:900px;margin:40px auto;padding:20px;max-height:90vh;overflow:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <h3 style="margin:0">${p.title || ''}</h3>
        <button class="button" id="closeModal">Close</button>
      </div>
      ${p.image ? `<img class='project-image project-modal-img' src='${p.image}' alt='${p.title || ''}' />` : ''}
      ${(p.tags || []).length ? `<div class='chips' style='margin:6px 0 10px;'>${(p.tags || []).map(t => `<span class='chip'>${renderInlineMarkdown(t)}</span>`).join('')}</div>` : ''}
      ${p.overview ? `<div class='muted'>${renderMarkdown(p.overview)}</div>` : ''}
      ${p.demo_gif || p.gif ? `<img class='project-image project-demo-img' src='${p.demo_gif || p.gif}' alt='${p.title || ''} demo' />` : ''}
      ${section('Stack', p.stack)}
      ${section('Focus', p.focus)}
      ${section('Target Users', p.target_users)}
      ${section('Impact', p.impact)}
      ${section('Future Enhancements', p.future || p.future_enhancements)}
      ${links(p.links)}
    </div>
  `);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  renderMermaidIn(modal);
  modal.querySelector('#closeModal').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

function section(title, arr) {
  if (!arr || !arr.length) return '';
  return `
    <div class='section'>
      <h2>${title}</h2>
      <div class='chips wrap'>${arr.map(i => `<span class='chip chip-muted'>${renderInlineMarkdown(i)}</span>`).join('')}</div>
    </div>
  `;
}

function links(items) {
  if (!items || !items.length) return '';
  return `
    <div class='section'>
      <h2>Links</h2>
      <div class='chips'>${items.map(i => `<a class='chip' href='${i.url}' target='_blank' rel='noopener'>${renderInlineMarkdown(i.label)}</a>`).join('')}</div>
    </div>
  `;
}
