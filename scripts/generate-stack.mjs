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
  siOpenjdk,
  siNodedotjs,
  siNextdotjs,
  siDocker,
  siPostgresql,
  siGithubactions,
} from 'simple-icons';

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
  { id: 'java', icon: siOpenjdk, title: 'Java', sub: 'Language', href: 'https://openjdk.org', color: { dark: '#6e9fc7' } },
  { id: 'nodejs', icon: siNodedotjs, title: 'Node.js', sub: 'Runtime', href: 'https://nodejs.org' },
  { id: 'nextjs', icon: siNextdotjs, title: 'Next.js', sub: 'React framework', href: 'https://nextjs.org', color: { dark: '#e6edf3' } },
  { id: 'docker', icon: siDocker, title: 'Docker', sub: 'Containers', href: 'https://www.docker.com' },
  { id: 'postgresql', icon: siPostgresql, title: 'PostgreSQL', sub: 'Database', href: 'https://www.postgresql.org' },
  { id: 'cicd', icon: siGithubactions, title: 'CI/CD', sub: 'GitHub Actions', href: 'https://github.com/features/actions' },
];

const W = 178;
const H = 52;
const TEXT_X = 54;
const TEXT_MAX = W - TEXT_X - 12;
const TITLE_SIZE = 13.5;
const SUB_SIZE = 11;
const ICON_SCALE = (20 / 24).toFixed(5); // 24px source grid -> 20px inside the chip

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
<path transform="translate(18,16) scale(${ICON_SCALE})" fill="${color}" d="${card.icon.path}"/>
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
