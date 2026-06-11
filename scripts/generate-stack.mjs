// Generates the per-card tech stack SVGs (light + dark) in assets/cards/.
// Labels are converted to vector paths so typography renders identically
// on every OS, matching the vectorized header.
//
// Usage: npm run generate

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import {
  siAngular,
  siSpringboot,
  siNodedotjs,
  siNextdotjs,
  siDocker,
  siPostgresql,
  siGithubactions,
  siClaude,
  siOpenai,
} from 'simple-icons';

// Classic Java coffee cup from devicon (MIT) — simple-icons doesn't ship it
// (Oracle trademark). box: source viewBox size (simple-icons icons are 24).
const javaCup = {
  box: 128,
  hex: '0074BD',
  path: 'M47.617 98.12c-19.192 5.362 11.677 16.439 36.115 5.969-4.003-1.556-6.874-3.351-6.874-3.351-10.897 2.06-15.952 2.222-25.844 1.092-8.164-.935-3.397-3.71-3.397-3.71zm33.189-10.46c-14.444 2.779-22.787 2.69-33.354 1.6-8.171-.845-2.822-4.805-2.822-4.805-21.137 7.016 11.767 14.977 41.309 6.336-3.14-1.106-5.133-3.131-5.133-3.131zm11.319-60.575c.001 0-42.731 10.669-22.323 34.187 6.024 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.793 15.634-29.58zm9.998 81.144s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.095.171-4.45-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.952-3.487-32.013 6.85-13.742 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM85 77.896c2.395-1.634 5.703-3.053 5.703-3.053s-9.424 1.685-18.813 2.474c-11.494.964-23.823 1.154-30.012.326-14.652-1.959 8.033-7.348 8.033-7.348s-8.812-.596-19.644 4.644C17.455 81.134 61.958 83.958 85 77.896zm5.609 15.145c-.108.29-.468.616-.468.616 31.273-8.221 19.775-28.979 4.822-23.725-1.312.464-2 1.543-2 1.543s.829-.334 2.678-.72c7.559-1.575 18.389 10.119-5.032 22.286zM64.181 70.069c-4.614-10.429-20.26-19.553.007-35.559C89.459 14.563 76.492 1.587 76.492 1.587c5.23 20.608-18.451 26.833-26.999 39.667-5.821 8.745 2.857 18.142 14.688 28.815zm27.274 51.748c-19.187 3.612-42.854 3.191-56.887.874 0 0 2.874 2.38 17.646 3.331 22.476 1.437 57-.8 57.816-11.436.001 0-1.57 4.032-18.575 7.231z',
};

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'assets', 'cards');

// Vectorization fonts. Segoe UI mirrors GitHub's system font stack on Windows;
// since the text is baked into paths, every viewer sees the same glyphs.
const FONT_TITLE = opentype.loadSync('C:/Windows/Fonts/seguisb.ttf'); // Segoe UI Semibold
const FONT_SUB = opentype.loadSync('C:/Windows/Fonts/segoeui.ttf'); // Segoe UI

const THEMES = {
  light: { bg: '#f6f8fa', border: '#d0d7de', title: '#1f2328', sub: '#57606a', chipOpacity: 0.12 },
  dark: { bg: '#161b22', border: '#30363d', title: '#e6edf3', sub: '#9aa4af', chipOpacity: 0.16 },
};

// color: per-theme override when the brand color lacks contrast on one theme.
const CARDS = [
  { id: 'angular', icon: siAngular, title: 'Angular', sub: 'Frontend', href: 'https://angular.dev', color: { light: '#DD0031', dark: '#DD0031' } },
  { id: 'spring-boot', icon: siSpringboot, title: 'Spring Boot', sub: 'Backend', href: 'https://spring.io/projects/spring-boot' },
  { id: 'java', icon: javaCup, title: 'Java', sub: 'Language', href: 'https://dev.java', color: { dark: '#4d9fdb' } },
  { id: 'jsf', icon: javaCup, title: 'JSF', sub: 'JavaServer Faces', href: 'https://jakarta.ee/specifications/faces/', color: { light: '#E76F00', dark: '#f08c2e' } },
  { id: 'nodejs', icon: siNodedotjs, title: 'Node.js', sub: 'Runtime', href: 'https://nodejs.org' },
  { id: 'nextjs', icon: siNextdotjs, title: 'Next.js', sub: 'React framework', href: 'https://nextjs.org', color: { dark: '#e6edf3' } },
  { id: 'docker', icon: siDocker, title: 'Docker', sub: 'Containers', href: 'https://www.docker.com' },
  { id: 'postgresql', icon: siPostgresql, title: 'PostgreSQL', sub: 'Database', href: 'https://www.postgresql.org' },
  { id: 'cicd', icon: siGithubactions, title: 'CI/CD', sub: 'GitHub Actions', href: 'https://github.com/features/actions' },
  { id: 'claude', icon: siClaude, title: 'Claude Code', sub: 'AI agent', href: 'https://claude.com/claude-code' },
  { id: 'codex', icon: siOpenai, title: 'Codex', sub: 'AI agent', href: 'https://openai.com/codex', color: { dark: '#e6edf3' } },
];

const W = 178;
const H = 52;
const TEXT_X = 54;
const TEXT_MAX = W - TEXT_X - 12;
const TITLE_SIZE = 13.5;
const SUB_SIZE = 11;
const ICON_SIZE = 20; // rendered size inside the 32px chip

function textPath(font, text, x, y, size) {
  const width = font.getAdvanceWidth(text, size);
  if (width > TEXT_MAX) {
    console.warn(`warning: "${text}" is ${width.toFixed(1)}px wide (max ${TEXT_MAX}px) — may overflow`);
  }
  return font.getPath(text, x, y, size).toPathData(2);
}

function cardSvg(card, theme, delay) {
  const t = THEMES[theme];
  const color = card.color?.[theme] ?? `#${card.icon.hex}`;
  const iconScale = (ICON_SIZE / (card.icon.box ?? 24)).toFixed(5);
  const label = `${card.title} — ${card.sub}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
<title>${label}</title>
<style>
.card { opacity: 0; transform: translateY(4px); animation: in .5s ease-out ${delay}s forwards; }
@keyframes in { to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .card { animation: none; opacity: 1; transform: none; } }
</style>
<g class="card">
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="10" fill="${t.bg}" stroke="${t.border}"/>
<rect x="12" y="10" width="32" height="32" rx="8" fill="${color}" fill-opacity="${t.chipOpacity}"/>
<path transform="translate(18,16) scale(${iconScale})" fill="${color}" d="${card.icon.path}"/>
<path fill="${t.title}" d="${textPath(FONT_TITLE, card.title, TEXT_X, 22.5, TITLE_SIZE)}"/>
<path fill="${t.sub}" d="${textPath(FONT_SUB, card.sub, TEXT_X, 38.5, SUB_SIZE)}"/>
</g>
</svg>
`;
}

mkdirSync(OUT_DIR, { recursive: true });

CARDS.forEach((card, i) => {
  const delay = (0.05 + i * 0.05).toFixed(2);
  for (const theme of Object.keys(THEMES)) {
    const file = join(OUT_DIR, `${card.id}-${theme}.svg`);
    writeFileSync(file, cardSvg(card, theme, delay), 'utf8');
    console.log(`wrote ${file}`);
  }
});

// README snippet, ready to paste.
console.log('\n--- README block ---\n<p>');
for (const card of CARDS) {
  console.log(`  <a href="${card.href}"><picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/cards/${card.id}-dark.svg">
    <img alt="${card.title} — ${card.sub}" src="assets/cards/${card.id}-light.svg" width="${W}" height="${H}">
  </picture></a>`);
}
console.log('</p>');
