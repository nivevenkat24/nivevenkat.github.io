import { loadContent } from '../content.js';
import { renderMarkdown, renderInlineMarkdown, renderMermaidIn } from '../markdown.js';

function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }

export async function renderResume(root) {
  const data = await loadContent();
  const r = data.resume || {};
  root.innerHTML = '';

  const header = el(`
    <section class="section resume-hero">
      <div class="resume-hero-top">
        <div class="kicker">Recuriter's View</div>
        <h1 class="title">Resume</h1>
        ${r.tagline ? `<p class="subtitle">${renderInlineMarkdown(r.tagline)}</p>` : ''}
      </div>
      <div class="resume-hero-actions">
        ${r.download ? `<a class="button" href="${r.download}" target="_blank" rel="noopener">Download Resume</a>` : ''}
      </div>
    </section>
  `);
  root.appendChild(header);

  if (r.summary) {
    const summary = el(`
      <section class="section">
        <div class="resume-summary card glass">${renderMarkdown(r.summary)}</div>
      </section>
    `);
    root.appendChild(summary);
  }

  renderSkills(root, r.skills);
  renderExperience(root, r.experience);
  renderEducation(root, r.education);
  renderMermaidIn(root);
}

function normalizeSkillGroups(skills = []) {
  const groups = [];
  const misc = [];
  skills.forEach((s) => {
    const m = s.split(':');
    if (m.length >= 2 && m[1].trim()) {
      const title = m[0].trim();
      const chips = m.slice(1).join(':').split(',').map(v => v.trim()).filter(Boolean);
      groups.push({ title, chips });
    } else {
      misc.push(s);
    }
  });
  if (!groups.length && misc.length) {
    groups.push({ title: 'Skills', chips: misc });
  } else if (misc.length) {
    groups.push({ title: 'Other', chips: misc });
  }
  return groups;
}

function renderSkills(root, skills = []) {
  if (!skills.length) return;
  const groups = normalizeSkillGroups(skills);
  const palette = ['tone-a', 'tone-b', 'tone-c', 'tone-d'];
  const section = el(`
    <section class="section">
      <h2 class="title">Skills</h2>
      <div class="skills-stack">
        ${groups.map((g, gi) => `
          <div class="skills-group">
            <h3>${renderInlineMarkdown(g.title)}</h3>
            <div class="chips wrap">
              ${g.chips.map((c) => `<span class="chip chip-muted ${palette[gi % palette.length]}">${renderInlineMarkdown(c)}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `);
  root.appendChild(section);
}

function renderExperience(root, items = []) {
  if (!items.length) return;
  const parsed = items.map(parseLineWithBullets);
  const section = el(`
    <section class="section">
      <h2 class="title">Experience</h2>
      <div class="experience-list">
        ${parsed.map(({ title, subtitle, bullets }) => `
          <div class="resume-card">
            <h3>${renderInlineMarkdown(title)}</h3>
            ${subtitle ? `<p class="muted">${renderInlineMarkdown(subtitle)}</p>` : ''}
            ${bullets.length ? nestedListHtml(bullets) : ''}
          </div>
        `).join('')}
      </div>
    </section>
  `);
  root.appendChild(section);
}

function renderEducation(root, items = []) {
  if (!items.length) return;
  const parsed = items.map(parseLineWithBullets);
  const section = el(`
    <section class="section">
      <h2 class="title">Education</h2>
      <div class="experience-list">
        ${parsed.map(({ title, subtitle }) => `
          <div class="resume-card">
            <h3>${renderInlineMarkdown(title)}</h3>
            ${subtitle ? `<p class="muted">${renderInlineMarkdown(subtitle)}</p>` : ''}
            ${subtitle ? '' : ''}
          </div>
        `).join('')}
      </div>
    </section>
  `);
  root.appendChild(section);
}

function parseLineWithBullets(str = '') {
  const segments = (str || '').split(';').map(s => s.trim()).filter(Boolean);
  const first = segments.shift() || '';
  let title = first;
  let subtitle = '';
  if (first.includes('|')) {
    const [t, sub] = first.split('|');
    title = t.trim();
    subtitle = sub.trim();
  }
  return { title, subtitle, bullets: segments };
}

function nestedListHtml(items = []) {
  const tree = [];
  let current = null;
  items.forEach((raw) => {
    const text = raw.trim();
    if (/^-/.test(text)) {
      const child = text.replace(/^-+\s*/, '');
      if (current) {
        current.children.push(child);
      } else {
        tree.push({ text: child, children: [] });
      }
    } else {
      const parentText = text.replace(/^\*\s*/, '');
      current = { text: parentText, children: [] };
      tree.push(current);
    }
  });

  const renderChildren = (children) => children && children.length
    ? `<ul class="list tight child">${children.map(c => `<li>${renderInlineMarkdown(c)}</li>`).join('')}</ul>`
    : '';

  return `<ul class="list tight">${tree.map(node => `
    <li>
      ${renderInlineMarkdown(node.text)}
      ${renderChildren(node.children)}
    </li>
  `).join('')}</ul>`;
}
