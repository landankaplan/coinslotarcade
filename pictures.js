/* Coinslot Arcade - puts cartridge art on the shelf cards, the game console header and the game-over overlay.
Purely additive: never edits game code, and does nothing if anything it needs is missing. */
(function () {
'use strict';
try {
var ART = window.CSA_ART;
if (!ART || !document.body) return;

/* id -> [title, cabinet colour]. Darts has no colour on the live site, so it gets a fallback. */
var GAMES = {
snake: ['Byte Snake', '#2FD3C7'], g2048: ['2048', '#8C7CF0'], brick: ['Brick Blitz', '#FF6B4A'], flap: ['Flap Coin', '#FFD166'],
memory: ['Memory Match', '#FF5DA2'], glitch: ['Glitch Squash', '#3DDC97'], stack: ['Block Drop', '#4DA6FF'], pong: ['Paddle Duel', '#FF9770'],
hoop: ['Free Throw', '#FF9770'], penalty: ['Penalty Kick', '#3DDC97'], airhockey: ['Air Hockey', '#4DA6FF'], tennis: ['Tennis Rally', '#FF5DA2'],
boxing: ['Reflex Boxing', '#FF6B4A'], golf: ['Mini Golf', '#2FD3C7'], derby: ['Home Run Derby', '#FFD166'], bowling: ['Lane Bowling', '#8C7CF0'],
fieldgoal: ['Field Goal', '#4DA6FF'], darts: ['Darts', '#4DA6FF'],
triviaSports: ['Sports Trivia', '#FF9770'], triviaMovies: ['Movie Trivia', '#FF5DA2'], triviaScience: ['Science Trivia', '#4DA6FF'],
triviaMusic: ['Music Trivia', '#8C7CF0'], triviaHistory: ['History Trivia', '#3DDC97'], triviaGeography: ['Geography Trivia', '#4DA6FF'],
triviaGaming: ['Video Game Trivia', '#FF5DA2'], triviaFood: ['Food & Drink Trivia', '#FF9770'], triviaAnimals: ['Animal Trivia', '#3DDC97'],
reactionQuick: ['Quick Reflex', '#2FD3C7'], whack: ['Byte Whacker', '#FF6B4A'], simon: ['Signal Chain', '#8C7CF0'],
tictactoe: ['Tri-Grid', '#4DA6FF'], connect4: ['Fall Four', '#FFD166'], minesweeper: ['Deep Sweep', '#FF9770'], codeword: ['Codeword', '#3DDC97'],
byteFarm: ['Byte Farm', '#2FD3C7'], deepMine: ['Deep Mine', '#FF9770'], cloudLegion: ['Cloud Legion', '#8C7CF0'],
dungeonDelver: ['Dungeon Delver', '#8C7CF0'], arenaChampion: ['Arena Champion', '#FF6B4A'], bossRush: ['Boss Rush', '#FF5DA2'],
byteRunner: ['Byte Runner', '#3DDC97'], towerAscent: ['Tower Ascent', '#4DA6FF'], meteorMiner: ['Meteor Miner', '#FF9770'], zombieSiege: ['Zombie Siege', '#FF5DA2'],
orbitRaiders: ['Orbit Raiders', '#4DA6FF'],
rockDrift: ['Rock Drift', '#FF9770'],
pelletProwler: ['Pellet Prowler', '#FFD166'],
laneLeaper: ['Lane Leaper', '#3DDC97'],
swarmStrike: ['Swarm Strike', '#FF5DA2'],
vineCrawler: ['Vine Crawler', '#3DDC97'],
skyShield: ['Sky Shield', '#2FD3C7'],
softTouchdown: ['Soft Touchdown', '#8C7CF0'],
neonTrails: ['Neon Trails', '#2FD3C7'],
silverBall: ['Silver Ball', '#8C7CF0'],
caveCopter: ['Cave Copter', '#FF9770'],
skyHopper: ['Sky Hopper', '#3DDC97'],
pyramidHop: ['Pyramid Hop', '#FF6B4A'],
dirtDigger: ['Dirt Digger', '#FF9770'],
craterCruiser: ['Crater Cruiser', '#FFD166'],
botSwarm: ['Bot Swarm', '#FF6B4A'],
landGrab: ['Land Grab', '#4DA6FF'],
fruitSlash: ['Fruit Slash', '#3DDC97'],
towerStack: ['Tower Stack', '#4DA6FF'],
helixFall: ['Helix Fall', '#8C7CF0'],
hueHopper: ['Hue Hopper', '#FF5DA2'],
beatTiles: ['Beat Tiles', '#2FD3C7'],
perfectTen: ['Perfect Ten', '#FFD166'],
coinCatcher: ['Coin Catcher', '#FF9770'],
typeRush: ['Type Rush', '#4DA6FF'],
targetBlitz: ['Target Blitz', '#FF6B4A'],
jewelJam: ['Jewel Jam', '#FF5DA2'],
slideSort: ['Slide Sort', '#2FD3C7'],
switchGrid: ['Switch Grid', '#FFD166'],
diskTower: ['Disk Tower', '#8C7CF0'],
cratePush: ['Crate Push', '#FF9770'],
codeBreaker: ['Code Breaker', '#4DA6FF'],
pixelCross: ['Pixel Cross', '#3DDC97'],
tubeSort: ['Tube Sort', '#FF6B4A'],
blockFit: ['Block Fit', '#4DA6FF'],
floodFill: ['Flood Fill', '#FF5DA2'],
oddTileOut: ['Odd Tile Out', '#FFD166'],
numberGrid: ['Number Grid', '#FF9770'],
discFlip: ['Disc Flip', '#2FD3C7'],
draughts: ['Draughts', '#FF6B4A'],
seedSow: ['Seed Sow', '#FFD166'],
fiveInRow: ['Five In Row', '#4DA6FF'],
fleetHunt: ['Fleet Hunt', '#4DA6FF'],
boxLine: ['Box Line', '#3DDC97'],
laneDefense: ['Lane Defense', '#FF9770'],
golfCards: ['Fairway Cards', '#3DDC97'],
twentyOne: ['Twenty One', '#FF6B4A'],
higherLower: ['Higher Lower', '#8C7CF0'],
hangWord: ['Word Fuse', '#FF9770'],
wordHunt: ['Word Hunt', '#2FD3C7']
};
var BY_TITLE = {}, id;
for (id in GAMES) if (Object.prototype.hasOwnProperty.call(GAMES, id)) BY_TITLE[GAMES[id][0]] = id;

var style = document.createElement('style');
style.setAttribute('data-csa-art', '');
style.textContent =
'.cart-top{background-image:repeating-linear-gradient(135deg,rgba(11,5,24,.07) 0 2px,transparent 2px 9px)}' +
'.cart-top>svg:not(.art){display:none}' +
'.cart-top svg.art{position:absolute;inset:0;width:100%;height:100%;z-index:0;transition:transform .25s ease}' +
'.cart:hover .cart-top svg.art,.cart:focus-visible .cart-top svg.art{transform:scale(1.06)}' +
'.game-banner{position:relative;height:72px;margin:0 0 .7rem;overflow:hidden;border-radius:2px;background-color:var(--pic-bg,#24f2ff);' +
'background-image:repeating-linear-gradient(135deg,rgba(11,5,24,.07) 0 2px,transparent 2px 9px)}' +
'.game-banner[hidden],.ov-art[hidden]{display:none}' +
'.game-banner svg{position:absolute;inset:0;width:100%;height:100%}' +
'.ov-art{position:relative;flex:none;width:132px;height:47px;overflow:hidden;border-radius:2px;background-color:var(--pic-bg,#24f2ff);' +
'background-image:repeating-linear-gradient(135deg,rgba(11,5,24,.07) 0 2px,transparent 2px 9px)}' +
'.ov-art svg{display:block;width:100%;height:100%}' +
'@media (prefers-reduced-motion:reduce){.cart-top svg.art{transition:none}.cart:hover .cart-top svg.art,.cart:focus-visible .cart-top svg.art{transform:none}}';
document.head.appendChild(style);

/* ---- shelf cards ---- */
function decorate() {
var carts = document.querySelectorAll('button.cart[data-game]:not([data-art])'), i, cart, gid, top, col;
for (i = 0; i < carts.length; i++) {
cart = carts[i]; gid = cart.getAttribute('data-game'); top = cart.querySelector('.cart-top');
if (!top || !ART.has(gid)) { cart.setAttribute('data-art', 'none'); continue; }
col = getComputedStyle(top).backgroundColor;
if (!col || col === 'rgba(0, 0, 0, 0)' || col === 'transparent') { col = GAMES[gid] ? GAMES[gid][1] : '#24f2ff'; top.style.backgroundColor = col; }
top.insertAdjacentHTML('beforeend', ART.svg(gid, col, 'art'));
cart.setAttribute('data-art', '1');
}
}

/* ---- console header + game-over overlay ---- */
var con = document.getElementById('console'), gt = document.getElementById('gameTitle'), ov = document.getElementById('overlay');
var banner = document.createElement('div'), ovArt = document.createElement('div'), shownBanner = null, shownOv = null;
banner.className = 'game-banner'; banner.hidden = true; banner.setAttribute('aria-hidden', 'true');
ovArt.className = 'ov-art'; ovArt.hidden = true; ovArt.setAttribute('aria-hidden', 'true');
if (con) con.insertBefore(banner, con.firstChild);
if (ov) ov.insertBefore(ovArt, ov.firstChild);

function currentId() {
var t = gt ? gt.textContent.trim() : '';
return (con && !con.hidden && BY_TITLE[t]) || null;
}
function sync() {
var gid = currentId();
if (!gid) { banner.hidden = true; ovArt.hidden = true; return; }
if (shownBanner !== gid) { banner.innerHTML = ART.svg(gid, GAMES[gid][1], 'art').replace('slice', 'meet'); banner.style.setProperty('--pic-bg', GAMES[gid][1]); shownBanner = gid; }
banner.hidden = false;
if (ov && !ov.hidden) {
if (shownOv !== gid) { ovArt.innerHTML = ART.svg(gid, GAMES[gid][1], 'art').replace('slice', 'meet'); ovArt.style.setProperty('--pic-bg', GAMES[gid][1]); shownOv = gid; }
ovArt.hidden = false;
if (ov.scrollHeight > ov.clientHeight + 1) ovArt.hidden = true; /* no room: keep the text readable */
} else ovArt.hidden = true;
}

var queued = false;
function schedule() {
if (queued) return;
queued = true;
window.setTimeout(function () { queued = false; try { decorate(); sync(); } catch (e) { /* art is optional */ } }, 30);
}

var shelf = document.getElementById('shelf');
if (window.MutationObserver) {
new MutationObserver(schedule).observe(shelf || document.body, { childList: true, subtree: true });
if (gt) new MutationObserver(schedule).observe(gt, { childList: true, characterData: true, subtree: true });
if (con) new MutationObserver(schedule).observe(con, { attributes: true, attributeFilter: ['hidden'] });
if (ov) new MutationObserver(schedule).observe(ov, { attributes: true, attributeFilter: ['hidden'] });
}
decorate(); sync();
} catch (e) { /* never break the arcade over decoration */ }
})();
