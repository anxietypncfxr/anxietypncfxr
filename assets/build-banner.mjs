// build-banner.mjs — generates a self-contained milky-pink animated hero banner.
// Embeds Pixelify Sans (woff2 -> base64) so it renders anywhere, including
// GitHub's image proxy. Output: assets/banner.svg
import { readFileSync, writeFileSync } from 'node:fs';

const b64 = (p) => readFileSync(new URL(p, import.meta.url)).toString('base64');
const LAT = b64('./fonts/pixelify-latin.woff2');
const LATEXT = b64('./fonts/pixelify-latin-ext.woff2');

const W = 1200;
const H = 400;

// ── palette: tender milky-pink ──
const C = {
  cream1: '#FFFBF8',
  cream2: '#FFEDF3',
  cream3: '#FFE2EC',
  card: '#FFF7F3',
  rose: '#E48BAE',       // title
  roseSoft: '#F6CFDE',   // title soft shadow
  sub: '#C98BA6',        // subtitle
  tag: '#D3A6BB',        // tagline
  pink: '#FFB3CD',       // sparkles / hearts
  pinkHi: '#FF9BBE',
  accentA: '#FFC8DC',    // underline grad
  accentB: '#FFA9C6',
  border: '#FFD9E6',
};

// ── pixel sparkle (plus / 4-point) ──
function sparkle(x, y, s, fill, dur, delay) {
  const u = s; // unit
  return `<g class="spark" style="--d:${dur}s;--dl:${delay}s" transform="translate(${x} ${y})">
    <rect x="${-u / 2}" y="${-u * 1.5}" width="${u}" height="${u}" fill="${fill}"/>
    <rect x="${-u / 2}" y="${u / 2}" width="${u}" height="${u}" fill="${fill}"/>
    <rect x="${-u * 1.5}" y="${-u / 2}" width="${u}" height="${u}" fill="${fill}"/>
    <rect x="${u / 2}" y="${-u / 2}" width="${u}" height="${u}" fill="${fill}"/>
    <rect x="${-u / 2}" y="${-u / 2}" width="${u}" height="${u}" fill="${fill}" opacity="0.9"/>
  </g>`;
}

// ── pixel heart (7x6 blocks) ──
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
  return `<g class="heart" style="--d:${dur}s;--dl:${delay}s" transform="translate(${x} ${y})" fill="${fill}">${r}</g>`;
}

const sparkles = [
  sparkle(150, 110, 5, C.pink, 3.4, 0.0),
  sparkle(1050, 96, 6, C.pinkHi, 3.0, 0.8),
  sparkle(200, 300, 4, C.accentB, 3.8, 1.4),
  sparkle(1000, 300, 5, C.pink, 3.2, 0.4),
  sparkle(95, 210, 4, C.accentB, 2.8, 2.0),
  sparkle(1110, 220, 4, C.pinkHi, 3.6, 1.0),
  sparkle(340, 80, 3, C.pink, 3.0, 1.7),
  sparkle(880, 320, 3, C.accentB, 3.3, 0.6),
].join('\n  ');

const hearts = [
  heart(120, 150, 4, C.pink, 4.2, 0.2),
  heart(1056, 250, 4, C.pinkHi, 4.6, 1.1),
].join('\n  ');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="'Pixelify Sans', monospace">
  <defs>
    <style>
      @font-face{font-family:'Pixelify Sans';font-style:normal;font-weight:400 700;src:url(data:font/woff2;base64,${LAT}) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215;}
      @font-face{font-family:'Pixelify Sans';font-style:normal;font-weight:400 700;src:url(data:font/woff2;base64,${LATEXT}) format('woff2');unicode-range:U+0100-024F,U+0259,U+1E00-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;}
      .fade{opacity:0;animation:fade .9s ease-out forwards}
      .d1{animation-delay:.15s}.d2{animation-delay:.4s}.d3{animation-delay:.65s}.d4{animation-delay:.9s}
      .float{animation:float 5s ease-in-out infinite;transform-origin:center}
      .spark{transform-box:fill-box;transform-origin:center;animation:tw var(--d,3s) ease-in-out var(--dl,0s) infinite}
      .heart{transform-box:fill-box;transform-origin:center;animation:beat var(--d,4s) ease-in-out var(--dl,0s) infinite;opacity:.85}
      @keyframes fade{to{opacity:1}}
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
      @keyframes tw{0%,100%{opacity:.25;transform:scale(.8) rotate(0deg)}50%{opacity:1;transform:scale(1.15) rotate(45deg)}}
      @keyframes beat{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
      @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
      .cursor{animation:blink 1.1s steps(1) infinite}
      text{shape-rendering:crispEdges}
    </style>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${C.cream1}"/>
      <stop offset="0.55" stop-color="${C.cream2}"/>
      <stop offset="1" stop-color="${C.cream3}"/>
    </linearGradient>
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${C.accentA}"/>
      <stop offset="1" stop-color="${C.accentB}"/>
    </linearGradient>
    <radialGradient id="glowA" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#FFC2D8" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#FFC2D8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#FFDCC8" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#FFDCC8" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="card"><rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="28"/></clipPath>
  </defs>

  <g clip-path="url(#card)">
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#bg)"/>
    <ellipse cx="170" cy="60" rx="320" ry="260" fill="url(#glowA)"/>
    <ellipse cx="1050" cy="360" rx="340" ry="280" fill="url(#glowB)"/>

    ${sparkles}
    ${hearts}

    <g class="float">
      <g class="fade d1">
        <text x="${W / 2 + 4}" y="194" text-anchor="middle" font-size="88" font-weight="700" fill="${C.roseSoft}">gothblessme</text>
        <text x="${W / 2}" y="190" text-anchor="middle" font-size="88" font-weight="700" fill="${C.rose}">gothblessme</text>
      </g>
    </g>

    <rect class="fade d2" x="${W / 2 - 130}" y="214" width="260" height="6" rx="3" fill="url(#line)"/>

    <text class="fade d3" x="${W / 2}" y="262" text-anchor="middle" font-size="29" font-weight="600" fill="${C.sub}">DevOps · DBA · Go Developer</text>

    <text class="fade d4" x="${W / 2}" y="312" text-anchor="middle" font-size="22" fill="${C.tag}">21 y.o · in IT since 2021<tspan class="cursor" fill="${C.pinkHi}"> _</tspan></text>
  </g>

  <rect x="1.5" y="1.5" width="${W - 3}" height="${H - 3}" rx="28" fill="none" stroke="${C.border}" stroke-width="3"/>
</svg>
`;

writeFileSync(new URL('./banner.svg', import.meta.url), svg);
console.log(`banner.svg written: ${W}x${H}, ${(svg.length / 1024).toFixed(1)} KB`);
