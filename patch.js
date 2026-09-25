// Adds the fifty extra cabinets to the verified page. Aborts the build if the page does not look exactly as expected.
var fs = require('fs');
var file = 'public/index.html';
var h = fs.readFileSync(file, 'utf8');
var tail = ',C(),T(),X()}();</script>';
var n = h.split(tail).length - 1;
if (n !== 1) { console.error('PATCH ABORTED: tail matches ' + n + ' times'); process.exit(1); }
var at = h.indexOf(tail);
var s0 = h.lastIndexOf('<script', at);
if (s0 < 0 || h.substr(s0, 8) !== '<script>') { console.error('PATCH ABORTED: app script start not found: ' + h.substr(Math.max(0, s0), 60)); process.exit(1); }
var hook = ',(function(){try{window.CSA_EXT&&window.CSA_EXT({g:g,M:M,api:x,A:A,L:L,R:R,D:D})}catch(e){console.error(e)}})()';
h = h.slice(0, s0) + '<script src="/games-ext.js"></script>' + h.slice(s0, at) + hook + h.slice(at);
fs.writeFileSync(file, h);
console.log('Patched: games-ext.js loaded before the app, hook added before first render');
