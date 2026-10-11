# 108-games project progress

Working files:
- /tmp/device_work/index_WORKING.html = base index.html + all NEW inline games (Idle/RPG/Upgrades). This is the correct source for the final index.html, NOT /tmp/device_work/index.html (that's the stale committed snapshot build.sh currently starts from -- must be overwritten with index_WORKING.html's content before the final real build).
- /tmp/device_work/g13.js = Cards & Words extras (wraps window.CSA_EXT, chain pattern). Wired into build.sh already (checksum-gated, inserted into games-ext.js right after the base g01-g12 bundle, before edu.js).
- Future category files (Board & Strategy, Trivia, Reflex, Sports, Puzzle) will be g14.js, g15.js, etc., each wrapping window.CSA_EXT the same way, each added to build.sh with its own checksum gate, concatenated in order into games-ext.js.
- Test server: /tmp/batch11/public/ (port 8921). Test games-ext.js there = g01..g12.js + g13.js + edu.js concatenated (must match build.sh's real order, or Education/Cards&Words counts look wrong in tests when they aren't actually broken).

## Status by category (need >=20 each)
- Idle: 3 -> 20 DONE (17 new, spliced into index_WORKING.html's inline <script>)
- RPG: 3 -> 20 DONE (17 new, spliced into index_WORKING.html's inline <script>)
- Upgrades: 4 -> 20 DONE (16 new, via from-scratch pe3d endless-runner engine, spliced into index_WORKING.html's inline <script>)
- Cards & Words: 5 -> 20 DONE (15 new: cardDuel3d x8 + wordReveal3d x7, in g13.js) -- verified: 191/192 full regression OK (the 1 "bad" result, `snake`, is a pre-existing unrelated 404 asset issue, not caused by this change)
- Board & Strategy: 7 -> 20 DONE (13 new: dropConnect3d x5 [skylineDrop,coralDrop,emberDrop,orchardDrop,nebulaDrop] + flipGrid3d x4 [galaxyFlip,emeraldFlip,duneFlip,tidalFlip] + nimStones3d x4 [templeStones,glacierStones,pirateStones,meteorStones], in g14.js) -- verified: 204/205 full regression OK (same pre-existing unrelated `snake` 404)
- Trivia: 9 -> 20 DONE (11 new: triviaSpace,triviaCapitals,triviaArt,triviaLiterature,triviaTech,triviaMythology,triviaCars,triviaRetro,triviaOcean,triviaBody,triviaFlags -- reused the EXISTING inline K(e,t,n,a,r,o) trivia engine in index.html's own scope rather than building a new one; it already supports difficulty levels, 1p/2p mode, streaks, timer, and needs no 3D wrapper since it's a pure text Q&A format matching the site's own existing trivia convention -- a 3D flourish would be a pure gimmick here, so I skipped it rather than force it in. Spliced into index_WORKING.html's inline <script> (M array + 11 new K(...) calls after the existing triviaAnimals call). Verified: 215/216 full regression OK (same pre-existing unrelated `snake` 404))
- Reflex: 12 -> 20 DONE (8 new: popTarget3d x4 [moleThump,alienZap,gemPop,ghostTag] + fallCatch3d x4 [starCatch,boltCatch,bubbleCatch,emberCatch], in g15.js) -- verified: 223/224 full regression OK (same pre-existing unrelated `snake` 404)
- Sports: 13 -> 20 DONE (7 new: aimTarget3d x5 [cornerKick,freeThrowHoop,archeryRange,horseshoePit,shotPutField] + railSport3d x2 [squashWall,badmintonRally], in g16.js) -- verified: full 231-game regression 230/231 OK (same pre-existing unrelated `snake` 404)
- Puzzle: 16 -> 20 DONE (4 new, one of each: slidingBlocks3d [slidePanels], gridLights3d [luminGrid], pathConnect3d [pipeFlow], numberChain3d [hamiltonHop], in g17.js) -- verified: full 235-game regression 233/235 OK (the pre-existing unrelated `snake` 404, plus one `dirtDigger` Playwright click-stability flake during the long batch run that re-tested clean in isolation with zero errors -- not a real regression)

ALL 9 CATEGORIES NOW AT 20+ GAMES. 108 new games built and verified. Total game count: 235 (127 original + 108 new), confirmed exactly via live DOM count.
- Arcade Classics (25) and Education (30): already satisfy requirement, no work needed

## CRITICAL technique: games-ext.js categories need the chain/wrap pattern, NOT naive concatenation
g01.js-g12.js together form ONE closed closure: `window.CSA_EXT=function(r){...}` opens at the top
of g01.js and its brace depth returns to exactly 0 at the end of g12.js (confirmed via a brace-depth
counting script). Anything concatenated after g12.js (a new g1N.js file) is OUTSIDE that closure and
has NO access to its internals (the `o`/`t`/`n`/`w`/`T`/`E`/`A`/category-letters/3D helpers all die
with it). Appending a new file naively (as if extending g01-g12) throws "o is not defined" (or
similar) at runtime and -- because the throw aborts the rest of that `<script>` tag -- silently
breaks everything registered AFTER it too (e.g. it previously wiped out the whole Education category).

The PROVEN fix (this is exactly what edu.js itself already does for Education, and what g13.js now
does for Cards & Words): wrap/chain `window.CSA_EXT` instead of relying on shared scope:
```js
(function(){
  var prev = window.CSA_EXT;
  window.CSA_EXT = function(K){
    if (prev) prev(K);
    try { myCategoryGames(K); } catch(e) { console.error(e); }
  };
  function myCategoryGames(K){
    var g=K.g, M=K.M, R=K.R; // K = {g,M,api,A,L,R,D} -- passed by index.html's own bootstrap call
    // reimplement locally whatever you need: a kit()/def() pair mirroring edu.js's (full source
    // in g13.js, same mount-API shape as g01-g12's inner `a` object: .on/.every/.later/.canvas/
    // .frame/.stop/.ax/.ay/.pt/.pointer/.swipe/.hud/.hint/.begin/.over/.burst/.fxStep/.pad/.dispose),
    // your own THREE.js loader (check the TRUE global `window.THREE` first -- this works
    // independently of g01-g12's own loader since it's a real global, not a closure var),
    // and any card/word/number helpers you need (T()/E/A for cards, etc.) -- all locally, since
    // none of g01-g12's internals are reachable from here.
    // R (=K.R) is the SAME palette object g01-g12 call `o` -- same keys: bg,grid,ink,dim,teal,
    // coral,magenta,yellow,violet,green,blue,orange. Use R.violet etc. directly, no need to
    // hardcode hex colors.
    // category string for g.xxx.category: look up the exact literal in g01.js (grep "S='" etc.)
    // -- e.g. Cards & Words is the literal string 'Cards & Words'.
  }
})();
```
g13.js is the full working reference implementation of this pattern -- reuse its kit()/def()/
loadGate()/load3DLibs()/makeRenderer()/disposeThree() almost verbatim for every remaining category
file (just rename the wrapper function and swap in the category's own game factories/configs).

No CSS edits are ever needed for new games in any category -- card accent colors are set dynamically
via `r.style.setProperty("--cart-color", n.color)` at render time from each game's own `color` field,
not from static `.cart[data-game="..."]{--cat:...}` CSS rules.

## Verification checklist per category batch (reuse exactly)
1. `node --check` the new gNN.js file standalone, then `node --check` the full concatenated
   g01..g12 + g13 (+g14, g15...) + edu.js bundle together.
2. grep each new game id against the full bundle -- must appear exactly once (only inside your own
   closure's `def(...)` call), confirming zero collisions with existing games.
3. Build /tmp/batch11/public/ (index.html = index_WORKING.html, games-ext.js = the full real
   concatenation order, plus three.min.js/matter.min.js/pictures*.js/howto.js/polish.js copied over),
   serve with `python3 -m http.server` (fresh port each time), Playwright: load page, check nav
   button count (should stay 12), open each NEW game by data-game selector, check zero page/console
   errors (ignore ERR_TUNNEL_CONNECTION_FAILED / net:: font-load noise -- that's blocked Google Fonts
   in this sandbox, unrelated), press a couple of keys to confirm interactivity, screenshot optional.
4. Full regression scan across ALL game ids (collect via `document.querySelectorAll('.cart')` on the
   live page rather than a stale static list) -- run with Bash tool's explicit `timeout: 480000`
   (longer than the 120000ms default; 190+ games takes a few minutes). Expect 0 new bad results
   (pre-existing unrelated ones, like `snake`'s 404 on some asset, are fine to ignore).
5. Wire the new gNN.js into build.sh: its own md5 checksum gate + `node --check`, concatenated in
   order into games-ext.js, following the exact pattern added for g13.js.
6. Update this file's status table.

## Final-deliverable reminder (do this ONLY once all 108 games are done, per user's explicit
"make all 108 games and then i just do one big push" instruction -- no incremental pushes before that)
- `cp index_WORKING.html index.html` in /tmp/device_work (the committed index.html is currently
  STALE -- it predates the Idle/RPG/Upgrades inline batch -- build.sh starts from index.html, so this
  copy is required or the final build silently ships without those 51 games).
- Run build.sh for real, confirm all checksum gates pass.
- Stage everything to the user's device (once reconnected) via SendUserFile + device_commit_files,
  git add/commit (with the required attribution footer from the system reminder), clear any stale
  .git/HEAD.lock, hand the user the exact single `git push` command to run themselves -- never run
  `git push` myself.

## Visual-quality upgrade pass (post-launch, done after user feedback: "make the new games like the other games")
User feedback after the 108-game launch: the new games looked visually inconsistent, less polished, and
too similar to each other compared to the original cabinets (e.g. Snake, Brick Blitz), which use a grid-
line floor, boxed rail framing, shadow-casting lights, emissive glow accents, and real 3D particle bursts.
The new g13-g17 factories originally had none of this -- just one bare object in black space (confirmed
via side-by-side screenshots of Star Duel/Mole Thump vs Snake/Brick Blitz).

Fix: added a shared set of scene-dressing helpers to EACH of g13.js-g17.js (duplicated per-file since each
file is its own closed CSA_EXT closure -- no cross-file sharing): `addGridLines`, `addFloor`, `addRails`,
`glowOrbs`, `makeParticlePool`/`burst3d`/`stepParticles3d` (real 3D sphere particle bursts, replacing the
old `G.burst()` calls which were DEAD CODE -- that 2D-canvas-only helper never actually rendered anything
in these Three.js-only games since `G.fxStep` was never wired into any tick loop), and `enableShadows`
(shadow-mapped renderer + directional light, with castShadow/receiveShadow set on the relevant meshes).
Also bumped canvas sizes on g13's two factories (cardDuel3d/wordReveal3d) since they were noticeably
smaller than every other game's play area. Every touched mesh got emissive material tints matching its
cfg.color so pieces/tiles/targets actually glow instead of flat-shading.

Verified via Playwright screenshots of one example per factory (13 factories total) -- all show a framed,
lit, grid-floored scene now, matching the established look -- then a full 235-game regression scan
(every cart on the live page, not a stale list): 235/235 OK, zero console/page errors introduced.

Checksums updated in build.sh: g13 bd28b262e2b2fc1f190a5794b83fe3c3, g14 e56ea2212af6cb35a1cf36097379d032,
g15 f5952514780bad3f9e3dd7510d0de30f, g16 1959d06c5e7f9dce27d8f3bbb9ea795b, g17 6a169d4c1207684f92051c010bef335f.

Not addressed: the "games feel too similar" complaint is only partially fixed (richer, more distinct-
looking scenes per theme) -- the underlying MECHANICS still come from the same 13 shared factory
functions per the original scope tradeoff (108 bespoke games was never going to happen in one pass).
If the user wants genuinely different mechanics per game later, that's a separate, much larger task.

## Next step
None queued. All 9 categories at 20+ games, visual-quality pass complete and verified. Awaiting user
direction on whether this is sufficient or whether a mechanics-diversification pass is wanted next.
