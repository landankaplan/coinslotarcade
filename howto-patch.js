// Adds a shared "How to play" UI to the game console: a short blurb always visible
// below the controls, plus an expandable full-instructions panel. Content comes from
// window.CSA_HOWTO (loaded via howto.js) keyed by game id, so every game gets this
// automatically with no per-game HTML. Aborts the build if the page doesn't look
// exactly as expected.
var fs = require('fs');
var file = 'public/index.html';
var h = fs.readFileSync(file, 'utf8');

// --- CSS: insert after .control-hint{...} rule, before .touch-pad{ ---
var cssAnchor = ".control-hint{font-size:.78rem;color:var(--ink-soft);font-family:'Share Tech Mono',monospace}";
var cssCount = h.split(cssAnchor).length - 1;
if (cssCount !== 1) { console.error('HOWTO CSS ANCHOR mismatch: found ' + cssCount + ' times'); process.exit(1); }
var css = ".howto-block{padding:.9rem .5rem 1.1rem;border-top:1px dashed var(--paper-edge)}" +
  ".howto-blurb{margin:0 0 .5rem;font-size:.88rem;color:var(--ink);line-height:1.5}" +
  ".howto-full{font-size:.85rem;color:var(--ink-soft)}" +
  ".howto-full summary{cursor:pointer;font-family:'Share Tech Mono',monospace;font-weight:700;color:var(--accent);letter-spacing:.02em;list-style:none}" +
  ".howto-full summary::-webkit-details-marker{display:none}" +
  ".howto-full summary::before{content:'▸ ';display:inline-block;transition:transform .15s}" +
  ".howto-full[open] summary::before{transform:rotate(90deg)}" +
  ".howto-full div{margin-top:.5rem;display:flex;flex-direction:column;gap:.45rem}" +
  ".howto-full p{margin:0;line-height:1.55}";
h = h.replace(cssAnchor, cssAnchor + css);

// --- HTML: insert the block right before the console section closes ---
var htmlAnchor = '<div class="control-row"><span class="control-hint" id="controlHint"></span><div class="touch-pad" id="touchPad" hidden></div></div></section>';
var htmlCount = h.split(htmlAnchor).length - 1;
if (htmlCount !== 1) { console.error('HOWTO HTML ANCHOR mismatch: found ' + htmlCount + ' times'); process.exit(1); }
var block = '<div class="howto-block" id="howtoBlock" hidden><p class="howto-blurb" id="howtoBlurb"></p>' +
  '<details class="howto-full" id="howtoFull"><summary>How to play</summary><div id="howtoFullBody"></div></details></div>';
h = h.replace(htmlAnchor, '<div class="control-row"><span class="control-hint" id="controlHint"></span><div class="touch-pad" id="touchPad" hidden></div></div>' + block + '</section>');

// --- JS: populate the block whenever a game opens, right after setHint ---
var jsAnchor = 'x.setHint(t.hint||""),m=t.mount(r,x)';
var jsCount = h.split(jsAnchor).length - 1;
if (jsCount !== 1) { console.error('HOWTO JS ANCHOR mismatch: found ' + jsCount + ' times'); process.exit(1); }
var jsHook = 'x.setHint(t.hint||""),function(){try{var w=window.CSA_HOWTO&&window.CSA_HOWTO[e],hb=document.getElementById("howtoBlock"),bl=document.getElementById("howtoBlurb"),fb=document.getElementById("howtoFullBody"),hf=document.getElementById("howtoFull");if(hb){if(w){bl.textContent=w.blurb||"",fb.innerHTML=(w.full||[]).map(function(s){return "<p>"+s+"</p>"}).join(""),hb.hidden=!1,hf&&(hf.open=!1)}else hb.hidden=!0}}catch(err){console.error(err)}}(),m=t.mount(r,x)';
h = h.replace(jsAnchor, jsHook);

fs.writeFileSync(file, h);
console.log('howto-patch.js done: CSS + HTML block + JS hook inserted');
