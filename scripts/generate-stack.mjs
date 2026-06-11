// Generates the tech stack section dividers (assets/sections/) and per-card
// SVGs (assets/cards/), each in light + dark variants. Labels are converted
// to vector paths so typography renders identically on every OS, matching
// the vectorized header.
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
  siReact,
  siDocker,
  siPostgresql,
  siGithubactions,
  siClaude,
  siOpenai,
} from 'simple-icons';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CARDS_DIR = join(ROOT, 'assets', 'cards');
const SECTIONS_DIR = join(ROOT, 'assets', 'sections');

// Vectorization fonts. Segoe UI mirrors GitHub's system font stack on Windows;
// since the text is baked into paths, every viewer sees the same glyphs.
const FONT_TITLE = opentype.loadSync('C:/Windows/Fonts/seguisb.ttf'); // Segoe UI Semibold
const FONT_SUB = opentype.loadSync('C:/Windows/Fonts/segoeui.ttf'); // Segoe UI

const THEMES = {
  light: {
    bg: '#f6f8fa', border: '#d0d7de', title: '#1f2328', sub: '#57606a',
    chipOpacity: 0.12, dot: '#2ea043', rule: '#8c959f',
  },
  dark: {
    bg: '#161b22', border: '#30363d', title: '#e6edf3', sub: '#9aa4af',
    chipOpacity: 0.16, dot: '#39d353', rule: '#586069',
  },
};

// Classic Java coffee cup from devicon (MIT) — simple-icons doesn't ship it
// (Oracle trademark). box: source viewBox size (simple-icons icons are 24).
const javaCup = {
  box: 128,
  hex: '0074BD',
  path: 'M47.617 98.12c-19.192 5.362 11.677 16.439 36.115 5.969-4.003-1.556-6.874-3.351-6.874-3.351-10.897 2.06-15.952 2.222-25.844 1.092-8.164-.935-3.397-3.71-3.397-3.71zm33.189-10.46c-14.444 2.779-22.787 2.69-33.354 1.6-8.171-.845-2.822-4.805-2.822-4.805-21.137 7.016 11.767 14.977 41.309 6.336-3.14-1.106-5.133-3.131-5.133-3.131zm11.319-60.575c.001 0-42.731 10.669-22.323 34.187 6.024 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.793 15.634-29.58zm9.998 81.144s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.095.171-4.45-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.952-3.487-32.013 6.85-13.742 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM85 77.896c2.395-1.634 5.703-3.053 5.703-3.053s-9.424 1.685-18.813 2.474c-11.494.964-23.823 1.154-30.012.326-14.652-1.959 8.033-7.348 8.033-7.348s-8.812-.596-19.644 4.644C17.455 81.134 61.958 83.958 85 77.896zm5.609 15.145c-.108.29-.468.616-.468.616 31.273-8.221 19.775-28.979 4.822-23.725-1.312.464-2 1.543-2 1.543s.829-.334 2.678-.72c7.559-1.575 18.389 10.119-5.032 22.286zM64.181 70.069c-4.614-10.429-20.26-19.553.007-35.559C89.459 14.563 76.492 1.587 76.492 1.587c5.23 20.608-18.451 26.833-26.999 39.667-5.821 8.745 2.857 18.142 14.688 28.815zm27.274 51.748c-19.187 3.612-42.854 3.191-56.887.874 0 0 2.874 2.38 17.646 3.331 22.476 1.437 57-.8 57.816-11.436.001 0-1.57 4.032-18.575 7.231z',
};

// color: per-theme override when the brand color lacks contrast on one theme.
const SECTIONS = [
  {
    id: 'languages',
    title: 'Languages & Frameworks',
    cards: [
      { id: 'angular', icon: siAngular, title: 'Angular', sub: 'Frontend', color: { light: '#DD0031', dark: '#DD0031' } },
      { id: 'react', icon: siReact, title: 'React', sub: 'UI library', color: { light: '#087EA4' } },
      { id: 'nextjs', icon: siNextdotjs, title: 'Next.js', sub: 'React framework', color: { dark: '#e6edf3' } },
      { id: 'spring-boot', icon: siSpringboot, title: 'Spring Boot', sub: 'Backend' },
      { id: 'java', icon: javaCup, title: 'Java', sub: 'Language', color: { dark: '#4d9fdb' } },
      { id: 'jsf', icon: javaCup, title: 'JSF', sub: 'JavaServer Faces', color: { light: '#E76F00', dark: '#f08c2e' } },
      { id: 'nodejs', icon: siNodedotjs, title: 'Node.js', sub: 'Runtime' },
    ],
  },
  {
    id: 'infra',
    title: 'Infrastructure & Data',
    cards: [
      { id: 'docker', icon: siDocker, title: 'Docker', sub: 'Containers' },
      { id: 'postgresql', icon: siPostgresql, title: 'PostgreSQL', sub: 'Database' },
      { id: 'cicd', icon: siGithubactions, title: 'CI/CD', sub: 'GitHub Actions' },
    ],
  },
  {
    id: 'ai',
    title: 'AI Tooling',
    cards: [
      { id: 'claude', icon: siClaude, title: 'Claude Code', sub: 'AI agent' },
      { id: 'codex', icon: siOpenai, title: 'Codex', sub: 'AI agent', color: { dark: '#e6edf3' } },
    ],
  },
];

const W = 178;
const H = 52;
const TEXT_X = 54;
const TEXT_MAX = W - TEXT_X - 12;
const TITLE_SIZE = 13.5;
const SUB_SIZE = 11;
const ICON_SIZE = 20; // rendered size inside the 32px chip
const DIVIDER_H = 20;
const DIVIDER_FONT = 10;
const DIVIDER_LS = 0.08; // letter spacing, em
const RULE_LEN = 90;

const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function textPath(font, text, x, y, size, options) {
  const width = font.getAdvanceWidth(text, size, options);
  if (width > TEXT_MAX && !options) {
    console.warn(`warning: "${text}" is ${width.toFixed(1)}px wide (max ${TEXT_MAX}px) — may overflow`);
  }
  return font.getPath(text, x, y, size, options).toPathData(2);
}

const motionCss = (cls, delay, slide) => `
.${cls} { opacity: 0;${slide ? ' transform: translateY(4px);' : ''} animation: in .5s ease-out ${delay}s forwards; }
@keyframes in { to { opacity: 1;${slide ? ' transform: translateY(0);' : ''} } }
@media (prefers-reduced-motion: reduce) { .${cls} { animation: none; opacity: 1;${slide ? ' transform: none;' : ''} } }
`;

function cardSvg(card, theme, delay) {
  const t = THEMES[theme];
  const color = card.color?.[theme] ?? `#${card.icon.hex}`;
  const iconScale = (ICON_SIZE / (card.icon.box ?? 24)).toFixed(5);
  const label = escapeXml(`${card.title} — ${card.sub}`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
<title>${label}</title>
<style>${motionCss('card', delay, true)}</style>
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

function dividerSvg(section, theme, delay) {
  const t = THEMES[theme];
  const label = section.title.toUpperCase();
  const opts = { letterSpacing: DIVIDER_LS };
  const textW = FONT_TITLE.getAdvanceWidth(label, DIVIDER_FONT, opts);
  const ruleX = Math.ceil(16 + textW + 10);
  const width = ruleX + RULE_LEN;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${DIVIDER_H}" viewBox="0 0 ${width} ${DIVIDER_H}" role="img" aria-label="${escapeXml(section.title)}">
<title>${escapeXml(section.title)}</title>
<style>${motionCss('d', delay, false)}</style>
<defs>
<linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="${t.rule}" stop-opacity="0.45"/>
<stop offset="1" stop-color="${t.rule}" stop-opacity="0"/>
</linearGradient>
</defs>
<g class="d">
<circle cx="5" cy="10.5" r="3" fill="${t.dot}"/>
<path fill="${t.sub}" d="${textPath(FONT_TITLE, label, 16, 14, DIVIDER_FONT, opts)}"/>
<rect x="${ruleX}" y="10" width="${RULE_LEN}" height="1" fill="url(#fade)"/>
</g>
<desc>w=${width}</desc>
</svg>
`;
}

mkdirSync(CARDS_DIR, { recursive: true });
mkdirSync(SECTIONS_DIR, { recursive: true });

const readme = [];
let cardIndex = 0;

for (const section of SECTIONS) {
  const dividerDelay = (cardIndex * 0.05).toFixed(2);
  const widths = {};
  for (const theme of Object.keys(THEMES)) {
    const svg = dividerSvg(section, theme, dividerDelay);
    widths[theme] = svg.match(/w=(\d+)/)[1];
    const file = join(SECTIONS_DIR, `${section.id}-${theme}.svg`);
    writeFileSync(file, svg.replace(/\n<desc>w=\d+<\/desc>/, ''), 'utf8');
    console.log(`wrote ${file}`);
  }
  readme.push(`<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/sections/${section.id}-dark.svg">
  <img alt="${section.title.replace(/&/g, 'and')}" src="assets/sections/${section.id}-light.svg" width="${widths.light}" height="${DIVIDER_H}">
</picture>
<p>`);

  for (const card of section.cards) {
    const delay = (0.05 + cardIndex * 0.05).toFixed(2);
    cardIndex++;
    for (const theme of Object.keys(THEMES)) {
      const file = join(CARDS_DIR, `${card.id}-${theme}.svg`);
      writeFileSync(file, cardSvg(card, theme, delay), 'utf8');
      console.log(`wrote ${file}`);
    }
    readme.push(`  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/cards/${card.id}-dark.svg">
    <img alt="${card.title} — ${card.sub}" src="assets/cards/${card.id}-light.svg" width="${W}" height="${H}">
  </picture>`);
  }
  readme.push('</p>\n');
}

console.log('\n--- README block ---\n');
console.log(readme.join('\n'));
