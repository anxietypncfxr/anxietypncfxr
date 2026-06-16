// build-decor.mjs — milky-pink decorative SVGs: an animated fade-through
// tagline and a twinkling pixel-heart divider. Self-contained (font embedded).
// Output: assets/tagline.svg, assets/divider.svg
import { readFileSync, writeFileSync } from 'node:fs';

const b64 = (p) => readFileSync(new URL(p, import.meta.url)).toString('base64');
const LAT = b64('./fonts/pixelify-latin.woff2');
const LATEXT = b64('./fonts/pixelify-latin-ext.woff2');

const C = {
  rose: '#E48BAE',
  pink: '#FFB3CD',
  pinkHi: '#FF9BBE',
  soft: '#F3C4D6',
  deep: '#EEA9C5',
};

// ── pixel heart (7x6) ──
function heart(x, y, p, fill, dur, delay) {
  const cells = [
    [1, 0], [2, 0], [4, 0], [5, 0],
    [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
    [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
    [2, 4], [3, 4], [4, 4],
    [3, 5],
  ];
  const r = cells.map(([cx, cy]) => `<rect x="${cx * p}" y="${cy * p}" width="${p}" height="${p}"/>`).join('');
  return `<g class="bt" style="--d:${dur}s;--dl:${delay}s" transform="translate(${x} ${y})" fill="${fill}">${r}</g>`;
}

function sparkle(x, y, s, fill, dur, delay) {
  const u = s;
  return `<g class="sp" style="--d:${dur}s;--dl:${delay}s" transform="translate(${x} ${y})" fill="${fill}">
    <rect x="${-u / 2}" y="${-u * 1.5}" width="${u}" height="${u}"/>
    <rect x="${-u / 2}" y="${u / 2}" width="${u}" height="${u}"/>
    <rect x="${-u * 1.5}" y="${-u / 2}" width="${u}" height="${u}"/>
    <rect x="${u / 2}" y="${-u / 2}" width="${u}" height="${u}"/>
    <rect x="${-u / 2}" y="${-u / 2}" width="${u}" height="${u}"/>
  </g>`;
}

// ─────────────────────────── tagline.svg ───────────────────────────
const phrases = [
  "hi, i'm raphael ♡",
  'postgres whisperer',
  'a gopher in a pink hoodie',
  'zero-trust dreamer',
];
const TW = 760, TH = 56;
const cycle = phrases.length * 3.4; // s
const lines = phrases.map((p, i) =>
  `<text class="ph" style="--dl:${(i * cycle / phrases.length).toFixed(2)}s" x="${TW / 2}" y="37" text-anchor="middle" font-size="27" font-weight="600" fill="${C.rose}">${p}</text>`
).join('\n    ');

const tagline = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TW} ${TH}" width="${TW}" height="${TH}" font-family="'Pixelify Sans', monospace">
  <defs>
    <style>
      @font-face{font-family:'Pixelify Sans';font-weight:400 700;src:url(data:font/woff2;base64,${LAT}) format('woff2');unicode-range:U+0000-00FF,U+2000-206F,U+2122,U+2661,U+2665,U+2764;}
      @font-face{font-family:'Pixelify Sans';font-weight:400 700;src:url(data:font/woff2;base64,${LATEXT}) format('woff2');unicode-range:U+0100-024F,U+1E00-1EFF;}
      text{shape-rendering:crispEdges}
      .ph{opacity:0;animation:show ${cycle}s ease-in-out var(--dl,0s) infinite}
      @keyframes show{0%{opacity:0}3%{opacity:1}20%{opacity:1}24%{opacity:0}100%{opacity:0}}
    </style>
  </defs>
  ${lines}
</svg>
`;
writeFileSync(new URL('./tagline.svg', import.meta.url), tagline);

// ─────────────────────────── divider.svg ───────────────────────────
const DW = 420, DH = 30, cy = 15;
const decor = [
  sparkle(60, cy, 3, C.soft, 3.2, 0.0),
  sparkle(120, cy, 4, C.pink, 2.8, 0.6),
  heart(DW / 2 - 60 - 14, cy - 8, 4, C.soft, 4.2, 0.2),
  heart(DW / 2 - 14, cy - 11, 5, C.deep, 4.6, 0.0),
  heart(DW / 2 + 46, cy - 8, 4, C.soft, 4.0, 0.9),
  sparkle(DW - 120, cy, 4, C.pink, 3.0, 0.3),
  sparkle(DW - 60, cy, 3, C.soft, 3.4, 1.1),
].join('\n  ');

const divider = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${DW} ${DH}" width="${DW}" height="${DH}">
  <defs>
    <style>
      rect{shape-rendering:crispEdges}
      .bt{transform-box:fill-box;transform-origin:center;animation:beat var(--d,4s) ease-in-out var(--dl,0s) infinite}
      .sp{transform-box:fill-box;transform-origin:center;animation:tw var(--d,3s) ease-in-out var(--dl,0s) infinite}
      @keyframes beat{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
      @keyframes tw{0%,100%{opacity:.3;transform:scale(.8) rotate(0)}50%{opacity:1;transform:scale(1.15) rotate(45deg)}}
    </style>
  </defs>
  ${decor}
</svg>
`;
writeFileSync(new URL('./divider.svg', import.meta.url), divider);

console.log(`tagline.svg ${(tagline.length / 1024).toFixed(1)}KB · divider.svg ${(divider.length / 1024).toFixed(1)}KB`);
