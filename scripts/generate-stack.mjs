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
  siTypescript,
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

// AWS wordmark from devicon (MIT) — simple-icons doesn't ship it (trademark).
const awsLogo = {
  box: 128,
  hex: 'FF9900',
  path: 'M108.59 26.148c-1.852 0-3.622.211-5.305.715-1.684.504-3.117 1.223-4.379 2.188a10.829 10.829 0 0 0-3.031 3.453c-.757 1.348-1.137 2.906-1.137 4.676 0 2.187.716 4.25 2.106 6.105 1.386 1.895 3.66 3.324 6.734 4.293l6.106 1.895c2.062.675 3.496 1.391 4.254 2.191.757.801 1.136 1.765 1.136 2.945 0 1.726-.758 3.074-2.191 4-1.43.925-3.492 1.391-6.145 1.391-1.687 0-3.328-.168-5.011-.504a23.102 23.102 0 0 1-4.633-1.476c-.421-.168-.801-.336-1.051-.418a2.357 2.357 0 0 0-.758-.13c-.634 0-.969.423-.969 1.305v2.149a2.919 2.919 0 0 0 .254 1.18c.168.38.629.8 1.305 1.18 1.094.628 2.734 1.179 4.84 1.683 2.105.504 4.297.758 6.484.758 2.15 0 4.129-.297 6.024-.883 1.808-.551 3.367-1.309 4.672-2.36 1.304-1.01 2.316-2.273 3.074-3.707.714-1.429 1.094-3.07 1.094-4.882 0-2.188-.633-4.168-1.938-5.895-1.304-1.727-3.491-3.074-6.523-4.043l-5.98-1.895c-2.23-.713-3.79-1.516-4.634-2.316-.84-.797-1.261-1.808-1.261-2.988 0-1.726.671-2.95 1.98-3.746 1.305-.801 3.199-1.18 5.598-1.18 2.988 0 5.683.547 8.086 1.64.714.337 1.261.508 1.597.508.633 0 .969-.463.969-1.347v-1.98c0-.59-.125-1.051-.379-1.391-.25-.378-.672-.715-1.262-1.051-.422-.254-1.011-.504-1.77-.758a32.528 32.528 0 0 0-2.398-.676c-.886-.168-1.769-.336-2.738-.46a21.347 21.347 0 0 0-2.82-.169zm-86.822.082c-2.316 0-4.508.254-6.57.801-2.063.505-3.831 1.137-5.303 1.895-.59.297-.97.59-1.18.883-.211.296-.293.8-.293 1.476v2.063c0 .882.293 1.304.883 1.304.168 0 .378-.043.674-.125.293-.086.796-.254 1.472-.547a33.416 33.416 0 0 1 4.547-1.433A19.176 19.176 0 0 1 20.547 32c3.242 0 5.513.633 6.863 1.938 1.304 1.303 1.98 3.534 1.98 6.734v3.074c-1.683-.379-3.283-.715-4.843-.926-1.558-.21-3.031-.336-4.461-.336-4.34 0-7.75 1.094-10.316 3.286-2.571 2.187-3.832 5.093-3.832 8.671 0 3.368 1.05 6.063 3.113 8.086 2.066 2.02 4.887 3.032 8.422 3.032 4.97 0 9.097-1.938 12.379-5.813a34.153 34.153 0 0 0 1.304 2.484 13.28 13.28 0 0 0 1.516 1.98c.422.38.844.59 1.266.59.334 0 .714-.128 1.093-.378l2.653-1.77c.546-.42.8-.843.8-1.261a1.86 1.86 0 0 0-.293-.97 22.469 22.469 0 0 1-1.347-3.03c-.297-.925-.465-2.19-.465-3.75h-.086V40c0-4.633-1.176-8.086-3.492-10.36-2.36-2.273-6.025-3.41-11.033-3.41zm19.58 1.012c-.676 0-1.012.379-1.012 1.051 0 .297.129.844.379 1.687l9.894 32.547c.254.8.547 1.387.887 1.641.336.297.84.422 1.598.422h3.62c.759 0 1.347-.125 1.684-.422.34-.293.591-.84.801-1.684l6.485-27.117 6.527 27.16c.168.84.46 1.387.8 1.684.337.292.883.422 1.684.422h3.621c.715 0 1.262-.167 1.598-.422.34-.253.633-.8.887-1.64L90.949 30.02c.168-.46.25-.797.293-1.051.043-.254.086-.466.086-.676 0-.715-.379-1.05-1.055-1.05H86.36c-.757 0-1.308.166-1.644.421-.293.25-.59.8-.84 1.64L76.59 57.517l-6.653-28.211c-.166-.8-.464-1.39-.8-1.64-.336-.298-.884-.423-1.684-.423h-3.367c-.758 0-1.348.167-1.688.422-.335.25-.588.8-.796 1.64l-6.57 27.876-7.075-27.875c-.25-.8-.504-1.39-.84-1.64-.297-.298-.844-.423-1.644-.423h-4.125zM21.64 47.496a31.816 31.816 0 0 1 3.96.25 34.401 34.401 0 0 1 3.872.719v1.765c0 1.435-.168 2.653-.422 3.665-.25 1.01-.758 1.895-1.43 2.695-1.137 1.262-2.484 2.187-4 2.695-1.516.504-2.949.758-4.336.758-1.937 0-3.41-.508-4.422-1.559-1.054-1.01-1.558-2.484-1.558-4.464 0-2.106.675-3.704 2.062-4.84 1.391-1.137 3.454-1.684 6.274-1.684zM118 73.348c-4.432.063-9.664 1.052-13.621 3.832-1.223.883-1.012 2.062.336 1.894 4.508-.547 14.44-1.726 16.21.547 1.77 2.23-1.976 11.62-3.663 15.79-.504 1.26.59 1.769 1.726.8 7.41-6.231 9.348-19.242 7.832-21.137-.757-.925-4.388-1.79-8.82-1.726zM1.63 75.859c-.926.116-1.347 1.236-.368 2.121 16.508 14.902 38.359 23.872 62.613 23.872 17.305 0 37.43-5.43 51.281-15.66 2.273-1.689.298-4.254-2.02-3.204-15.533 6.57-32.421 9.77-47.788 9.77-22.778 0-44.8-6.273-62.653-16.633-.39-.231-.755-.304-1.064-.266z',
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
      { id: 'typescript', icon: siTypescript, title: 'TypeScript', sub: 'Language' },
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
      { id: 'aws', icon: awsLogo, title: 'AWS', sub: 'Cloud services' },
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
