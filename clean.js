// Strips a previous build's injected extras from public/index.html so patch.js can apply a
// fresh, single copy. The live page we start from is itself already a previously-patched
// build (it already runs games-ext.js, the Education v1 extras and the cartridge-art scripts),
// so re-running the old patch step without cleaning first would double-inject everything.
var fs = require('fs');
var file = 'public/index.html';
var h = fs.readFileSync(file, 'utf8');
var before = h.length;

var TRAIL = '<script src="/pictures-data.js" defer></script><script src="/pictures-edu.js" defer></script><script src="/pictures.js" defer></script><script src="/polish.js" defer></script>';
if (h.slice(-TRAIL.length) === TRAIL) {
  h = h.slice(0, -TRAIL.length);
  console.log('Removed trailing cartridge-art script tags');
} else {
  console.log('No trailing cartridge-art script tags found (page was already clean)');
}

var TRAIL_HOWTO = '<script src="/howto.js" defer></script>';
if (h.slice(-TRAIL_HOWTO.length) === TRAIL_HOWTO) {
  h = h.slice(0, -TRAIL_HOWTO.length);
  console.log('Removed trailing howto.js script tag');
} else {
  console.log('No trailing howto.js script tag found (page was already clean)');
}

// --- undo howto-patch.js's three edits, so a fresh live-page fetch that already
// includes them (this build's own past output) doesn't get them injected twice ---
var HOWTO_CSS = ".howto-block{padding:.9rem .5rem 1.1rem;border-top:1px dashed var(--paper-edge)}" +
  ".howto-blurb{margin:0 0 .5rem;font-size:.88rem;color:var(--ink);line-height:1.5}" +
  ".howto-full{font-size:.85rem;color:var(--ink-soft)}" +
  ".howto-full summary{cursor:pointer;font-family:'Share Tech Mono',monospace;font-weight:700;color:var(--accent);letter-spacing:.02em;list-style:none}" +
  ".howto-full summary::-webkit-details-marker{display:none}" +
  ".howto-full summary::before{content:'▸ ';display:inline-block;transition:transform .15s}" +
  ".howto-full[open] summary::before{transform:rotate(90deg)}" +
  ".howto-full div{margin-top:.5rem;display:flex;flex-direction:column;gap:.45rem}" +
  ".howto-full p{margin:0;line-height:1.55}";
var cssIdx = h.indexOf(HOWTO_CSS);
if (cssIdx > -1) {
  h = h.slice(0, cssIdx) + h.slice(cssIdx + HOWTO_CSS.length);
  console.log('Removed existing howto CSS block');
} else {
  console.log('No existing howto CSS block found (page was already clean)');
}

var HOWTO_BLOCK = '<div class="howto-block" id="howtoBlock" hidden><p class="howto-blurb" id="howtoBlurb"></p>' +
  '<details class="howto-full" id="howtoFull"><summary>How to play</summary><div id="howtoFullBody"></div></details></div>';
var blockIdx = h.indexOf(HOWTO_BLOCK);
if (blockIdx > -1) {
  h = h.slice(0, blockIdx) + h.slice(blockIdx + HOWTO_BLOCK.length);
  console.log('Removed existing howto HTML block');
} else {
  console.log('No existing howto HTML block found (page was already clean)');
}

var HOWTO_JS = 'function(){try{var w=window.CSA_HOWTO&&window.CSA_HOWTO[e],hb=document.getElementById("howtoBlock"),bl=document.getElementById("howtoBlurb"),fb=document.getElementById("howtoFullBody"),hf=document.getElementById("howtoFull");if(hb){if(w){bl.textContent=w.blurb||"",fb.innerHTML=(w.full||[]).map(function(s){return "<p>"+s+"</p>"}).join(""),hb.hidden=!1,hf&&(hf.open=!1)}else hb.hidden=!0}}catch(err){console.error(err)}}(),';
var jsIdx = h.indexOf(HOWTO_JS);
if (jsIdx > -1) {
  h = h.slice(0, jsIdx) + h.slice(jsIdx + HOWTO_JS.length);
  console.log('Removed existing howto JS hook');
} else {
  console.log('No existing howto JS hook found (page was already clean)');
}

var GEXT = '<script src="/games-ext.js"></script>';
var gi = h.indexOf(GEXT);
if (gi > -1) {
  h = h.slice(0, gi) + h.slice(gi + GEXT.length);
  console.log('Removed existing games-ext.js script tag');
} else {
  console.log('No existing games-ext.js script tag found (page was already clean)');
}

var HOOK = ',(function(){try{window.CSA_EXT&&window.CSA_EXT({g:g,M:M,api:x,A:A,L:L,R:R,D:D})}catch(e){console.error(e)}})()';
var hi = h.indexOf(HOOK);
if (hi > -1) {
  h = h.slice(0, hi) + h.slice(hi + HOOK.length);
  console.log('Removed existing CSA_EXT hook');
} else {
  console.log('No existing CSA_EXT hook found (page was already clean)');
}

fs.writeFileSync(file, h);
console.log('clean.js done: ' + before + ' -> ' + h.length + ' bytes');
