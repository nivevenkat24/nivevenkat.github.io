import { readFileSync } from 'fs';
import { execSync } from 'child_process';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function runBuild() {
  execSync('npm run build', { stdio: 'inherit' });
}

function loadData() {
  return JSON.parse(readFileSync('public/data.json', 'utf8'));
}

function hasLabelUrl(item) {
  return item && typeof item.label === 'string' && item.label.trim() && typeof item.url === 'string' && item.url.trim();
}

function testAbout(about) {
  assert(about, 'about missing');
  assert(about.name, 'about.name missing');
  assert(about.tagline, 'about.tagline missing');
  assert(Array.isArray(about.roles) && about.roles.length, 'about.roles missing or empty');
  assert(Array.isArray(about.interests) && about.interests.length, 'about.interests missing or empty');
}

function testContact(contact) {
  assert(contact, 'contact missing');
  assert(contact.title, 'contact.title missing');
  assert(contact.body, 'contact.body missing');
  assert(Array.isArray(contact.network), 'contact.network should be array');
  contact.network.forEach((n, idx) => {
    assert(hasLabelUrl(n), `contact.network[${idx}] missing label or url`);
  });
}

function testResume(resume) {
  assert(resume, 'resume missing');
  assert(Array.isArray(resume.skills) && resume.skills.length, 'resume.skills missing or empty');
  assert(Array.isArray(resume.experience) && resume.experience.length, 'resume.experience missing or empty');
  assert(Array.isArray(resume.education) && resume.education.length, 'resume.education missing or empty');
}

function testProjects(projects) {
  assert(Array.isArray(projects) && projects.length, 'projects missing or empty');
  projects.forEach((p, idx) => {
    assert(p.title || p.subtitle, `project[${idx}] missing title/subtitle`);
  });
}

function main() {
  runBuild();
  const data = loadData();
  assert(data.generatedAt, 'generatedAt missing');
  testAbout(data.about);
  testContact(data.contact);
  testResume(data.resume);
  testProjects(data.projects);
  console.log('Content sanity checks passed.');
}

main();
