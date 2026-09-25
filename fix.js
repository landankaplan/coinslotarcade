/* Pellet Prowler art fix: swaps the chomper and ghosts for a cat and patrol bots. Aborts unless every pattern matches exactly once. */
var fs = require("fs");
var file = process.argv[2] || "public/games-ext.js";
var s = fs.readFileSync(file, "utf8");
var NL = String.fromCharCode(10);
function swap(a, b) {
  var i = s.indexOf(a);
  if (i < 0 || s.indexOf(a, i + 1) >= 0) { console.error("FIX ABORTED: pattern is not unique: " + a.slice(0, 40)); process.exit(1); }
  s = s.slice(0, i) + b + s.slice(i + a.length);
}
var HEAD = "function G(){var a,f,u,v,w,m,T,C;";
var HELPERS =
  "function catDraw(m,v,z){var s=9*z,ox=2*z*Math.cos(v),oy=2*z*Math.sin(v);R.fillStyle=o.yellow,R.beginPath(),R.moveTo(m.x-.85*s,m.y-.1*s),R.lineTo(m.x-.75*s,m.y-1.25*s),R.lineTo(m.x-.15*s,m.y-.65*s),R.closePath(),R.fill(),R.beginPath(),R.moveTo(m.x+.85*s,m.y-.1*s),R.lineTo(m.x+.75*s,m.y-1.25*s),R.lineTo(m.x+.15*s,m.y-.65*s),R.closePath(),R.fill(),d(R,m.x,m.y+1,s,o.yellow),d(R,m.x-3.2*z+ox,m.y-.5*z+oy,2.2*z,o.ink),d(R,m.x+3.2*z+ox,m.y-.5*z+oy,2.2*z,o.ink)}" +
  "function botDraw(m,c,dx,dy){p(R,m.x-1,m.y-11,2,4,1,c),d(R,m.x,m.y-12,2,c),p(R,m.x-8,m.y-8,16,15,5,c),p(R,m.x-7,m.y+6,4,4,1.5,c),p(R,m.x+3,m.y+6,4,4,1.5,c),p(R,m.x-6,m.y-4,12,6,3,o.ink),d(R,m.x+2.2*dx,m.y-1+1.6*dy,1.8,'#ffffff')}" + NL;
swap(HEAD, HELPERS + HEAD);
swap("R.beginPath(),R.moveTo(m.x,m.y),R.arc(m.x,m.y,9,v+T,v+e-T),R.closePath(),R.fillStyle=o.yellow,R.fill(),k>0)",
  "catDraw(m,v,k>0?Math.max(.05,k/1.2):1),k>0)");
swap("R.beginPath(),R.arc(m.x,m.y-1,9,Math.PI,0),R.lineTo(m.x+9,m.y+9),R.lineTo(m.x+4.5,m.y+5),R.lineTo(m.x,m.y+9),R.lineTo(m.x-4.5,m.y+5),R.lineTo(m.x-9,m.y+9),R.closePath(),R.fillStyle=w.fr?C?'#4DA6FF':o.ink:L[u],R.fill(),d(R,m.x-3.5,m.y-2,2.6,o.ink),d(R,m.x+3.5,m.y-2,2.6,o.ink)," + NL + "d(R,m.x-3.5+1.2*w.dx,m.y-2+1.2*w.dy,1.3,o.bg),d(R,m.x+3.5+1.2*w.dx,m.y-2+1.2*w.dy,1.3,o.bg);",
  "botDraw(m,w.fr?C?'#4DA6FF':o.ink:L[u],w.dx,w.dy);");
fs.writeFileSync(file, s);
console.log("Pellet Prowler art fix applied");
