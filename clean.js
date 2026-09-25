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
