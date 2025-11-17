import { loadContent } from '../content.js';
import { renderInlineMarkdown, renderMarkdown } from '../markdown.js';

function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }

export async function renderContact(root) {
  const data = await loadContent();
  const contact = data.contact || {};
  const network = contact.network || [];

  root.innerHTML = '';

  const hero = el(`
    <section class="section contact-hero glass">
      <div class="contact-hero-text">
        <h1 class="title contact-title">${renderInlineMarkdown(contact.title || "Let's Connect")}</h1>
        ${contact.subtitle ? `<p class="subtitle contact-subtitle">${renderInlineMarkdown(contact.subtitle)}</p>` : ''}
      </div>
    </section>
  `);
  root.appendChild(hero);

  const body = el(`
    <section class="section">
      <div class="card glass about-body">
        <div class="contact-body">
          ${renderMarkdown(contact.body || "I'm always interested in connecting with people working on innovative products, AI applications, or strategic challenges. Feel free to reach out!")}
        </div>
        <div class="contact-actions">
          ${renderNetworkButtons(network)}
        </div>
      </div>
    </section>
  `);
  root.appendChild(body);
}

function renderNetworkButtons(items = []) {
  if (!items.length) return '';
  return items.map((n) => {
    if (n && n.label && n.url) {
      const isEmail = /^mailto:/i.test(n.url) || /\b@/.test(n.url);
      const href = isEmail && !/^mailto:/i.test(n.url) ? `mailto:${n.url}` : n.url;
      return `<a class="contact-btn" href="${href}" target="_blank" rel="noreferrer">${renderInlineMarkdown(n.label)}</a>`;
    }
    return `<span class="contact-btn ghost">${renderInlineMarkdown(n)}</span>`;
  }).join('');
}
