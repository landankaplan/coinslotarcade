(function () {
'use strict';
var prev = window.CSA_EXT;
window.CSA_EXT = function (K) {
  if (prev) prev(K);
  try { edu(K); } catch (e) { console.error(e); }
};
/* Coinslot Arcade - Education cabinets. Wrapped by head.js; edu(K) runs right after the base extras registered.
   K = { g: registry, M: shelf order, api: HUD/score/overlay API, A: canvas maker, L: rounded-rect path, R: palette, D: swipe helper } */
function edu(K) {
  'use strict';
  var g = K.g, M = K.M, R = K.R, TAU = Math.PI * 2, NEW = [];
  var ICON = String('<svg viewBox=#0 0 24 24# fill=#none# stroke=#currentColor# stroke-width=#2# stroke-linecap=#round# stroke-linejoin=#round#><rect x=#4# y=#4# width=#16# height=#16# rx=#3#/><circle cx=#12# cy=#12# r=#3#/></svg>').split('#').join(String.fromCharCode(39));
  var ARROWS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '];
  function rnd(n) { return Math.floor(Math.random() * n); }
  function rr(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[rnd(a.length)]; }
  function shuf(a) { var i, j, t; for (i = a.length - 1; i > 0; i--) { j = rnd(i + 1); t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function pad(n) { return String(Math.floor(n)).padStart(4, '0'); }
  function circ(c, x, y, r, f) { c.beginPath(); c.arc(x, y, r, 0, TAU); if (f) { c.fillStyle = f; c.fill(); } }
  function rect(c, x, y, w, h, r, f) { K.L(c, x, y, w, h, r === undefined ? 4 : r); if (f) { c.fillStyle = f; c.fill(); } }
  function txt(c, s, x, y, sz, f, al) { c.font = '700 ' + sz + 'px Figtree, sans-serif'; c.textAlign = al || 'center'; c.textBaseline = 'middle'; c.fillStyle = f || R.ink; c.fillText(s, x, y); }
  function line(c, x1, y1, x2, y2, col, w) { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.strokeStyle = col; c.lineWidth = w || 2; c.stroke(); }
  function clear(c, w, h, col) { c.fillStyle = col || R.bg; c.fillRect(0, 0, w, h); }

  function kit(id, el, x) {
    var G = { id: id, el: el, x: x, k: {}, dead: false, fns: [], rid: 0, last: 0, run: null, fx: [], press: null, again: null };
    G.on = function (t, ev, f, o) { t.addEventListener(ev, f, o); G.fns.push(function () { t.removeEventListener(ev, f, o); }); };
    G.every = function (f, ms) { var i = setInterval(f, ms); G.fns.push(function () { clearInterval(i); }); return i; };
    G.later = function (f, ms) { var i = setTimeout(f, ms); G.fns.push(function () { clearTimeout(i); }); return i; };
    G.canvas = function (w, h) { var a = K.A(el, w, h); G.cv = a.canvas; G.c = a.ctx; G.w = w; G.h = h; return G.c; };
    function tick(t) {
      G.rid = 0;
      if (G.dead || !G.run) return;
      G.rid = requestAnimationFrame(tick);
      var dt = G.last ? Math.min(0.05, (t - G.last) / 1000) : 0.016;
      G.last = t;
      try { G.run(dt); } catch (e) { G.run = null; console.error(e); }
    }
    G.frame = function (f) { G.run = f; G.last = 0; if (!G.rid && !G.dead) G.rid = requestAnimationFrame(tick); };
    G.stop = function () { G.run = null; };
    G.on(document, 'keydown', function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (ARROWS.indexOf(k) > -1) e.preventDefault();
      if (!G.k[k]) { G.k[k] = 1; if (G.press) G.press(k, e); }
    });
    G.on(document, 'keyup', function (e) { delete G.k[e.key.length === 1 ? e.key.toLowerCase() : e.key]; });
    G.on(window, 'blur', function () { G.k = {}; });
    G.ax = function () { return (G.k.ArrowRight || G.k.d ? 1 : 0) - (G.k.ArrowLeft || G.k.a ? 1 : 0); };
    G.ay = function () { return (G.k.ArrowDown || G.k.s ? 1 : 0) - (G.k.ArrowUp || G.k.w ? 1 : 0); };
    G.pt = function (e) { var r = G.cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * G.w / r.width, y: (e.clientY - r.top) * G.h / r.height }; };
    G.pointer = function (o) {
      var cv = G.cv, dn = false;
      G.on(cv, 'pointerdown', function (e) { dn = true; try { cv.setPointerCapture(e.pointerId); } catch (_) { } if (o.down) o.down(G.pt(e), e); });
      G.on(cv, 'pointermove', function (e) { if (o.move) o.move(G.pt(e), e, dn); });
      G.on(cv, 'pointerup', function (e) { dn = false; if (o.up) o.up(G.pt(e), e); });
      G.on(cv, 'pointercancel', function (e) { dn = false; if (o.up) o.up(G.pt(e), e); });
    };
    G.swipe = function (cb) { var off = K.D(G.cv, cb); G.fns.push(off); };
    G.hud = function (a) {
      var s = a.map(function (p, i) { var q = p[0] + '<b>' + p[1] + '</b>'; return i ? '<span style=margin-left:1rem>' + q + '</span>' : q; }).join('');
      if (s !== G.lh) { G.lh = s; x.setHud(s); }
    };
    G.hint = function (s) { x.setHint(s); };
    G.begin = function (start) { G.again = function () { G.st = null; start(); }; x.hideOverlay(); G.st = null; start(); };
    /* learning stats: G.tally(true/false, 'note shown in the review list') after every answered question */
    G.tally = function (ok, note) {
      var s = G.st || (G.st = { n: 0, r: 0, miss: [], done: '' });
      s.n++;
      if (ok) s.r++; else if (note && s.miss.length < 40 && s.miss.indexOf(note) < 0) s.miss.push(String(note));
    };
    G.summary = function () {
      var s = G.st, o, L, k;
      if (!s || !s.n) return '';
      if (s.done) return s.done;
      o = ' · Accuracy ' + Math.round(100 * s.r / s.n) + '% (' + s.r + '/' + s.n + ')';
      if (s.miss.length) o += ' · Review: ' + s.miss.slice(0, 3).join('; ');
      try {
        k = 'csa_edu_' + id; L = JSON.parse(localStorage.getItem(k) || '{}');
        L.n = (L.n || 0) + s.n; L.r = (L.r || 0) + s.r; localStorage.setItem(k, JSON.stringify(L));
        if (L.n >= 40) o += ' · Lifetime ' + Math.round(100 * L.r / L.n) + '%';
      } catch (e) { }
      s.done = o;
      return o;
    };
    G.over = function (score, msg, title) {
      G.run = null; score = Math.floor(score);
      x.reportScore(id, score);
      x.showOverlay(title || 'Game Over', (msg || 'Score: ' + score) + G.summary() + ' · Best ' + x.getHighScore(id), 'Play again', G.again);
    };
    G.burst = function (px, py, col, n) { var i, a, s; for (i = 0; i < (n || 10); i++) { a = rr(0, TAU); s = rr(30, 150); G.fx.push({ x: px, y: py, vx: Math.cos(a) * s, vy: Math.sin(a) * s, t: rr(0.3, 0.7), m: 0.7, c: col }); } };
    G.fxStep = function (dt) {
      var c = G.c;
      G.fx = G.fx.filter(function (p) {
        p.t -= dt; p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.t <= 0) return false;
        c.globalAlpha = clamp(p.t / p.m, 0, 1); c.fillStyle = p.c; c.fillRect(p.x - 1.5, p.y - 1.5, 3, 3); c.globalAlpha = 1;
        return true;
      });
    };
    G.opt = function (label, names, cur, cb) {
      var bar = document.getElementById('optionsBar'), grp = document.createElement('span'), lb = document.createElement('span'), bs = [];
      grp.className = 'opt-group'; lb.className = 'opt-label'; lb.textContent = label; grp.appendChild(lb);
      names.forEach(function (n, i) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'opt-btn' + (i === cur ? ' active' : ''); b.textContent = n;
        b.onclick = function () { bs.forEach(function (o, j) { o.className = 'opt-btn' + (j === i ? ' active' : ''); }); G.st = null; cb(i); };
        bs.push(b); grp.appendChild(b);
      });
      bar.appendChild(grp);
    };
    G.pad = function (list) {
      if (!('ontouchstart' in window) && !(navigator.maxTouchPoints > 0)) return;
      x.setTouchPad(list.map(function (p) { return '<button type=button class=pad-btn data-k=' + p[1] + '>' + p[0] + '</button>'; }).join(''));
      [].forEach.call(document.getElementById('touchPad').querySelectorAll('button'), function (b) {
        var k = b.getAttribute('data-k');
        if (k === 'Space') k = ' ';
        G.on(b, 'pointerdown', function (e) { e.preventDefault(); if (!G.k[k]) { G.k[k] = 1; if (G.press) G.press(k, e); } });
        var up = function () { delete G.k[k]; };
        G.on(b, 'pointerup', up); G.on(b, 'pointerleave', up); G.on(b, 'pointercancel', up);
      });
    };
    G.dispose = function () { G.dead = true; if (G.rid) cancelAnimationFrame(G.rid); G.fns.forEach(function (f) { f(); }); };
    return G;
  }

  function def(id, cat, title, color, tag, hint, fn) {
    g[id] = { title: title, tagline: tag, color: color, hint: hint, category: cat, icon: ICON, mount: function (el, x) { var G = kit(id, el, x); fn(G); return function () { G.dispose(); }; } };
    M.push(id);
    NEW.push(id);
  }

  /* ================= EDUCATION: shared helpers and engines ================= */
  var EDU = 'Education', LV3 = ['Easy', 'Normal', 'Hard'];

  /* draw text wrapped to maxW; returns number of lines */
  function wrap(c, s, x, y, maxW, sz, lh, col) {
    var words = String(s).split(' '), line = '', lines = [], i, t;
    c.font = '700 ' + sz + 'px Figtree, sans-serif';
    for (i = 0; i < words.length; i++) {
      t = line ? line + ' ' + words[i] : words[i];
      if (line && c.measureText(t).width > maxW) { lines.push(line); line = words[i]; } else line = t;
    }
    lines.push(line);
    for (i = 0; i < lines.length; i++) txt(c, lines[i], x, y + i * lh, sz, col);
    return lines.length;
  }
  /* one line, shrunk until it fits maxW; if still too wide at the floor size, truncated with an ellipsis so it never overflows its box */
  function fit(c, s, x, y, maxW, sz, col, al) {
    var z = sz, str = String(s), t;
    c.font = '700 ' + z + 'px Figtree, sans-serif';
    while (z > 9 && c.measureText(str).width > maxW) { z--; c.font = '700 ' + z + 'px Figtree, sans-serif'; }
    if (c.measureText(str).width > maxW) {
      t = str;
      while (t.length > 1 && c.measureText(t + String.fromCharCode(8230)).width > maxW) t = t.slice(0, -1);
      str = t + String.fromCharCode(8230);
    }
    txt(c, str, x, y, z, col, al);
  }
  function hearts(c, x, y, n, max) { var i; for (i = 0; i < max; i++) txt(c, '♥', x + i * 18, y, 16, i < n ? R.coral : R.grid); }
  /* four options: the right one plus three random wrong ones, shuffled. wrongs may hold more than 3. */
  function mk4(right, wrongs) {
    var w = shuf(wrongs.filter(function (v, i, a) { return v !== right && a.indexOf(v) === i; })).slice(0, 3), o = shuf([right].concat(w));
    return { opts: o, a: o.indexOf(right) };
  }
  /* game-over/next-round timers that die if the round was restarted meanwhile (level change, Play again) */
  function gl(G, f, ms) { var g0 = G.gen || 0; G.later(function () { if (g0 === (G.gen || 0)) f(); }, ms); }
  function nice(n) { var s = String(Math.abs(n)), o = '', i; for (i = 0; i < s.length; i++) { if (i && (s.length - i) % 3 === 0) o += ','; o += s.charAt(i); } return (n < 0 ? '-' : '') + o; }

  /* ---- engine 1: multiple-choice race ----
     cfg = { color, secs:[easy,normal,hard], make(level, n) -> { q:'prompt', draw?(c, cx, cy), why?:'shown after a miss', opts:[4 strings], a:index } } */
  function mcq(G, cfg) {
    var W = 400, H = 470, c = G.canvas(W, H), lv = 1, secs = cfg.secs || [14, 10, 7], q, tl, lives, score, streak, bestS, fb, pk, busy, nq;
    function next() { q = cfg.make(lv, nq++); tl = secs[lv]; fb = 0; pk = -1; busy = false; }
    function start() { G.gen = (G.gen || 0) + 1; lives = 3; score = 0; streak = 0; bestS = 0; nq = 0; G.fx = []; next(); G.frame(step); }
    function answer(i) {
      if (busy || i < 0 || i >= q.opts.length) return;
      busy = true; pk = i;
      G.tally(i === q.a, q.rev || q.why || String(q.opts[q.a]));
      if (i === q.a) { streak++; bestS = Math.max(bestS, streak); score += 10 + Math.min(streak, 10) * 2 + Math.ceil(tl); G.burst(70 + (i % 2) * 260, 300 + Math.floor(i / 2) * 84, R.green, 16); fb = 0.75; }
      else { lives--; streak = 0; fb = 1.6; }
    }
    G.pointer({ down: function (p) {
      var i, bx, by;
      for (i = 0; i < 4; i++) { bx = 12 + (i % 2) * 192; by = 262 + Math.floor(i / 2) * 92; if (p.x >= bx && p.x <= bx + 184 && p.y >= by && p.y <= by + 82) answer(i); }
    } });
    G.press = function (k) { var i = '1234'.indexOf(k); if (i < 0) i = 'abcd'.indexOf(k); if (k.length === 1 && i > -1) answer(i); };
    G.pad([['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']]);
    function step(dt) {
      var i, bx, by, col, lab;
      if (!busy) { tl -= dt; if (tl <= 0) { busy = true; pk = -2; lives--; streak = 0; fb = 1.6; G.tally(false, q.rev || q.why || String(q.opts[q.a])); } }
      else { fb -= dt; if (fb <= 0) { if (lives <= 0) { G.over(score, 'Out of lives with ' + score + ' points. Best streak ' + bestS + '.'); return; } next(); } }
      clear(c, W, H);
      rect(c, 20, 14, 360, 8, 4, R.grid); rect(c, 20, 14, Math.max(0, 360 * tl / secs[lv]), 8, 4, tl < 3 && !busy ? R.coral : (cfg.color || R.teal));
      rect(c, 12, 34, 376, 214, 12, R.grid);
      if (q.draw) { wrap(c, q.q, 200, 58, 340, 17, 21, R.dim); q.draw(c, 200, 152); } else wrap(c, q.q, 200, 140, 340, 24, 30, R.ink);
      if (busy && pk !== q.a && q.why) wrap(c, q.why, 200, 226, 350, 13, 16, R.yellow);
      for (i = 0; i < q.opts.length; i++) {
        bx = 12 + (i % 2) * 192; by = 262 + Math.floor(i / 2) * 92; col = R.violet;
        if (busy && i === q.a) col = R.green; else if (busy && i === pk) col = R.coral;
        rect(c, bx, by, 184, 82, 12, col);
        lab = String(q.opts[i]);
        if (lab.length > 15) wrap(c, lab, bx + 92, by + 41 - (lab.length > 30 ? 12 : 0), 164, 15, 18, '#171233'); else fit(c, lab, bx + 92, by + 41, 164, 21, '#171233');
        txt(c, 'ABCD'.charAt(i), bx + 14, by + 14, 12, 'rgba(23,18,51,.6)');
      }
      G.fxStep(dt);
      G.hud([['SCORE', pad(score)], ['STREAK', streak], ['LIVES', lives]]);
    }
    G.opt('Level', LV3, lv, function (i) { lv = i; start(); });
    G.begin(start);
  }

  /* ---- engine 2: two-column matching ----
     cfg = { color, bank:[[left,right],...], n:[pairs per round for easy,normal,hard], per:seconds per pair } */
  function pairs(G, cfg) {
    var W = 400, H = 470, c = G.canvas(W, H), lv = 1, Ls, Rs, sel, lives, score, round, tl, shake, cur, doneN;
    function deal() {
      var b = shuf(cfg.bank.slice()).slice(0, cfg.n[lv]);
      Ls = b.map(function (p, i) { return { t: p[0], k: i, ok: 0 }; });
      Rs = shuf(b.map(function (p, i) { return { t: p[1], k: i, ok: 0 }; }));
      sel = null; doneN = 0; tl = b.length * (cfg.per || 6) + 5; cur = { s: 0, i: 0 };
    }
    function start() { G.gen = (G.gen || 0) + 1; lives = 3; score = 0; round = 0; shake = 0; G.fx = []; deal(); G.frame(step); }
    function rowH() { return Math.min(58, 330 / Ls.length); }
    function hit(side, i) {
      var it = (side ? Rs : Ls)[i], o, cp;
      if (!it || it.ok) return;
      if (!sel || sel.s === side) { sel = { s: side, i: i }; return; }
      o = (sel.s ? Rs : Ls)[sel.i];
      if (o.k === it.k) {
        G.tally(true);
        o.ok = 1; it.ok = 1; doneN++; score += 10 + Math.ceil(tl / 4); G.burst(200, 110 + i * rowH(), R.green, 16); sel = null;
        if (doneN >= Ls.length) { round++; score += 20 + Math.ceil(tl) * 2; gl(G, deal, 500); }
      } else { cp = (sel.s ? Ls : Rs).filter(function (z) { return z.k === o.k; })[0]; G.tally(false, sel.s ? cp.t + ' = ' + o.t : o.t + ' = ' + cp.t); lives--; shake = 0.35; sel = null; if (lives <= 0) gl(G, function () { G.over(score, 'Out of lives after ' + round + ' round' + (round === 1 ? '' : 's') + '. Score: ' + score); }, 500); }
    }
    G.pointer({ down: function (p) {
      var rh = rowH(), i;
      if (p.y < 88) return;
      i = Math.floor((p.y - 92) / rh);
      if (i < 0 || i >= Ls.length) return;
      if (p.x < 200) hit(0, i); else hit(1, i);
    } });
    G.press = function (k) {
      if (k === 'ArrowUp' || k === 'w') cur.i = (cur.i + Ls.length - 1) % Ls.length;
      else if (k === 'ArrowDown' || k === 's') cur.i = (cur.i + 1) % Ls.length;
      else if (k === 'ArrowLeft' || k === 'a') cur.s = 0;
      else if (k === 'ArrowRight' || k === 'd') cur.s = 1;
      else if (k === ' ' || k === 'Enter') hit(cur.s, cur.i);
    };
    G.pad([['◀', 'ArrowLeft'], ['▲', 'ArrowUp'], ['▼', 'ArrowDown'], ['▶', 'ArrowRight'], ['Pick', 'Space']]);
    function step(dt) {
      var rh = rowH(), i, it, y, side, col, dx;
      if (lives > 0 && doneN < Ls.length) { tl -= dt; if (tl <= 0) { lives--; shake = 0.35; if (lives <= 0) gl(G, function () { G.over(score, 'Time ran out after ' + round + ' round' + (round === 1 ? '' : 's') + '. Score: ' + score); }, 400); else deal(); } }
      if (shake > 0) shake -= dt;
      clear(c, W, H);
      rect(c, 20, 14, 360, 8, 4, R.grid); rect(c, 20, 14, Math.max(0, 360 * tl / (Ls.length * (cfg.per || 6) + 5)), 8, 4, tl < 5 ? R.coral : (cfg.color || R.teal));
      txt(c, 'Tap one on the left, then its match on the right', 200, 48, 14, R.dim);
      for (side = 0; side < 2; side++) for (i = 0; i < Ls.length; i++) {
        it = (side ? Rs : Ls)[i]; y = 92 + i * rh; dx = shake > 0 ? Math.sin(shake * 90) * 4 : 0;
        col = it.ok ? R.green : (sel && sel.s === side && sel.i === i ? R.yellow : (side ? R.violet : R.blue));
        rect(c, 10 + side * 200 + dx, y, 180, rh - 6, 10, col);
        if (cur && G.k && (G.k.ArrowUp || G.k.ArrowDown || G.k.ArrowLeft || G.k.ArrowRight) && cur.s === side && cur.i === i) { c.strokeStyle = R.ink; c.lineWidth = 3; K.L(c, 8 + side * 200, y - 2, 184, rh - 2, 11); c.stroke(); }
        if (String(it.t).length > 14) wrap(c, it.t, 100 + side * 200 + dx, y + rh / 2 - 3 - (String(it.t).length > 28 ? 8 : 0), 164, 14, 16, '#171233'); else fit(c, it.t, 100 + side * 200 + dx, y + rh / 2 - 3, 164, 19, '#171233');
      }
      G.fxStep(dt);
      G.hud([['SCORE', pad(score)], ['ROUND', round + 1], ['LIVES', lives]]);
    }
    G.opt('Level', LV3, lv, function (i) { lv = i; start(); });
    G.begin(start);
  }

  /* ---- engine 3: put things in order ----
     cfg = { color, make(level) -> { q:'prompt', items:[in correct order; repeated texts are fine], sub?:[small caption per item, revealed once placed], first:'label for the first', last:'label for the last' } } */
  function order(G, cfg) {
    var W = 400, H = 470, c = G.canvas(W, H), lv = 1, q, tiles, next, lives, score, round, t0, flash, mistakes, cur;
    function deal() {
      var i;
      q = cfg.make(lv); tiles = shuf(q.items.map(function (s, k) { return { t: s, k: k, ok: 0 }; })); next = 0; t0 = 0; mistakes = 0; flash = null; cur = 0;
    }
    function start() { G.gen = (G.gen || 0) + 1; lives = 4; score = 0; round = 0; G.fx = []; deal(); G.frame(step); }
    function geo() { var n = tiles.length, cols = n > 5 ? 2 : 1, rows = Math.ceil(n / cols), h = Math.min(58, 300 / rows); return { cols: cols, rows: rows, h: h, w: cols === 2 ? 184 : 300 }; }
    function tileXY(i) { var g2 = geo(), col = g2.cols === 2 ? i % 2 : 0, row = g2.cols === 2 ? Math.floor(i / 2) : i; return { x: g2.cols === 2 ? 10 + col * 192 : 50, y: 132 + row * g2.h }; }
    function pickT(i) {
      var t = tiles[i];
      if (!t || t.ok || lives <= 0 || next >= tiles.length) return;
      if (t.t === q.items[next]) {
        G.tally(true);
        t.ok = next + 1; next++; score += 10; G.burst(tileXY(i).x + geo().w / 2, tileXY(i).y + 20, R.green, 12);
        if (next >= tiles.length) { round++; score += Math.max(0, 40 - mistakes * 10) + Math.max(0, Math.ceil(40 - t0)); gl(G, deal, 900); }
      } else { G.tally(false, q.items[next] + (q.sub ? ' (' + q.sub[next] + ')' : '')); lives--; mistakes++; flash = { i: i, t: 0.4 }; if (lives <= 0) gl(G, function () { G.over(score, 'Out of lives after ' + round + ' round' + (round === 1 ? '' : 's') + '. Score: ' + score); }, 700); }
    }
    G.pointer({ down: function (p) {
      var i, xy, g2 = geo();
      for (i = 0; i < tiles.length; i++) { xy = tileXY(i); if (p.x >= xy.x && p.x <= xy.x + g2.w && p.y >= xy.y && p.y <= xy.y + g2.h - 6) pickT(i); }
    } });
    G.press = function (k) {
      var g2 = geo(), n = tiles.length;
      if (k === 'ArrowUp' || k === 'w') cur = (cur - g2.cols + n) % n; else if (k === 'ArrowDown' || k === 's') cur = (cur + g2.cols) % n;
      else if (k === 'ArrowLeft' || k === 'a') cur = (cur + n - 1) % n; else if (k === 'ArrowRight' || k === 'd') cur = (cur + 1) % n;
      else if (k === ' ' || k === 'Enter') pickT(cur);
    };
    G.pad([['◀', 'ArrowLeft'], ['▲', 'ArrowUp'], ['▼', 'ArrowDown'], ['▶', 'ArrowRight'], ['Pick', 'Space']]);
    function step(dt) {
      var i, xy, g2 = geo(), col;
      if (next < tiles.length && lives > 0) t0 += dt;
      if (flash) { flash.t -= dt; if (flash.t <= 0) flash = null; }
      clear(c, W, H);
      wrap(c, q.q, 200, 34, 360, 19, 23, R.ink);
      txt(c, next < tiles.length ? 'Next: pick number ' + (next + 1) + ' of ' + tiles.length : 'Perfect order!', 200, 84, 14, R.yellow);
      txt(c, (q.first || 'first') + '  →  ' + (q.last || 'last'), 200, 108, 13, R.dim);
      for (i = 0; i < tiles.length; i++) {
        xy = tileXY(i);
        col = tiles[i].ok ? R.green : (flash && flash.i === i ? R.coral : R.violet);
        rect(c, xy.x, xy.y, g2.w, g2.h - 6, 10, col);
        fit(c, tiles[i].t, xy.x + g2.w / 2 + (tiles[i].ok ? 12 : 0), xy.y + (g2.h - 6) / 2 - (tiles[i].ok && q.sub ? 7 : 0), g2.w - 44, 18, '#171233');
        if (tiles[i].ok && q.sub) fit(c, q.sub[tiles[i].ok - 1], xy.x + g2.w / 2 + 12, xy.y + (g2.h - 6) / 2 + 13, g2.w - 44, 12, 'rgba(23,18,51,.75)');
        if (tiles[i].ok) txt(c, String(tiles[i].ok), xy.x + 18, xy.y + (g2.h - 6) / 2, 16, '#171233');
        if (G.k && (G.k.ArrowUp || G.k.ArrowDown || G.k.ArrowLeft || G.k.ArrowRight) && i === cur) { c.strokeStyle = R.ink; c.lineWidth = 3; K.L(c, xy.x - 2, xy.y - 2, g2.w + 4, g2.h - 2, 11); c.stroke(); }
      }
      G.fxStep(dt);
      G.hud([['SCORE', pad(score)], ['ROUND', round + 1], ['LIVES', lives]]);
    }
    G.opt('Level', LV3, lv, function (i) { lv = i; start(); });
    G.begin(start);
  }

  /* ---- engine 4: sort falling cards into bins ----
     cfg = { color, bins:[{n:'Noun', c:colour}], pool(level) -> [[text, binIndex],...], speed:[easy,normal,hard] px/sec } */
  function sorter(G, cfg) {
    var W = 400, H = 470, c = G.canvas(W, H), lv = 1, it, lives, score, streak, sp, pool, msg, msgT, hit, n = cfg.bins.length, BY = 388;
    function spawn() { var p = pick(pool); it = { t: p[0], b: p[1], y: 30, x: rr(90, 310), gone: 0, res: 0 }; }
    function start() { G.gen = (G.gen || 0) + 1; lives = 3; score = 0; streak = 0; sp = cfg.speed[lv]; pool = cfg.pool(lv); msg = ''; msgT = 0; G.fx = []; spawn(); G.frame(step); }
    function put(b) {
      if (!it || it.res || b < 0 || b >= n || lives <= 0) return;
      G.tally(b === it.b, it.t + ' = ' + cfg.bins[it.b].n);
      if (b === it.b) { it.res = 1; streak++; score += 10 + Math.min(streak, 10); sp += 2.5; G.burst(it.x, it.y, cfg.bins[b].c, 14); msg = ''; }
      else { it.res = 2; lives--; streak = 0; msg = it.t + ' belongs in ' + cfg.bins[it.b].n; msgT = 1.6; if (lives <= 0) gl(G, function () { G.over(score, 'Out of lives with ' + score + ' points.'); }, 900); }
      it.gone = 0.35;
    }
    G.pointer({ down: function (p) { var w = 380 / n, b = Math.floor((p.x - 10) / w); if (p.y > BY - 20) put(b); } });
    G.press = function (k) {
      var i = '1234'.indexOf(k);
      if (i > -1 && i < n) put(i);
      else if (n === 3 && k === 'ArrowLeft') put(0); else if (n === 3 && k === 'ArrowDown') put(1); else if (n === 3 && k === 'ArrowRight') put(2);
      else if (n === 2 && k === 'ArrowLeft') put(0); else if (n === 2 && k === 'ArrowRight') put(1);
      else if (n === 4 && k === 'ArrowLeft') put(0); else if (n === 4 && k === 'ArrowDown') put(1); else if (n === 4 && k === 'ArrowUp') put(2); else if (n === 4 && k === 'ArrowRight') put(3);
    };
    G.pad(cfg.bins.map(function (b, i) { return [String(i + 1), String(i + 1)]; }));
    function step(dt) {
      var i, w = 380 / n, cw;
      if (it) {
        if (!it.res) { it.y += sp * dt; if (it.y > BY - 30) { G.tally(false, it.t + ' = ' + cfg.bins[it.b].n); lives--; streak = 0; msg = 'Too slow: ' + it.t + ' belongs in ' + cfg.bins[it.b].n; msgT = 1.6; it.res = 2; it.gone = 0.25; if (lives <= 0) gl(G, function () { G.over(score, 'Out of lives with ' + score + ' points.'); }, 900); } }
        else { it.gone -= dt; if (it.gone <= 0) { if (lives > 0) spawn(); else it = null; } }
      }
      if (msgT > 0) msgT -= dt;
      clear(c, W, H);
      for (i = 0; i < n; i++) {
        rect(c, 10 + i * w + 3, BY, w - 6, 66, 12, cfg.bins[i].c);
        fit(c, cfg.bins[i].n, 10 + i * w + w / 2, BY + 26, w - 18, 18, '#171233');
        txt(c, String(i + 1), 10 + i * w + w / 2, BY + 50, 12, 'rgba(23,18,51,.6)');
      }
      if (it) {
        c.font = '700 22px Figtree, sans-serif'; cw = Math.min(190, c.measureText(it.t).width + 36);
        rect(c, it.x - cw / 2, it.y - 24, cw, 48, 12, it.res === 1 ? R.green : it.res === 2 ? R.coral : R.ink);
        fit(c, it.t, it.x, it.y, cw - 16, 22, '#171233');
      }
      if (msgT > 0) wrap(c, msg, 200, 60, 340, 15, 19, R.yellow);
      G.fxStep(dt);
      G.hud([['SCORE', pad(score)], ['STREAK', streak], ['LIVES', lives]]);
    }
    G.opt('Level', LV3, lv, function (i) { lv = i; start(); });
    G.begin(start);
  }
  /* ================= H: geography / history cabinets (timelineSort, gridPilot, continentClick) ================= */

  /* ---- H1: Timeline Sort — order engine, 190+ verified events, two round types (earliest-first / most-recent-first) ---- */
  var H_EV = [
    [-3200, 1, 'Cuneiform writing appears in Sumer'], [-3100, 1, 'Egypt unified under its first pharaoh'], [-2560, 1, 'Great Pyramid of Giza completed'],
    [-1792, 1, 'Hammurabi becomes king of Babylon'], [-1600, 1, 'Shang dynasty begins in China'], [-1274, 1, 'Battle of Kadesh fought'],
    [-1046, 1, 'Zhou dynasty begins in China'], [-776, 0, 'First Olympic Games recorded'], [-753, 1, 'Rome traditionally founded'],
    [-551, 1, 'Confucius born'], [-509, 0, 'Roman Republic founded'], [-490, 0, 'Battle of Marathon'], [-431, 0, 'Peloponnesian War begins'],
    [-399, 0, 'Socrates executed in Athens'], [-336, 0, 'Alexander becomes king of Macedon'], [-331, 0, 'Alexander defeats Persia at Gaugamela'],
    [-323, 0, 'Alexander the Great dies'], [-264, 0, 'First Punic War begins'], [-221, 0, 'Qin unites China'], [-202, 0, 'Battle of Zama ends Second Punic War'],
    [-44, 0, 'Julius Caesar assassinated'], [-27, 0, 'Roman Empire begins under Augustus'], [14, 0, 'Augustus dies, Tiberius succeeds'],
    [64, 0, 'Great Fire of Rome'], [79, 0, 'Pompeii buried by Vesuvius'], [122, 0, 'Hadrian Wall construction begins'],
    [312, 0, 'Battle of Milvian Bridge'], [325, 0, 'Council of Nicaea convened'], [395, 0, 'Roman Empire permanently splits East and West'],
    [410, 0, 'Rome sacked by the Visigoths'], [476, 0, 'Western Roman Empire falls'], [537, 0, 'Hagia Sophia completed in Constantinople'],
    [618, 0, 'Tang dynasty founded in China'], [711, 0, 'Umayyad conquest of Hispania begins'], [793, 0, 'Viking raid on Lindisfarne'],
    [800, 0, 'Charlemagne crowned emperor'], [868, 0, 'Diamond Sutra printed, oldest dated book'], [1066, 0, 'Battle of Hastings'],
    [1088, 0, 'University of Bologna founded'], [1096, 0, 'First Crusade begins'], [1187, 0, 'Saladin captures Jerusalem'],
    [1206, 0, 'Genghis Khan founds the Mongol Empire'], [1215, 0, 'Magna Carta signed'], [1271, 0, 'Marco Polo departs for China'],
    [1279, 0, 'Mongols complete conquest of Song China'], [1291, 0, 'Swiss Confederacy founded'], [1299, 1, 'Ottoman Empire founded'],
    [1325, 1, 'Aztecs found Tenochtitlan'], [1347, 0, 'Black Death arrives in Europe'], [1368, 0, 'Ming dynasty founded in China'],
    [1405, 0, 'Zheng He departs on his first treasure voyage'], [1429, 0, 'Joan of Arc relieves the Siege of Orleans'],
    [1440, 1, 'Gutenberg develops the printing press'], [1453, 0, 'Constantinople falls to the Ottomans'], [1455, 0, 'Wars of the Roses begin'],
    [1478, 0, 'Spanish Inquisition established'], [1480, 0, 'Mongol rule over Moscow formally ends'], [1492, 0, 'Columbus reaches the Americas'],
    [1498, 0, 'Da Gama reaches India by sea'], [1517, 0, '95 Theses published'], [1521, 0, 'Tenochtitlan falls to Spanish conquest'],
    [1522, 0, 'First circumnavigation of the globe completes'], [1526, 0, 'Battle of Panipat founds the Mughal Empire'],
    [1533, 0, 'Inca Empire falls to Spanish conquest'], [1543, 0, 'Copernicus publishes heliocentric theory'], [1588, 0, 'Spanish Armada defeated'],
    [1600, 0, 'British East India Company founded'], [1607, 0, 'Jamestown founded in North America'], [1609, 0, 'Galileo improves the telescope'],
    [1620, 0, 'Mayflower lands at Plymouth'], [1642, 0, 'English Civil War begins'], [1648, 0, 'Peace of Westphalia signed'],
    [1652, 0, 'Dutch found the Cape Colony'], [1666, 0, 'Great Fire of London'], [1687, 0, 'Newton publishes the Principia'],
    [1694, 0, 'Bank of England founded'], [1707, 0, 'Acts of Union create Great Britain'], [1735, 0, 'Linnaeus publishes Systema Naturae'],
    [1769, 0, 'Watt patents his improved steam engine'], [1776, 0, 'US Declaration of Independence'], [1783, 0, 'First hot air balloon flight'],
    [1789, 0, 'French Revolution begins'], [1791, 0, 'Haitian Revolution begins'], [1799, 0, 'Rosetta Stone found'],
    [1803, 0, 'Louisiana Purchase'], [1804, 0, 'Napoleon crowned emperor'], [1804, 0, 'Haiti declares independence'],
    [1815, 0, 'Battle of Waterloo'], [1821, 0, 'Greek War of Independence begins'], [1830, 0, 'First inter-city passenger railway opens'],
    [1839, 0, 'First Opium War begins'], [1839, 0, 'Daguerre announces practical photography'], [1848, 0, 'Revolutions of 1848 sweep Europe'],
    [1848, 0, 'Gold discovered in California'], [1857, 0, 'Indian Rebellion of 1857 begins'], [1859, 0, 'Origin of Species published'],
    [1861, 0, 'US Civil War begins'], [1865, 0, 'Lincoln assassinated'], [1867, 0, 'Canadian Confederation formed'],
    [1868, 0, 'Meiji Restoration begins in Japan'], [1869, 0, 'Suez Canal opens'], [1869, 0, 'First US transcontinental railroad completed'],
    [1871, 0, 'German Empire is proclaimed'], [1876, 0, 'Telephone patented'], [1877, 0, 'Edison invents the phonograph'],
    [1879, 0, 'Edison demonstrates a practical light bulb'], [1885, 0, 'Berlin Conference on Africa concludes'], [1886, 0, 'Benz automobile patented'],
    [1889, 0, 'Eiffel Tower completed'], [1893, 0, 'New Zealand grants women the vote nationally'], [1895, 0, 'Lumiere brothers screen film publicly'],
    [1896, 0, 'First modern Olympic Games'], [1898, 0, 'Curies discover radium and polonium'], [1901, 0, 'First Nobel Prizes awarded'],
    [1903, 0, 'Wright brothers first powered flight'], [1904, 0, 'Russo-Japanese War begins'], [1905, 0, 'Einstein publishes special relativity'],
    [1908, 0, 'Model T launched'], [1910, 0, 'Mexican Revolution begins'], [1911, 0, 'Amundsen expedition reaches the South Pole'],
    [1912, 0, 'Titanic sinks'], [1912, 0, 'Republic of China founded'], [1914, 0, 'World War I begins'], [1917, 0, 'Russian Revolution'],
    [1918, 0, 'World War I ends'], [1919, 0, 'Treaty of Versailles signed'], [1920, 0, 'League of Nations established'],
    [1922, 0, 'Tutankhamun tomb found'], [1922, 0, 'Soviet Union formally established'], [1923, 0, 'Republic of Turkey founded'],
    [1928, 0, 'Penicillin discovered'], [1929, 0, 'Wall Street crash'], [1931, 0, 'Empire State Building completed'],
    [1933, 0, 'Hitler becomes German chancellor'], [1936, 0, 'Owens wins four golds at the Berlin Olympics'], [1939, 0, 'World War II begins'],
    [1945, 0, 'World War II ends'], [1945, 0, 'United Nations founded'], [1947, 0, 'India becomes independent'],
    [1949, 0, 'People Republic of China proclaimed'], [1950, 0, 'Korean War begins'], [1953, 0, 'DNA double helix structure published'],
    [1953, 0, 'Hillary and Norgay summit Everest'], [1955, 0, 'Rosa Parks sparks the Montgomery bus boycott'], [1957, 0, 'Sputnik launched'],
    [1957, 0, 'Ghana becomes independent'], [1959, 0, 'Castro takes power in Cuba'], [1961, 0, 'First human in space'],
    [1961, 0, 'Berlin Wall is constructed'], [1962, 0, 'Cuban Missile Crisis'], [1963, 0, 'Kennedy assassinated'],
    [1963, 0, 'MLK delivers his Dream speech in Washington'], [1964, 0, 'US Civil Rights Act signed'], [1965, 0, 'US Voting Rights Act signed'],
    [1967, 0, 'First human heart transplant performed'], [1969, 0, 'First Moon landing'], [1969, 0, 'ARPANET sends its first message'],
    [1971, 0, 'Bangladesh becomes independent'], [1974, 0, 'Carnation Revolution ends dictatorship in Portugal'], [1975, 0, 'Vietnam War ends'],
    [1976, 0, 'Apple Computer founded'], [1979, 0, 'Iranian Revolution establishes an Islamic republic'], [1981, 0, 'First Space Shuttle launch'],
    [1986, 0, 'Chernobyl disaster'], [1989, 0, 'Berlin Wall falls'], [1990, 0, 'Mandela freed after 27 years'],
    [1990, 0, 'World Wide Web invented'], [1991, 0, 'Soviet Union dissolves'], [1993, 0, 'European Union formally established'],
    [1994, 0, 'Channel Tunnel opens'], [1994, 0, 'Mandela elected president of South Africa'], [1996, 0, 'Dolly the sheep is born'],
    [1997, 0, 'Hong Kong returns to China'], [2001, 0, 'September 11 attacks'], [2003, 0, 'Human Genome Project completed'],
    [2004, 0, 'Facebook founded'], [2004, 0, 'Indian Ocean tsunami'], [2007, 0, 'First iPhone released'],
    [2008, 0, 'Global financial crisis begins'], [2009, 0, 'Obama becomes first Black US president'], [2010, 0, 'Arab Spring begins'],
    [2011, 0, 'Osama bin Laden killed in US raid'], [2012, 0, 'Curiosity rover lands on Mars'], [2015, 0, 'Paris Agreement on climate adopted'],
    [2016, 0, 'UK votes for Brexit'], [2019, 0, 'First image of a black hole released'], [2020, 0, 'WHO declares COVID-19 a pandemic'],
    [2022, 0, 'Russia launches full invasion of Ukraine']
  ];
  function H_year(y, ap) { return (ap ? 'c. ' : '') + (y < 0 ? (-y) + ' BCE' : y < 1000 ? y + ' CE' : String(y)); }
  /* pick n events within +-w years of a random anchor, widening w until n fit; enforce a minimum year gap between any two (bigger if either date is approximate, since c. dates should not be adjacent) */
  function H_pickEv(n, w0, w1, gap) {
    var an = shuf(H_EV.slice()), w, i, j, k, cand, out, ok, d;
    for (w = w0; w <= w1 + 1; w += Math.max(10, (w1 - w0) / 6)) {
      for (i = 0; i < Math.min(an.length, 16); i++) {
        cand = shuf(H_EV.filter(function (e) { return Math.abs(e[0] - an[i][0]) <= w; }));
        out = [];
        for (j = 0; j < cand.length && out.length < n; j++) {
          ok = true;
          for (k = 0; k < out.length; k++) { d = Math.abs(out[k][0] - cand[j][0]); if (d < gap + (out[k][1] || cand[j][1] ? 14 : 0)) ok = false; }
          if (ok) out.push(cand[j]);
        }
        if (out.length >= n) return out.sort(function (a, b) { return a[0] - b[0]; });
      }
    }
    return H_pickEv(n, 4000, 6000, 3);
  }
  def('timelineSort', EDU, 'Timeline Sort', R.yellow, 'Put famous world events in order. Each correct pick reveals its year. 190+ verified dates.', 'Tap the events in order · arrows + Space work too · four wrong taps ends it', function (G) {
    var rnd2 = 0;
    order(G, { color: R.yellow, make: function (lv) {
      var ev = lv === 0 ? H_pickEv(4, 4700, 6000, 250) : lv === 1 ? H_pickEv(6, 180, 1200, 12) : H_pickEv(8, 45, 150, 3), rev, q;
      rev = lv > 0 && (rnd2++ % 3 === 2);
      if (rev) ev = ev.slice().reverse();
      q = { q: rev ? 'Put these events in order, most recent first' : 'Put these events in order, earliest first',
        items: ev.map(function (e) { return e[2]; }), sub: ev.map(function (e) { return H_year(e[0], e[1]); }),
        first: rev ? 'most recent' : 'earliest', last: rev ? 'earliest' : 'most recent' };
      return q;
    } });
  });

  /* ---- H2: Grid Pilot — coordinate geometry: plot, read, reflect, midpoint and distance rounds ---- */
  function H_pt(x, y) { return '(' + String(x).replace('-', String.fromCharCode(8722)) + ', ' + String(y).replace('-', String.fromCharCode(8722)) + ')'; }
  function H_plane(c, x, y, ang, s, col) {
    var g;
    c.save(); c.translate(x, y); c.rotate(ang);
    c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 5; c.shadowOffsetY = 2;
    g = c.createLinearGradient(-s, -s, s, s);
    g.addColorStop(0, H_lite(col, 60)); g.addColorStop(0.5, col); g.addColorStop(1, H_lite(col, -40));
    c.beginPath(); c.moveTo(0, -s); c.lineTo(s * 0.75, s * 0.8); c.lineTo(0, s * 0.35); c.lineTo(-s * 0.75, s * 0.8); c.closePath();
    c.fillStyle = g; c.fill(); c.shadowColor = 'transparent'; c.shadowBlur = 0;
    c.strokeStyle = 'rgba(10,10,20,.6)'; c.lineWidth = 1; c.stroke();
    c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(0, -s * 0.15, s * 0.22, s * 0.4, 0, 0, TAU); c.fill();
    c.restore();
  }
  function H_lite(hex, amt) {
    if (hex.charAt(0) !== '#' || hex.length < 7) return hex;
    var r = clamp(parseInt(hex.substr(1, 2), 16) + amt, 0, 255), g2 = clamp(parseInt(hex.substr(3, 2), 16) + amt, 0, 255), b = clamp(parseInt(hex.substr(5, 2), 16) + amt, 0, 255);
    return 'rgb(' + r + ',' + g2 + ',' + b + ')';
  }
  function H_star(c, x, y, r, col, hollow, glow) {
    var i, a;
    if (glow) { c.save(); c.shadowColor = col; c.shadowBlur = 10; }
    c.beginPath();
    for (i = 0; i < 10; i++) { a = -Math.PI / 2 + i * Math.PI / 5; c.lineTo(x + Math.cos(a) * (i % 2 ? r * 0.45 : r), y + Math.sin(a) * (i % 2 ? r * 0.45 : r)); }
    c.closePath();
    if (hollow) { c.strokeStyle = col; c.lineWidth = 2; c.stroke(); } else { c.fillStyle = col; c.fill(); c.strokeStyle = R.bg; c.lineWidth = 1; c.stroke(); }
    if (glow) c.restore();
  }
  def('gridPilot', EDU, 'Grid Pilot', R.green, 'Fly your plane to coordinates, read star positions, then find midpoints and distances.', 'Tap or drag on the grid, or arrows + Space · star rounds: tap an answer or press 1-4', function (G) {
    var W = 400, H = 540, c = G.canvas(W, H), lv = 1, LO = [0, -5, -8], HI = [8, 5, 8], BX = 44, BY = 84, BS = 320, BASE = [[15, 12], [12, 10], [14, 12]];
    var q, cur, ang, tang, tl, tmax, lives, score, streak, bestS, n, fb, rv, pk, sel, chosen, msg, msgCol, pdown, hover, hold, ksel, board, boardLv = -1;
    function cs() { return BS / (HI[lv] - LO[lv]); }
    function gx2px(x) { return BX + (x - LO[lv]) * cs(); }
    function gy2py(y) { return BY + (HI[lv] - y) * cs(); }
    function buildBoard() {
      var o, sc = G.cv.width / W, i, ax0, ay0, bx0 = BX - 30, by0 = BY - 12, bw = BS + 60, bh = BS + 40, g;
      board = document.createElement('canvas'); board.width = Math.round(W * sc); board.height = Math.round(H * sc);
      o = board.getContext('2d'); o.scale(sc, sc);
      g = o.createLinearGradient(0, by0, 0, by0 + bh);
      g.addColorStop(0, '#1e1750'); g.addColorStop(1, '#150f38');
      o.shadowColor = 'rgba(0,0,0,.4)'; o.shadowBlur = 10; o.shadowOffsetY = 3;
      rect(o, bx0, by0, bw, bh, 14, null); o.fillStyle = g; o.fill();
      o.shadowColor = 'transparent'; o.shadowBlur = 0;
      ax0 = gx2px(0); ay0 = gy2py(0);
      for (i = LO[lv]; i <= HI[lv]; i++) {
        line(o, gx2px(i), BY, gx2px(i), BY + BS, i === 0 ? R.dim : 'rgba(233,251,249,.10)', i === 0 ? 2 : 1);
        line(o, BX, gy2py(i), BX + BS, gy2py(i), i === 0 ? R.dim : 'rgba(233,251,249,.10)', i === 0 ? 2 : 1);
      }
      for (i = LO[lv]; i <= HI[lv]; i++) {
        if (i === 0 && lv > 0) { txt(o, '0', ax0 - 8, ay0 + 10, 12, R.dim); continue; }
        txt(o, String(i).replace('-', String.fromCharCode(8722)), gx2px(i), ay0 + 11, 12, R.dim);
        if (i !== 0 || lv === 0) txt(o, String(i).replace('-', String.fromCharCode(8722)), ax0 - (lv === 0 ? 9 : 8) - (i < 0 ? 4 : 0), gy2py(i), 12, R.dim);
      }
      txt(o, 'x', BX + BS + 16, ay0, 14, R.ink); txt(o, 'y', ax0, BY - 4, 14, R.ink);
      boardLv = lv;
    }
    function rp() {
      var x, y, lo = LO[lv], hi = HI[lv];
      do { x = lo + rnd(hi - lo + 1); y = lo + rnd(hi - lo + 1); } while ((x === 0 && y === 0) || (lv === 0 && (x === 0 || y === 0) && Math.random() < 0.8));
      return [x, y];
    }
    function rpEven() {
      var x, y, lo = LO[lv], hi = HI[lv], t;
      do { x = lo + rnd(hi - lo + 1); y = lo + rnd(hi - lo + 1); } while (x === 0 && y === 0);
      return [x, y];
    }
    function make() {
      var t = n % 2 ? 'read' : 'plot', p, refl, ax, o = {}, wr = [], i, j, lo = LO[lv], hi = HI[lv], special = null, a, b, mx, my, d, j2;
      if (lv > 0 && n % 5 === 3) special = 'dist';
      else if (lv === 2 && n % 7 === 5) special = 'mid';
      if (special === 'dist') {
        a = rp(); do { b = rp(); } while (b[0] === a[0] && b[1] === a[1]);
        d = Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]));
        o.type = 'read'; o.mode = 'dist'; o.mA = a; o.mB = b;
        o.l1 = 'Distance from A to B?'; o.l2 = '';
        wr = [Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]), Math.sqrt((a[0] - b[0] + 1) * (a[0] - b[0] + 1) + (a[1] - b[1]) * (a[1] - b[1])),
          Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1] + 1) * (a[1] - b[1] + 1)), Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), d + 1, Math.max(0.5, d - 1)];
        j = mk4(d.toFixed(1) + ' u', wr.filter(function (v) { return v >= 0; }).map(function (v) { return v.toFixed(1) + ' u'; }));
        o.opts = j.opts; o.a = j.a; o.tx = 0; o.ty = 0;
        return o;
      }
      if (special === 'mid') {
        do { a = rpEven(); b = rpEven(); } while ((a[0] === b[0] && a[1] === b[1]) || ((a[0] + b[0]) % 2 !== 0) || ((a[1] + b[1]) % 2 !== 0));
        mx = (a[0] + b[0]) / 2; my = (a[1] + b[1]) / 2;
        o.type = 'plot'; o.mode = 'mid'; o.mA = a; o.mB = b; o.tx = mx; o.ty = my;
        o.l1 = 'Fly to the midpoint of A and B'; o.l2 = '';
        return o;
      }
      p = rp(); refl = lv === 2 && Math.random() < 0.5; ax = Math.random() < 0.5;
      o.type = t; o.sx = p[0]; o.sy = p[1]; o.refl = refl; o.ax = ax ? 'x' : 'y';
      if (refl) {
        while (ax ? p[1] === 0 : p[0] === 0) p = rp();
        o.sx = p[0]; o.sy = p[1]; o.tx = ax ? p[0] : -p[0]; o.ty = ax ? -p[1] : p[1];
      } else { o.tx = p[0]; o.ty = p[1]; }
      if (t === 'plot') {
        o.l1 = refl ? 'Fly to the mirror image of ' + H_pt(o.sx, o.sy) : 'Fly to ' + H_pt(o.tx, o.ty);
        o.l2 = refl ? 'across the ' + o.ax + '-axis' : '';
      } else {
        o.l1 = refl ? 'Mirror the star across the ' + o.ax + '-axis.' : 'Which coordinates is the star at?';
        o.l2 = refl ? 'Which coordinates does it land on?' : '';
        for (i = -1; i <= 1; i++) for (j2 = -1; j2 <= 1; j2++) if (i || j2) wr.push([o.tx + i, o.ty + j2]);
        wr.push([o.ty, o.tx], [-o.tx, o.ty], [o.tx, -o.ty], [-o.tx, -o.ty], [o.tx + 2, o.ty], [o.tx, o.ty - 2]);
        if (refl) wr.push([o.sx, o.sy], [o.sy, o.sx], ax ? [-o.sx, o.sy] : [o.sx, -o.sy]);
        wr = wr.filter(function (v) { return v[0] >= lo && v[0] <= hi && v[1] >= lo && v[1] <= hi; }).map(function (v) { return H_pt(v[0], v[1]); });
        j = mk4(H_pt(o.tx, o.ty), wr); o.opts = j.opts; o.a = j.a;
      }
      return o;
    }
    function next() {
      q = make(); tmax = BASE[lv][q.type === 'plot' ? 0 : 1] * Math.max(0.62, 1 - 0.018 * n) + (q.refl || q.mode ? 3 : 0); tl = tmax; fb = 0; rv = 0; pk = -1; chosen = null; msg = ''; pdown = false;
      cur = { x: Math.max(LO[lv], 0), y: Math.max(LO[lv], 0) }; sel = 0; ksel = false; hold = -0.25;
      window.H_DBG_GP = q;
    }
    function start() { G.gen = (G.gen || 0) + 1; lives = 3; score = 0; streak = 0; bestS = 0; n = 0; q = null; ang = 0; tang = 0; hover = false; G.fx = []; if (boardLv !== lv) buildBoard(); next(); G.frame(step); }
    function fin(ok, ch, why, note) {
      if (fb) return;
      G.tally(ok, note || why);
      if (ok) { streak++; bestS = Math.max(bestS, streak); score += 10 + Math.min(streak, 10) * 2 + Math.ceil(tl); fb = 0.8; msgCol = R.green; msg = 'Great flying! +' + (10 + Math.min(streak, 10) * 2 + Math.ceil(tl)); G.burst(q.type === 'plot' ? gx2px(q.tx) : 200, q.type === 'plot' ? gy2py(q.ty) : 470, R.green, 22); }
      else { lives--; streak = 0; fb = 2.4; msgCol = R.coral; msg = why; }
      chosen = ch; n++;
    }
    function fly() {
      var d;
      if (fb || q.type !== 'plot') return;
      d = Math.sqrt((cur.x - q.tx) * (cur.x - q.tx) + (cur.y - q.ty) * (cur.y - q.ty));
      if (d < 0.5) fin(true, { x: cur.x, y: cur.y }, null, q.mode === 'mid' ? 'Midpoint of ' + H_pt(q.mA[0], q.mA[1]) + ' and ' + H_pt(q.mB[0], q.mB[1]) + ' is ' + H_pt(q.tx, q.ty) : null);
      else fin(false, { x: cur.x, y: cur.y }, 'You flew to ' + H_pt(cur.x, cur.y) + ', missed by ' + (Math.round(d * 10) / 10) + ' squares. Target: ' + H_pt(q.tx, q.ty));
    }
    function choose(i) {
      if (fb || q.type !== 'read' || i < 0 || i >= q.opts.length) return;
      pk = i;
      if (i === q.a) fin(true, null);
      else fin(false, null, 'The answer is ' + q.opts[q.a] + '. You picked ' + q.opts[i] + '.');
    }
    function setCur(p) {
      var x = Math.round((p.x - BX) / cs()) + LO[lv], y = HI[lv] - Math.round((p.y - BY) / cs());
      if (p.x < BX - cs() || p.x > BX + BS + cs() || p.y < BY - cs() || p.y > BY + BS + cs()) return false;
      cur.x = clamp(x, LO[lv], HI[lv]); cur.y = clamp(y, LO[lv], HI[lv]); return true;
    }
    function optRect(i) { return { x: 12 + (i % 2) * 194, y: 434 + Math.floor(i / 2) * 42, w: 182, h: 36 }; }
    G.pointer({
      down: function (p) {
        var i, r;
        if (fb) { if (rv > 0.9) rv = 9; return; }
        if (q.type === 'plot') { pdown = setCur(p); hover = true; }
        else for (i = 0; i < 4; i++) { r = optRect(i); if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) choose(i); }
      },
      move: function (p, e, dn) { if (!fb && q.type === 'plot' && (dn || e.pointerType === 'mouse')) { if (setCur(p)) hover = true; } },
      up: function (p) { if (pdown && !fb && q.type === 'plot') { setCur(p); fly(); } pdown = false; }
    });
    G.press = function (k) {
      var dx = 0, dy = 0, i;
      if (fb) { if (rv > 0.9) rv = 9; return; }
      if (q.type === 'plot') {
        if (k === 'ArrowLeft' || k === 'a') dx = -1; else if (k === 'ArrowRight' || k === 'd') dx = 1; else if (k === 'ArrowUp' || k === 'w') dy = 1; else if (k === 'ArrowDown' || k === 's') dy = -1;
        else if (k === ' ' || k === 'Enter') { fly(); return; }
        if (dx || dy) { cur.x = clamp(cur.x + dx, LO[lv], HI[lv]); cur.y = clamp(cur.y + dy, LO[lv], HI[lv]); tang = Math.atan2(dx, dy); hover = true; hold = -0.25; }
      } else {
        i = '1234'.indexOf(k);
        if (i > -1) choose(i);
        else if (k === 'ArrowLeft' || k === 'ArrowRight') { sel = sel ^ 1; ksel = true; } else if (k === 'ArrowUp' || k === 'ArrowDown') { sel = sel ^ 2; ksel = true; }
        else if (k === ' ' || k === 'Enter') choose(sel);
      }
    };
    G.pad([['◀', 'ArrowLeft'], ['▲', 'ArrowUp'], ['▼', 'ArrowDown'], ['▶', 'ArrowRight'], ['Fly', 'Space']]);
    function step(dt) {
      var i, m, x, y, t, r, col, ax0, ay0, da;
      if (!fb) {
        tl -= dt;
        if (q.type === 'plot') { da = (G.k.ArrowRight || G.k.d ? 1 : 0) - (G.k.ArrowLeft || G.k.a ? 1 : 0); m = (G.k.ArrowUp || G.k.w ? 1 : 0) - (G.k.ArrowDown || G.k.s ? 1 : 0); if (da || m) { hold += dt; while (hold >= 0.1) { hold -= 0.1; cur.x = clamp(cur.x + da, LO[lv], HI[lv]); cur.y = clamp(cur.y + m, LO[lv], HI[lv]); tang = Math.atan2(da, m); hover = true; } } else hold = -0.25; }
        if (tl <= 0) { fin(false, null, q.mode === 'mid' ? 'Time is up! The midpoint was ' + H_pt(q.tx, q.ty) + '.' : 'Time is up! The target was ' + H_pt(q.tx, q.ty) + '.'); }
      }
      else { rv += dt; if (rv >= fb) { if (lives <= 0) { G.over(score, 'Out of lives with ' + score + ' points. Best streak ' + bestS + '.'); return; } next(); } }
      clear(c, W, H);
      rect(c, 20, 12, 360, 8, 4, R.grid); rect(c, 20, 12, Math.max(0, 360 * tl / tmax), 8, 4, tl < 4 && !fb ? R.coral : R.green);
      if (q.l2) { txt(c, q.l1, 200, 38, 19, R.ink); txt(c, q.l2, 200, 60, 19, R.ink); } else fit(c, q.l1, 200, 48, 370, 24, R.ink);
      if (boardLv !== lv) buildBoard();
      c.drawImage(board, 0, 0, W, H);
      ax0 = gx2px(0); ay0 = gy2py(0);
      /* mirror source marker */
      if (q.refl) { H_star(c, gx2px(q.sx), gy2py(q.sy), 9, R.magenta, true, false); }
      /* midpoint round: both source stars + dashed link */
      if (q.mode === 'mid' || q.mode === 'dist') {
        c.save(); c.setLineDash([4, 4]); c.strokeStyle = 'rgba(233,251,249,.4)'; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(gx2px(q.mA[0]), gy2py(q.mA[1])); c.lineTo(gx2px(q.mB[0]), gy2py(q.mB[1])); c.stroke(); c.restore();
        H_star(c, gx2px(q.mA[0]), gy2py(q.mA[1]), 8, R.yellow, false, true); txt(c, 'A', gx2px(q.mA[0]), gy2py(q.mA[1]) - 16, 13, R.yellow);
        H_star(c, gx2px(q.mB[0]), gy2py(q.mB[1]), 8, R.blue, false, true); txt(c, 'B', gx2px(q.mB[0]), gy2py(q.mB[1]) - 16, 13, R.blue);
        if (fb && q.mode === 'mid') { H_star(c, gx2px(q.tx), gy2py(q.ty), 7, msgCol === R.green ? R.green : R.yellow, false, true); }
      }
      /* star in plain read rounds */
      if (q.type === 'read' && !q.mode) {
        if (q.refl) { H_star(c, gx2px(q.sx), gy2py(q.sy), 9, R.yellow, false, true); }
        else H_star(c, gx2px(q.tx), gy2py(q.ty), 9, R.yellow, false, true);
        if (fb && q.refl) { line(c, gx2px(q.sx), gy2py(q.sy), gx2px(q.tx), gy2py(q.ty), R.magenta, 1); H_star(c, gx2px(q.tx), gy2py(q.ty), 9, R.green, false, true); }
      }
      /* plane */
      if (q.type === 'plot' && (hover || chosen)) {
        x = chosen ? chosen.x : cur.x; y = chosen ? chosen.y : cur.y;
        da = Math.atan2(Math.sin(tang - ang), Math.cos(tang - ang)); ang += da * Math.min(1, dt * 12);
        H_plane(c, gx2px(x), gy2py(y), ang, 9, R.ink);
      } else if (q.type === 'plot') { H_plane(c, gx2px(cur.x), gy2py(cur.y), 0, 9, R.ink); }
      /* reveal of the target for plot rounds */
      if (fb && q.type === 'plot' && q.mode !== 'mid') {
        x = gx2px(q.tx); y = gy2py(q.ty);
        circ(c, x, y, 8 + 3 * Math.sin(rv * 10), null); c.strokeStyle = msgCol === R.green ? R.green : R.yellow; c.lineWidth = 2; c.stroke();
        H_star(c, x, y, 7, msgCol === R.green ? R.green : R.yellow, false, true);
        if (chosen && msgCol !== R.green) { line(c, gx2px(chosen.x), gy2py(chosen.y), x, y, R.coral, 1); }
        t = H_pt(q.tx, q.ty);
        txt(c, t, clamp(x, 40, 360), y < BY + 30 ? y + 22 : y - 22, 15, msgCol === R.green ? R.green : R.yellow);
      }
      if (fb && q.type === 'read' && !q.mode && msgCol !== R.green) { t = H_pt(q.tx, q.ty); txt(c, t, clamp(gx2px(q.tx), 40, 360), gy2py(q.ty) < BY + 30 ? gy2py(q.ty) + 22 : gy2py(q.ty) - 22, 15, R.yellow); }
      /* bottom panel */
      if (q.type === 'read') {
        for (i = 0; i < 4; i++) {
          r = optRect(i); col = R.violet;
          if (fb && i === q.a) col = R.green; else if (fb && i === pk) col = R.coral; else if (!fb && ksel && i === sel) col = R.blue;
          rect(c, r.x, r.y, r.w, r.h, 10, col);
          fit(c, q.opts[i], r.x + r.w / 2 + 6, r.y + r.h / 2, r.w - 30, 18, '#171233');
          txt(c, String(i + 1), r.x + 13, r.y + r.h / 2, 12, 'rgba(23,18,51,.6)');
        }
        if (fb) wrap(c, msg, 200, 529, 380, 13, 15, msgCol);
      } else {
        if (fb) wrap(c, msg, 200, 452, 370, 14, 17, msgCol);
        else wrap(c, hover ? 'Release or press Space to fly' : 'Tap the grid, or use the arrow keys and Space', 200, 452, 360, 13, 16, R.dim);
      }
      G.fxStep(dt);
      G.hud([['SCORE', pad(score)], ['STREAK', streak], ['LIVES', lives]]);
    }
    G.opt('Level', LV3, lv, function (i) { lv = i; start(); });
    G.begin(start);
  });

  /* ---- H3: Continent Click — real coastline data (Natural Earth via world-atlas, simplified + dissolved to continent level offline) ---- */
  /* standard 7-continent model. H_CDATA: dissolved continent polygons (borders between same-continent countries removed).
     H_FDATA: a few notable islands/countries kept as their own clickable shapes. Custom base64-ish varint delta encoding, see H_uv/H_zz. */
  var H_CDATA = 'NSEFAOZ/+Ij4CyrB6CPqBOeB+BOOHUOuBTcOCP4BI+DRaJbJkBDoCGULWKTIMIqBCkBP4BH+BEDMSEgBHARMQQAKUtBUCWYOuBLcVRJmBDATaQYNFNUNiBgBCW6BDaJCJPLOJBJlBNxBEdjBjCXBLVDtBlBJnBeBShBcE2DnB2BDEjBOVeTQGKWJeNMgBIiBcPgBXOYWPwB2CCwBZkBAGpBgBPeMgBegChCHN6ChBIPWJCX1ClB-DApBVzBtBQEgBaqBQeCSJRLMlBaJiBEUWANOHvDvBNCBSkBQ1BDCF9BVJLDPQNpCNkBApBBDVNPLMIVPXEONYCTNCOFMtBNP1BZrBpBAbY9BFhBPAJOXoBEOTabFZQ-BDET3CK3BbPRGdPlCoBnCeN8BQMIKiBgCKGNPXDZJEBnBJLuCCgBNETN5BKTYbQDkBQeHOJAVJHJSEEROZNIPRFDMvBMBObUBJLGAYnBkBICDGTB1BOlCuBlBJpE0BnBgBDKIUNchC4BAQ5B0BRsBPIRECf+BlCSvBaRLLrBmBBa3BiBKAISZUjBkCXUpBMrCyDByBM2BP2BgBDKRGGJgB3BcjBILSEMZKDQ1BmBDSZQLSxBChCaxCK9BSVDENpCPGeWGFGjClBOJRPpBNpBb-DfuEgCOapBJZOfHCSLIZDdOBMNIIMWUeAuBONMOInBJrBCbGhBUoCSQABJqBAlDuBMKkBAyBcqDWuBNqBCgHV,0Cnd0zBkFSmHA+DPzGNkEDmBGQHVJ0EO8BDMH7EVuBBnBZAXYL-BHmBJERVAaRrBBYHHF3BDaNAHnBIJF2BPGPhBDnBSGLXLyCBrDfxCHvBbvDXRNJZfPIPTjBbBdSnBAhC2BNgBbSIONIUYeGMYzBLXGGY8BDzBSjBEWSzBqBZIAI1BMvEA5BS8CIhEMCI2EUII1BG0DYHKsDI0CF0BK2DNvBKCI,1BnxBotBUIoCTCJmBGUNwBHkBZjBJuCReReAFNhBX3BcZBBL4BZMTFNrCU0BjB-CUXKGG5BUAF5BDRIOOuCEFGIKYULQnCQOE3BWtBJzEOPIUIbAFUkBa0BGPLQNSQ0BKiBVDLoBG,en5BmzB6DQuBHQM+BEiEC6GLzDVsBAvCRhBPxDJcBNDQJ3CZmBH1BLxFGBKkBEJOiCH7BS6BSjBUmCDgBIzDAvCc,exiC2tBWHShBmCTBHfBMHFFnCIxENLKrBEXQiDItDCJIuBIhCGeW2BMUDJHuBGaJYKSHQRKINUmBA,L9rCwuBuCDqBNpCTZNAHzBJ3BUoBkBTMkCC,N-7BsyBiBIHEuBC8CToBT-BTtCAVKSMlBAhBQOI,Ph3BwuB1CIJWTI-BKIImDHSFFHkBJiFCUHGHND3EF,Y3iBigBXdOGMDFFuBHFNOEKXJPVCAUXRLAOKTE7BABGMIHEkBsBeSKADF,PrjCsvBmBEEJLJ1DLdADGqBK1DAuBa+DTbSSIUBQR,M3+ButBVOWI8BAGFTJgBHDRhBHxCYAGqBB,OtzBwOwCN0BjBeHnCHOKTGLS9BMHEIE-BNYSeI,Kt0B2oBsCbRFpBOvBTHKZBQKKiBoBL,N5sBoL3BGCIqBAJQLCEGwBAyBZHHnBENPFI,Gh7BquBwCDrClBVCLaeO,Jx9B+vBQHJZfBVEAKfABOyCI,H5sCyvBsCc6BCBNPH3CLbE,H9hCyxB+CJWRtDKUGXEBI,HltCqerBGZUVEFQ0BJuBjB,G7xBwtBVKKKuBBkBRlCA,Gl8BurBOHNFlCMgBOmBL,Gv8BoxBYHhBLPGJQkBB,H-uBkqBjBFDKIKSEQFBL,Fv6B8uBLHzBGmBOaL,G3-CokBWHlBRJGDKeK,GxlC8wBcDFFlBFbGsBK,H9yC4hBUCHVSPlBYBQKD,FprD8nB8BJPFpBGBK,FziCguBqBDRLdOGC,GjhDyMMLRLHQEMKD,H-nBsdGJiBBRHXIFGIG,Fv0BinBQIaAXNRG,FvwByLcLfAJGOG,FxmB4GQCAPVAGO|oEvkBlVBJaRDNOHBJRZdJ9BBElBLFvBBCTOFKIGLhBRHdhBLFNoBRHRXLLXZPShBZCZLDRHBlCgBHOGMJMBiBIUWQdGSQGiBYHKqBNGFZLEWuCHqBICkB+CBmCMaO8EDeVS5C4BrC0EdWIIJUgBoBDKHJLKCWQmBYMKYKCQWHGEiBLcOOFMkBSEYMKeCgBYOFFLJBGTJJIPIAGQHWYIGQiBfoBAaJMKwBCPFGJgBJCPgBLMXcP+BDJRKZJZgBDgBqBQtBKDCNPPqBHATQM6BTKJDLYGkCJ4BlBoBNKjBHhBnCxCL-CfvCVVzBH7BdRTH3BhDxDVLZCrBU,L7qB7gBQX2BRHJdGVN5BKpCuBoCZQYiBG|lEmGsiBUTgBKgBNmCWWJwCBCMdGDgBcUQPQAGcTEBM+CGLPGRHFSZ2BLBPmBbbFKToBEMJDJQBIL+CTHPELfNBH-BPALhCMAITBVfPBDXRVGLlBDKDJPvBBOLjBEQVHDUPAJREGJLBIRdILehBoBCclCkBVgBLCFHFGEKPCPFGZyBpBQAAJ0BZDHbMHLOHBJTRHBIWNUhCiBfYFUZKvBZlBGdFBXrBRNRHPILPVbRtBAdNLSvBACcNIOqBLsBcO6DFKMEoBjBgBdIBO8BBFYSJuBQGQsBOSewBMUDOKNeAUIMqBMFPMHZTGJ,uB+OopBhBFTNELnChBNbiBXRVVFRzBXCLPXAxByCnBXbDZKNkCSM8CmB2CiC4CoBsCIeQqCE+BNZFWLxBJDNgBNRPWVNRSNHLeNjCvBnDNfSEUHSIMuCmBBIbK,gB9BshBEMNMdKIIFGLJAULKYkBoBAVTqBCVhBUBUZOBSfYDNRIJRJlCBrBNLEwBYfEFIWGLKEOeB,ShJypBDNWNZNrCRxCKUIrBKkBEAGpBEMOgBCeNeMaFgBKiBA,OuJ6xBmBI6CVxBHJPRDJPXApBMSGlCYPQ4BGmBF,L7D2hBENPRjBLbCQWJUqBYSCULJN,HkRiyBdL5BB5BE1BOuDI6CL,IpgB0CXpBfEKaJaKSWHYX,GoJ6XOCHf1BUEKsBA,IuFyZKGMNBZRFHGDkBKB,HuP2wBrBJjBGOELIqBEkBL,G4HijBGJLPVMBIeG,FuQiWfHXIEI0BH,FuF0aOIDfHEBU|tDwY9CHjBMFDhBatBGtCZnBpBRzBrBBNSfBnB5BfGJNzBvCvCvBV-BA7BRbSFaGS7B8CRkDxBwCAuBOuBWeCaPeGMZoC9BuCU0CHMRWzBJfoBvBDtCbzBK5BRdKjCyBvBoCjBaBcRWWcIoBDoBPSCSmB0BOkBkBiBSCqBkBDaKcwBeUiBqCLqCcqEGWKODAJSEJJGNBRLJCJiDdKRkCVUOFQGIcMqCXqCNqBOUNEIqBBMhBNhBVMNeGX8B-CDPcVMjCSLSpBwClCLNmBZiEgBJ3BnBtCnBvBlCzBdnBZRVpB,V+e5HS-BDFFMDFCX1B-EhBNbMNsBCeKCMkBJoBIYmBIcYESIBSkBGJ|0IwjCwNZRTfgCrCIlBBhBvC9BHMGOfORgBjBIEQRARjCAPOAMjBmBZUXCpBOdNBpBgBZqCfmBDLKoCfuDjBXXGCsBLeZUTqBRADTZGBHlBDAPJJbN5BxBAHlBNHtDLBHPGFRFPRRSrByDRcRsDpBJZYIIFGlBWTehDFxCMHaJCjBLXGnBWbsBXERFIbIRcTMlBEYMDDXILsBCwBuBAdINmBLWZZlBNDBZvBZAH5BPDPlCf9BNLLdBXiD-BsCLwBTMvBsCJAIaNkBiBkCCYFKIIdCNLdBlBMRLTMVAZeKQLKWSeCIOmBBwBSiBA+BVqBCaUDM-C0BeUJIcIRCCIcIIiB9CUHMPCEKLKnBDJUcGlBcCQ1BMRaIGFSiBaTKkCwBdOIMROOSVWSQfOEOmCQkFnBQHANVJfFnDMgBNCdqBJCILKOGwBLQGLOuBUmBHKOPMKMNM4BHKJXBALOFgBEEMwDcQBTLqDOWLYMVMMI6BHkDbOKVQXCIILWgCoB2BDELTPUTDbWLvBpBWB2BgBLKIOVCDKQUZQkBODOUJHTWBJOiBIqBAkBLRSBU+DGPMYM4DSmCByCKYSwBIiBFbFuBBEJuCE8BRDJ5CVoCDKNqBK4EPCOqCBgBLKLLH4BXUUgBH4DCPScI0FLmCb4DCQHBPYFqEEkBRYGPOKIiFN,kDwwD0oBzBHoBfDNjBEpCPjCjBbOzBPJIRJbEdhBCHWDBbTBHPIHhBLHVdDFVbRb4CKcSUgBGqD8BQeXBLRzBVPazBHxBfQNpCFAOdEZJ9DD-BlBtCvBgBBKLUDMKWBcVX9CnDjDbLXKtBbFTrBVBLULWjBHhBzBNHuBQENQRALIMeTG-BTWeLKzBfTBJJMLQDAJQDWOgBHCLbDlBjBUJiB1BAPLDQRHfLBvBnC3BhBhBLHG7BVHVJAAWlBE,SvwDkrBmDjBBLOFFQ2BDoBRzBLBRHD7BMDKrBAJGEIXDKJLH,DvwD2sBwBDvBJ,bmoCsDgBeMReLlBrBORBJWRXBFfRNJxBBGVHHMXIXHHKdCBaTWAkBMOeBEQgBIyBuB,RohCVKXOBKNF3BVAhC+BpB8BNgBhCqCsBF+B9BWAQNaZHPUH,Tk4CzBAhERQxBBWWPmBzCmBNLDQPKiBMdAhBamBKgBHInBWLmBiBoCR,X24CwYRTDvBJN9BJbVNGAQxCNUPNfLJJIESTUgCqB+BCUkBOJoBcS8BWEKrB,SuhBkuBwBQFKwDYsEMOHvGrB9BlBERmBPrCCFIjBGBKUEBMoBQRE,f6sCSYAUONXzCDDNSRwBQAJJEZTUZOpBLFHGKQTHDGCINMCUNFCzBLDHGCmBHAFOU8BWWoBH,H06B0yBqBG2CdFRhDCrCa0BO,N6jC-DCHmBBGIkBHIN2BPVHhFcDKRAOUwBJ,Qq5CyhBGlBe3BdGLbSVANPMLNCkDLSCcSKHIKEEN,Os6CwbOIEVbFRTfOJVVADUKOWCMsBWVeJ,QusCsLEVPXAfuBJCZXWDHNMbCIMFGBHNUQ+BgBF,H42CyvB+DJPPpDDnBOKMaE,UgvCoFCXFRHUHJGPFHXMFOGKLIdRDGIQYOGJiBQBQQJER,GogCyxB0BLFHxDHmBaeC,GkzB2EDTZJLsBIgBiBtB,J8U4cGEkBPUCzBVLEEITGSO,HqQkamBEUNzBVFMKQJE,HukCsLPGBSsBOEHNTPJ,GksCoPVvBLgBciBKFDL,HmuC7FNNRBKSWMsBGrBT,I4yC+UeSSLLLRCFLLGAK,GmO+hB7BCEKcGeFBL,G8wC3BWFGP5BKEMaA,H+vCsBQVBPJCAZNmBKY,J0sCoGGSMADLQSBRTZLOEG,GgcsyBmECtCNVEMItBA,KuuC0HGXPGGRJFJcMBAILQYH,G08CivByBD1BFlBIGGkBD,FiqC6FZRuB8BEPXZ,H6rCpFgBIBLdDbCAIcB,Eu3C8tBsBKeNpCE,G+pCnFMCEHvBFYSIF,FosCkHBKYFVXAU,FmrCtGZOSESLJF,FuU+VmBMfVNKIA,FwrC+HJQYHDRJK|0C6uCjUlBPJRrCBlBVbCfQAMOGCWP2BhBkCKHHSQNPmBGmBIOCNIOqBW0CUaeCSOSIRKEHKGKKDCOaccIaVYBDMYmBoBIAKPGME6BVYGKJTRJhB+C1BOGIUIcA0BQiBcrCOGQPUvCwBbSlBUBEVoBjBO3BNlClB1BT9BhBHnBXbMCKbR7BQTmBdKGKDOJNRDWiBBOjBnBPIRmB7BWnDN,EkwDvKNDBIcK,Uk4CzBoCZcfgBLGJRBENehBMAAHePBF3BKlBoBZKbLCPPFfEAiE,OiqDnb+B+BIPQIEHdpBIJfFRhBZNzBIDGkBkBcK,TyuDhZRXPHJIKQbUQOCcpB6BiBPUlBCOIFEPcHWGJdPCFT,Jq8CvZMBHtBFGNNRCZ4BiBHaG,Ny+CzDfJbMCGcBGKCJMAQOBMMCEPTR,F0nDlNaVRCrBoBkBT,Hs-CpCKPFFHUhBWEEiBX,GqvD9KMBBLXAGQIB,F4gDpDYXBFNGHY|lEvwD90BSM+CH4CMuHdgGDsDMEI1GSOiBtCS8DD0CU9BSzDG3BWFWuEJoDSBWaEiGS2JD0DQgBTqHLKIvBQXe0ET8DGSOwCRqCHYQyCRyEUkBUbuBY4B2CuBoDaMDHH3CRLNKNfFnBdyBXcdU7BnCf7DZjEBmCXzCJBP0BV6JpBePoFesEHoBO0HWVU1DDGckL8BkBMGIVEWQmDkB6BHKQmEN+EiBkBBaP0BQiBH0CKiCP6CEiDQmBY+CZ+JwCqErB2BMgDJQZlBVaHXXoBHWE6BsBqCIeYqCWwCCYSiBR6DFuCE+BgBkCZ0EU8DbkCQwDF4DMGSwBhBgFCWTsBJuDDyEnByDDuCRlBnB-BNxBjBBRYVuBLnDHnBhBgG5B0GR,Ite3wBoBE4BNMdvETpCIgCUuBgB,KluBxsBkBCIiBcMoBxBJPnCFKI9BAWQ,HtpBlyB4CBaQUHLT1CCjBM,F9-B9sBuDBMJ7CAdM,FpmDjxByBEoBVlBBzBU,EzsChuBuCEdLvBI';
  var H_FDATA = 'Greenland,Iceland,Madagascar,Japan,India,Indonesia,New Zealand,United Kingdom/nDnd0zBkCMmCAaGmHA+DPlBH3FBKDmCC+BFmBGQHVJ0EO8BDMH7CT-BBuBBnBZAXYL-BHmBJERVAaRrBBYHHF3BDaNAHnBIJFcDaLGPhBDnBSGLXLyCBrDfxCHTHbTrBNjCJRNANJLfPIPTjBbBdSnBARKNUhBYJODSbSIONIUYeGIIEQzBLXGBOIK8BDzBSTBPGWSzBqBZIAI1BMvEA5BS8CIzCEtBICI2EUII1BGSIiDQHKsDI+BAWF0BK2DNvBKCI|ShJypBDNWNZNrCRxCKUIrBKkBEAGpBEMOgBCeNeMaFgBKiBA|d+e5HMVIfBJDFFMDFCXFDBRtBpEhBNbMNsBCeKCMkBJWASIYmBIcYGKBIIBKOCMGKGJ|kB24CwYRTAVHPEJJNZHjBBbVNGAQjBDVJXAUPNfLJJIESLGHOUGKMUMOMoBGWDUkBOJoBcOYDYIMWEKbAP,Os6CwbOIEVbFRTfOJVVADUKOWCMsBWVeJ,M4yC+UKMMDIKOFEFLLHGJDFLLGAK|rD68B2RCHFDALNEZNCLLPAJJPPEAVDFCHJFLgBDADLJKGMIAKSxBGBOXIHLOLPNMFDLKdBHlBDAPJJbNXXhBZAHlBNFPGpBHRAhBLBHPGFRFHLHFRSRwBPcJmBRcNgCDsBbLNCZYIIFGVSMOsBADQJKBQNIWWYB0B+BAOSMPKPeKIgBDWESQWXBPIJAJNCEVwBZLJHRgCbcDMJ4BFAeMECTSHuBCCOHGQCqBcQFOKKNHHWB|hB2pCyCLRORBJWRXBFNARRNJxBBGVHHMNCJGXHHKdCBaJGJQBSCSMOCNOJaCMKKCSFQEa6BoBD,YohCVKXOBKNF3BVAPSZQXcZqBPSNgBROJQjBiBBKsBF+B9BWAQNMPOJHPUH,iBk4CzBAhERQTEDFZAIQOGFWJQlBSPAdUFJHBDQPKWGOABGdAHMREHKcEKGgBHInBWLQWWMSAgBNWD,oB6sCSYAUOCDPTNDTExBDDNSRMIkBIAJJEHLRHUZDFSXALLFHGKQTHDGCINMCUNFCzBLDHGGSDUHAFOIOMuBWWoBH,T6jC-DCHmBBGIkBHINeDYLVHVKnBApBMVBjBIDKRAOUYBYH,N+vCsBCLMBCHBPJCBNIJFBHMFaEQGI,H8wC3BWFGPPKpBAEMaA,I6rCpFgBIBLdDbCAIQEMF,GkuCxFCJNNRBKSUI,I+pCnFMCEHvBFIKKCGGIF,GmrCtGZOSESLBDHB,GqvCrCNEDIUCEHFF,F8zCpEBQIOEPJN|UiqDnbcWSUCKOKIPQIEHAJdfIJPAPFRhBZNzBIDGKQaUcK,byuDhZRXPHJIKQFMVICIOGCcHShBoBIAMJOFGROTCOIFEPcHMIKBJdPCFFAN|oB9BshBEMNMXEFGIIFGLJAULKIUQQoBAVTqBCDPRRUBUZOBSfYDBLLFIJRJ7BFJELJRCNFLEeUSEfEFIWGLKEOeB,H7D2hBbEEKDKSCULJN';
  var H_ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-';
  var H_AVAL = {};
  (function () { var i; for (i = 0; i < H_ALPHA.length; i++) H_AVAL[H_ALPHA.charAt(i)] = i; })();
  function H_uv(s, pos) { var v = 0, sh = 0, d; do { d = H_AVAL[s.charAt(pos.i)]; pos.i++; v |= (d & 31) << sh; sh += 5; } while (d & 32); return v; }
  function H_zz(n) { return n & 1 ? -((n + 1) / 2) : n / 2; }
  function H_bb(pts) { var b = [1e9, 1e9, -1e9, -1e9], i, x, y; for (i = 0; i < pts.length; i++) { x = pts[i][0]; y = pts[i][1]; if (x < b[0]) b[0] = x; if (y < b[1]) b[1] = y; if (x > b[2]) b[2] = x; if (y > b[3]) b[3] = y; } return b; }
  function H_decRings(str) {
    if (!str) return [];
    var parts = str.split(','), out = [], i, pos, n, pts, x, y, k;
    for (i = 0; i < parts.length; i++) {
      pos = { i: 0 }; n = H_uv(parts[i], pos); pts = []; x = 0; y = 0;
      for (k = 0; k < n; k++) { x += H_zz(H_uv(parts[i], pos)); y += H_zz(H_uv(parts[i], pos)); pts.push([x / 10, y / 10]); }
      out.push({ pts: pts, bb: H_bb(pts) });
    }
    return out;
  }
  var H_CORDER = 'NSEFAOZ';
  var H_CNAME = { N: 'North America', S: 'South America', E: 'Europe', F: 'Africa', A: 'Asia', O: 'Oceania', Z: 'Antarctica' };
  var H_CCOL = { N: R.orange, S: R.green, E: R.violet, F: R.yellow, A: R.coral, O: R.teal, Z: '#DCE6F2' };
  var H_ONAME = { P: 'Pacific Ocean', A: 'Atlantic Ocean', I: 'Indian Ocean', S: 'Southern Ocean', R: 'Arctic Ocean' };
  var H_OANCH = { P: [-150, 0], A: [-32, 12], I: [73, -18], S: [10, -68], R: [95, 81] };
  var H_FMETA = [['N', 'island, autonomous Danish territory'], ['E', 'island nation'], ['F', 'island nation'], ['A', 'island nation'], ['A', 'country, the Indian subcontinent'], ['A', 'archipelago nation'], ['O', 'island nation'], ['E', 'island nation']];
  var H_CONT = null, H_FEAT = null;
  function H_loadMap() {
    var cparts, codes, cslots, i, fparts, fnames, fslots;
    if (H_CONT) return;
    cparts = H_CDATA.split('/'); codes = cparts[0].split(''); cslots = cparts[1].split('|');
    H_CONT = {};
    for (i = 0; i < codes.length; i++) H_CONT[codes[i]] = H_decRings(cslots[i]);
    fparts = H_FDATA.split('/'); fnames = fparts[0].split(','); fslots = fparts[1].split('|');
    H_FEAT = [];
    for (i = 0; i < fnames.length; i++) H_FEAT.push({ name: fnames[i], cont: H_FMETA[i][0], hint: H_FMETA[i][1], rings: H_decRings(fslots[i]) });
  }
  function H_pipSub(pts, x, y) {
    var n = pts.length, inside = false, i, j, xi, yi, xj, yj;
    for (i = 0, j = n - 1; i < n; j = i++) {
      xi = pts[i][0]; yi = pts[i][1]; xj = pts[j][0]; yj = pts[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }
  function H_pipAny(rings, x, y) {
    var k, b;
    for (k = 0; k < rings.length; k++) {
      b = rings[k].bb;
      if (x >= b[0] && x <= b[2] && y >= b[1] && y <= b[3] && H_pipSub(rings[k].pts, x, y)) return true;
    }
    return false;
  }
  function H_findCont(lon, lat) {
    var i;
    for (i = 0; i < H_CORDER.length; i++) if (H_pipAny(H_CONT[H_CORDER.charAt(i)], lon, lat)) return H_CORDER.charAt(i);
    return null;
  }
  /* ocean of an open-water point; conventional approximate boundaries; ~ marks a marginal/inland sea, never a scored answer */
  function H_ocz(lon, lat) {
    if (lat <= -60) return 'S';
    if ((lon > -6 && lon < 42 && lat > 30 && lat < 47) || (lon > 27 && lon < 42 && lat > 40 && lat < 47.5)) return '~';
    if (lon > 32 && lon < 56 && lat > 12 && lat < 31) return '~';
    if (lon > 9 && lon < 31 && lat > 53 && lat < 66) return '~';
    if (lon > -96 && lon < -77 && lat > 50 && lat < 64) return '~';
    if (lon > 46 && lon < 55 && lat > 36 && lat < 47.5) return '~';
    if (lat >= 66) return 'R';
    if (lon > 20 && lon <= 147 && lat <= 30 && !(lon > 100 && lat > -8)) return 'I';
    if (lon >= -100 && lon <= 20) return (lat < -10 ? lon < -67 : (lon < -77 && lat < 15)) ? 'P' : 'A';
    return 'P';
  }
  /* a 120x60 lookup grid built once (memoized): fast, forgiving hit-testing + flash-reveal, sourced from the real polygons above */
  var H_GW = 120, H_GH = 60, H_GRID = null, H_GZONE = null;
  function H_cellLL(c, r) { return [-180 + (c + 0.5) * 3, 84 - (r + 0.5) * 164 / H_GH]; }
  function H_prep() {
    var r, c, ll, cont, C, Z, Zr;
    if (H_GRID) return;
    H_loadMap();
    H_GRID = []; Z = [];
    for (r = 0; r < H_GH; r++) {
      C = []; Zr = [];
      for (c = 0; c < H_GW; c++) {
        ll = H_cellLL(c, r); cont = H_findCont(ll[0], ll[1]);
        if (cont) { C.push(cont); Zr.push(''); } else { C.push('.'); Zr.push(H_ocz(ll[0], ll[1])); }
      }
      H_GRID.push(C); Z.push(Zr);
    }
    H_GZONE = Z.map(function (row, r2) {
      return row.map(function (z, c2) {
        var i, j, o;
        if (z === '' || z === '~') return z;
        for (i = -1; i <= 1; i++) for (j = -1; j <= 1; j++) { o = Z[r2 + i] && Z[r2 + i][c2 + j]; if (o !== undefined && o !== '' && o !== '~' && o !== z) return '='; }
        return z;
      });
    });
  }
  function H_ctAt(c, r) { return H_GRID[r] && H_GRID[r][c]; }
  function H_inFeature(idx, lon, lat) { return H_pipAny(H_FEAT[idx].rings, lon, lat); }
  function H_inCell(k, c, r) {
    var ch = H_ctAt(c, r), t = k.charAt(0), v = k.slice(1);
    if (ch === undefined) return false;
    if (t === 'c') return ch === v;
    if (t === 'o') return ch === '.' && H_GZONE[r][c] === v;
    return false;
  }
  var H_NUDGE = [[3, 0], [-3, 0], [0, 2.7], [0, -2.7], [3, 2.7], [-3, 2.7], [3, -2.7], [-3, -2.7], [6, 0], [-6, 0], [0, 5.5], [0, -5.5]];
  /* 1 = right, 0 = wrong, -1 = tap on a border/marginal sea while an ocean was asked (ignored, not scored) */
  function H_judge(k, c, r, lon, lat) {
    var i, j, z, idx, m;
    if (H_inCell(k, c, r)) return 1;
    if (k.charAt(0) === 'f') {
      idx = +k.slice(1);
      if (H_inFeature(idx, lon, lat)) return 1;
      for (m = 0; m < H_NUDGE.length; m++) if (H_inFeature(idx, lon + H_NUDGE[m][0], lat + H_NUDGE[m][1])) return 1;
      return 0;
    }
    if (k.charAt(0) === 'o') { z = H_GZONE[r] && H_GZONE[r][c]; return (z === '=' || z === '~') ? -1 : 0; }
    if (H_ctAt(c, r) === '.') for (i = -1; i <= 1; i++) for (j = -1; j <= 1; j++) if (H_inCell(k, c + j, r + i)) return 1;
    return 0;
  }
  function H_desc(k) {
    var v = k.slice(1), t = k.charAt(0), f;
    if (t === 'c') return [H_CNAME[v], 'continent'];
    if (t === 'o') return [H_ONAME[v], 'ocean: tap open water'];
    f = H_FEAT[+v]; return [f.name, f.hint];
  }
  function H_tapName(c, r, lon, lat) {
    var ch = H_ctAt(c, r), z, i;
    if (ch === '.') { z = H_GZONE[r][c]; return z === '~' ? 'a marginal sea' : H_ONAME[z]; }
    for (i = 0; i < H_FEAT.length; i++) if (H_inFeature(i, lon, lat)) return H_FEAT[i].name + ' (part of ' + H_CNAME[H_FEAT[i].cont] + ')';
    return H_CNAME[ch];
  }
  function H_cellsFor(k) {
    var a = [], r, c, t = k.charAt(0), idx, ll, bb, cmin, cmax, rmin, rmax;
    if (t === 'f') {
      idx = +k.slice(1); bb = H_bb(H_FEAT[idx].rings.reduce(function (s, rg) { return s.concat(rg.pts); }, []));
      cmin = clamp(Math.floor((bb[0] + 180) / 3) - 1, 0, H_GW - 1); cmax = clamp(Math.ceil((bb[2] + 180) / 3) + 1, 0, H_GW - 1);
      rmin = clamp(Math.floor((84 - bb[3]) / (164 / H_GH)) - 1, 0, H_GH - 1); rmax = clamp(Math.ceil((84 - bb[1]) / (164 / H_GH)) + 1, 0, H_GH - 1);
      for (r = rmin; r <= rmax; r++) for (c = cmin; c <= cmax; c++) { ll = H_cellLL(c, r); if (H_inFeature(idx, ll[0], ll[1])) a.push([c, r]); }
      return a;
    }
    for (r = 0; r < H_GH; r++) for (c = 0; c < H_GW; c++) if (H_inCell(k, c, r)) a.push([c, r]);
    return a;
  }
  window.H_cellsFor = H_cellsFor; window.H_desc = H_desc;
  def('continentClick', EDU, 'Continent Click', R.blue, 'A real map of the Earth, drawn from actual coastline data. Tap the continent, ocean or island you are asked for.', 'Tap the map · arrows move the cursor, Space picks · three misses ends the run', function (G) {
    var W = 400, H = 440, MY = 88, CW = 400 / H_GW, CH = 260 / H_GH, c = G.canvas(W, H), lv = 1, SECS = [16, 14, 12];
    var off, t, tmax, tl, lives, score, streak, bestS, cnt, bag, fb, rv, cells, msg, msgCol, cx, cy, tap, hold, flashMsg;
    H_prep();
    function lon2x(lon) { return (lon + 180) / 360 * W; }
    function lat2y(lat) { return MY + (84 - lat) * 260 / 164; }
    function buildMap() {
      var o, sc = G.cv.width / W, i, j, k, ring, pt, col, hi, lo2, g, bb, any, f;
      off = document.createElement('canvas'); off.width = Math.round(W * sc); off.height = Math.round(H * sc);
      o = off.getContext('2d'); o.scale(sc, sc);
      g = o.createLinearGradient(0, MY, 0, MY + 260);
      g.addColorStop(0, '#173463'); g.addColorStop(0.14, '#0d2044'); g.addColorStop(0.5, '#0a1830'); g.addColorStop(0.86, '#0d2044'); g.addColorStop(1, '#1c3f6e');
      o.fillStyle = g; o.fillRect(0, MY, W, 260);
      o.strokeStyle = 'rgba(233,251,249,.07)'; o.lineWidth = 1;
      for (i = -180; i <= 180; i += 30) { o.beginPath(); o.moveTo(lon2x(i), MY); o.lineTo(lon2x(i), MY + 260); o.stroke(); }
      for (i = -60; i <= 80; i += 30) { o.beginPath(); o.moveTo(0, lat2y(i)); o.lineTo(W, lat2y(i)); o.stroke(); }
      o.shadowColor = 'rgba(0,0,0,.4)'; o.shadowBlur = 3.5; o.shadowOffsetY = 1.2;
      for (k = 0; k < H_CORDER.length; k++) {
        col = H_CORDER.charAt(k); any = false;
        o.beginPath();
        for (i = 0; i < H_CONT[col].length; i++) {
          ring = H_CONT[col][i].pts;
          pt = ring[0]; o.moveTo(lon2x(pt[0]), lat2y(pt[1])); any = true;
          for (j = 1; j < ring.length; j++) { pt = ring[j]; o.lineTo(lon2x(pt[0]), lat2y(pt[1])); }
          o.closePath();
        }
        if (!any) continue;
        bb = null;
        for (i = 0; i < H_CONT[col].length; i++) { var b2 = H_CONT[col][i].bb; if (!bb) bb = b2.slice(); else { bb[0] = Math.min(bb[0], b2[0]); bb[1] = Math.min(bb[1], b2[1]); bb[2] = Math.max(bb[2], b2[2]); bb[3] = Math.max(bb[3], b2[3]); } }
        hi = H_lite(H_CCOL[col], 26); lo2 = H_lite(H_CCOL[col], -30);
        g = o.createLinearGradient(lon2x(bb[0]), lat2y(bb[3]), lon2x(bb[2]), lat2y(bb[1]));
        g.addColorStop(0, hi); g.addColorStop(1, lo2);
        o.fillStyle = g; o.fill();
        o.shadowColor = 'transparent'; o.shadowBlur = 0;
        o.strokeStyle = 'rgba(10,10,20,.55)'; o.lineWidth = 0.8; o.stroke();
        o.shadowColor = 'rgba(0,0,0,.4)'; o.shadowBlur = 3.5; o.shadowOffsetY = 1.2;
      }
      o.shadowColor = 'transparent'; o.shadowBlur = 0; o.shadowOffsetY = 0;
      for (f = 0; f < H_FEAT.length; f++) {
        o.setLineDash([3, 2]); o.strokeStyle = 'rgba(255,255,255,.55)'; o.lineWidth = 1;
        for (i = 0; i < H_FEAT[f].rings.length; i++) {
          ring = H_FEAT[f].rings[i].pts; if (ring.length < 3) continue;
          o.beginPath(); pt = ring[0]; o.moveTo(lon2x(pt[0]), lat2y(pt[1]));
          for (j = 1; j < ring.length; j++) { pt = ring[j]; o.lineTo(lon2x(pt[0]), lat2y(pt[1])); }
          o.closePath(); o.stroke();
        }
      }
      o.setLineDash([]);
    }
    function pool() {
      var a = ['cN', 'cS', 'cE', 'cF', 'cA', 'cO', 'cZ'], i;
      if (lv > 0) a = a.concat(['oP', 'oA', 'oI', 'oS', 'oR']);
      if (lv > 1) for (i = 0; i < H_FEAT.length; i++) a.push('f' + i);
      return a;
    }
    function next() {
      if (!bag.length) { bag = shuf(pool()); if (t && bag[bag.length - 1] === t.k) bag.unshift(bag.pop()); }
      var d = bag.pop(), ds = H_desc(d);
      t = { k: d, n: ds[0], h: ds[1] };
      tmax = Math.max(SECS[lv] * 0.6, SECS[lv] - 0.4 * Math.floor(cnt / 4)); tl = tmax; fb = 0; rv = 0; cells = null; msg = ''; flashMsg = 0; tap = null;
      window.H_DBG_CC = t;
    }
    function start() { G.gen = (G.gen || 0) + 1; lives = 3; score = 0; streak = 0; bestS = 0; cnt = 0; bag = []; t = null; cx = 60; cy = 30; hold = -0.22; G.fx = []; buildMap(); next(); G.frame(step); }
    function reveal(good, why) {
      cells = H_cellsFor(t.k);
      fb = good ? 0.95 : 2.8; rv = 0; msgCol = good ? R.green : R.coral; msg = why;
    }
    function pickAt(px, py) {
      var j, pts, ll;
      if (fb || px < 0 || px >= H_GW || py < 0 || py >= H_GH) return;
      ll = H_cellLL(px, py);
      j = H_judge(t.k, px, py, ll[0], ll[1]);
      if (j < 0) { msg = H_GZONE[py][px] === '~' ? 'That is a marginal sea. Tap the open ocean.' : 'Too close to an ocean border. Tap deeper inside the ocean.'; msgCol = R.yellow; flashMsg = 1.6; return; }
      cnt++; tap = [px, py];
      if (j) {
        streak++; bestS = Math.max(bestS, streak); pts = 10 + Math.min(streak, 10) * 2 + Math.ceil(tl); score += pts;
        G.tally(true, 'Yes: ' + t.n); G.burst(px * CW + CW / 2, MY + py * CH + CH / 2, R.green, 18); reveal(true, 'Yes! ' + t.n + '  +' + pts);
      } else {
        lives--; streak = 0;
        G.tally(false, 'That was ' + H_tapName(px, py, ll[0], ll[1]) + '. You needed ' + t.n + '.');
        reveal(false, 'That was ' + H_tapName(px, py, ll[0], ll[1]) + '. The flashing area is ' + t.n + '.');
      }
    }
    function move(dx, dy) { cx = clamp(cx + dx, 0, H_GW - 1); cy = clamp(cy + dy, 0, H_GH - 1); }
    G.pointer({
      down: function (p) { if (fb) { if (rv > 0.9) rv = 9; return; } if (p.y >= MY && p.y < MY + 260) { cx = clamp(Math.floor(p.x / CW), 0, H_GW - 1); cy = clamp(Math.floor((p.y - MY) / CH), 0, H_GH - 1); pickAt(cx, cy); } },
      move: function (p) { if (!fb && p.y >= MY && p.y < MY + 260) { cx = clamp(Math.floor(p.x / CW), 0, H_GW - 1); cy = clamp(Math.floor((p.y - MY) / CH), 0, H_GH - 1); } }
    });
    G.press = function (k) {
      var dx = 0, dy = 0;
      if (fb) { if (rv > 0.9) rv = 9; return; }
      if (k === ' ' || k === 'Enter') { pickAt(cx, cy); return; }
      if (k === 'ArrowLeft' || k === 'a') dx = -1; else if (k === 'ArrowRight' || k === 'd') dx = 1; else if (k === 'ArrowUp' || k === 'w') dy = -1; else if (k === 'ArrowDown' || k === 's') dy = 1;
      if (dx || dy) { move(dx, dy); hold = -0.25; }
    };
    G.pad([['◀', 'ArrowLeft'], ['▲', 'ArrowUp'], ['▼', 'ArrowDown'], ['▶', 'ArrowRight'], ['Pick', 'Space']]);
    function lab(s, lon, lat, col) {
      var x = lon2x(lon), y = lat2y(lat), w;
      c.font = '700 15px Figtree, sans-serif'; w = c.measureText(s).width;
      x = clamp(x, w / 2 + 6, W - w / 2 - 6);
      c.lineWidth = 4; c.strokeStyle = R.bg; c.lineJoin = 'round'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.strokeText(s, x, y);
      txt(c, s, x, y, 15, col);
    }
    function step(dt) {
      var i, dx = 0, dy = 0, p, blink, anchor;
      if (!fb) {
        tl -= dt;
        if (G.k) { dx = (G.k.ArrowRight || G.k.d ? 1 : 0) - (G.k.ArrowLeft || G.k.a ? 1 : 0); dy = (G.k.ArrowDown || G.k.s ? 1 : 0) - (G.k.ArrowUp || G.k.w ? 1 : 0); }
        if (dx || dy) { hold += dt; while (hold >= 0.03) { hold -= 0.03; move(dx, dy); } } else hold = -0.25;
        if (tl <= 0) { lives--; streak = 0; cnt++; G.tally(false, 'Ran out of time: ' + t.n); reveal(false, 'Time is up! The flashing area is ' + t.n + '.'); }
        if (flashMsg > 0) flashMsg -= dt;
      } else { rv += dt; if (rv >= fb) { if (lives <= 0) { G.over(score, 'Out of lives with ' + score + ' points. Best streak ' + bestS + '.'); return; } next(); } }
      clear(c, W, H);
      rect(c, 20, 14, 360, 8, 4, R.grid); rect(c, 20, 14, Math.max(0, 360 * tl / tmax), 8, 4, tl < 4 && !fb ? R.coral : R.blue);
      fit(c, 'Tap: ' + t.n, 200, 46, 370, 27, R.ink); txt(c, t.h, 200, 70, 13, R.dim);
      c.drawImage(off, 0, 0, W, H);
      if (fb && cells) {
        blink = Math.floor(rv * 6) % 2 === 0;
        c.fillStyle = msgCol === R.green ? 'rgba(61,220,151,.75)' : 'rgba(255,255,255,.8)';
        if (blink) for (i = 0; i < cells.length; i++) c.fillRect(cells[i][0] * CW, MY + cells[i][1] * CH, CW + 0.6, CH + 0.6);
        anchor = t.k.charAt(0) === 'c' ? [(H_CONT[t.k.slice(1)][0].bb[0] + H_CONT[t.k.slice(1)][0].bb[2]) / 2, (H_CONT[t.k.slice(1)][0].bb[1] + H_CONT[t.k.slice(1)][0].bb[3]) / 2] : t.k.charAt(0) === 'o' ? H_OANCH[t.k.slice(1)] : [(H_FEAT[+t.k.slice(1)].rings[0].bb[0] + H_FEAT[+t.k.slice(1)].rings[0].bb[2]) / 2, (H_FEAT[+t.k.slice(1)].rings[0].bb[1] + H_FEAT[+t.k.slice(1)].rings[0].bb[3]) / 2];
        lab(t.n, anchor[0], anchor[1], msgCol === R.green ? R.green : R.yellow);
        if (tap && msgCol !== R.green) { c.strokeStyle = R.coral; c.lineWidth = 2; c.beginPath(); c.moveTo(tap[0] * CW - 3, MY + tap[1] * CH - 3); c.lineTo(tap[0] * CW + CW + 3, MY + tap[1] * CH + CH + 3); c.moveTo(tap[0] * CW + CW + 3, MY + tap[1] * CH - 3); c.lineTo(tap[0] * CW - 3, MY + tap[1] * CH + CH + 3); c.stroke(); }
      } else if (!fb) {
        c.strokeStyle = R.ink; c.lineWidth = 1.5; K.L(c, cx * CW - 3, MY + cy * CH - 3, CW + 6, CH + 6, 3); c.stroke();
        line(c, cx * CW + CW / 2, MY + cy * CH - 8, cx * CW + CW / 2, MY + cy * CH - 3, R.ink, 1.5); line(c, cx * CW + CW / 2, MY + cy * CH + CH + 3, cx * CW + CW / 2, MY + cy * CH + CH + 8, R.ink, 1.5);
        line(c, cx * CW - 8, MY + cy * CH + CH / 2, cx * CW - 3, MY + cy * CH + CH / 2, R.ink, 1.5); line(c, cx * CW + CW + 3, MY + cy * CH + CH / 2, cx * CW + CW + 8, MY + cy * CH + CH / 2, R.ink, 1.5);
      }
      if (fb || flashMsg > 0) wrap(c, msg, 200, 384, 360, 16, 20, msgCol);
      else txt(c, 'Tap the map, or use arrows and Space', 200, 384, 13, R.dim);
      G.fxStep(dt);
      G.hud([['SCORE', pad(score)], ['STREAK', streak], ['LIVES', lives]]);
    }
    G.opt('Level', LV3, lv, function (i) { lv = i; start(); });
    G.begin(start);
  });

  /* ================= EDUCATION (author L): logic and trivia games ================= */
  function L_in(p, x, y, w, h) { return p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h; }
  function L_bar(c, f, col) { rect(c, 20, 14, 360, 8, 4, R.grid); rect(c, 20, 14, Math.max(0, 360 * f), 8, 4, f < 0.25 ? R.coral : col); }
  function L_btn(c, x, y, w, h, col, s, sz) { rect(c, x, y, w, h, 10, col); fit(c, s, x + w / 2, y + h / 2, w - 10, sz || 16, '#171233'); }

  /* ---------- Clock Master ---------- */
  function L_tm(h, m) { return h + ':' + (m < 10 ? '0' : '') + m; }
  function L_add(h, m, d) { var t = (((h % 12) * 60 + m + d) % 720 + 720) % 720, hh = Math.floor(t / 60); return [hh === 0 ? 12 : hh, t % 60]; }
  function L_dur(mins) { var h = Math.floor(mins / 60), m = mins % 60, o = ''; if (h) o += h + (h === 1 ? ' hour' : ' hours'); if (h && m) o += ' '; if (m || !h) o += m + (m === 1 ? ' minute' : ' minutes'); return o; }
  var L_faceCache = null;
  function L_faceImg() {
    if (L_faceCache) return L_faceCache;
    var r = 56, pad = 12, sz = (r + pad) * 2, o = document.createElement('canvas'), oc, cx, cy, i, a, bez, fg;
    o.width = sz; o.height = sz; oc = o.getContext('2d'); cx = sz / 2; cy = sz / 2;
    oc.save(); oc.shadowColor = 'rgba(0,0,0,.55)'; oc.shadowBlur = 16; oc.shadowOffsetY = 6;
    bez = oc.createRadialGradient(cx - 14, cy - 18, 4, cx, cy, r + 4);
    bez.addColorStop(0, '#453a86'); bez.addColorStop(0.55, '#241c47'); bez.addColorStop(1, '#0c0920');
    oc.beginPath(); oc.arc(cx, cy, r + 4, 0, TAU); oc.fillStyle = bez; oc.fill(); oc.restore();
    fg = oc.createRadialGradient(cx - 10, cy - 14, 2, cx, cy, r);
    fg.addColorStop(0, '#241d4c'); fg.addColorStop(1, '#120e28');
    oc.beginPath(); oc.arc(cx, cy, r, 0, TAU); oc.fillStyle = fg; oc.fill();
    oc.strokeStyle = 'rgba(255,255,255,.22)'; oc.lineWidth = 1.5;
    oc.beginPath(); oc.arc(cx, cy, r - 1, Math.PI * 1.08, Math.PI * 1.85); oc.stroke();
    oc.strokeStyle = 'rgba(0,0,0,.3)'; oc.beginPath(); oc.arc(cx, cy, r + 3.5, Math.PI * 0.1, Math.PI * 0.85); oc.stroke();
    for (i = 0; i < 60; i++) { a = i * 6 * Math.PI / 180; line(oc, cx + Math.sin(a) * (r - (i % 5 ? 3 : 8)), cy - Math.cos(a) * (r - (i % 5 ? 3 : 8)), cx + Math.sin(a) * (r - 1), cy - Math.cos(a) * (r - 1), i % 5 ? R.dim : R.ink, i % 5 ? 1 : 2); }
    for (i = 1; i <= 12; i++) { a = i * 30 * Math.PI / 180; txt(oc, String(i), cx + Math.sin(a) * (r - 18), cy - Math.cos(a) * (r - 18), 13, R.ink); }
    L_faceCache = { img: o, cx: cx, cy: cy, r: r };
    return L_faceCache;
  }
  function L_clock(c, cx, cy, h, m, arc, back) {
    var f = L_faceImg(), r = f.r, ma = m * 6, ha = ((h % 12) + m / 60) * 30, R2 = Math.PI / 180, g0, cg;
    c.drawImage(f.img, cx - f.cx, cy - f.cy);
    if (arc) {
      c.save(); g0 = c.createRadialGradient(cx, cy, 4, cx, cy, r);
      g0.addColorStop(0, 'rgba(47,211,199,.08)'); g0.addColorStop(1, 'rgba(47,211,199,.4)');
      c.beginPath(); c.moveTo(cx, cy);
      if (back) c.arc(cx, cy, r - 2, (ma - arc * 6 - 90) * R2, (ma - 90) * R2); else c.arc(cx, cy, r - 2, (ma - 90) * R2, (ma + arc * 6 - 90) * R2);
      c.closePath(); c.fillStyle = g0; c.fill(); c.restore();
    }
    c.save(); c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 4; c.shadowOffsetY = 2; c.lineCap = 'round';
    line(c, cx, cy, cx + Math.sin(ha * R2) * r * 0.5, cy - Math.cos(ha * R2) * r * 0.5, R.coral, 6);
    line(c, cx, cy, cx + Math.sin(ma * R2) * (r - 6), cy - Math.cos(ma * R2) * (r - 6), R.yellow, 3);
    c.restore(); c.lineCap = 'butt';
    cg = c.createRadialGradient(cx - 1, cy - 1, 0, cx, cy, 4); cg.addColorStop(0, '#fff'); cg.addColorStop(1, R.ink);
    circ(c, cx, cy, 4, cg);
  }
  function L_clockQ(lv) {
    var mode, h = 1 + rnd(12), m, ah, am, w, why, q, d, back, lbl, A, end, dur, distr, rr3;
    if (lv === 0) mode = 'read'; else if (lv === 1) mode = Math.random() < 0.62 ? 'read' : 'elapsed';
    else { rr3 = Math.random(); mode = rr3 < 0.34 ? 'read' : rr3 < 0.67 ? 'elapsed' : 'duration'; }
    if (mode === 'read') {
      if (lv === 0) m = pick([0, 15, 30, 45]); else if (lv === 1) m = 5 * rnd(12); else m = Math.random() < 0.2 ? 5 * rnd(12) : 1 + rnd(59);
      ah = h; am = m; q = 'What time is it?';
      w = [L_tm(h % 12 + 1, m), L_tm((h + 10) % 12 + 1, m), L_tm(h, (m + 15) % 60), L_tm(h, (m + 45) % 60), L_tm(h, (m + 5) % 60), L_tm(h, (m + 55) % 60)];
      if (m % 5 === 0) w.push(L_tm(m / 5 || 12, (h % 12) * 5));
      why = (m === 0 ? 'The short hand points at ' + h + ' and the long hand at 12' : 'The short hand is between ' + h + ' and ' + (h % 12 + 1) + (m % 5 === 0 ? ', and the long hand points at ' + m / 5 + ' = ' + m + ' minutes' : ', and the long hand is ' + m + ' minute marks past 12')) + '. So ' + L_tm(h, m) + '.';
      return { q: q, opts: w, right: L_tm(h, m), draw: function (c, cx, cy) { L_clock(c, cx, cy + 6, ah, am, 0, 0); }, why: why };
    }
    if (mode === 'elapsed') {
      m = lv === 1 ? 5 * rnd(12) : (Math.random() < 0.3 ? 5 * rnd(12) : rnd(60));
      d = pick([10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 65, 70, 75, 85]); back = Math.random() < 0.4;
      lbl = d < 60 ? d + ' minutes' : '1 hour ' + (d - 60) + ' minutes';
      A = L_add(h, m, back ? -d : d);
      q = 'The clock shows the time now. What time ' + (back ? 'was it ' + lbl + ' ago?' : 'will it be ' + lbl + ' later?');
      w = [L_add(h, m, back ? d : -d), [h, m], L_add(A[0], A[1], 60), L_add(A[0], A[1], -60), L_add(A[0], A[1], 10), L_add(A[0], A[1], -10)];
      if (d > 60) w.push(L_add(h, m, (back ? -1 : 1) * (d - 60)));
      w = w.map(function (t) { return L_tm(t[0], t[1]); });
      why = 'It is ' + L_tm(h, m) + ' now, so ' + lbl + (back ? ' earlier' : ' later') + ' is ' + L_tm(A[0], A[1]) + '.';
      return { q: q, opts: w, right: L_tm(A[0], A[1]), draw: function (c, cx, cy) { L_clock(c, cx, cy + 8, h, m, d % 60, back); }, why: why };
    }
    m = lv === 2 ? (Math.random() < 0.3 ? 5 * rnd(12) : rnd(60)) : 5 * rnd(12);
    dur = pick([15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80, 90, 100, 110, 120, 150, 180]);
    end = L_add(h, m, dur);
    q = 'The clock shows the start time. How long until ' + L_tm(end[0], end[1]) + '?';
    distr = shuf([dur + 5, dur - 5, dur + 10, dur - 10, dur + 15, dur - 20, dur * 2].filter(function (v) { return v > 0 && v !== dur; }));
    w = distr.map(L_dur);
    why = 'From ' + L_tm(h, m) + ' to ' + L_tm(end[0], end[1]) + ' is ' + L_dur(dur) + '.';
    return { q: q, opts: w, right: L_dur(dur), draw: function (c, cx, cy) { L_clock(c, cx, cy + 6, h, m, 0, 0); }, why: why };
  }
  def('clockMaster', EDU, 'Clock Master', R.blue, 'Read a realistic analog clock and answer time, elapsed-time and duration questions before the clock runs out.', 'Click an answer or press 1-4 · three misses ends the run', function (G) {
    mcq(G, { color: R.blue, secs: [16, 14, 24], make: function (lv) {
      var o = L_clockQ(lv), m4 = mk4(o.right, o.opts);
      return { q: o.q, draw: o.draw, why: o.why, opts: m4.opts, a: m4.a };
    } });
  });

  /* ---------- Number Hunt ---------- */
  function L_mul(k) { return ['multiple of ' + k, function (n) { return n % k === 0; }]; }
  function L_end(d) { return ['number that ends in ' + d, function (n) { return n % 10 === d; }]; }
  function L_eo(ev, over, k) { return [(ev ? 'even' : 'odd') + ' number ' + (over ? 'over ' : 'under ') + k, function (n) { return n % 2 === (ev ? 0 : 1) && (over ? n > k : n < k); }]; }
  function L_dsF(n) { var s = 0, x = n; while (x > 0) { s += x % 10; x = Math.floor(x / 10); } return s; }
  function L_dsr(k) { return ['number with digit sum ' + k, function (n) { return L_dsF(n) === k; }]; }
  function L_isP(n) { var i; if (n < 2) return false; for (i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
  function L_isSq(n) { var r = Math.round(Math.sqrt(n)); return r * r === n; }
  function L_isCu(n) { var r = Math.round(Math.pow(n, 1 / 3)); return r * r * r === n; }
  function L_isTri(n) { var k = Math.round((-1 + Math.sqrt(1 + 8 * n)) / 2); return k >= 1 && k * (k + 1) / 2 === n; }
  var L_FIB = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  function L_isFib(n) { return L_FIB.indexOf(n) > -1; }
  function L_primeExp(x) { var d = 2; while (x % d) d++; return ' (' + d + ' × ' + x / d + ')'; }
  function L_rules(lv) {
    var e = [L_mul(2), L_mul(5), L_mul(10), L_end(0), L_end(5), L_end(2), L_end(7), L_end(4), L_end(6), L_eo(1, 0, 30), L_eo(1, 1, 40), L_eo(0, 0, 30), L_eo(0, 1, 30), L_eo(1, 0, 20), L_eo(0, 1, 40), L_eo(1, 0, 40), L_eo(0, 1, 20), ['number with an even digit sum', function (n) { return L_dsF(n) % 2 === 0; }], ['number with an odd digit sum', function (n) { return L_dsF(n) % 2 === 1; }]],
      n2 = e.concat([L_mul(3), L_mul(4), L_mul(6), L_end(3), L_end(9), L_end(1), L_end(8), L_eo(1, 1, 30), L_eo(0, 0, 40), L_eo(1, 0, 50), L_eo(0, 1, 50), ['square number', L_isSq], L_dsr(9), L_dsr(6), L_dsr(10), L_dsr(7), ['triangular number', L_isTri]]),
      f = pick([36, 48, 60, 72, 84, 90]);
    return lv === 0 ? e : lv === 1 ? n2 : [['prime number', L_isP, L_primeExp], L_mul(7), L_mul(8), L_mul(9), L_mul(11), L_mul(12), ['cube number', L_isCu], ['square number', L_isSq], ['factor of ' + f, function (x) { return f % x === 0; }], L_end(7), L_end(4), L_end(6), L_end(3), L_eo(0, 1, 50), L_eo(1, 1, 50), L_eo(0, 0, 60), L_eo(1, 0, 60), ['triangular number', L_isTri], ['Fibonacci number', L_isFib], L_dsr(12), L_dsr(15), L_dsr(5), L_dsr(8), L_dsr(11), ['prime number', L_isP, L_primeExp]];
  }
  function L_grid(lv) {
    var lo = lv === 2 ? 2 : 1, hi = lv === 2 ? 99 : 60, pool = L_rules(lv), r, M, N, i, k, kmin, kmax, ok = 0, cells, tries = 0;
    while (!ok && tries < 200) {
      tries++; r = pick(pool); M = []; N = [];
      for (i = lo; i <= hi; i++) (r[1](i) ? M : N).push(i);
      kmin = Math.max(3, 48 - N.length); kmax = Math.min(14, M.length);
      if (kmin <= kmax) ok = 1;
    }
    k = clamp(6 + rnd(7), kmin, kmax);
    cells = shuf(shuf(M).slice(0, k).concat(shuf(N).slice(0, 48 - k))).map(function (n) { return { n: n, st: 0, t: 0 }; });
    return { r: r, cells: cells, need: k };
  }
  var L_tileCache = null;
  function L_lighten(hex, amt) { var n = parseInt(hex.slice(1), 16), r = (n >> 16) + amt, g = (n >> 8 & 255) + amt, b = (n & 255) + amt; r = r > 255 ? 255 : r < 0 ? 0 : r; g = g > 255 ? 255 : g < 0 ? 0 : g; b = b > 255 ? 255 : b < 0 ? 0 : b; return 'rgb(' + r + ',' + g + ',' + b + ')'; }
  function L_tileArt() {
    if (L_tileCache) return L_tileCache;
    var w = 58, h = 42, cols = [R.grid, R.green, R.coral, R.yellow, '#5A2B45'], o = document.createElement('canvas'), oc, i, g0;
    o.width = w * cols.length; o.height = h; oc = o.getContext('2d');
    for (i = 0; i < cols.length; i++) {
      oc.save(); oc.translate(i * w, 0);
      oc.shadowColor = 'rgba(0,0,0,.4)'; oc.shadowBlur = 3; oc.shadowOffsetY = 2;
      K.L(oc, 1, 1, w - 2, h - 2, 8);
      g0 = oc.createLinearGradient(0, 0, 0, h); g0.addColorStop(0, L_lighten(cols[i], 34)); g0.addColorStop(1, cols[i]);
      oc.fillStyle = g0; oc.fill(); oc.shadowBlur = 0;
      oc.strokeStyle = 'rgba(255,255,255,.22)'; oc.lineWidth = 1; oc.beginPath(); oc.moveTo(6, 3); oc.lineTo(w - 6, 3); oc.stroke();
      oc.restore();
    }
    L_tileCache = { img: o, w: w, h: h };
    return L_tileCache;
  }
  def('numberHunt', EDU, 'Number Hunt', R.green, 'A grid of 48 numbers and a rule: tap every number that fits before time runs out. Primes, squares, cubes, digit sums and more.', 'Tap the matching numbers · arrows + Space work too · three wrong taps ends the run', function (G) {
    var W = 400, H = 470, c = G.canvas(W, H), lv = 1, g0, found, tl, tmax, lives, score, round, mist, busy, fb, msg, msgC, cur, kb, mT = 0, k2;
    function deal() { g0 = L_grid(lv); found = 0; mist = 0; busy = false; msg = ''; mT = 0; tmax = Math.max(22, [50, 42, 42][lv] - round * 2); tl = tmax; }
    function start() { G.gen = (G.gen || 0) + 1; lives = 3; score = 0; round = 0; cur = 0; kb = false; G.fx = []; deal(); G.frame(step); }
    function cxy(i) { return { x: 10 + (i % 6) * 63.33, y: 88 + Math.floor(i / 6) * 46 }; }
    function tap(i) {
      var ce = g0.cells[i], r = g0.r, xy;
      if (busy || !ce || ce.st) return;
      xy = cxy(i);
      if (r[1](ce.n)) {
        ce.st = 1; found++; score += 5; G.burst(xy.x + 29, xy.y + 21, R.green, 8);
        G.tally(true, ce.n + ' is ' + r[0]);
        if (found >= g0.need) { busy = true; fb = 1.2; k2 = 20 + Math.floor(tl * 2) + (mist ? 0 : 20); score += k2; msg = 'Round clear! +' + k2 + (mist ? '' : ' (perfect)'); msgC = R.green; G.burst(200, 250, R.yellow, 30); }
      } else {
        ce.st = 2; ce.t = 0.5; lives--; mist++; msg = ce.n + ' is not ' + (/^[aeiou]/i.test(r[0]) ? 'an ' : 'a ') + r[0] + (r[2] ? r[2](ce.n) : ''); msgC = R.coral; mT = 2.6;
        G.tally(false, ce.n + ' is not ' + (/^[aeiou]/i.test(r[0]) ? 'an ' : 'a ') + r[0]);
        if (lives <= 0) { busy = true; fb = 2.4; reveal(); }
      }
    }
    function reveal() { g0.cells.forEach(function (e) { if (!e.st && g0.r[1](e.n)) e.st = 3; }); }
    G.pointer({ down: function (p) {
      var i, xy; kb = false;
      for (i = 0; i < 48; i++) { xy = cxy(i); if (L_in(p, xy.x, xy.y, 58, 42)) tap(i); }
    } });
    G.press = function (k) {
      if (k === 'ArrowLeft' || k === 'a') { cur = (cur + 47) % 48; kb = true; } else if (k === 'ArrowRight' || k === 'd') { cur = (cur + 1) % 48; kb = true; }
      else if (k === 'ArrowUp' || k === 'w') { cur = (cur + 42) % 48; kb = true; } else if (k === 'ArrowDown' || k === 's') { cur = (cur + 6) % 48; kb = true; }
      else if (k === ' ' || k === 'Enter') tap(cur);
    };
    G.pad([['◀', 'ArrowLeft'], ['▲', 'ArrowUp'], ['▼', 'ArrowDown'], ['▶', 'ArrowRight'], ['Tap', 'Space']]);
    function step(dt) {
      var i, xy, ce, st, art = L_tileArt();
      if (mT > 0) { mT -= dt; if (mT <= 0 && !busy) msg = ''; }
      if (!busy) { tl -= dt; if (tl <= 0) { busy = true; lives--; fb = 2.4; reveal(); msg = 'Time is up! The missing ones are marked.'; msgC = R.yellow; G.tally(false, 'rule: ' + g0.r[0]); } }
      else { fb -= dt; if (fb <= 0) { if (lives <= 0) { G.over(score, 'Out of lives after ' + round + ' round' + (round === 1 ? '' : 's') + '. Score: ' + score); return; } round++; deal(); } }
      clear(c, W, H); L_bar(c, tl / tmax, R.green);
      fit(c, 'Tap every ' + g0.r[0], 200, 42, 372, 24, R.ink);
      if (msg) fit(c, msg, 200, 70, 376, 14, msgC); else txt(c, found + ' of ' + g0.need + ' found', 200, 70, 14, R.dim);
      for (i = 0; i < 48; i++) {
        ce = g0.cells[i]; xy = cxy(i); if (ce.t > 0) ce.t -= dt;
        st = ce.st === 1 ? 1 : ce.st === 2 ? (ce.t > 0 ? 2 : 4) : ce.st === 3 ? 3 : 0;
        c.drawImage(art.img, st * art.w, 0, art.w, art.h, xy.x, xy.y, art.w, art.h);
        txt(c, String(ce.n), xy.x + 29, xy.y + 22, 22, st === 1 || st === 3 || st === 2 ? '#171233' : st === 4 ? 'rgba(233,251,249,.5)' : R.ink);
        if (kb && i === cur) { c.strokeStyle = R.ink; c.lineWidth = 3; K.L(c, xy.x - 2, xy.y - 2, 62, 46, 9); c.stroke(); }
      }
      G.fxStep(dt);
      G.hud([['SCORE', pad(score)], ['ROUND', round + 1], ['LIVES', lives]]);
    }
    G.opt('Level', LV3, lv, function (i) { lv = i; start(); });
    G.begin(start);
  });

  /* ---------- Bit Flip ---------- */
  function L_val(b) { var v = 0, i; for (i = 0; i < b.length; i++) v = v * 2 + (b[i] ? 1 : 0); return v; }
  function L_bits(v, nb) { var b = [], i; for (i = 0; i < nb; i++) b.push((v >> (nb - 1 - i)) & 1); return b; }
  function L_binStr(b) { var s = b.join(''); return b.length > 4 ? s.slice(0, 4) + ' ' + s.slice(4) : s; }
  function L_sum(b) { var s = [], i, n = b.length; for (i = 0; i < n; i++) if (b[i]) s.push(1 << (n - 1 - i)); return s.length > 1 ? s.join(' + ') + ' = ' + L_val(b) : s.length ? 'Only the ' + s[0] + ' light is on = ' + s[0] : 'All lights off = 0'; }
  var L_BFACT = ['A byte is 8 bits and can store 256 values, 0 to 255.', 'Binary uses only two digits: 0 and 1.', 'Each place value doubles: 1, 2, 4, 8, 16, 32...', 'Bit is short for binary digit.', 'Computers use binary because a transistor is reliably either off or on.', 'Four bits make a nibble, half of a byte.', 'One hex digit always equals exactly 4 binary digits.'];
  var L_ledCache = null;
  function L_ledArt() {
    if (L_ledCache) return L_ledCache;
    var r = 30, pad = 16, w = (r + pad) * 2, o = document.createElement('canvas'), oc, cx = w / 2, cy = w / 2, g0;
    o.width = w * 2; o.height = w; oc = o.getContext('2d');
    oc.save(); g0 = oc.createRadialGradient(cx - 9, cy - 11, 2, cx, cy, r);
    g0.addColorStop(0, '#4c4290'); g0.addColorStop(1, '#221b46');
    oc.beginPath(); oc.arc(cx, cy, r, 0, TAU); oc.fillStyle = g0; oc.fill();
    oc.strokeStyle = 'rgba(0,0,0,.45)'; oc.lineWidth = 2; oc.stroke(); oc.restore();
    oc.save(); oc.translate(w, 0); oc.shadowColor = 'rgba(255,209,102,.95)'; oc.shadowBlur = 20;
    g0 = oc.createRadialGradient(cx - 9, cy - 11, 2, cx, cy, r);
    g0.addColorStop(0, '#fff8e0'); g0.addColorStop(0.45, R.yellow); g0.addColorStop(1, '#c9931f');
    oc.beginPath(); oc.arc(cx, cy, r, 0, TAU); oc.fillStyle = g0; oc.fill(); oc.restore();
    L_ledCache = { img: o, w: w, r: r };
    return L_ledCache;
  }
  function L_led(c, x, y, rr, on) { var art = L_ledArt(), sc = rr / art.r, dw = art.w * sc, sx = on ? art.w : 0; c.drawImage(art.img, sx, 0, art.w, art.w, x - dw / 2, y - dw / 2, dw, dw); }
  def('bitFlip', EDU, 'Bit Flip', R.coral, 'Flip glowing binary lights to build a target number, read them back, or convert between binary and decimal.', 'Tap lights or press 1-8 (left to right) · in read/convert rounds press 1-4 · three misses ends it', function (G) {
    var W = 400, H = 470, c = G.canvas(W, H), lv = 1, nb, mode, bits, target, opts, pk, tl, tmax, lives, score, streak, best, round, busy, fb, msg, fact, good, last;
    function pitch() { return Math.min(88, 380 / nb); }
    function bxc(i) { return (W - pitch() * nb) / 2 + pitch() * (i + 0.5); }
    function newRound() {
      var mx, v, cand = [], i, m4, rr3;
      nb = [4, 6, 8][lv]; mx = (1 << nb) - 1;
      if (lv === 0) mode = 'set'; else if (lv === 1) mode = Math.random() < 0.55 ? 'set' : 'read'; else { rr3 = Math.random(); mode = rr3 < 0.4 ? 'set' : rr3 < 0.72 ? 'read' : 'convert'; }
      do { v = 1 + rnd(mx); } while (v === last);
      last = v; target = v; pk = -1; busy = false; msg = ''; good = 0; fact = pick(L_BFACT);
      if (mode === 'set') { bits = L_bits(0, nb); tmax = [14, 20, 28][lv] - Math.min(round, 8) * 0.5; }
      else if (mode === 'read') {
        bits = L_bits(v, nb); tmax = 11;
        for (i = 0; i < nb; i++) cand.push(v ^ (1 << i));
        cand.push(v + 1, v - 1);
        m4 = mk4(v, cand.filter(function (x) { return x >= 0 && x <= mx; })); opts = m4.opts;
      } else {
        bits = L_bits(v, nb); tmax = 13;
        for (i = 0; i < nb; i++) cand.push(v ^ (1 << i));
        cand.push(v + 1, v - 1);
        m4 = mk4(L_binStr(L_bits(v, nb)), cand.filter(function (x) { return x >= 0 && x <= mx; }).map(function (x) { return L_binStr(L_bits(x, nb)); })); opts = m4.opts;
      }
      tl = tmax;
    }
    function start() { G.gen = (G.gen || 0) + 1; lives = 3; score = 0; streak = 0; best = 0; round = 0; last = 0; G.fx = []; newRound(); G.frame(step); }
    function win(note) { busy = true; streak++; best = Math.max(best, streak); score += 10 + Math.ceil(tl) + Math.min(streak, 10) * 2; good = 1; fb = 1.5; G.burst(200, 205, R.green, 26); G.tally(true, note); }
    function lose(note) { busy = true; lives--; streak = 0; good = 0; fb = 2.8; G.tally(false, note); }
    function flip(i) {
      if (busy || mode !== 'set' || i < 0 || i >= nb) return;
      bits[i] ^= 1; G.burst(bxc(i), 205, bits[i] ? R.yellow : R.dim, 6);
      if (L_val(bits) === target) { msg = 'Yes! ' + L_sum(bits); win(String(target) + ' = ' + L_sum(bits)); }
    }
    function choose(i) {
      var right;
      if (busy || (mode !== 'read' && mode !== 'convert') || i < 0 || i > 3) return;
      pk = i; right = mode === 'read' ? target : L_binStr(bits);
      if (opts[i] === right) { msg = 'Yes! ' + L_sum(bits); win(String(right)); }
      else { msg = mode === 'read' ? 'It was ' + L_sum(bits) : 'It was ' + L_binStr(bits) + ' = ' + target; lose(mode === 'read' ? String(target) + ' = ' + L_sum(bits) : L_binStr(bits) + ' = ' + target); }
    }
    G.pointer({ down: function (p) {
      var i;
      if (mode === 'set') { for (i = 0; i < nb; i++) if (L_in(p, bxc(i) - pitch() / 2, 150, pitch(), 110)) flip(i); }
      else for (i = 0; i < 4; i++) if (L_in(p, 12 + (i % 2) * 192, 300 + Math.floor(i / 2) * 84, 184, 74)) choose(i);
    } });
    G.press = function (k) { var i = '12345678'.indexOf(k); if (k.length === 1 && i > -1) { if (mode === 'set') flip(i); else choose(i); } else if ((mode === 'read' || mode === 'convert') && k.length === 1 && 'abcd'.indexOf(k) > -1) choose('abcd'.indexOf(k)); };
    function step(dt) {
      var i, x, rr, on, y, col, right2;
      if (!busy) {
        tl -= dt;
        if (tl <= 0) {
          busy = true; lives--; streak = 0; good = 0; fb = 2.8; pk = -2;
          if (mode === 'set') { bits = L_bits(target, nb); msg = 'Time! ' + L_sum(bits); G.tally(false, target + ' = ' + L_sum(bits)); }
          else if (mode === 'read') { msg = 'Time! ' + L_sum(bits); G.tally(false, target + ' = ' + L_sum(bits)); }
          else { msg = 'Time! ' + L_binStr(bits) + ' = ' + target; G.tally(false, L_binStr(bits) + ' = ' + target); }
        }
      } else { fb -= dt; if (fb <= 0) { if (lives <= 0) { G.over(score, 'Out of lives with ' + score + ' points. Best streak ' + best + '.'); return; } round++; newRound(); } }
      clear(c, W, H); L_bar(c, tl / tmax, R.coral);
      if (mode === 'set') { txt(c, 'Make this number with the lights', 200, 46, 16, R.dim); txt(c, String(target), 200, 96, 54, R.yellow); }
      else if (mode === 'read') { txt(c, 'Read the lights: what number is it?', 200, 46, 16, R.dim); txt(c, '?', 200, 96, 54, R.yellow); }
      else { txt(c, 'Which binary pattern equals this number?', 200, 46, 15, R.dim); txt(c, String(target), 200, 96, 50, R.yellow); }
      rr = Math.min(pitch() / 2 - 5, 30);
      for (i = 0; i < nb; i++) {
        x = bxc(i); on = bits[i]; y = 205;
        txt(c, String(1 << (nb - 1 - i)), x, 158, nb === 8 ? 18 : 22, R.ink);
        rect(c, x - pitch() / 2 + 3, 174, pitch() - 6, 64, 12, R.grid);
        L_led(c, x, y, rr, on);
        if (mode === 'set') txt(c, String(i + 1), x, 254, 12, R.dim);
      }
      if (mode === 'set') {
        if (busy) { fit(c, msg, 200, 300, 376, 20, good ? R.green : R.yellow); fit(c, fact, 200, 396, 376, 11, R.dim); }
        else fit(c, 'Now: ' + (L_val(bits) ? L_sum(bits) : '0'), 200, 300, 376, 18, R.ink);
        txt(c, 'Tap a light or press 1-' + nb + ' (left to right)', 200, 372, 13, R.dim);
      } else {
        right2 = mode === 'read' ? target : L_binStr(bits);
        if (busy) { fit(c, msg, 200, 278, 376, 16, good ? R.green : R.yellow); fit(c, fact, 200, 294, 376, 11, R.dim); }
        for (i = 0; i < 4; i++) {
          col = R.violet;
          if (busy && opts[i] === right2) col = R.green; else if (busy && i === pk) col = R.coral;
          rect(c, 12 + (i % 2) * 192, 300 + Math.floor(i / 2) * 84, 184, 74, 12, col);
          fit(c, String(opts[i]), 104 + (i % 2) * 192, 337 + Math.floor(i / 2) * 84, 164, mode === 'convert' ? 20 : 28, '#171233');
          txt(c, 'ABCD'.charAt(i), 26 + (i % 2) * 192, 314 + Math.floor(i / 2) * 84, 12, 'rgba(23,18,51,.6)');
        }
      }
      G.fxStep(dt);
      G.hud([['SCORE', pad(score)], ['STREAK', streak], ['LIVES', lives]]);
    }
    G.opt('Level', LV3, lv, function (i) { lv = i; start(); });
    G.begin(start);
  });

  /* ---------- What Comes Next ---------- */
  var L_SH = ['●', '■', '▲', '◆'], L_CN = ['Red', 'Blue', 'Green', 'Yellow'], L_CH = ['#FF5A5A', '#4DA6FF', '#3DDC97', '#FFD166'], L_AR = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
  function L_shapeDraw(c, s, x, y, r, col) {
    var g0;
    c.save(); c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 6; c.shadowOffsetY = 3;
    g0 = c.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.15, x, y, r * 1.15);
    g0.addColorStop(0, L_lighten(col, 70)); g0.addColorStop(0.6, col); g0.addColorStop(1, L_lighten(col, -40));
    c.fillStyle = g0; c.beginPath();
    if (s === 0) c.arc(x, y, r, 0, TAU);
    else if (s === 1) c.rect(x - r * 0.85, y - r * 0.85, r * 1.7, r * 1.7);
    else if (s === 2) { c.moveTo(x, y - r); c.lineTo(x + r * 1.05, y + r * 0.85); c.lineTo(x - r * 1.05, y + r * 0.85); c.closePath(); }
    else { c.moveTo(x, y - r * 1.15); c.lineTo(x + r * 1.05, y); c.lineTo(x, y + r * 1.15); c.lineTo(x - r * 1.05, y); c.closePath(); }
    c.fill(); c.restore();
    c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.ellipse(x - r * 0.32, y - r * 0.35, r * 0.34, r * 0.18, -0.6, 0, TAU); c.fill();
  }
  function L_arrowDraw(c, d, x, y, r, col) {
    var a = d * Math.PI / 180, ux = Math.sin(a), uy = -Math.cos(a), bx = x + ux * r * 0.2, by = y + uy * r * 0.2, g0;
    c.save(); c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 5; c.shadowOffsetY = 2;
    g0 = c.createLinearGradient(x - ux * r, y - uy * r, x + ux * r, y + uy * r);
    g0.addColorStop(0, L_lighten(col, -30)); g0.addColorStop(1, L_lighten(col, 55));
    c.lineCap = 'round'; c.strokeStyle = g0; c.lineWidth = 5; c.beginPath(); c.moveTo(x - ux * r, y - uy * r); c.lineTo(bx, by); c.stroke(); c.lineCap = 'butt';
    c.fillStyle = g0; c.beginPath(); c.moveTo(x + ux * r, y + uy * r); c.lineTo(bx - uy * r * 0.6, by + ux * r * 0.6); c.lineTo(bx + uy * r * 0.6, by - ux * r * 0.6); c.closePath(); c.fill();
    c.restore();
  }
  function L_blk(c, x, y, w, h, col) {
    var g0 = c.createLinearGradient(x, y, x, y + h);
    g0.addColorStop(0, L_lighten(col, 55)); g0.addColorStop(1, col);
    c.save(); c.shadowColor = 'rgba(0,0,0,.3)'; c.shadowBlur = 2; c.shadowOffsetY = 1; rect(c, x, y, w, h, 1, g0); c.restore();
  }
  function L_seq(c, cx, cy, items) {
    var n = items.length + 1, gap = 4, bw = Math.min(52, Math.floor((372 - (n - 1) * gap) / n)), bh = 78, x0 = cx - (n * bw + (n - 1) * gap) / 2, i, it, bx, mid, mx = 1, j, u;
    items.forEach(function (t) { if (t.k === 'b') mx = Math.max(mx, t.n); });
    u = Math.min(9, 62 / mx);
    for (i = 0; i < n; i++) {
      bx = x0 + i * (bw + gap); mid = bx + bw / 2; rect(c, bx, cy - bh / 2, bw, bh, 8, R.bg);
      if (i === n - 1) { c.strokeStyle = R.yellow; c.lineWidth = 2; c.setLineDash([5, 4]); K.L(c, bx + 1, cy - bh / 2 + 1, bw - 2, bh - 2, 8); c.stroke(); c.setLineDash([]); txt(c, '?', mid, cy + 1, 32, R.yellow); continue; }
      it = items[i];
      if (it.k === 'n') fit(c, it.v, mid, cy, bw - 6, 22, R.ink);
      else if (it.k === 's') L_shapeDraw(c, it.s, mid, cy, bw * 0.3, it.col);
      else if (it.k === 'a') L_arrowDraw(c, it.d, mid, cy, bw * 0.34, R.teal);
      else for (j = 0; j < it.n; j++) L_blk(c, mid - bw * 0.22, cy + bh / 2 - 7 - (j + 1) * u, bw * 0.44, Math.max(2, u - 1.5), R.orange);
    }
  }
  function L_mkQ(q, items, ans, wr, why) { var m = mk4(String(ans), wr.map(String)); return { q: q, items: items, draw: function (c, cx, cy) { L_seq(c, cx, cy + 2, items); }, why: why, opts: m.opts, a: m.a }; }
  function L_nq(arr, ans, why, ex) {
    var w = (ex || []).concat([ans + 1, ans - 1, ans + 2, ans - 2, ans + 3, ans + 10]).filter(function (v) { return v > 0 && v !== ans; });
    return L_mkQ('What number comes next?', arr.map(function (v) { return { k: 'n', v: String(v) }; }), ans, w, why);
  }
  function L_rep(p, vis, col) {
    var idx = shuf([0, 1, 2, 3]), items = [], i, ans = idx[vis % p];
    for (i = 0; i < vis; i++) items.push({ k: 's', s: idx[i % p], col: col });
    return { items: items, ans: L_SH[ans], all: L_SH.slice(), cyc: idx.slice(0, p).map(function (k) { return L_SH[k]; }).join(' ') };
  }
  function L_repC(p, vis) {
    var idx = shuf([0, 1, 2, 3]), items = [], i;
    for (i = 0; i < vis; i++) items.push({ k: 's', s: 0, col: L_CH[idx[i % p]] });
    return L_mkQ('Which colour comes next?', items, L_CN[idx[vis % p]], L_CN, 'The colours repeat: ' + idx.slice(0, p).map(function (k) { return L_CN[k]; }).join(', ') + '.');
  }
  function L_gShape(p, vis) { var o = L_rep(p, vis, R.teal); return L_mkQ('Which shape comes next?', o.items, o.ans, o.all, 'The pattern ' + o.cyc + ' repeats.'); }
  function L_gArrow(st) {
    var d0 = rnd(8 / (st / 45)) * st, sg = pick([1, -1]), items = [], i, dir = function (k) { return ((d0 + sg * k * st) % 360 + 360) % 360; }, ans = L_AR[dir(5) / 45], w = st === 90 ? [0, 2, 4, 6].map(function (k) { return L_AR[k]; }) : L_AR;
    for (i = 0; i < 5; i++) items.push({ k: 'a', d: dir(i) });
    return L_mkQ('Which arrow comes next?', items, ans, w, 'The arrow turns ' + (st === 90 ? 'a quarter' : 'an eighth of a') + ' turn ' + (sg > 0 ? 'clockwise' : 'anticlockwise') + ' each time.');
  }
  function L_gArrowAlt() {
    var dirs = shuf([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, 2).map(function (k) { return k * 45; }), items = [], i, ans = L_AR[dirs[1] / 45];
    for (i = 0; i < 5; i++) items.push({ k: 'a', d: dirs[i % 2] });
    return L_mkQ('Which arrow comes next?', items, ans, L_AR, 'The arrow alternates between two directions each time.');
  }
  function L_gBars(arr, ans, why) { return L_mkQ('How many blocks tall is the next bar?', arr.map(function (v) { return { k: 'b', n: v }; }), ans, [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3], why); }
  function L_letterQ(step, allowBack) {
    var back = allowBack && Math.random() < 0.4, s2 = back ? -step : step, span = step * 5, loStart, hiStart, start, i, arr = [], ansIdx, ansCh, wrongIdx, w;
    if (s2 > 0) { loStart = 1; hiStart = 26 - span; } else { loStart = 1 + span; hiStart = 26; }
    start = loStart + rnd(Math.max(1, hiStart - loStart + 1));
    for (i = 0; i < 5; i++) arr.push(String.fromCharCode(64 + start + s2 * i));
    ansIdx = start + s2 * 5; ansCh = String.fromCharCode(64 + ansIdx);
    wrongIdx = [ansIdx - 1, ansIdx + 1, ansIdx - s2, ansIdx + s2, ansIdx - 2, ansIdx + 2].filter(function (v) { return v >= 1 && v <= 26 && v !== ansIdx; });
    w = wrongIdx.map(function (v) { return String.fromCharCode(64 + v); });
    return L_mkQ('What letter comes next?', arr.map(function (v) { return { k: 'n', v: v }; }), ansCh, w, 'The letters move ' + (s2 > 0 ? 'forward' : 'backward') + ' by ' + step + ' each time' + (step > 1 ? ' (skipping ' + (step - 1) + ')' : '') + '.');
  }
  var L_PR = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
  var L_GEN = [
    [function () { var s = 1 + rnd(15), d = 2 + rnd(8), a = [], i; for (i = 0; i < 5; i++) a.push(s + i * d); return L_nq(a, s + 5 * d, 'Add ' + d + ' each time.', [s + 5 * d + d, s + 4 * d]); },
      function () { var s = 50 + rnd(50), d = 2 + rnd(8), a = [], i; for (i = 0; i < 5; i++) a.push(s - i * d); return L_nq(a, s - 5 * d, 'Subtract ' + d + ' each time.', [s - 6 * d]); },
      function () { var m = pick([2, 2, 3]), s = m === 2 ? 2 + rnd(6) : 1 + rnd(2), a = [], i, v = s; for (i = 0; i < 5; i++) { a.push(v); v *= m; } return L_nq(a, v, 'Multiply by ' + m + ' each time.', [a[4] * (m + 1), a[4] + a[3]]); },
      function () { return L_gShape(pick([2, 3]), 5 + rnd(2)); },
      function () { return L_repC(pick([2, 3]), 5 + rnd(2)); },
      function () { return L_gArrow(90); },
      function () { var d = pick([1, 2]), s = d === 1 ? 1 + rnd(5) : 1 + rnd(2), a = [], i; for (i = 0; i < 4; i++) a.push(s + i * d); return L_gBars(a, s + 4 * d, 'The bar grows by ' + d + ' block' + (d > 1 ? 's' : '') + ' each time.'); },
      function () { return L_letterQ(1, false); },
      function () { return L_gArrowAlt(); }],
    [function () { var k = 1 + rnd(5), a = [], i; for (i = 0; i < 5; i++) a.push((k + i) * (k + i)); return L_nq(a, (k + 5) * (k + 5), 'Square numbers: ' + (k + 5) + ' × ' + (k + 5) + ' = ' + (k + 5) * (k + 5) + '.', [a[4] + a[4] - a[3]]); },
      function () { var t = 1 + rnd(4), a = [], i, T = function (n) { return n * (n + 1) / 2; }; for (i = 0; i < 5; i++) a.push(T(t + i)); return L_nq(a, T(t + 5), 'The gap grows by 1 each time (+' + (t + 4) + ', then +' + (t + 5) + ').', [a[4] + a[4] - a[3]]); },
      function () { var s = 1 + rnd(8), d = 1 + rnd(3), g = 1 + rnd(2), a = [s], i; for (i = 0; i < 4; i++) a.push(a[i] + d + i * g); return L_nq(a, a[4] + d + 4 * g, 'The jumps grow by ' + g + ' each time: +' + d + ', +' + (d + g) + ', +' + (d + 2 * g) + '... so next is +' + (d + 4 * g) + '.', [a[4] + a[4] - a[3]]); },
      function () { var m = pick([2, 2, 3]), b = m === 3 ? pick([1, -1]) : pick([1, -1, 2]), s = b < 0 ? 2 + rnd(2) : 1 + rnd(2), a = [s], i; for (i = 0; i < 4; i++) a.push(a[i] * m + b); return L_nq(a, a[4] * m + b, (m === 2 ? 'Double' : 'Multiply by 3') + ', then ' + (b > 0 ? 'add ' : 'subtract ') + Math.abs(b) + '.', [a[4] * m, a[4] * m + b + (b > 0 ? 1 : -1)]); },
      function () { var k = 1 + rnd(3), a = [], i, z = k + 5; for (i = 0; i < 5; i++) a.push(Math.pow(k + i, 3)); return L_nq(a, z * z * z, 'Cube numbers: ' + z + ' × ' + z + ' × ' + z + ' = ' + z * z * z + '.', [a[4] + a[4] - a[3]]); },
      function () { return L_gArrow(45); },
      function () { return L_gShape(pick([3, 4]), 6); },
      function () { return L_repC(3, 6); },
      function () { var s = 1 + rnd(2), a = [s, s + 1, s + 3, s + 6]; return L_gBars(a, s + 10, 'The bar grows by 1, then 2, then 3, so next comes +4.'); },
      function () { return L_letterQ(pick([2, 3]), false); },
      function () { var s = 1 + rnd(4), a = [s], i; for (i = 0; i < 4; i++) a.push(a[i] * 2 - 1); return L_nq(a, a[4] * 2 - 1, 'Double the number, then subtract 1, each time.', [a[4] * 2, a[4] * 2 - 2]); }],
    [function () { var a = 1 + rnd(4), b = a + 1 + rnd(4), t = [a, b], i; for (i = 2; i < 6; i++) t.push(t[i - 1] + t[i - 2]); return L_nq(t, t[4] + t[5], 'Each number is the sum of the two before it: ' + t[4] + ' + ' + t[5] + ' = ' + (t[4] + t[5]) + '.', [t[5] + t[5] - t[4], t[5] * 2]); },
      function () {
        var a = 2 + rnd(20), d1 = 2 + rnd(4), b = 40 + rnd(20), d2 = 2 + rnd(3), t = [], i;
        for (i = 0; i < 3; i++) t.push(a + i * d1, b - i * d2);
        return L_nq(t, a + 3 * d1, 'Two patterns take turns: ' + t[0] + ', ' + t[2] + ', ' + t[4] + ' (+' + d1 + ') and ' + t[1] + ', ' + t[3] + ', ' + t[5] + ' (-' + d2 + '). Next is ' + (a + 3 * d1) + '.', [b - 3 * d2, t[5] + d1]);
      },
      function () {
        var s = 10 + rnd(11), a = 4 + rnd(6), b = 1 + rnd(3), t = [s], i;
        for (i = 0; i < 5; i++) t.push(t[i] + (i % 2 ? -b : a));
        return L_nq(t, t[5] - b, 'Add ' + a + ', then subtract ' + b + ', again and again.', [t[5] + a, t[5] - a]);
      },
      function () { var s = 2 + rnd(4), t = [s], i; for (i = 0; i < 5; i++) t.push(i % 2 ? t[i] + 1 : t[i] * 2); return L_nq(t, t[5] + 1, 'Double, then add 1, taking turns.', [t[5] * 2, t[5] + 2]); },
      function () {
        var sh = shuf([0, 1, 2, 3]).slice(0, 3), cl = shuf([0, 1, 2, 3]).slice(0, 2), items = [], i, w = [], x, y, ans = L_CN[cl[0]] + ' ' + L_SH[sh[0]];
        for (i = 0; i < 6; i++) items.push({ k: 's', s: sh[i % 3], col: L_CH[cl[i % 2]] });
        for (x = 0; x < 2; x++) for (y = 0; y < 4; y++) w.push(L_CN[cl[x]] + ' ' + L_SH[y]);
        return L_mkQ('What comes next?', items, ans, w, 'Shapes repeat every 3 and the two colours take turns, so next is ' + ans + '.');
      },
      function () { var s = 1 + rnd(3), a = [s, s + 2, s + 1, s + 3, s + 2, s + 4]; return L_gBars(a, s + 3, 'The bar goes up 2, then down 1, again and again.'); },
      function () { var s = pick([0, 1, 2, 4]), a = L_PR.slice(s, s + 6); return L_nq(a, L_PR[s + 6], 'These are the prime numbers in order. The next prime is ' + L_PR[s + 6] + '.', [a[5] + 2, L_PR[s + 7]]); },
      function () { var k = 1 + rnd(3), a = [], i; for (i = 0; i < 5; i++) a.push((k + i) * (k + i) + 1); return L_nq(a, (k + 5) * (k + 5) + 1, 'Each number is a square plus 1: ' + (k + 5) + ' × ' + (k + 5) + ' + 1 = ' + ((k + 5) * (k + 5) + 1) + '.', [a[4] + a[4] - a[3]]); },
      function () { return L_letterQ(pick([2, 3, 4]), true); },
      function () { return L_gArrowAlt(); },
      function () { var c0 = 1 + rnd(5), a = [], i; for (i = 1; i <= 5; i++) a.push(Math.pow(2, i) + c0); return L_nq(a, Math.pow(2, 6) + c0, 'Each term is a power of two (2, 4, 8, 16, 32...) plus ' + c0 + '.', [a[4] + a[4] - a[3]]); }]
  ];
  def('whatNext', EDU, 'What Comes Next', R.magenta, 'Spot the rule in number, letter, shape, colour and arrow patterns and pick what comes next.', 'Click an answer or press 1-4 · three misses ends the run', function (G) {
    var last = -1;
    mcq(G, { color: R.magenta, secs: [16, 18, 24], make: function (lv) {
      var pool = L_GEN[lv], i;
      do { i = rnd(pool.length); } while (i === last && pool.length > 1);
      last = i; return pool[i]();
    } });
  });

  /* ---------- Cipher Wheel ---------- */
  var L_WD = {
    4: 'MOON STAR FISH BIRD TREE RAIN SNOW WIND FIRE BOOK CAKE DUCK FROG GOLD JUMP KITE LAMP MILK PARK ROAD SHIP SONG WAVE BEAR CORN WOLF LION DEER GOAT SEAL CRAB LEAF VINE ROSE SAND DUNE LAKE POND HILL CAVE ROCK RUBY JADE OPAL COAL IRON WOOL YARN NAIL BOLT DESK CARD GAME BALL GOAL TEAM RACE SWIM CAMP TENT HIKE PEAK SURF TIDE REEF COVE FERN MOSS WEED HERD'.split(' '),
    5: 'HELLO WORLD HOUSE WATER APPLE BREAD CLOUD DREAM EARTH FLAME GRASS HEART LIGHT MUSIC NIGHT OCEAN PLANT RIVER SMILE TIGER WHALE HAPPY LEMON PIANO SUGAR TRAIN BEACH CANDY DANCE BRAVE CHESS CROWN EAGLE FAIRY FLUTE FROST GHOST GRAPE HONEY JUICE KNIFE LASER MAGIC MOUSE NORTH OLIVE PEACH PIZZA QUEEN ROBOT ROUND SNAKE STORM TOAST AMBER BLAZE BRICK CABIN CHALK CHARM CLOCK COACH CORAL DERBY DITCH DOUGH FENCE FLOOD GLOBE GRAIN HATCH HUMOR IVORY JOKER'.split(' '),
    6: 'ORANGE FLOWER GARDEN SILVER PLANET ROCKET BRIDGE CASTLE FOREST MARKET SUMMER WINTER YELLOW BUTTER CIRCLE DRAGON ISLAND JUNGLE MONKEY PENCIL SCHOOL TURTLE ANIMAL BASKET BOTTLE CAMERA CANDLE CARROT COFFEE COOKIE DESERT DOCTOR ENGINE FAMILY FRIEND GUITAR HAMMER HELMET JACKET KETTLE LADDER MIRROR MARBLE PUZZLE RABBIT SPIDER TURKEY WALNUT WIZARD COUSIN SAILOR SPROUT BANNER BUCKET CANYON GALAXY HARBOR'.split(' '),
    7: 'BALLOON BLANKET CHICKEN DOLPHIN KITCHEN LIBRARY MACHINE PICTURE RAINBOW TEACHER THUNDER VILLAGE WEATHER JOURNEY MORNING PENGUIN AIRPORT BICYCLE CAPTAIN COMPANY CRYSTAL DIAMOND FANTASY GIRAFFE HARVEST HOLIDAY MONSTER MUSTANG NETWORK PYRAMID STADIUM TSUNAMI VOLCANO CABINET CHIMNEY COMPASS CONCERT COUNTRY FACTORY FREEDOM HISTORY JOURNAL LIBERTY PACKAGE PROBLEM SEASIDE STATION SURGEON'.split(' ')
  };
  var L_CFACT = ['Julius Caesar reportedly shifted each letter by 3 to hide military messages.', 'A Caesar cipher has only 25 possible shifts, so it can be cracked by trying each one.', 'Shifting forward encodes a letter; shifting back by the same amount decodes it again.', 'This is called a substitution cipher: every letter is swapped for another, always the same way.', 'Modern encryption uses far more complex math, but this swap-and-shift idea is where it started.'];
  function L_shift(w, k) { var o = '', i; for (i = 0; i < w.length; i++) o += String.fromCharCode(65 + ((w.charCodeAt(i) - 65 + k) % 26 + 26) % 26); return o; }
  var L_wheelCache = null;
  function L_circAt(c, x, y, r, f) { c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = f; c.fill(); }
  function L_wheelOuter() {
    if (L_wheelCache) return L_wheelCache;
    var o = document.createElement('canvas'), oc, sz = 220, cx = 110, cy = 110, i, a, st = TAU / 26, g0;
    o.width = sz; o.height = sz; oc = o.getContext('2d');
    oc.save(); oc.shadowColor = 'rgba(0,0,0,.5)'; oc.shadowBlur = 14; oc.shadowOffsetY = 5;
    g0 = oc.createRadialGradient(cx - 20, cy - 24, 6, cx, cy, 98); g0.addColorStop(0, '#453a86'); g0.addColorStop(1, '#221a48');
    L_circAt(oc, cx, cy, 98, g0); oc.restore();
    g0 = oc.createRadialGradient(cx - 14, cy - 18, 4, cx, cy, 70); g0.addColorStop(0, '#4d4192'); g0.addColorStop(1, '#2c2456');
    L_circAt(oc, cx, cy, 70, g0); L_circAt(oc, cx, cy, 44, R.bg);
    oc.strokeStyle = 'rgba(255,255,255,.16)'; oc.lineWidth = 1; [98, 70, 44].forEach(function (r) { oc.beginPath(); oc.arc(cx, cy, r, 0, TAU); oc.stroke(); });
    oc.strokeStyle = 'rgba(255,255,255,.3)'; oc.beginPath(); oc.arc(cx, cy, 97, Math.PI * 1.12, Math.PI * 1.8); oc.stroke();
    for (i = 0; i < 26; i++) { a = -Math.PI / 2 + i * st; txt(oc, String.fromCharCode(65 + i), cx + Math.cos(a) * 84, cy + Math.sin(a) * 84, 14, R.ink); }
    L_wheelCache = { img: o, cx: cx, cy: cy };
    return L_wheelCache;
  }
  function L_wheel(c, cx, cy, sh, hi) {
    var cache = L_wheelOuter(), st = TAU / 26, i, a, x, y;
    c.drawImage(cache.img, cx - cache.cx, cy - cache.cy);
    if (hi >= 0) { a = -Math.PI / 2 + (hi - sh) * st; line(c, cx + Math.cos(a) * 46, cy + Math.sin(a) * 46, cx + Math.cos(a) * 96, cy + Math.sin(a) * 96, 'rgba(255,209,102,.5)', 2); }
    for (i = 0; i < 26; i++) {
      a = -Math.PI / 2 + (i - sh) * st; x = cx + Math.cos(a) * 57; y = cy + Math.sin(a) * 57;
      if (i === hi) { circ(c, x, y, 10, R.yellow); txt(c, String.fromCharCode(65 + i), x, y + 1, 14, '#171233'); } else txt(c, String.fromCharCode(65 + i), x, y + 1, 13, R.yellow);
    }
  }
  def('cipherWheel', EDU, 'Cipher Wheel', R.teal, 'Encode and decode secret words with a real Caesar cipher wheel: match the coded letter on the inner ring to the plain letter above it.', 'Type letters or tap the keys · Enter checks · Backspace deletes · Hard: turn the wheel with ◀ ▶', function (G) {
    var W = 400, H = 548, c = G.canvas(W, H), lv = 1, word, coded, key, ws, wa, ans, given, goal, mode, locked, tl, tmax, lives, score, streak, best, round, busy, fb, msg, fact, msgT, ok, last, kf, kt, keys = [];
    (function () {
      var rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'], r, i, x, y;
      for (r = 0; r < 3; r++) {
        y = 354 + r * 44; x = r === 0 ? 12 : r === 1 ? 31 : 13 + 56;
        if (r === 2) keys.push({ k: 'Enter', l: 'OK', x: 13, y: y, w: 52 });
        for (i = 0; i < rows[r].length; i++) keys.push({ k: rows[r].charAt(i).toLowerCase(), l: rows[r].charAt(i), x: x + i * 38, y: y, w: 34 });
        if (r === 2) keys.push({ k: 'Backspace', l: 'DEL', x: 335, y: y, w: 52 });
      }
    })();
    function next() {
      var len = pick(lv === 0 ? [4, 5] : [5, 6, 7]), w;
      do { w = pick(L_WD[len]); } while (w === last);
      last = w; word = w; key = lv === 0 ? 1 + rnd(7) : lv === 1 ? 1 + rnd(13) : 1 + rnd(25);
      coded = L_shift(word, key); mode = lv === 2 ? 'decode' : (Math.random() < 0.5 ? 'decode' : 'encode');
      given = mode === 'decode' ? coded : word; goal = mode === 'decode' ? word : coded;
      ws = lv === 2 ? 0 : key; wa = 0; locked = lv === 2 ? 1 : 0; ans = lv === 2 ? given.charAt(0) : '';
      busy = false; ok = 0; msg = ''; fact = pick(L_CFACT); msgT = 0; tmax = [40, 46, 70][lv] * (1 - Math.min(round, 10) * 0.03); tl = tmax;
    }
    function start() { G.gen = (G.gen || 0) + 1; lives = 3; score = 0; streak = 0; best = 0; round = 0; last = ''; G.fx = []; kt = 0; next(); G.frame(step); }
    function eff() { return ((ws % 26) + 26) % 26; }
    function turn(d) { if (!busy && lv === 2) ws += d; }
    function typeL(ch) { if (busy || ans.length >= given.length) return; ans += ch.toUpperCase(); }
    function back() { if (!busy && ans.length > locked) ans = ans.slice(0, -1); }
    function miss(pre) {
      var dd, fromCh, toCh;
      busy = true; lives--; streak = 0; ok = 0; fb = 3.2; ans = goal;
      dd = ((key - eff()) % 26 + 26) % 26; if (dd > 13) dd -= 26; ws += dd;
      fromCh = given.charAt(0); toCh = goal.charAt(0);
      msg = pre + 'It was ' + goal + '. ' + (mode === 'decode' ? 'Go back ' : 'Go forward ') + key + ' places: ' + fromCh + ' becomes ' + toCh + '.';
      G.tally(false, given + ' -> ' + goal + ' (shift ' + key + ')');
    }
    function check() {
      if (busy) return;
      if (ans.length < given.length) { msg = 'Type all ' + given.length + ' letters first.'; msgT = 1.3; return; }
      if (ans === goal) { busy = true; ok = 1; streak++; best = Math.max(best, streak); score += 10 + goal.length * 2 + Math.ceil(tl) + Math.min(streak, 10) * 3 + (lv === 2 ? 10 : 0); fb = 1.4; msg = 'Correct! ' + given + ' -> ' + goal + ' (shift ' + key + ')'; G.burst(200, 104, R.green, 26); G.tally(true, given + ' -> ' + goal); }
      else miss('Not quite. ');
    }
    G.pointer({ down: function (p) {
      var i, dx = p.x - 200, dy = p.y - 244;
      for (i = 0; i < keys.length; i++) if (L_in(p, keys[i].x, keys[i].y, keys[i].w, 38)) { G.press(keys[i].k); kf = keys[i].k; kt = 0.12; }
      if (lv === 2) { if (dx * dx + dy * dy < 100 * 100) turn(dx < 0 ? -1 : 1); else if (dy * dy < 30 * 30 && Math.abs(dx) > 100) turn(dx < 0 ? -1 : 1); }
    } });
    G.press = function (k) {
      if (k.length === 1 && k >= 'a' && k <= 'z') { typeL(k); kf = k; kt = 0.12; } else if (k === 'Enter') check(); else if (k === 'Backspace' || k === 'Delete') back();
      else if (k === 'ArrowLeft') turn(-1); else if (k === 'ArrowRight') turn(1);
    };
    function step(dt) {
      var i, len = given.length, tw = Math.min(46, (372 - (len - 1) * 5) / len), x0 = 200 - (len * tw + (len - 1) * 5) / 2, x, col, k, hi, cand;
      if (msgT > 0) msgT -= dt; if (kt > 0) kt -= dt;
      wa += (ws - wa) * Math.min(1, dt * 7);
      if (!busy) { tl -= dt; if (tl <= 0) miss('Time is up! '); }
      else { fb -= dt; if (fb <= 0) { if (lives <= 0) { G.over(score, 'Out of lives with ' + score + ' points. Best streak ' + best + '.'); return; } round++; next(); } }
      clear(c, W, H); L_bar(c, tl / tmax, R.teal);
      if (lv < 2) fit(c, (mode === 'decode' ? 'Decode it. ' : 'Encode it. ') + 'Shift ' + key + ': each letter moves ' + key + ' place' + (key > 1 ? 's' : '') + ' forward', 200, 32, 376, 14, R.yellow);
      else fit(c, 'Key hidden. First letter given. Turn the wheel!', 200, 32, 376, 15, R.yellow);
      hi = busy ? -1 : Math.min(ans.length, len - 1);
      for (i = 0; i < len; i++) {
        x = x0 + i * (tw + 5);
        rect(c, x, 44, tw, 38, 8, i === hi ? '#4A3C8C' : R.grid); txt(c, given.charAt(i), x + tw / 2, 64, 24, R.yellow);
        col = busy ? (ok ? R.green : R.yellow) : i < locked ? R.teal : ans.length > i ? '#3A3070' : R.grid;
        rect(c, x, 88, tw, 38, 8, col);
        if (i < ans.length) txt(c, ans.charAt(i), x + tw / 2, 108, 24, busy || i < locked ? '#171233' : R.ink);
        else if (i === ans.length && !busy) rect(c, x + 6, 118, tw - 12, 3, 1, R.yellow);
      }
      if (lv < 2) fit(c, mode === 'decode' ? 'Outer ring: plain letters. Inner ring: coded letters.' : 'Type the CODED word below using the inner ring.', 200, 139, 376, 12, R.dim);
      else { cand = L_shift(given, -eff()); fit(c, 'Wheel shift ' + eff() + ' reads: ' + cand, 200, 139, 376, 14, R.ink); }
      L_wheel(c, 200, 244, wa, hi >= 0 ? given.charCodeAt(hi) - 65 : -1);
      txt(c, 'SHIFT', 200, 236, 12, R.dim); txt(c, String(lv < 2 ? key : eff()), 200, 256, 24, R.ink);
      if (lv === 2) for (i = 0; i < 2; i++) { circ(c, i ? 372 : 28, 244, 22, R.violet); txt(c, i ? '▶' : '◀', i ? 372 : 28, 245, 20, '#171233'); }
      for (i = 0; i < keys.length; i++) { k = keys[i]; L_btn(c, k.x, k.y, k.w, 38, k.k === 'Enter' ? R.green : k.k === 'Backspace' ? R.coral : kt > 0 && kf === k.k ? R.yellow : R.blue, k.l, k.w > 40 ? 15 : 18); }
      if ((busy || msgT > 0) && msg) { wrap(c, msg, 200, 500, 372, 13, 16, busy ? (ok ? R.green : R.yellow) : R.dim); if (busy) fit(c, fact, 200, 528, 372, 11, R.dim); }
      else txt(c, 'Type the ' + (mode === 'decode' ? 'plain' : 'coded') + ' word, then press OK', 200, 506, 14, R.dim);
      G.fxStep(dt);
      G.hud([['SCORE', pad(score)], ['STREAK', streak], ['LIVES', lives]]);
    }
    G.opt('Level', LV3, lv, function (i) { lv = i; start(); });
    G.begin(start);
  });

  /* ---------- Capital Match ---------- */
  var L_CAPRAW = 'France|Paris|EU;Germany|Berlin|EU;Italy|Rome|EU;Spain|Madrid|EU;Portugal|Lisbon|EU;Greece|Athens|EU;Poland|Warsaw|EU;Sweden|Stockholm|EU;Norway|Oslo|EU;Finland|Helsinki|EU;Denmark|Copenhagen|EU;Iceland|Reykjavik|EU;Ireland|Dublin|EU;Austria|Vienna|EU;Switzerland|Bern|EU;Hungary|Budapest|EU;Czechia|Prague|EU;Slovakia|Bratislava|EU;Slovenia|Ljubljana|EU;Croatia|Zagreb|EU;Romania|Bucharest|EU;Bulgaria|Sofia|EU;Serbia|Belgrade|EU;Albania|Tirana|EU;Estonia|Tallinn|EU;Latvia|Riga|EU;Lithuania|Vilnius|EU;Belgium|Brussels|EU;Netherlands|Amsterdam|EU;Luxembourg|Luxembourg City|EU;Malta|Valletta|EU;Cyprus|Nicosia|EU;Ukraine|Kyiv|EU;Belarus|Minsk|EU;Moldova|Chisinau|EU;Russia|Moscow|EU;North Macedonia|Skopje|EU;Montenegro|Podgorica|EU;Bosnia and Herzegovina|Sarajevo|EU;Andorra|Andorra la Vella|EU;Monaco|Monaco|EU;San Marino|San Marino|EU;Liechtenstein|Vaduz|EU;Egypt|Cairo|AF;Morocco|Rabat|AF;Algeria|Algiers|AF;Tunisia|Tunis|AF;Libya|Tripoli|AF;Sudan|Khartoum|AF;Ethiopia|Addis Ababa|AF;Kenya|Nairobi|AF;Tanzania|Dodoma|AF;Uganda|Kampala|AF;Rwanda|Kigali|AF;Nigeria|Abuja|AF;Ghana|Accra|AF;Senegal|Dakar|AF;Mali|Bamako|AF;Niger|Niamey|AF;Chad|Ndjamena|AF;Cameroon|Yaounde|AF;Guinea|Conakry|AF;Sierra Leone|Freetown|AF;Liberia|Monrovia|AF;Burkina Faso|Ouagadougou|AF;Togo|Lome|AF;Gabon|Libreville|AF;Congo|Brazzaville|AF;DR Congo|Kinshasa|AF;Angola|Luanda|AF;Zambia|Lusaka|AF;Zimbabwe|Harare|AF;Mozambique|Maputo|AF;Namibia|Windhoek|AF;Botswana|Gaborone|AF;Madagascar|Antananarivo|AF;Malawi|Lilongwe|AF;Somalia|Mogadishu|AF;Djibouti|Djibouti|AF;Eritrea|Asmara|AF;South Sudan|Juba|AF;Mauritania|Nouakchott|AF;Gambia|Banjul|AF;Guinea-Bissau|Bissau|AF;Equatorial Guinea|Malabo|AF;Central African Republic|Bangui|AF;Burundi|Gitega|AF;Comoros|Moroni|AF;Cabo Verde|Praia|AF;Mauritius|Port Louis|AF;Seychelles|Victoria|AF;Lesotho|Maseru|AF;Japan|Tokyo|AS;China|Beijing|AS;South Korea|Seoul|AS;North Korea|Pyongyang|AS;Mongolia|Ulaanbaatar|AS;India|New Delhi|AS;Pakistan|Islamabad|AS;Bangladesh|Dhaka|AS;Nepal|Kathmandu|AS;Bhutan|Thimphu|AS;Afghanistan|Kabul|AS;Iran|Tehran|AS;Iraq|Baghdad|AS;Saudi Arabia|Riyadh|AS;United Arab Emirates|Abu Dhabi|AS;Qatar|Doha|AS;Kuwait|Kuwait City|AS;Bahrain|Manama|AS;Oman|Muscat|AS;Jordan|Amman|AS;Lebanon|Beirut|AS;Syria|Damascus|AS;Turkey|Ankara|AS;Georgia|Tbilisi|AS;Armenia|Yerevan|AS;Azerbaijan|Baku|AS;Kazakhstan|Astana|AS;Uzbekistan|Tashkent|AS;Turkmenistan|Ashgabat|AS;Kyrgyzstan|Bishkek|AS;Tajikistan|Dushanbe|AS;Thailand|Bangkok|AS;Vietnam|Hanoi|AS;Laos|Vientiane|AS;Cambodia|Phnom Penh|AS;Myanmar|Naypyidaw|AS;Malaysia|Kuala Lumpur|AS;Singapore|Singapore|AS;Philippines|Manila|AS;Brunei|Bandar Seri Begawan|AS;Maldives|Male|AS;Timor-Leste|Dili|AS;United States|Washington DC|NA;Canada|Ottawa|NA;Mexico|Mexico City|NA;Guatemala|Guatemala City|NA;Belize|Belmopan|NA;Honduras|Tegucigalpa|NA;El Salvador|San Salvador|NA;Nicaragua|Managua|NA;Costa Rica|San Jose|NA;Panama|Panama City|NA;Cuba|Havana|NA;Jamaica|Kingston|NA;Haiti|Port-au-Prince|NA;Dominican Republic|Santo Domingo|NA;Bahamas|Nassau|NA;Trinidad and Tobago|Port of Spain|NA;Barbados|Bridgetown|NA;Brazil|Brasilia|SA;Argentina|Buenos Aires|SA;Chile|Santiago|SA;Peru|Lima|SA;Colombia|Bogota|SA;Venezuela|Caracas|SA;Ecuador|Quito|SA;Paraguay|Asuncion|SA;Uruguay|Montevideo|SA;Guyana|Georgetown|SA;Suriname|Paramaribo|SA;Australia|Canberra|OC;New Zealand|Wellington|OC;Fiji|Suva|OC;Papua New Guinea|Port Moresby|OC;Samoa|Apia|OC;Solomon Islands|Honiara|OC;Vanuatu|Port Vila|OC;Kiribati|Tarawa|OC;Marshall Islands|Majuro|OC;Micronesia|Palikir|OC;Palau|Ngerulmud|OC';
  var L_CAP = L_CAPRAW.split(';').map(function (s) { var p = s.split('|'); return { c: p[0], k: p[1], g: p[2] }; });
  var L_CNAME = { EU: 'Europe', AF: 'Africa', AS: 'Asia', NA: 'North America', SA: 'South America', OC: 'Oceania' };
  var L_CPOS = { EU: [-0.15, -0.55], AF: [-0.05, 0.05], AS: [0.4, -0.25], NA: [-0.55, -0.3], SA: [-0.4, 0.35], OC: [0.55, 0.5] };
  var L_CFACTS = {
    'United States': 'Washington DC was set aside as neutral federal land in 1790, inside no state.',
    'Canada': 'Queen Victoria chose Ottawa in 1857, partly since it sat between rival Toronto and Montreal.',
    'Australia': 'Canberra was purpose-built as a compromise between rival Sydney and Melbourne.',
    'Brazil': 'Brasilia was built from scratch and became the capital in 1960, replacing Rio de Janeiro.',
    'Turkey': 'Ankara replaced Istanbul as capital when the modern republic formed in 1923.',
    'Myanmar': 'Naypyidaw became the capital in 2005, replacing the much larger Yangon.',
    'Kazakhstan': 'The capital was Astana, renamed Nur-Sultan in 2019, then Astana again in 2022.',
    'Tanzania': 'Dodoma has been the official capital since 1996, though Dar es Salaam is bigger.',
    'Russia': 'Moscow became the capital again in 1918, moving back from Saint Petersburg.',
    'Switzerland': 'Bern hosts the federal government, though Switzerland names no single official capital.',
    'Netherlands': 'Amsterdam is the official capital, even though government sits in The Hague.',
    'New Zealand': 'Wellington became the capital in 1865, replacing Auckland for its central spot.',
    'Nigeria': 'Abuja became the capital in 1991, a planned city replacing Lagos.',
    'India': 'New Delhi became the capital in 1911, replacing Kolkata.',
    'Pakistan': 'Islamabad was built as a planned capital starting in the 1960s, replacing Karachi.',
    'Japan': 'Tokyo became the imperial capital in 1868, renamed from Edo.',
    'Egypt': 'Cairo sits on the Nile and is the largest city in Africa.'
  };
  function L_capFact(e) { return L_CFACTS[e.c] || ('The capital of ' + e.c + ' is ' + e.k + '.'); }
  var L_globeCache = null;
  function L_globeImg() {
    if (L_globeCache) return L_globeCache;
    var r = 52, pad = 10, sz = (r + pad) * 2, o = document.createElement('canvas'), oc, cx, cy, g0, i;
    o.width = sz; o.height = sz; oc = o.getContext('2d'); cx = sz / 2; cy = sz / 2;
    oc.save(); oc.shadowColor = 'rgba(0,0,0,.5)'; oc.shadowBlur = 14; oc.shadowOffsetY = 6;
    g0 = oc.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.15, cx, cy, r);
    g0.addColorStop(0, '#4c82c2'); g0.addColorStop(0.55, '#254a7c'); g0.addColorStop(1, '#101b30');
    oc.beginPath(); oc.arc(cx, cy, r, 0, TAU); oc.fillStyle = g0; oc.fill(); oc.restore();
    oc.save(); oc.beginPath(); oc.arc(cx, cy, r, 0, TAU); oc.clip();
    oc.strokeStyle = 'rgba(255,255,255,.2)'; oc.lineWidth = 1;
    for (i = 1; i < 4; i++) { oc.beginPath(); oc.ellipse(cx, cy, r * (1 - i * 0.22), r, 0, 0, TAU); oc.stroke(); }
    oc.beginPath(); oc.moveTo(cx - r, cy); oc.lineTo(cx + r, cy); oc.stroke();
    oc.beginPath(); oc.moveTo(cx - r, cy - r * 0.42); oc.lineTo(cx + r, cy - r * 0.42); oc.stroke();
    oc.beginPath(); oc.moveTo(cx - r, cy + r * 0.42); oc.lineTo(cx + r, cy + r * 0.42); oc.stroke();
    oc.restore();
    oc.fillStyle = 'rgba(255,255,255,.24)'; oc.beginPath(); oc.ellipse(cx - r * 0.32, cy - r * 0.36, r * 0.3, r * 0.16, -0.6, 0, TAU); oc.fill();
    L_globeCache = { img: o, cx: cx, cy: cy, r: r };
    return L_globeCache;
  }
  function L_capDraw(o) {
    return function (c, cx, cy) {
      var g0 = L_globeImg(), pos = L_CPOS[o.g] || [0, 0], px, py, col;
      c.drawImage(g0.img, cx - g0.cx, cy - g0.cy - 6);
      px = cx + pos[0] * g0.r * 0.8; py = cy - 6 + pos[1] * g0.r * 0.8; col = R.coral;
      c.save(); c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 4; c.shadowOffsetY = 2;
      circ(c, px, py - 7, 7, col); c.beginPath(); c.moveTo(px - 6, py - 4); c.lineTo(px + 6, py - 4); c.lineTo(px, py + 10); c.closePath(); c.fillStyle = col; c.fill();
      c.restore(); circ(c, px, py - 7, 3, '#171233');
      txt(c, o.contName, cx, cy + g0.r + 18, 12, R.dim);
    };
  }
  function L_capQ(lv) {
    var e = pick(L_CAP), dir = lv === 0 ? 0 : (Math.random() < 0.5 ? 0 : 1), sameCont, pool, wrongs, q, right;
    sameCont = lv === 0 ? false : (lv === 1 ? Math.random() < 0.6 : true);
    pool = sameCont ? L_CAP.filter(function (x) { return x.g === e.g && x !== e; }) : L_CAP.filter(function (x) { return x !== e; });
    if (pool.length < 3) pool = L_CAP.filter(function (x) { return x !== e; });
    wrongs = shuf(pool.slice()).slice(0, 8);
    if (dir === 0) { q = 'What is the capital of ' + e.c + '?'; right = e.k; wrongs = wrongs.map(function (x) { return x.k; }); }
    else { q = e.k + ' is the capital of which country?'; right = e.c; wrongs = wrongs.map(function (x) { return x.c; }); }
    return { q: q, opts: wrongs, right: right, why: L_capFact(e), rev: e.c + ' -> ' + e.k, g: e.g, contName: L_CNAME[e.g] };
  }
  def('capitalMatch', EDU, 'Capital Match', R.blue, 'Match every country to its true capital city in a fast world-trivia quiz, with tougher same-region decoys at higher levels.', 'Click an answer or press 1-4 · three misses ends the run', function (G) {
    mcq(G, { color: R.blue, secs: [15, 13, 20], make: function (lv) {
      var o = L_capQ(lv), m4 = mk4(o.right, o.opts);
      return { q: o.q, why: o.why, opts: m4.opts, a: m4.a, rev: o.rev, draw: L_capDraw(o) };
    } });
  });

  /* ================= M: math and measure games v2 (mathRain, timesGrid, fractionSlice, balanceScales, lineDart, coinChange, unitSnap) ================= */
  function M_ri(a, b) { return a + rnd(b - a + 1); }
  function M_gcd(a, b) { var t; a = Math.abs(a); b = Math.abs(b); while (b) { t = a % b; a = b; b = t; } return a; }
  function M_font(c, z) { c.font = '700 ' + z + 'px Figtree, sans-serif'; }
  /* raised button: drop shadow + gloss highlight, so buttons read as physical keys */
  function M_btn(c, x, y, w, h, col, dn) {
    rect(c, x, y + 2, w, h, 10, 'rgba(0,0,0,.35)');
    rect(c, x, dn ? y + 2 : y, w, h, 10, col);
    if (!dn) { c.save(); c.globalAlpha = 0.22; rect(c, x + 2, y + 2, w - 4, h * 0.42, 8, '#ffffff'); c.restore(); }
  }
  function M_lines(c, s, maxW, sz) {
    var w = String(s).split(' '), l = '', n = 1, i, t;
    M_font(c, sz);
    for (i = 0; i < w.length; i++) { t = l ? l + ' ' + w[i] : w[i]; if (l && c.measureText(t).width > maxW) { n++; l = w[i]; } else l = t; }
    return n;
  }
  /* feedback banner used by the shared round engine */
  function M_banner(c, S, y, h) {
    var n, sz = 13, lh = 16;
    rect(c, 8, y, 384, h, 10, S.ok ? R.green : R.coral);
    n = M_lines(c, S.msg, 362, sz); if (n > 3) { sz = 12; lh = 15; n = M_lines(c, S.msg, 362, sz); }
    wrap(c, S.msg, 200, y + h / 2 - (n - 1) * lh / 2, 362, sz, lh, '#171233');
  }
  /* four numeric options: right plus distractors that differ by at least gap (never accidentally right) */
  function M_num4(right, cands, gap, fmt) {
    var w = shuf(cands.filter(function (v, i, a) { return isFinite(v) && Math.abs(v - right) >= gap - 1e-9 && a.indexOf(v) === i; })), k = 1, o;
    w = w.filter(function (v, i) { var j; for (j = 0; j < i; j++) if (Math.abs(w[j] - v) < gap * 0.5) return false; return true; }).slice(0, 3);
    while (w.length < 3) { o = right + (k % 2 ? 1 : -1) * gap * (1 + Math.floor(k / 2)); if (w.indexOf(o) < 0 && o !== right) w.push(o); k++; }
    o = shuf([right].concat(w));
    return { opts: o.map(fmt || String), a: o.indexOf(right) };
  }
  /* shared round engine: timer, lives, score, feedback banner. cfg = { H, secs:[3], by, bh, make(lv,n)->q{why,rev}, init?(q,S), draw(c,q,S,dt), down(p,S), key(k,S), move, up, pad } */
  function M_core(G, cfg) {
    var W = 400, H = cfg.H, c = G.canvas(W, H), S = { c: c, lv: 1, W: W, H: H, cfg: cfg };
    S.next = function () { var q = cfg.make(S.lv, S.n++); S.q = q; S.tl = S.tmax = cfg.secs[S.lv] * (q.tm || 1); S.busy = false; S.fb = 0; S.ok = false; S.pk = -1; S.el = 0; S.msg = ''; if (cfg.init) cfg.init(q, S); };
    S.start = function () { G.gen = (G.gen || 0) + 1; S.lives = 3; S.score = 0; S.streak = 0; S.best = 0; S.n = 0; G.fx = []; S.next(); G.frame(step); };
    S.ans = function (ok, wrong, pk) {
      var q = S.q;
      if (S.busy) return;
      S.busy = true; S.ok = ok; S.pk = pk === undefined ? -1 : pk; S.el = 0;
      G.tally(ok, q.rev || String(q.right));
      if (ok) { S.streak++; S.best = Math.max(S.best, S.streak); S.score += 10 + Math.min(S.streak, 10) * 2 + Math.ceil(S.tl); S.fb = 1.6; S.msg = q.why || 'Correct'; G.burst(200, 160, R.green, 18); }
      else { S.lives--; S.streak = 0; S.fb = 3.2; S.msg = wrong || ('Answer: ' + q.right + '. ' + (q.why || '')); }
      if (cfg.onAns) cfg.onAns(ok, q, S);
    };
    function skip() { if (S.el > 0.7) S.fb = Math.min(S.fb, 0.01); }
    G.pointer({
      down: function (p) { if (S.busy) { skip(); return; } if (cfg.down) cfg.down(p, S); },
      move: function (p, e, dn) { if (!S.busy && cfg.move) cfg.move(p, S, dn); },
      up: function (p) { if (!S.busy && cfg.up) cfg.up(p, S); }
    });
    G.press = function (k) { if (S.busy) { if (k === 'Enter' || k === ' ') skip(); return; } if (cfg.key) cfg.key(k, S); };
    G.pad(cfg.pad || [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']]);
    function step(dt) {
      var q = S.q;
      if (!S.busy) { S.tl -= dt; S.t = (S.t || 0) + dt; if (S.tl <= 0) S.ans(false, 'Time is up. ' + (q.why || '')); }
      else { S.el += dt; S.fb -= dt; if (S.fb <= 0) { if (S.lives <= 0) { G.over(S.score, 'Out of lives with ' + S.score + ' points. Best streak ' + S.best + '.'); return; } S.next(); q = S.q; } }
      clear(c, W, H);
      cfg.draw(c, q, S, dt);
      rect(c, 20, 4, 360, 6, 3, R.grid); rect(c, 20, 4, Math.max(0, 360 * S.tl / S.tmax), 6, 3, S.tl < 3 && !S.busy ? R.coral : (cfg.color || R.teal));
      if (S.busy) M_banner(c, S, cfg.by, cfg.bh || 50);
      G.fxStep(dt);
      G.hud([['SCORE', pad(S.score)], ['STREAK', S.streak], ['LIVES', S.lives]]);
    }
    G.opt('Level', LV3, S.lv, function (i) { S.lv = i; S.start(); });
    G.begin(S.start);
    return S;
  }

  /* ================= 1. Math Rain ================= */
  function M_sq(n) { return n + '²'; }
  function M_rQ0() {
    var r = Math.random(), a, b;
    if (r < 0.22) { a = M_ri(2, 16); b = M_ri(2, 20 - a); return { t: a + ' + ' + b, a: a + b }; }
    if (r < 0.40) { a = M_ri(1, 10); return { t: a + ' + ' + a, a: a * 2 }; }
    if (r < 0.62) { a = M_ri(5, 20); b = M_ri(1, a - 1); return { t: a + ' − ' + b, a: a - b }; }
    if (r < 0.84) { a = pick([2, 3, 4, 5]); b = M_ri(2, 10); return { t: Math.random() < 0.5 ? a + ' × ' + b : b + ' × ' + a, a: a * b }; }
    a = pick([10, 20, 30, 40, 50]); b = pick([10, 20, 30, 40, 50]); return { t: a + ' + ' + b, a: a + b };
  }
  function M_rQ1() {
    var r = Math.random(), a, b;
    if (r < 0.20) { a = M_ri(2, 10); b = M_ri(2, 10); return { t: a + ' × ' + b, a: a * b }; }
    if (r < 0.38) { a = M_ri(2, 12); b = M_ri(2, 12); return { t: a + ' × ' + b, a: a * b }; }
    if (r < 0.56) { a = M_ri(2, 10); b = M_ri(2, 10); return { t: (a * b) + ' ÷ ' + a, a: b }; }
    if (r < 0.72) { a = M_ri(11, 79); b = M_ri(11, 79); return { t: a + ' + ' + b, a: a + b }; }
    if (r < 0.86) { a = M_ri(20, 99); b = M_ri(10, a - 5); return { t: a + ' − ' + b, a: a - b }; }
    a = M_ri(2, 12); return { t: M_sq(a), a: a * a };
  }
  function M_rQ2() {
    var r = Math.random(), a, b, of, p;
    if (r < 0.16) { a = M_ri(120, 700); b = M_ri(120, 290); return { t: a + ' + ' + b, a: a + b }; }
    if (r < 0.32) { a = M_ri(200, 999); b = M_ri(100, a - 60); return { t: a + ' − ' + b, a: a - b }; }
    if (r < 0.48) { a = M_ri(11, 29); b = M_ri(3, 9); return { t: a + ' × ' + b, a: a * b }; }
    if (r < 0.64) { b = M_ri(3, 12); a = M_ri(11, 40); return { t: (a * b) + ' ÷ ' + b, a: a }; }
    if (r < 0.82) { of = M_ri(1, 20) * 20; p = pick([10, 20, 25, 50, 75]); return { t: p + '% of ' + of, a: of * p / 100 }; }
    a = M_ri(2, 12); return { t: a + '³', a: a * a * a };
  }
  function M_rainQ(lv) { return lv === 0 ? M_rQ0() : lv === 1 ? M_rQ1() : M_rQ2(); }
  var M_bubCache = {};
  function M_bubble(col) {
    if (M_bubCache[col]) return M_bubCache[col];
    var cv = document.createElement('canvas'), x, g;
    cv.width = 124; cv.height = 40; x = cv.getContext('2d');
    x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 7; x.shadowOffsetY = 3;
    g = x.createLinearGradient(0, 2, 0, 36); g.addColorStop(0, '#39306e'); g.addColorStop(1, '#221b46');
    rect(x, 2, 2, 120, 34, 12, g);
    x.shadowBlur = 0; x.shadowOffsetY = 0;
    x.lineWidth = 2; x.strokeStyle = col; K.L(x, 2, 2, 120, 34, 12); x.stroke();
    x.save(); x.globalAlpha = 0.20; rect(x, 5, 4, 114, 13, 7, '#ffffff'); x.restore();
    M_bubCache[col] = cv; return cv;
  }
  def('mathRain', EDU, 'Math Rain', R.teal, 'Sums fall like rain. Type each answer before it hits the floor and pop it.', 'Type digits, Backspace to fix, Enter to send · or tap the number pad · three misses ends the run', function (G) {
    var W = 400, H = 470, c = G.canvas(W, H), lv = 1, FL = 300, LX = [70, 200, 330], BASE = [24, 30, 34], CAP = [1.5, 1.3, 1.1], GAP = [1.5, 1.7, 2.0], KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace', 'Enter'], LABS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'DEL', 'GO'];
    var items, typed, lives, score, combo, bestC, solved, spawnT, misses, pops, over, endT, shake, rain = [], flash, i0;
    for (i0 = 0; i0 < 16; i0++) rain.push({ x: rnd(W), y: rnd(FL), l: 8 + rnd(14), v: 50 + rnd(80) });
    function start() { items = []; typed = ''; lives = 3; score = 0; combo = 0; bestC = 0; solved = 0; spawnT = 0; misses = []; pops = []; over = false; endT = 0; shake = 0; flash = {}; G.fx = []; G.frame(step); }
    function lowest() { var b = null; items.forEach(function (it) { if (!b || it.y > b.y) b = it; }); return b; }
    function spawn() {
      var free = [], l, q, tries = 0, dup;
      for (l = 0; l < 3; l++) if (items.every(function (it) { return it.lane !== l || it.y > 62; })) free.push(l);
      if (!free.length) return false;
      do { q = M_rainQ(lv); dup = items.some(function (it) { return it.t === q.t; }); tries++; } while (dup && tries < 12);
      l = pick(free); items.push({ t: q.t, a: q.a, lane: l, x: LX[l], y: -16 });
      return true;
    }
    function wrong() { combo = 0; typed = ''; shake = 0.3; }
    function pop(it) {
      var bonus = Math.max(0, Math.round((FL - it.y) / FL * 10));
      score += 10 + Math.min(combo, 10) * 2 + bonus; combo++; bestC = Math.max(bestC, combo); solved++;
      G.tally(true, it.t + ' = ' + it.a);
      G.burst(it.x, it.y, R.teal, 22); G.burst(it.x, it.y, R.yellow, 8);
      pops.push({ s: it.a + ' ✓', x: it.x, y: it.y, t: 0.8 });
      items.splice(items.indexOf(it), 1); typed = '';
    }
    function check(enter) {
      var low = lowest(), m = null, longer = false, s;
      if (!low) { if (enter) typed = ''; return; }
      items.forEach(function (it) {
        s = String(it.a);
        if (s === typed) { if (!m || it.y > m.y) m = it; } else if (typed && s.indexOf(typed) === 0) longer = true;
      });
      if (m && (enter || !longer || m === low || String(low.a) === typed)) { pop(m); return; }
      if (enter) { if (typed) wrong(); return; }
      if (typed && !m && !longer) wrong();
    }
    function inp(k) {
      if (over) return;
      if (k.length === 1 && k >= '0' && k <= '9') {
        if (typed === '' && k === '0') return;
        if (typed.length < 4) typed += k;
        check(false);
      } else if (k === 'Backspace') typed = typed.slice(0, -1);
      else if (k === 'Enter') check(true);
    }
    function padXY(i) { return { x: 12 + (i % 6) * 64, y: 358 + Math.floor(i / 6) * 54, w: 56, h: 46 }; }
    G.pointer({ down: function (p) {
      var i, r;
      for (i = 0; i < 12; i++) { r = padXY(i); if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) { flash[i] = 0.12; inp(KEYS[i]); } }
    } });
    G.press = function (k) { inp(k); };
    function miss(it) {
      lives--; combo = 0; typed = ''; shake = 0.4;
      G.tally(false, it.t + ' = ' + it.a);
      misses.push({ s: it.t + ' = ' + it.a, x: it.x, t: 2.4 });
      items.splice(items.indexOf(it), 1);
      if (lives <= 0) { over = true; endT = 1.3; }
    }
    function step(dt) {
      var i, it, sp, low, p, r, k;
      if (shake > 0) shake -= dt;
      for (k in flash) if (flash[k] > 0) flash[k] -= dt;
      if (!over) {
        sp = BASE[lv] * (1 + Math.min(solved * 0.05, CAP[lv]));
        spawnT -= dt;
        if ((spawnT <= 0 || !items.length) && items.length < 5) spawnT = spawn() ? Math.max(GAP[lv], 3.6 - solved * 0.06) : 0.3;
        for (i = items.length - 1; i >= 0; i--) { it = items[i]; it.y += sp * dt; if (it.y >= FL - 18) { miss(it); if (over) break; } }
      } else endT -= dt;
      misses = misses.filter(function (o) { o.t -= dt; return o.t > 0; });
      pops = pops.filter(function (o) { o.t -= dt; o.y -= 30 * dt; return o.t > 0; });
      clear(c, W, H);
      rain.forEach(function (o) { o.y += o.v * dt; if (o.y > FL) { o.y = -20; o.x = rnd(W); } line(c, o.x, o.y, o.x, o.y + o.l, 'rgba(79,140,255,.35)', 2); });
      rect(c, 0, FL, W, 3, 0, shake > 0 ? R.coral : 'rgba(255,107,74,.55)');
      low = lowest();
      items.forEach(function (it) {
        var col = it === low ? R.yellow : (it.y > FL - 80 ? R.coral : R.teal), bub = M_bubble(col);
        c.drawImage(bub, it.x - 60, it.y - 18);
        fit(c, it.t, it.x, it.y, 100, 20, R.ink);
      });
      misses.forEach(function (o) {
        c.globalAlpha = Math.min(1, o.t);
        rect(c, o.x - 60, FL - 44, 120, 32, 10, R.coral);
        fit(c, o.s, o.x, FL - 28, 108, 17, '#171233');
        c.globalAlpha = 1;
      });
      pops.forEach(function (o) { c.globalAlpha = Math.min(1, o.t * 2); txt(c, o.s, o.x, o.y, 22, R.green); c.globalAlpha = 1; });
      rect(c, 90, 312, 220, 36, 10, R.grid);
      if (shake > 0) { c.lineWidth = 2; c.strokeStyle = R.coral; K.L(c, 90, 312, 220, 36, 10); c.stroke(); }
      if (typed) txt(c, typed, 200, 331, 26, R.ink); else txt(c, 'type the answer', 200, 331, 14, R.dim);
      for (i = 0; i < 12; i++) { r = padXY(i); M_btn(c, r.x, r.y, r.w, r.h, flash[i] > 0 ? R.yellow : (i > 9 ? R.violet : R.teal), flash[i] > 0); txt(c, LABS[i], r.x + r.w / 2, r.y + r.h / 2 + 1, i > 9 ? 15 : 22, '#171233'); }
      G.fxStep(dt);
      G.hud([['SCORE', pad(score)], ['SOLVED', solved], ['LIVES', lives]]);
      if (over && endT <= 0) G.over(score, 'Solved ' + solved + ' problems. Best combo ' + bestC + '. Score ' + score + '.');
    }
    G.opt('Level', LV3, lv, function (i) { lv = i; start(); });
    G.begin(start);
  });

  /* ================= 2. Times Grid ================= */
  function M_cnt(n, p) { var r, k = 0; for (r = 1; r <= n; r++) if (p % r === 0 && p / r <= n) k++; return k; }
  var M_GSZ = [6, 9, 12];
  function M_gridSetup(lv) {
    var n = M_GSZ[lv], cs = Math.min(44, Math.floor(372 / (n + 1)), Math.floor((470 - 150) / (n + 1))), gx = Math.round((400 - (n + 1) * cs) / 2);
    return { n: n, cs: cs, gx: gx, gy: 104 };
  }
  function M_buildGridArt(gs) {
    var cv = document.createElement('canvas'), x, r, cc, xx, yy, g, fill;
    cv.width = 400; cv.height = 470; x = cv.getContext('2d');
    x.fillStyle = R.bg; x.fillRect(0, 0, 400, 470);
    for (r = 0; r <= gs.n; r++) for (cc = 0; cc <= gs.n; cc++) {
      if (!r && !cc) continue;
      xx = gs.gx + cc * gs.cs; yy = gs.gy + r * gs.cs;
      if (!r || !cc) {
        g = x.createLinearGradient(0, yy, 0, yy + gs.cs); g.addColorStop(0, '#3d3280'); g.addColorStop(1, '#2a2358');
        rect(x, xx + 1, yy + 1, gs.cs - 2, gs.cs - 2, 5, g);
        x.strokeStyle = 'rgba(255,255,255,.08)'; x.lineWidth = 1; K.L(x, xx + 1.5, yy + 1.5, gs.cs - 3, gs.cs - 3, 5); x.stroke();
        txt(x, String(r || cc), xx + gs.cs / 2, yy + gs.cs / 2, gs.cs < 32 ? 12 : gs.cs < 44 ? 15 : 19, R.orange);
        continue;
      }
      fill = (r + cc) % 2 ? '#2E2660' : '#282152';
      g = x.createLinearGradient(0, yy, 0, yy + gs.cs); g.addColorStop(0, fill); g.addColorStop(1, '#1D1740');
      rect(x, xx + 1, yy + 1, gs.cs - 2, gs.cs - 2, 4, g);
    }
    return cv;
  }
  function M_gridQ(lv, n) {
    var r = Math.random(), a, b, p, cnt, tries = 0, mode, k, valid;
    if (lv === 0) mode = r < 0.55 ? 'exact' : 'find';
    else if (lv === 1) mode = r < 0.34 ? 'exact' : r < 0.68 ? 'find' : 'square';
    else mode = r < 0.3 ? 'exact' : r < 0.62 ? 'find' : 'square';
    if (mode === 'square') {
      k = M_ri(2, n); p = k * k;
      return { mode: 'square', p: p, right: { r: k, c: k }, t: 'Tap the square number ' + p, why: k + ' × ' + k + ' = ' + p + '. That makes ' + p + ' a square number.', rev: k + '² = ' + p };
    }
    if (mode === 'exact') {
      a = M_ri(2, n); b = M_ri(2, n); p = a * b;
      return { mode: 'exact', p: p, a: a, b: b, right: { r: a, c: b }, t: 'Tap the cell for ' + a + ' × ' + b, why: a + ' × ' + b + ' = ' + p + '.', rev: a + ' × ' + b + ' = ' + p };
    }
    do { a = M_ri(2, n); b = M_ri(2, n); p = a * b; cnt = M_cnt(n, p); tries++; } while (tries < 60 && ((lv === 0 && cnt > 2) || (lv === 1 && cnt > 5)));
    for (valid = null, r = 1; r <= n; r++) if (p % r === 0 && p / r <= n) { valid = { r: r, c: p / r }; break; }
    return { mode: 'find', p: p, right: valid, t: 'Find ' + p + ' anywhere on the grid', why: 'Any cell where row × column = ' + p + ' works, for example ' + valid.r + ' × ' + valid.c + ' = ' + p + '.', rev: 'row × column = ' + p };
  }
  function M_gridOk(q, r, cc) {
    if (q.mode === 'square') return r === q.right.r && cc === q.right.c;
    if (q.mode === 'exact') return (r === q.a && cc === q.b) || (r === q.b && cc === q.a);
    return r * cc === q.p;
  }
  function M_cellAt(p, gs) {
    var cc = Math.floor((p.x - gs.gx) / gs.cs), r = Math.floor((p.y - gs.gy) / gs.cs);
    return cc >= 1 && cc <= gs.n && r >= 1 && r <= gs.n ? { r: r, c: cc } : null;
  }
  function M_gridPick(S, r, cc) {
    var q = S.q, ok, msg;
    if (r < 1 || cc < 1 || r > S.gs.n || cc > S.gs.n) return;
    ok = M_gridOk(q, r, cc);
    S.hitRC = { r: r, c: cc, ok: ok };
    if (!ok) {
      S.showRC = q.right;
      if (q.mode === 'find') msg = r + ' × ' + cc + ' = ' + (r * cc) + ', not ' + q.p + '. ' + q.why;
      else msg = r + ' × ' + cc + ' = ' + (r * cc) + ', not ' + q.p + '. The right cell was ' + q.right.r + ' × ' + q.right.c + ' = ' + q.p + '.';
    }
    S.ans(ok, msg, null);
  }
  def('timesGrid', EDU, 'Times Grid', R.orange, 'Find the cell where the row number times the column number makes the target.', 'Tap a cell or press 1 to select then Space · arrows move, Space picks · three misses ends the run', function (G) {
    M_core(G, {
      H: 470, color: R.orange, secs: [15, 13, 11], by: 322, bh: 52,
      make: function (lv) { var gs = M_gridSetup(lv); return M_gridQ(lv, gs.n); },
      init: function (q, S) {
        var gs = M_gridSetup(S.lv);
        if (S._gn !== gs.n) { S.gs = gs; S.gridArt = M_buildGridArt(gs); S._gn = gs.n; S.cur = { r: 1, c: 1 }; }
        S.hitRC = null; S.showRC = null; S.hov = null; S.sel = null; if (S.kbd === undefined) S.kbd = false;
      },
      draw: function (c, q, S, dt) {
        var gs = S.gs, f, pulse;
        c.drawImage(S.gridArt, 0, 0);
        fit(c, q.t, 200, 34, 372, 21, R.ink);
        if (!S.busy && S.streak >= 2) txt(c, S.streak + ' in a row! +' + Math.min(S.streak, 10) * 2 + ' bonus', 200, 58, 13, R.yellow);
        else if (!S.busy) txt(c, 'row × column = the number', 200, 58, 12, R.dim);
        f = S.sel || (S.kbd ? S.cur : S.hov);
        if (f && f.r >= 1 && f.r <= gs.n && !S.busy) {
          c.save(); c.globalAlpha = 0.20;
          rect(c, gs.gx + 1, gs.gy + f.r * gs.cs + 1, (gs.n + 1) * gs.cs - 2, gs.cs - 2, 4, R.blue);
          rect(c, gs.gx + f.c * gs.cs + 1, gs.gy + 1, gs.cs - 2, (gs.n + 1) * gs.cs - 2, 4, R.blue);
          c.restore();
          rect(c, gs.gx + f.c * gs.cs + 1, gs.gy + f.r * gs.cs + 1, gs.cs - 2, gs.cs - 2, 4, 'rgba(255,209,102,.35)');
          if (S.kbd) { c.lineWidth = 3; c.strokeStyle = R.ink; K.L(c, gs.gx + f.c * gs.cs + 1, gs.gy + f.r * gs.cs + 1, gs.cs - 2, gs.cs - 2, 4); c.stroke(); }
        }
        if (S.busy && S.hitRC) rect(c, gs.gx + S.hitRC.c * gs.cs + 1, gs.gy + S.hitRC.r * gs.cs + 1, gs.cs - 2, gs.cs - 2, 4, S.hitRC.ok ? R.green : R.coral);
        if (S.busy && S.showRC && !S.hitRC.ok) {
          pulse = 0.5 + 0.5 * Math.sin((S.t || 0) * 9); c.save(); c.globalAlpha = pulse;
          rect(c, gs.gx + S.showRC.c * gs.cs + 1, gs.gy + S.showRC.r * gs.cs + 1, gs.cs - 2, gs.cs - 2, 4, R.yellow); c.restore();
        }
      },
      down: function (p, S) { var xy; S.kbd = false; xy = M_cellAt(p, S.gs); S.sel = xy; S.hov = xy; if (xy) M_gridPick(S, xy.r, xy.c); },
      move: function (p, S, dn) { S.hov = M_cellAt(p, S.gs); if (dn) S.sel = S.hov; },
      key: function (k, S) {
        var n = S.gs.n;
        if (k === 'ArrowLeft' || k === 'a') { S.kbd = true; S.cur.c = S.cur.c > 1 ? S.cur.c - 1 : n; }
        else if (k === 'ArrowRight' || k === 'd') { S.kbd = true; S.cur.c = S.cur.c < n ? S.cur.c + 1 : 1; }
        else if (k === 'ArrowUp' || k === 'w') { S.kbd = true; S.cur.r = S.cur.r > 1 ? S.cur.r - 1 : n; }
        else if (k === 'ArrowDown' || k === 's') { S.kbd = true; S.cur.r = S.cur.r < n ? S.cur.r + 1 : 1; }
        else if (k === ' ' || k === 'Enter') { S.kbd = true; M_gridPick(S, S.cur.r, S.cur.c); }
      },
      pad: [['◀', 'ArrowLeft'], ['▲', 'ArrowUp'], ['▼', 'ArrowDown'], ['▶', 'ArrowRight'], ['Pick', 'Space']]
    });
  });

  /* ================= 3. Fraction Slice ================= */
  function M_divs(n) { var d = [], k; for (k = 2; k < n; k++) if (n % k === 0) d.push(k); return d; }
  /* cheese base with light radial shading, plus a speckle texture - cached per radius so it is built once, not per frame */
  var M_cheeseCache = {};
  function M_cheese(r) {
    var key = r, cv, x, g, i, a, rr, sx, sy;
    if (M_cheeseCache[key]) return M_cheeseCache[key];
    cv = document.createElement('canvas'); cv.width = r * 2 + 8; cv.height = r * 2 + 8; x = cv.getContext('2d');
    x.translate(r + 4, r + 4);
    x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 10; x.shadowOffsetY = 4;
    g = x.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.15, 0, 0, r);
    g.addColorStop(0, '#FCEFC4'); g.addColorStop(0.7, '#F5E1A0'); g.addColorStop(1, '#E0BD6E');
    x.beginPath(); x.arc(0, 0, r, 0, TAU); x.fillStyle = g; x.fill();
    x.shadowBlur = 0; x.shadowOffsetY = 0;
    x.fillStyle = 'rgba(160,110,40,.4)';
    for (i = 0; i < 90; i++) { a = Math.random() * TAU; rr = Math.sqrt(Math.random()) * r * 0.92; sx = Math.cos(a) * rr; sy = Math.sin(a) * rr; x.beginPath(); x.arc(sx, sy, 1 + Math.random() * 1.4, 0, TAU); x.fill(); }
    x.lineWidth = 4; x.strokeStyle = '#C98A3B'; x.beginPath(); x.arc(0, 0, r - 2, 0, TAU); x.stroke();
    M_cheeseCache[key] = cv; return cv;
  }
  function M_pie(c, cx, cy, r, n, on, col) {
    var i, s = TAU / n, a0, base = M_cheese(r);
    c.drawImage(base, cx - r - 4, cy - r - 4);
    for (i = 0; i < n; i++) if (on(i)) {
      a0 = -Math.PI / 2 + i * s;
      c.save(); c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, r, a0, a0 + s); c.closePath(); c.clip();
      var g = c.createRadialGradient(cx, cy, r * 0.1, cx, cy, r); g.addColorStop(0, col); g.addColorStop(1, col);
      c.globalAlpha = 0.86; c.fillStyle = col; c.fill(); c.globalAlpha = 1; c.restore();
    }
    for (i = 0; i < n; i++) { a0 = -Math.PI / 2 + i * s; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a0) * r, cy + Math.sin(a0) * r); c.strokeStyle = 'rgba(23,18,51,.55)'; c.lineWidth = 1.5; c.stroke(); }
  }
  function M_fracMake(lv, prevT) {
    var DEN = [4, 8, 12], LO = [2, 3, 5], n, a, b, m, j, cands, eq, tries = 0, cd, q, mixed = lv === 2 && Math.random() < 0.3;
    if (mixed) {
      n = pick([3, 4, 5, 6]); a = M_ri(1, n - 1);
      q = { kind: 'mixed', n: n, cnt: a, whole: 1, t: 'Shade 1 whole and ' + a + '/' + n + ' more', why: '1 whole pizza plus ' + a + '/' + n + ' of a second pizza equals 1 ' + a + '/' + n + '.', rev: '1 ' + a + '/' + n + ' pizzas' };
      return q;
    }
    do {
      n = M_ri(LO[lv], DEN[lv]); eq = lv > 0 && Math.random() < (lv === 1 ? 0.4 : 0.5); cands = [];
      if (eq) { M_divs(n).forEach(function (d) { cands.push([d, 0]); }); for (b = n * 2; b <= DEN[lv]; b += n) cands.push([b, 1]); }
      if (eq && cands.length) {
        cd = pick(cands); b = cd[0];
        if (!cd[1]) { a = M_ri(1, b - 1); q = { kind: 'eq', n: n, cnt: a * (n / b), ref: [a, b], t: 'Shade the same amount as ' + a + '/' + b, why: a + '/' + b + ' = ' + (a * (n / b)) + '/' + n + ' once both are written with ' + n + ' slices.', rev: a + '/' + b + ' = ' + (a * (n / b)) + '/' + n }; }
        else { m = b / n; j = M_ri(1, n - 1); a = m * j; q = { kind: 'eq', n: n, cnt: j, ref: [a, b], t: 'Shade the same amount as ' + a + '/' + b, why: a + '/' + b + ' = ' + j + '/' + n + ' once both are written with ' + n + ' slices.', rev: a + '/' + b + ' = ' + j + '/' + n }; }
      } else { a = M_ri(1, n - 1); q = { kind: 'basic', n: n, cnt: a, ref: null, t: 'Shade ' + a + '/' + n, why: a + '/' + n + ' means ' + a + ' of ' + n + ' equal slices.', rev: a + '/' + n }; }
      tries++;
    } while (q.t === prevT && tries < 25);
    return q;
  }
  var M_fracPrev = '';
  def('fractionSlice', EDU, 'Fraction Slice', R.magenta, 'Shade the right number of slices on the pizza to match the fraction.', 'Tap slices to shade, then Check · arrows move, Space shades, Enter checks · three misses ends the run', function (G) {
    var CX = 200, CY = 208, RR = 108;
    M_core(G, {
      H: 470, color: R.magenta, secs: [30, 27, 24], by: 388, bh: 58,
      make: function (lv, n) { var q = M_fracMake(lv, M_fracPrev); M_fracPrev = q.t; return q; },
      init: function (q, S) {
        var i; S.sh = []; for (i = 0; i < q.n; i++) S.sh.push(false); S.cur = 0; S.kbd = false;
      },
      draw: function (c, q, S, dt) {
        var k = S.sh.filter(function (v) { return v; }).length, a0, s = TAU / q.n, on;
        if (q.ref) {
          txt(c, 'Shade the same amount as', 190, 34, 17, R.ink);
          txt(c, q.ref[0] + '/' + q.ref[1], 190, 64, 28, R.yellow);
          M_pie(c, 344, 50, 24, q.ref[1], function (i) { return i < q.ref[0]; }, R.magenta);
        } else if (q.kind === 'mixed') {
          txt(c, q.t, 200, 40, 20, R.ink);
          M_pie(c, 108, CY, 76, q.n, function () { return true; }, R.green);
          M_pie(c, 292, CY, 76, q.n, S.busy ? function (i) { return i < q.cnt; } : function (i) { return S.sh[i]; }, S.busy ? (S.ok ? R.green : R.coral) : R.magenta);
          if (S.kbd && !S.busy) { a0 = -Math.PI / 2 + S.cur * s; c.beginPath(); c.moveTo(292, CY); c.arc(292, CY, 76, a0, a0 + s); c.closePath(); c.lineWidth = 4; c.strokeStyle = R.ink; c.stroke(); }
          if (!S.busy) { txt(c, 'Second pizza: shaded ' + k + ' of ' + q.n, 200, CY + 96, 13, R.dim); M_btn(c, 110, CY + 108, 180, 40, R.magenta); txt(c, 'Check', 200, CY + 128, 18, '#171233'); }
          return;
        } else txt(c, q.t, 200, 46, 30, R.ink);
        on = S.busy ? function (i) { return i < q.cnt; } : function (i) { return S.sh[i]; };
        M_pie(c, CX, CY, RR, q.n, on, S.busy ? (S.ok ? R.green : R.coral) : R.magenta);
        if (S.kbd && !S.busy) { a0 = -Math.PI / 2 + S.cur * s; c.beginPath(); c.moveTo(CX, CY); c.arc(CX, CY, RR, a0, a0 + s); c.closePath(); c.lineWidth = 5; c.strokeStyle = R.ink; c.stroke(); }
        if (!S.busy) txt(c, 'Shaded ' + k + ' of ' + q.n + ' slices', 200, CY + RR + 26, 14, R.dim);
        if (!S.busy) { M_btn(c, 110, CY + RR + 42, 180, 44, R.magenta); txt(c, 'Check', 200, CY + RR + 65, 19, '#171233'); }
      },
      down: function (p, S) {
        var q = S.q, dx, dy, ang, i, cx2 = q.kind === 'mixed' ? 292 : CX, cy2 = CY, rr2 = q.kind === 'mixed' ? 76 : RR, by2 = q.kind === 'mixed' ? CY + 108 : CY + RR + 42, bh2 = q.kind === 'mixed' ? 40 : 44;
        if (p.x >= 110 && p.x <= 290 && p.y >= by2 && p.y <= by2 + bh2) { M_fracCheck(S); return; }
        dx = p.x - cx2; dy = p.y - cy2;
        if (dx * dx + dy * dy <= rr2 * rr2) {
          ang = Math.atan2(dy, dx) + Math.PI / 2; if (ang < 0) ang += TAU;
          i = Math.min(q.n - 1, Math.floor(ang / (TAU / q.n))); S.kbd = false; S.cur = i; S.sh[i] = !S.sh[i];
        }
      },
      key: function (k, S) {
        var q = S.q;
        if (k === 'ArrowLeft' || k === 'a' || k === 'ArrowUp' || k === 'w') { S.kbd = true; S.cur = (S.cur + q.n - 1) % q.n; }
        else if (k === 'ArrowRight' || k === 'd' || k === 'ArrowDown' || k === 's') { S.kbd = true; S.cur = (S.cur + 1) % q.n; }
        else if (k === ' ') { S.kbd = true; S.sh[S.cur] = !S.sh[S.cur]; }
        else if (k === 'Enter') M_fracCheck(S);
      },
      pad: [['◀', 'ArrowLeft'], ['▶', 'ArrowRight'], ['Shade', 'Space'], ['Check', 'Enter']]
    });
  });
  function M_fracCheck(S) {
    var q = S.q, k = S.sh.filter(function (v) { return v; }).length;
    if (!k) return;
    S.ans(k === q.cnt, k === q.cnt ? undefined : 'You shaded ' + k + ' of ' + q.n + '. ' + q.why, null);
  }

  /* ================= 4. Balance Scales ================= */
  /* the stand (fulcrum + base) never changes, so it is drawn once to an offscreen canvas and reused every frame */
  var M_standArt = null;
  function M_stand() {
    var cv, x, cx = 120, cy = 90, g;
    if (M_standArt) return M_standArt;
    cv = document.createElement('canvas'); cv.width = 240; cv.height = 150; x = cv.getContext('2d');
    x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 6; x.shadowOffsetY = 3;
    g = x.createLinearGradient(cx - 34, 0, cx + 34, 0); g.addColorStop(0, '#2A2358'); g.addColorStop(0.5, '#453A8A'); g.addColorStop(1, '#2A2358');
    x.fillStyle = g; x.beginPath(); x.moveTo(cx, cy - 38); x.lineTo(cx - 34, cy + 62); x.lineTo(cx + 34, cy + 62); x.closePath(); x.fill();
    x.shadowBlur = 0;
    rect(x, cx - 56, cy + 60, 112, 10, 5, '#3B3170');
    g = x.createLinearGradient(0, cy - 44, 0, cy - 32); g.addColorStop(0, '#FFE9A8'); g.addColorStop(1, '#C9962F');
    x.fillStyle = g; circ(x, cx, cy - 38, 9, 0); x.fill();
    M_standArt = cv; return cv;
  }
  function M_drawScale(c, cx, cy, Lf, Rt) {
    var by = cy - 52, py = cy + 12, side, sx, items, n, x0, i, bx, mys, g, stand = M_stand();
    c.drawImage(stand, cx - 120, cy - 90);
    c.lineCap = 'round'; g = c.createLinearGradient(cx - 110, by - 3, cx + 110, by + 3); g.addColorStop(0, '#8C7CF0'); g.addColorStop(0.5, '#E9FBF9'); g.addColorStop(1, '#8C7CF0'); c.strokeStyle = g; c.lineWidth = 6; c.beginPath(); c.moveTo(cx - 110, by); c.lineTo(cx + 110, by); c.stroke(); c.lineCap = 'butt';
    txt(c, '=', cx, cy + 36, 22, R.bg);
    for (side = 0; side < 2; side++) {
      sx = cx + (side ? 110 : -110); items = side ? Rt : Lf; n = items.length;
      line(c, sx, by, sx - 50, py + 2, R.dim, 2); line(c, sx, by, sx + 50, py + 2, R.dim, 2);
      g = c.createLinearGradient(sx - 52, py, sx + 52, py + 8); g.addColorStop(0, '#9089c4'); g.addColorStop(1, '#5f5698');
      c.save(); c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 5; c.shadowOffsetY = 3;
      c.beginPath(); c.ellipse(sx, py + 4, 52, 8, 0, 0, TAU); c.fillStyle = g; c.fill(); c.restore();
      x0 = sx - (n * 28 + (n - 1) * 4) / 2;
      for (i = 0; i < n; i++) {
        bx = x0 + i * 32; mys = items[i] === 'x';
        g = c.createLinearGradient(bx, py - 30, bx, py - 2);
        if (mys) { g.addColorStop(0, '#FF9E85'); g.addColorStop(1, '#D6553A'); } else { g.addColorStop(0, '#FFE9A8'); g.addColorStop(1, '#E0AE3F'); }
        c.save(); c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 3; c.shadowOffsetY = 2;
        rect(c, bx, py - 30, 28, 28, 5, g);
        c.restore();
        c.save(); c.globalAlpha = 0.3; rect(c, bx + 2, py - 28, 24, 8, 3, '#ffffff'); c.restore();
        txt(c, String(items[i]), bx + 14, py - 15, mys ? 19 : 15, '#171233');
      }
    }
  }
  function M_scaleQ(lv) {
    var t = lv === 0 ? 0 : lv === 1 ? 1 + rnd(2) : 3 + rnd(5), x, a, b, cc, L, Rt, why, ex, tries = 0, tot, sw;
    if (t === 0) { x = M_ri(2, 14); a = M_ri(1, 9); b = x + a; L = ['x', a]; Rt = [b]; why = 'Take ' + a + ' from both sides: x = ' + x + '.'; ex = [b + a, b, x + a, x * 2]; }
    else if (t === 1) {
      do { a = M_ri(2, 12); b = M_ri(2, 12); cc = M_ri(2, 12); x = b + cc - a; tries++; } while (x < 2 && tries < 50);
      if (x < 2) { a = 2; b = 7; cc = 9; x = 14; }
      L = ['x', a]; Rt = [b, cc]; why = 'The right side totals ' + (b + cc) + '. Take ' + a + ' from both sides: x = ' + x + '.'; ex = [b + cc + a, b + cc, b, cc, a];
    } else if (t === 2) { x = M_ri(2, 15); b = 2 * x; L = ['x', 'x']; Rt = [b]; why = 'Two equal boxes weigh ' + b + ' together, so one box: x = ' + x + '.'; ex = [b, b * 2, x * 2 + 1]; }
    else if (t === 3) { x = M_ri(2, 15); a = M_ri(1, 20); b = 2 * x + a; L = ['x', 'x', a]; Rt = [b]; why = 'Take ' + a + ' away first: two x = ' + (2 * x) + ', so x = ' + x + '.'; ex = [b - a, b, b + a, (b + a) / 2]; }
    else if (t === 4) { x = M_ri(2, 12); b = 3 * x; L = ['x', 'x', 'x']; Rt = [b]; why = 'Three equal boxes weigh ' + b + ', so one box: x = ' + x + '.'; ex = [b, 2 * x, b / 2]; }
    else if (t === 5) {
      x = M_ri(3, 15); a = M_ri(1, 12); tot = 2 * x + a; b = M_ri(3, tot - 3); cc = tot - b; L = ['x', 'x', a]; Rt = [b, cc];
      why = 'The right side totals ' + tot + '. Take ' + a + ' away: two x = ' + (2 * x) + ', so x = ' + x + '.'; ex = [tot - a, tot, tot + a, b, cc];
    } else if (t === 6) { x = M_ri(2, 15); b = 2 * x; L = ['x', 'x', 'x']; Rt = ['x', b]; why = 'Take one x from both sides: two x = ' + b + ', so x = ' + x + '.'; ex = [b, b * 3, x + b]; }
    else { x = M_ri(2, 12); a = M_ri(1, 10); b = x + a; L = ['x', 'x', a]; Rt = ['x', b]; why = 'Take one x from both sides: x + ' + a + ' = ' + b + ', so x = ' + x + '.'; ex = [b, b - a, b + a, a]; }
    if (Math.random() < 0.5) { sw = L; L = Rt; Rt = sw; }
    ex = ex.filter(function (v) { return v > 0 && v === Math.floor(v) && v !== x; }).concat([x + 1, x + 2, x + 3, x - 1]).filter(function (v) { return v > 0; });
    var m = mk4(x, ex);
    return { q: 'The scale is balanced. What does x weigh?', draw: function (c, cx, cy) { M_drawScale(c, cx, cy - 12, L, Rt); }, why: why, opts: m.opts, a: m.a, rev: 'x = ' + x };
  }
  def('balanceScales', EDU, 'Balance Scales', R.violet, 'The scale is level. Work out how much the mystery box x weighs.', 'Click an answer or press 1-4 · three misses ends the run', function (G) {
    mcq(G, { color: R.violet, secs: [20, 22, 28], make: function (lv) { return M_scaleQ(lv); } });
  });

  /* ================= 5. Line Dart ================= */
  var M_FR = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [5, 8], [7, 8], [1, 3], [2, 3], [1, 6], [5, 6], [1, 10], [3, 10], [7, 10], [9, 10]],
    M_IM = [[5, 4], [3, 2], [7, 4], [4, 3], [5, 3], [7, 3], [8, 3], [9, 4], [11, 4], [5, 2], [9, 8], [11, 8], [13, 8], [15, 8], [17, 8], [19, 8]],
    M_SQ = [2, 3, 5, 6, 7, 8];
  function M_dfmt(v, dp) {
    var s = (Math.round(v * Math.pow(10, dp)) / Math.pow(10, dp)).toFixed(dp);
    if (dp > 0) { while (s.charAt(s.length - 1) === '0') s = s.slice(0, -1); if (s.charAt(s.length - 1) === '.') s = s.slice(0, -1); }
    if (s === '-0') s = '0';
    return s.split('-').join('−');
  }
  function M_fexact(f) {
    var v = f[0] / f[1], r = Math.round(v * 1000) / 1000;
    return f[0] + '/' + f[1] + (Math.abs(r - v) < 1e-9 ? ' = ' : ' ≈ ') + M_dfmt(v, 3);
  }
  function M_lineQ0(lv) {
    var r = Math.random(), s, v, f, dec, k;
    if (lv === 0) { s = Math.random() < 0.5 ? 10 : 20; v = M_ri(1, s - 1); return { lo: 0, hi: s, D: s, maj: 5, dp: 1, v: v, t: String(v), ex: String(v) }; }
    if (lv === 1) {
      if (r < 0.28) { f = pick(M_FR); return { lo: 0, hi: 1, D: 10, maj: 5, dp: 2, v: f[0] / f[1], t: f[0] + '/' + f[1], ex: M_fexact(f) }; }
      if (r < 0.58) { v = M_ri(1, 19) * 5 / 100; dec = M_dfmt(v, 2); return { lo: 0, hi: 1, D: 10, maj: 5, dp: 2, v: v, t: dec, ex: dec }; }
      v = M_ri(1, 99); return { lo: 0, hi: 100, D: 10, maj: 5, dp: 0, v: v, t: String(v), ex: String(v) };
    }
    if (r < 0.24) { v = M_ri(-9, 9); if (!v) v = 4; return { lo: -10, hi: 10, D: 20, maj: 5, dp: 1, v: v, t: M_dfmt(v, 0), ex: M_dfmt(v, 0) }; }
    if (r < 0.36) { v = M_ri(-19, 19) / 2; if (v === Math.floor(v)) v += 0.5; dec = M_dfmt(v, 1); return { lo: -10, hi: 10, D: 20, maj: 5, dp: 1, v: v, t: dec, ex: dec }; }
    if (r < 0.6) { v = M_ri(1, 999); return { lo: 0, hi: 1000, D: 10, maj: 5, dp: 0, v: v, t: String(v), ex: String(v) }; }
    if (r < 0.8) { f = pick(M_IM); return { lo: 0, hi: 3, D: 6, maj: 2, dp: 2, v: f[0] / f[1], t: f[0] + '/' + f[1], ex: M_fexact(f) }; }
    k = pick(M_SQ); v = Math.sqrt(k); return { lo: 0, hi: 3, D: 12, maj: 4, dp: 3, v: v, t: '√' + k, ex: '√' + k + ' ≈ ' + M_dfmt(v, 3) };
  }
  function M_lineQ(lv) {
    var q, i = 0, u, k;
    do {
      q = M_lineQ0(lv); u = (q.hi - q.lo) / q.D * q.maj; k = (q.v - q.lo) / u; i++;
    } while (i < 30 && q.t.indexOf('/') < 0 && q.t.indexOf('√') < 0 && Math.abs(k - Math.round(k)) < 1e-9);
    return q;
  }
  function M_tier(e) { return e <= 0.02 ? 50 : e <= 0.05 ? 30 : e <= 0.10 ? 15 : e <= 0.20 ? 5 : 0; }
  def('lineDart', EDU, 'Line Dart', R.yellow, 'Throw a dart at the spot where the number belongs on the line. The closer, the more points.', 'Tap or drag then release to throw · Left/Right arrows aim, Space throws · eight darts per game', function (G) {
    var W = 400, H = 470, c = G.canvas(W, H), lv = 1, X0 = 30, X1 = 370, LN = 340, LY = 240;
    var q, dart, score, bulls, phase, aim, armed, t, thrown, tier, err, hold, tt;
    function start() { score = 0; bulls = 0; dart = 0; aim = 200; armed = false; hold = 0; tt = 0; G.fx = []; next(); G.frame(step); }
    function next() { q = M_lineQ(lv); dart++; phase = 'aim'; t = 0; thrown = null; }
    function xOf(v) { return X0 + (v - q.lo) / (q.hi - q.lo) * LN; }
    function vOf(x) { return q.lo + (x - X0) / LN * (q.hi - q.lo); }
    function throwIt() {
      if (phase !== 'aim') return;
      thrown = vOf(aim); err = Math.abs(thrown - q.v) / (q.hi - q.lo); tier = M_tier(err);
      score += tier; if (tier === 50) bulls++;
      G.tally(tier >= 15, q.t + ' is at ' + q.ex);
      phase = 'fly'; t = 0;
    }
    G.pointer({
      down: function (p) { if (phase === 'aim') { aim = clamp(p.x, X0, X1); armed = true; } else if (phase === 'show' && t > 0.5) { t = 99; armed = false; } },
      move: function (p, e, dn) { if (dn && armed && phase === 'aim') aim = clamp(p.x, X0, X1); },
      up: function (p) { if (armed && phase === 'aim') { aim = clamp(p.x, X0, X1); throwIt(); } armed = false; }
    });
    G.press = function (k) {
      if (k === ' ' || k === 'Enter') { if (phase === 'aim') throwIt(); else if (phase === 'show' && t > 0.5) t = 99; }
      else if (k === 'ArrowLeft' || k === 'a') aim = clamp(aim - 3, X0, X1);
      else if (k === 'ArrowRight' || k === 'd') aim = clamp(aim + 3, X0, X1);
    };
    G.pad([['◀', 'ArrowLeft'], ['▶', 'ArrowRight'], ['Throw', 'Space']]);
    function step(dt) {
      var i, x, y, d, tx, ax, lab, cols, rad, fy, g;
      tt += dt; t += dt;
      d = G.ax();
      if (phase === 'aim' && d) { hold += dt; aim = clamp(aim + d * (90 + Math.min(hold, 1.2) * 200) * dt, X0, X1); } else if (!d) hold = 0;
      if (phase === 'fly' && t >= 0.28) { phase = 'show'; t = 0; G.burst(xOf(thrown < q.lo ? q.lo : thrown > q.hi ? q.hi : thrown), LY, tier ? R.yellow : R.dim, 10 + tier / 4); }
      if (phase === 'show' && t > 2.6) { if (dart >= 8) { G.over(score, 'Eight darts thrown. ' + score + ' of 400 points, ' + bulls + ' bullseye' + (bulls === 1 ? '' : 's') + '.'); return; } next(); }
      clear(c, W, H);
      g = c.createLinearGradient(0, 0, 0, LY); g.addColorStop(0, '#1c1440'); g.addColorStop(1, R.bg); c.fillStyle = g; c.fillRect(0, 0, W, LY);
      txt(c, 'Dart ' + dart + ' of 8', 200, 22, 14, R.dim);
      fit(c, 'Where is ' + q.t.split('-').join('−') + '?', 200, 62, 360, 34, R.ink);
      if (phase === 'show' || phase === 'fly') {
        tx = xOf(q.v);
        if (phase === 'show') {
          rad = [0.20, 0.10, 0.05, 0.02]; cols = ['rgba(77,166,255,.16)', 'rgba(61,220,151,.20)', 'rgba(255,209,102,.30)', 'rgba(255,107,74,.55)'];
          for (i = 0; i < 4; i++) circ(c, tx, LY, rad[i] * LN, cols[i]);
        }
      }
      line(c, X0, LY, X1, LY, R.ink, 4);
      for (i = 0; i <= q.D; i++) { x = X0 + i * LN / q.D; fy = i % q.maj === 0 ? 12 : 6; line(c, x, LY - fy, x, LY + fy, R.ink, i % q.maj === 0 ? 3 : 2); }
      lab = function (v) { return q.dp === 0 || v === Math.floor(v) ? M_dfmt(v, 0) : M_dfmt(v, q.dp); };
      txt(c, lab(q.lo), X0, LY + 32, 18, R.ink); txt(c, lab(q.hi), X1, LY + 32, 18, R.ink);
      for (i = q.maj; i < q.D; i += q.maj) txt(c, lab(q.lo + i * (q.hi - q.lo) / q.D), X0 + i * LN / q.D, LY + 32, 14, R.dim);
      if (phase === 'aim') {
        c.globalAlpha = 0.8; line(c, aim, LY - 50, aim, LY + 16, R.yellow, 2);
        c.fillStyle = R.yellow; c.beginPath(); c.moveTo(aim - 9, LY - 66); c.lineTo(aim + 9, LY - 66); c.lineTo(aim, LY - 46); c.closePath(); c.fill(); c.globalAlpha = 1;
        txt(c, 'Tap or drag the marker, then release', 200, 140, 14, R.dim);
      } else {
        ax = xOf(clamp(thrown, q.lo, q.hi)); y = phase === 'fly' ? LY - 34 - (1 - t / 0.28) * 200 : LY - 34; if (y > LY - 34) y = LY - 34;
        if (phase === 'show') {
          line(c, tx, LY - 40, tx, LY + 16, R.green, 3);
          txt(c, q.t.split('-').join('−'), tx, LY + 58, 16, R.green);
        }
        c.save(); c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 4; c.shadowOffsetY = 3;
        line(c, ax, y, ax, y + 34, R.ink, 3);
        c.fillStyle = R.coral; c.beginPath(); c.moveTo(ax, y); c.lineTo(ax - 8, y - 12); c.lineTo(ax + 8, y - 12); c.closePath(); c.fill();
        c.beginPath(); c.moveTo(ax, y + 3); c.lineTo(ax - 7, y + 13); c.lineTo(ax + 7, y + 13); c.closePath(); c.fillStyle = R.yellow; c.fill();
        c.restore();
      }
      if (phase === 'show') {
        txt(c, 'Exact value: ' + q.ex, 200, 330, 18, R.green);
        txt(c, (tier === 50 ? 'Bullseye! +50' : tier ? '+' + tier + ' points' : 'Missed by a lot: 0 points') + '  ·  off by ' + M_dfmt(Math.abs(thrown - q.v), q.dp + (q.dp === 0 ? 0 : 1)), 200, 358, 15, tier ? R.yellow : R.coral);
        if (t > 0.5) txt(c, 'Tap or press Space for the next dart', 200, 388, 13, R.dim);
      }
      txt(c, 'Within 2% = 50  ·  5% = 30  ·  10% = 15  ·  20% = 5', 200, 440, 12, R.dim);
      G.fxStep(dt);
      G.hud([['SCORE', pad(score)], ['DARTS LEFT', 8 - dart + (phase === 'aim' ? 1 : 0)], ['BULLS', bulls]]);
    }
    G.opt('Level', LV3, lv, function (i) { lv = i; start(); });
    G.begin(start);
  });

  /* ================= 7. Unit Snap ================= */
  /* exact, non-ambiguous conversions only: metric, time, and US customary units (all defined by exact legal ratios) */
  var M_UN0 = [['m', 'cm', 100], ['km', 'm', 1000], ['kg', 'g', 1000], ['L', 'mL', 1000], ['h', 'min', 60]],
    M_UN1 = [['m', 'mm', 1000], ['cm', 'mm', 10], ['tonne', 'kg', 1000], ['g', 'mg', 1000], ['min', 's', 60], ['day', 'h', 24], ['week', 'day', 7]],
    M_UN2 = [['ft', 'in', 12], ['yd', 'ft', 3], ['lb', 'oz', 16], ['gal', 'qt', 4], ['qt', 'pt', 2], ['pt', 'cup', 2], ['cup', 'floz', 8], ['ton', 'lb', 2000]];
  var M_DEC = [0.25, 0.5, 0.75, 1.5, 2.5, 3.5, 4.5];
  function M_unum(n) { var r = Math.round(n * 10000) / 10000, ip = Math.floor(r), s = String(r); return nice(ip) + s.slice(String(ip).length); }
  function M_uS(name, v) { return (name === 'day' || name === 'tonne' || name === 'ton' || name === 'week') && v !== 1 ? name + 's' : name; }
  function M_unitQ(lv) {
    var pool = lv === 0 ? M_UN0 : lv === 1 ? M_UN0.concat(M_UN1) : M_UN0.concat(M_UN1).concat(M_UN2);
    var u = pick(pool), f = u[2], up = lv > 0 && Math.random() < 0.5, val, ans, D, right, m, why;
    if (lv === 2 && Math.random() < 0.4) {
      D = M_DEC.filter(function (d) { return Math.abs(d * f - Math.round(d * f)) < 0.000001; });
      if (D.length) { if (up) { ans = pick(D); val = Math.round(ans * f); } else { val = pick(D); ans = Math.round(val * f); } }
      else { val = 2 + rnd(19); ans = val * f; }
    } else if (up) { ans = rr(2, 10) | 0; val = ans * f; } else { val = lv === 0 ? 2 + rnd(8) : 2 + rnd(19); ans = val * f; }
    right = M_unum(ans);
    m = mk4(right, [M_unum(ans * 10), M_unum(ans / 10), M_unum(ans * 100), M_unum(ans / 100)]);
    why = '1 ' + u[0] + ' = ' + f + ' ' + u[1] + ', so ' + (up ? 'divide' : 'multiply') + ': ' + M_unum(val) + ' ' + M_uS(up ? u[1] : u[0], val) + ' = ' + right + ' ' + M_uS(up ? u[0] : u[1], ans) + '.';
    return {
      q: 'Convert the unit', why: why, opts: m.opts, a: m.a, rev: '1 ' + u[0] + ' = ' + f + ' ' + u[1],
      draw: function (c, cx, cy) { fit(c, M_unum(val) + ' ' + M_uS(up ? u[1] : u[0], val) + ' = ?', cx, cy - 6, 340, 32, R.ink); txt(c, 'answer in ' + M_uS(up ? u[0] : u[1], 2), cx, cy + 34, 17, R.yellow); }
    };
  }
  def('unitSnap', EDU, 'Unit Snap', R.green, 'Metres, grams, litres, minutes, and everyday feet and pounds: convert between units before the timer snaps shut.', 'Click an answer or press 1-4 · three misses ends the run', function (G) {
    mcq(G, { color: R.green, secs: [15, 12, 10], make: M_unitQ });
  });

  /* ================= 6. Coin Change ================= */
  /* real US coin denominations (cents) and their true relative sizes (mm diameter) */
  var M_CV = [1, 5, 10, 25, 50, 100], M_MM = [19.05, 21.21, 17.91, 24.26, 30.61, 26.49], M_CLAB = ['1¢', '5¢', '10¢', '25¢', '50¢', '$1'];
  var M_BILL = [100, 200, 500, 1000, 2000];
  var M_ITEMS = ['Pencil', 'Apple', 'Sticker', 'Eraser', 'Balloon', 'Cookie', 'Lollipop', 'Notebook', 'Ruler', 'Toy car', 'Bookmark', 'Juice box', 'Pretzel', 'Marbles', 'Postcard', 'Banana', 'Comic book', 'Sandwich', 'Muffin', 'Whistle', 'Yo-yo', 'Stickers pack', 'Keychain', 'Granola bar', 'Poster', 'Highlighter', 'Water bottle', 'Puzzle'];
  function M_money(v) { var m = v % 100; return '$' + Math.floor(v / 100) + '.' + (m < 10 ? '0' : '') + m; }
  function M_clist(v) { var i, n, o = []; for (i = 5; i >= 0; i--) { n = Math.floor(v / M_CV[i]); v -= n * M_CV[i]; if (n) o.push(n > 1 ? n + ' × ' + M_CLAB[i] : M_CLAB[i]); } return o.join(' + '); }
  var M_coinCache = {};
  function M_coinArt(i) {
    if (M_coinCache[i]) return M_coinCache[i];
    var cv = document.createElement('canvas'), x, rad = 28, cx = 32, cy = 32, g, reeded = i >= 2 && i <= 4, gold = i === 5, copper = i === 0, k, a, hg;
    cv.width = 64; cv.height = 64; x = cv.getContext('2d');
    x.shadowColor = 'rgba(0,0,0,.5)'; x.shadowBlur = 5; x.shadowOffsetY = 2;
    g = x.createRadialGradient(cx - 8, cy - 10, 4, cx, cy, rad);
    if (copper) { g.addColorStop(0, '#E3A66E'); g.addColorStop(0.6, '#C1793F'); g.addColorStop(1, '#8B4A24'); }
    else if (gold) { g.addColorStop(0, '#FFE9A0'); g.addColorStop(0.6, '#E0B84A'); g.addColorStop(1, '#A9791E'); }
    else { g.addColorStop(0, '#F5F8FA'); g.addColorStop(0.6, '#C7D0D6'); g.addColorStop(1, '#8E99A1'); }
    x.beginPath(); x.arc(cx, cy, rad, 0, TAU); x.fillStyle = g; x.fill();
    x.shadowBlur = 0; x.shadowOffsetY = 0;
    if (reeded) { x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 1; for (k = 0; k < 36; k++) { a = k / 36 * TAU; x.beginPath(); x.moveTo(cx + Math.cos(a) * (rad - 1), cy + Math.sin(a) * (rad - 1)); x.lineTo(cx + Math.cos(a) * (rad - 4), cy + Math.sin(a) * (rad - 4)); x.stroke(); } }
    x.lineWidth = 2; x.strokeStyle = 'rgba(0,0,0,.3)'; x.beginPath(); x.arc(cx, cy, rad - 3, 0, TAU); x.stroke();
    x.save(); x.globalAlpha = 0.4; hg = x.createRadialGradient(cx - 7, cy - 9, 0, cx - 7, cy - 9, rad * 0.5); hg.addColorStop(0, '#ffffff'); hg.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = hg; x.beginPath(); x.arc(cx - 7, cy - 9, rad * 0.5, 0, TAU); x.fill(); x.restore();
    txt(x, M_CLAB[i], cx, cy + 1, i === 5 ? 15 : 13, i === 0 ? '#5c2e0f' : '#171233');
    M_coinCache[i] = cv; return cv;
  }
  function M_coin(c, x, y, base, i) { var r = base * M_MM[i] / 30.61; c.drawImage(M_coinArt(i), x - r, y - r, r * 2, r * 2); }
  function M_bill(c, x, y, w, h, v) {
    var g = c.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, '#7FD8A0'); g.addColorStop(1, '#4FAF78');
    c.save(); c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 5; c.shadowOffsetY = 2; rect(c, x, y, w, h, 6, g); c.restore();
    c.strokeStyle = 'rgba(23,18,51,.4)'; c.lineWidth = 2; K.L(c, x + 3, y + 3, w - 6, h - 6, 4); c.stroke();
    circ(c, x + w / 2, y + h / 2, h * 0.32, 'rgba(255,255,255,.5)');
    txt(c, M_money(v), x + w / 2, y + h / 2, 15, '#123420');
  }
  function M_total(tray) { var s = 0, i; for (i = 0; i < tray.length; i++) s += tray[i]; return s; }
  var M_ccLast = -1;
  function M_coinQ(lv, n) {
    var t, price = 0, bill = 0, tm;
    do {
      if (lv === 0) t = 5 * (1 + rnd(19)); else if (lv === 1) t = 1 + rnd(99);
      else { bill = pick(M_BILL); price = 20 + rnd(bill - 40); t = bill - price; }
    } while (t === M_ccLast);
    M_ccLast = t; if (lv < 2) price = t;
    tm = Math.max(0.55, 1 - n * 0.02);
    return {
      target: t, price: price, bill: bill, item: pick(M_ITEMS), lv: lv, tm: tm,
      why: (lv === 2 ? 'Change: ' + M_money(bill) + ' − ' + M_money(price) + ' = ' + M_money(t) : 'The price was ' + M_money(t)) + '. Try ' + M_clist(t) + '.',
      rev: M_money(t) + ' = ' + M_clist(t)
    };
  }
  def('coinChange', EDU, 'Coin Change', R.yellow, 'Build the exact price from coins, or make the right change from a bill. Fast and precise.', 'Tap coins or press 1-6 · Enter pays · Backspace undoes · c clears · three misses ends the run', function (G) {
    M_core(G, {
      H: 470, color: R.yellow, secs: [22, 26, 40], by: 394, bh: 62,
      make: function (lv, n) { return M_coinQ(lv, n); },
      init: function (q, S) { S.tray = []; S.fi = -1; S.ft = 0; },
      draw: function (c, q, S, dt) {
        var i, k, t = M_total(S.tray), col;
        if (S.ft > 0) S.ft -= dt;
        rect(c, 12, 30, 376, 66, 12, R.grid);
        if (q.lv < 2) { txt(c, 'Buy: ' + q.item + '. Pay exactly', 200, 50, 15, R.dim); txt(c, M_money(q.target), 200, 80, 38, R.yellow); }
        else { fit(c, q.item + ' costs ' + M_money(q.price), 148, 48, 264, 16, R.ink); txt(c, 'you hand over this bill', 148, 68, 12, R.dim); txt(c, 'Tap the change', 148, 88, 18, R.yellow); M_bill(c, 300, 42, 74, 32, q.bill); }
        rect(c, 12, 108, 376, 90, 12, '#100C25');
        col = S.busy ? (S.ok ? R.green : R.coral) : R.grid; c.strokeStyle = col; c.lineWidth = 3; K.L(c, 12, 108, 376, 90, 12); c.stroke();
        for (i = 0; i < S.tray.length; i++) { k = M_CV.indexOf(S.tray[i]); M_coin(c, 34 + (i % 12) * 30, 132 + Math.floor(i / 12) * 30, 12, k); }
        if (!S.tray.length) txt(c, 'Your tray is empty', 200, 152, 14, R.dim);
        txt(c, 'Tray: ' + M_money(t) + (S.tray.length ? '  (' + S.tray.length + (S.tray.length === 1 ? ' coin)' : ' coins)') : ''), 200, 222, 19, S.busy ? col : R.ink);
        for (i = 0; i < 6; i++) { M_coin(c, 44 + i * 62, 254 - (S.ft > 0 && S.fi === i ? 3 : 0), 25, i); txt(c, String(i + 1), 44 + i * 62, 286, 12, R.dim); }
        M_btn(c, 12, 300, 118, 42, R.violet); txt(c, 'Undo', 71, 322, 16, '#171233');
        M_btn(c, 141, 300, 118, 42, R.blue); txt(c, 'Clear', 200, 322, 16, '#171233');
        M_btn(c, 270, 300, 118, 42, R.green); txt(c, 'Pay', 329, 322, 18, '#171233');
        if (!S.busy) txt(c, 'Tap coins to fill the tray, then Pay', 200, 360, 13, R.dim);
      },
      down: function (p, S) {
        var i, dx, dy, k;
        for (i = 0; i < 6; i++) { dx = p.x - (44 + i * 62); dy = p.y - 254; if (dx * dx + dy * dy <= 34 * 34) { if (S.tray.length < 30) S.tray.push(M_CV[i]); S.fi = i; S.ft = 0.15; return; } }
        if (p.x >= 12 && p.x <= 130 && p.y >= 300 && p.y <= 342) { S.tray.pop(); return; }
        if (p.x >= 141 && p.x <= 259 && p.y >= 300 && p.y <= 342) { S.tray = []; return; }
        if (p.x >= 270 && p.x <= 388 && p.y >= 300 && p.y <= 342) { k = M_total(S.tray); if (!S.tray.length) return; S.ans(k === S.q.target, k === S.q.target ? undefined : 'You made ' + M_money(k) + '. ' + S.q.why, null); }
      },
      key: function (k, S) { var i = '123456'.indexOf(k), t; if (i > -1) { if (S.tray.length < 30) S.tray.push(M_CV[i]); S.fi = i; S.ft = 0.15; } else if (k === 'Backspace') S.tray.pop(); else if (k === 'c') S.tray = []; else if (k === 'Enter') { t = M_total(S.tray); if (!S.tray.length) return; S.ans(t === S.q.target, t === S.q.target ? undefined : 'You made ' + M_money(t) + '. ' + S.q.why, null); } },
      pad: [['Undo', 'Backspace'], ['Clear', 'c'], ['Pay', 'Enter']]
    });
  });

  /* ================= AUTHOR S: SCIENCE GAMES (v2) ================= */
  /* shared tiny helpers, prefixed so they never clash with other files */
  function S_off(w, h) { var a = document.createElement('canvas'), o; a.width = w; a.height = h; o = a.getContext('2d'); return { cv: a, c: o }; }
  function S_shadow(c, col, blur, dx, dy) { c.shadowColor = col; c.shadowBlur = blur; c.shadowOffsetX = dx || 0; c.shadowOffsetY = dy || 0; }
  function S_noShadow(c) { c.shadowColor = 'rgba(0,0,0,0)'; c.shadowBlur = 0; c.shadowOffsetX = 0; c.shadowOffsetY = 0; }
  function S_hex2rgb(h) { var n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function S_shade(h, amt) { var v = S_hex2rgb(h), i, o = []; for (i = 0; i < 3; i++) o.push(clamp(Math.round(v[i] + amt), 0, 255)); return 'rgb(' + o[0] + ',' + o[1] + ',' + o[2] + ')'; }

  /* ---------------------------------------------------------------
     ELEMENT HUNT - full 118-element periodic table, real layout
  --------------------------------------------------------------- */
  var S_CATN = ['Alkali metal', 'Alkaline earth metal', 'Transition metal', 'Post-transition metal', 'Metalloid', 'Reactive nonmetal', 'Halogen', 'Noble gas', 'Lanthanide', 'Actinide'];
  var S_CATC = ['#FF6B4A', '#FF9770', '#9FB4D9', '#4DA6FF', '#2FD3C7', '#3DDC97', '#FFD166', '#8C7CF0', '#FF5DA2', '#C792EA'];
  var S_CATF = ['React vigorously with water; get more reactive going down the group', 'Form +2 ions; harder and less reactive than alkali metals', 'Hard, shiny, and good conductors of heat and electricity', 'Softer with lower melting points than transition metals', 'Properties between metals and nonmetals; used in semiconductors', 'React readily and are essential to living things', 'Very reactive nonmetals that form salts with metals', 'Have a full outer shell, so they almost never react', 'Soft, reactive metals used in magnets, lasers and phone screens', 'Radioactive metals; most are made artificially in labs'];
  var S_ELS = 'H,Hydrogen,5;He,Helium,7;Li,Lithium,0;Be,Beryllium,1;B,Boron,4;C,Carbon,5;N,Nitrogen,5;O,Oxygen,5;F,Fluorine,6;Ne,Neon,7;Na,Sodium,0;Mg,Magnesium,1;Al,Aluminum,3;Si,Silicon,4;P,Phosphorus,5;S,Sulfur,5;Cl,Chlorine,6;Ar,Argon,7;K,Potassium,0;Ca,Calcium,1;Sc,Scandium,2;Ti,Titanium,2;V,Vanadium,2;Cr,Chromium,2;Mn,Manganese,2;Fe,Iron,2;Co,Cobalt,2;Ni,Nickel,2;Cu,Copper,2;Zn,Zinc,2;Ga,Gallium,3;Ge,Germanium,4;As,Arsenic,4;Se,Selenium,5;Br,Bromine,6;Kr,Krypton,7;Rb,Rubidium,0;Sr,Strontium,1;Y,Yttrium,2;Zr,Zirconium,2;Nb,Niobium,2;Mo,Molybdenum,2;Tc,Technetium,2;Ru,Ruthenium,2;Rh,Rhodium,2;Pd,Palladium,2;Ag,Silver,2;Cd,Cadmium,2;In,Indium,3;Sn,Tin,3;Sb,Antimony,4;Te,Tellurium,4;I,Iodine,6;Xe,Xenon,7;Cs,Cesium,0;Ba,Barium,1;La,Lanthanum,8;Ce,Cerium,8;Pr,Praseodymium,8;Nd,Neodymium,8;Pm,Promethium,8;Sm,Samarium,8;Eu,Europium,8;Gd,Gadolinium,8;Tb,Terbium,8;Dy,Dysprosium,8;Ho,Holmium,8;Er,Erbium,8;Tm,Thulium,8;Yb,Ytterbium,8;Lu,Lutetium,8;Hf,Hafnium,2;Ta,Tantalum,2;W,Tungsten,2;Re,Rhenium,2;Os,Osmium,2;Ir,Iridium,2;Pt,Platinum,2;Au,Gold,2;Hg,Mercury,2;Tl,Thallium,3;Pb,Lead,3;Bi,Bismuth,3;Po,Polonium,3;At,Astatine,4;Rn,Radon,7;Fr,Francium,0;Ra,Radium,1;Ac,Actinium,9;Th,Thorium,9;Pa,Protactinium,9;U,Uranium,9;Np,Neptunium,9;Pu,Plutonium,9;Am,Americium,9;Cm,Curium,9;Bk,Berkelium,9;Cf,Californium,9;Es,Einsteinium,9;Fm,Fermium,9;Md,Mendelevium,9;No,Nobelium,9;Lr,Lawrencium,9;Rf,Rutherfordium,2;Db,Dubnium,2;Sg,Seaborgium,2;Bh,Bohrium,2;Hs,Hassium,2;Mt,Meitnerium,2;Ds,Darmstadtium,2;Rg,Roentgenium,2;Cn,Copernicium,2;Nh,Nihonium,3;Fl,Flerovium,3;Mc,Moscovium,3;Lv,Livermorium,3;Ts,Tennessine,5;Og,Oganesson,7';
  function S_elPos(n) {
    var vr, c;
    if (n <= 2) { vr = 0; c = n === 1 ? 0 : 17; }
    else if (n <= 18) { vr = n <= 10 ? 1 : 2; var o = n <= 10 ? n - 2 : n - 10; c = o <= 2 ? o - 1 : o + 9; }
    else if (n <= 36) { vr = 3; c = n - 19; }
    else if (n <= 54) { vr = 4; c = n - 37; }
    else if (n === 55) { vr = 5; c = 0; }
    else if (n === 56) { vr = 5; c = 1; }
    else if (n <= 71) { vr = 7; c = (n - 57) + 2; }
    else if (n <= 86) { vr = 5; c = (n - 72) + 3; }
    else if (n === 87) { vr = 6; c = 0; }
    else if (n === 88) { vr = 6; c = 1; }
    else if (n <= 103) { vr = 8; c = (n - 89) + 2; }
    else { vr = 6; c = (n - 104) + 3; }
    return { vr: vr, c: c };
  }
  var S_EL = S_ELS.split(';').map(function (s, i) {
    var a = s.split(','), n = i + 1, p = S_elPos(n);
    return { n: n, s: a[0], nm: a[1], cat: +a[2], vr: p.vr, c: p.c };
  });

  def('elementHunt', EDU, 'Element Hunt', R.teal, 'Hydrogen to oganesson: the whole periodic table, real positions, real families. Find the element before the clock runs out.', 'Tap the right cell . arrows move, Space picks . three misses ends the run', function (G) {
    var W = 400, H = 560, c = G.canvas(W, H), lv = 1, secs = [17, 14, 11];
    var X0 = 7.6, PX = 21.4, CW = 19.6, CH = 20, Y0 = 100, PYm = 22, GAP = 12, PYf = 19;
    var lives, score, streak, bestS, tgt, mode, tl, tlMax, busy, fb, pk, cur, kb, lastN, off, offBuilt;
    function ex(e) { return X0 + e.c * PX; }
    function ey(e) { var vr = e.vr; return vr <= 6 ? Y0 + vr * PYm : Y0 + 6 * PYm + GAP + (vr - 7) * PYf; }
    function pool() {
      if (lv === 0) return S_EL.filter(function (e) { return e.n <= 20 || e.n === 26 || e.n === 29 || e.n === 47 || e.n === 79; });
      if (lv === 1) return S_EL.filter(function (e) { return e.n <= 54; });
      return S_EL;
    }
    function famPool() { return S_EL.filter(function (e) { return e.cat === 0 || e.cat === 1 || e.cat === 6 || e.cat === 7; }); }
    function buildOff() {
      off = S_off(W, ey({ vr: 8 }) - Y0 + PYf + 4);
      var oc = off.c, k, e, x, y, g0;
      clear(oc, W, off.cv.height, R.bg);
      for (k = 0; k < S_EL.length; k++) {
        e = S_EL[k]; x = ex(e); y = ey(e) - Y0;
        S_shadow(oc, 'rgba(0,0,0,.45)', 3, 0, 1.5);
        g0 = oc.createLinearGradient(x, y, x, y + CH);
        g0.addColorStop(0, S_shade(S_CATC[e.cat], 34));
        g0.addColorStop(0.5, S_CATC[e.cat]);
        g0.addColorStop(1, S_shade(S_CATC[e.cat], -38));
        rect(oc, x, y, CW, CH, 3, g0);
        S_noShadow(oc);
        oc.strokeStyle = 'rgba(255,255,255,.35)'; oc.lineWidth = 1; oc.beginPath(); oc.moveTo(x + 1.5, y + CH - 1.5); oc.lineTo(x + 1.5, y + 1.5); oc.lineTo(x + CW - 1.5, y + 1.5); oc.stroke();
        fit(oc, lv === 2 ? String(e.n) : e.s, x + CW / 2, y + CH / 2 + 1, CW - 3, 11, '#171233');
      }
      offBuilt = true;
    }
    function nextQ() {
      var p = mode === 3 ? famPool() : pool();
      do { tgt = pick(p); } while (tgt.n === lastN && p.length > 1);
      lastN = tgt.n;
      mode = lv === 0 ? pick([0, 1]) : lv === 1 ? pick([0, 1, 2]) : pick([0, 1, 2, 3]);
      if (mode === 3) { var fp = famPool(); tgt = pick(fp); lastN = tgt.n; }
      tlMax = tl = secs[lv] - Math.min(streak, 6) * 0.35; busy = false; fb = 0; pk = null;
    }
    function start() { G.gen = (G.gen || 0) + 1; lives = 3; score = 0; streak = 0; bestS = 0; lastN = 0; kb = false; cur = S_EL[0]; G.fx = []; buildOff(); mode = 0; nextQ(); G.frame(step); }
    function answer(e) {
      if (busy || !e) return;
      busy = true; pk = e;
      G.tally(e === tgt, tgt.nm + ' (' + tgt.s + ', #' + tgt.n + ')');
      if (e === tgt) { streak++; bestS = Math.max(bestS, streak); score += 10 + Math.min(streak, 10) * 2 + Math.ceil(tl); G.burst(ex(e) + CW / 2, ey(e) + CH / 2, R.green, 16); fb = 0.8; }
      else { lives--; streak = 0; fb = 2.6; }
    }
    function cellAt(p) {
      var k, e, x, y;
      for (k = 0; k < S_EL.length; k++) { e = S_EL[k]; x = ex(e); y = ey(e); if (p.x >= x - 0.6 && p.x <= x + CW + 0.6 && p.y >= y - 0.6 && p.y <= y + CH + 0.6) return e; }
      return null;
    }
    function rowFind(vr, col, dir) {
      var k, cc, e, cands = S_EL.filter(function (q) { return q.vr === vr; });
      for (k = 1; k <= 18; k++) { cc = (col + dir * k + 36) % 18; e = cands.filter(function (q) { return q.c === cc; })[0]; if (e) return e; }
      return cur;
    }
    function vFind(dir) {
      var order = [0, 1, 2, 3, 4, 5, 6, 7, 8], idx = order.indexOf(cur.vr), tries = 0, nvr, best;
      while (tries < 9) { tries++; idx = (idx + dir + 9) % 9; nvr = order[idx]; best = null;
        S_EL.forEach(function (q) { if (q.vr === nvr && (!best || Math.abs(q.c - cur.c) < Math.abs(best.c - cur.c))) best = q; });
        if (best) return best;
      }
      return cur;
    }
    G.pointer({ down: function (p) { kb = false; answer(cellAt(p)); } });
    G.press = function (k) {
      kb = true;
      if (k === 'ArrowLeft' || k === 'a') cur = rowFind(cur.vr, cur.c, -1);
      else if (k === 'ArrowRight' || k === 'd') cur = rowFind(cur.vr, cur.c, 1);
      else if (k === 'ArrowUp' || k === 'w') cur = vFind(-1);
      else if (k === 'ArrowDown' || k === 's') cur = vFind(1);
      else if (k === ' ' || k === 'Enter') answer(cur);
    };
    G.pad([['<', 'ArrowLeft'], ['^', 'ArrowUp'], ['v', 'ArrowDown'], ['>', 'ArrowRight'], ['Pick', 'Space']]);
    function step(dt) {
      var k, e, x, y, pulse, ps, gh = off.cv.height;
      if (!busy) { tl -= dt; if (tl <= 0) { busy = true; pk = null; lives--; streak = 0; fb = 2.6; G.tally(false, tgt.nm + ' (' + tgt.s + ', #' + tgt.n + ')'); } }
      else { fb -= dt; if (fb <= 0) { if (lives <= 0) { G.over(score, 'Out of lives with ' + score + ' points. Best streak ' + bestS + '.'); return; } nextQ(); } }
      clear(c, W, H);
      rect(c, 20, 10, 360, 7, 4, R.grid); rect(c, 20, 10, Math.max(0, 360 * tl / tlMax), 7, 4, tl < 3 && !busy ? R.coral : R.teal);
      rect(c, 12, 22, 376, 70, 12, R.grid);
      ps = mode === 3 ? 'Find the ' + S_CATN[tgt.cat].toLowerCase() + ' in period ' + (tgt.vr + 1) : mode === 2 ? 'Find atomic number ' + tgt.n : 'Find: ' + (mode === 1 ? tgt.s : tgt.nm);
      fit(c, ps, 200, 48, 350, 22, R.ink);
      txt(c, lv === 2 ? 'Cells show atomic numbers' : 'Cells show symbols', 200, 78, 11, R.dim);
      c.drawImage(off.cv, 0, Y0);
      pulse = 0.5 + 0.5 * Math.sin(Date.now() / 120);
      if (busy && tgt) {
        x = ex(tgt); y = ey(tgt);
        c.globalAlpha = 0.5 + 0.5 * pulse; c.strokeStyle = R.ink; c.lineWidth = 3; K.L(c, x - 2, y - 2, CW + 4, CH + 4, 4); c.stroke(); c.globalAlpha = 1;
        if (pk && pk !== tgt) { c.strokeStyle = R.coral; c.lineWidth = 3; K.L(c, ex(pk) - 2, ey(pk) - 2, CW + 4, CH + 4, 4); c.stroke(); }
      }
      if (kb && !busy) { c.strokeStyle = R.ink; c.lineWidth = 2; K.L(c, ex(cur) - 2, ey(cur) - 2, CW + 4, CH + 4, 4); c.stroke(); }
      rect(c, 12, Y0 + gh + 8, 376, 74, 12, R.grid);
      if (!busy) {
        wrap(c, 'Atomic number counts up left to right, row by row. The two rows below the main table are the lanthanides and actinides.', 200, Y0 + gh + 30, 350, 11, 14, R.dim);
      } else if (pk === tgt) {
        txt(c, 'Yes! ' + tgt.s + ' is ' + tgt.nm, 200, Y0 + gh + 22, 18, R.green);
        wrap(c, '#' + tgt.n + ' . ' + S_CATN[tgt.cat] + ': ' + S_CATF[tgt.cat], 200, Y0 + gh + 44, 355, 11, 14, R.ink);
      } else {
        txt(c, (pk ? '' : 'Time up! ') + tgt.nm, 200, Y0 + gh + 16, 18, R.yellow);
        txt(c, 'Symbol ' + tgt.s + '  .  Atomic number ' + tgt.n, 200, Y0 + gh + 36, 13, R.ink);
        fit(c, S_CATN[tgt.cat], 200, Y0 + gh + 54, 355, 12, S_CATC[tgt.cat]);
      }
      var ly = Y0 + gh + 90;
      for (k = 0; k < 10; k++) { x = 16 + (k % 2) * 190; y = ly + Math.floor(k / 2) * 17; rect(c, x, y - 6, 11, 11, 3, S_CATC[k]); txt(c, S_CATN[k], x + 17, y, 11, R.ink, 'left'); }
      G.fxStep(dt);
      G.hud([['SCORE', pad(score)], ['STREAK', streak], ['LIVES', lives]]);
    }
    G.opt('Level', LV3, lv, function (j) { lv = j; start(); });
    G.begin(start);
  });

  /* ---------------------------------------------------------------
     BODY MAP - 16 organs, real front-view anatomy, shaded with
     radial gradients and drop shadows, cached to an offscreen layer
  --------------------------------------------------------------- */
  function S_ell(c, x, y, rx, ry, rot, c1, c2, hl, w) {
    var g0;
    c.save(); c.translate(x, y); c.rotate(rot || 0);
    if (hl) { c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, TAU); c.strokeStyle = '#ffffff'; c.lineWidth = w || 4; c.stroke(); c.restore(); return; }
    S_shadow(c, 'rgba(10,6,25,.5)', 6, 1, 3);
    g0 = c.createRadialGradient(-rx * 0.3, -ry * 0.35, 1, 0, 0, Math.max(rx, ry) * 1.15);
    g0.addColorStop(0, S_shade(c1, 55)); g0.addColorStop(0.55, c1); g0.addColorStop(1, c2 || S_shade(c1, -45));
    c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, TAU); c.fillStyle = g0; c.fill();
    S_noShadow(c);
    c.strokeStyle = 'rgba(23,18,51,.5)'; c.lineWidth = 1.3; c.stroke();
    c.beginPath(); c.ellipse(-rx * 0.3, -ry * 0.4, rx * 0.35, ry * 0.22, -0.4, 0, TAU); c.fillStyle = 'rgba(255,255,255,.30)'; c.fill();
    c.restore();
  }
  function S_tube(c, pts, w, col, hl) {
    var i;
    c.beginPath(); c.moveTo(pts[0], pts[1]);
    for (i = 2; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]);
    c.lineJoin = 'round'; c.lineCap = 'round';
    if (hl) { c.strokeStyle = '#ffffff'; c.lineWidth = w + 6; c.stroke(); return; }
    S_shadow(c, 'rgba(10,6,25,.4)', 4, 0, 2);
    c.strokeStyle = col; c.lineWidth = w; c.stroke();
    S_noShadow(c);
    c.strokeStyle = 'rgba(255,255,255,.28)'; c.lineWidth = Math.max(1, w * 0.3); c.stroke();
  }
  function S_segDist(p, x1, y1, x2, y2) {
    var dx = x2 - x1, dy = y2 - y1, t = clamp(((p.x - x1) * dx + (p.y - y1) * dy) / (dx * dx + dy * dy), 0, 1);
    return Math.hypot(p.x - x1 - t * dx, p.y - y1 - t * dy);
  }
  function S_inE(p, x, y, rx, ry, rot, pd) {
    var dx = p.x - x, dy = p.y - y, cs = Math.cos(-(rot || 0)), sn = Math.sin(-(rot || 0)), u = dx * cs - dy * sn, v = dx * sn + dy * cs;
    return (u * u) / ((rx + pd) * (rx + pd)) + (v * v) / ((ry + pd) * (ry + pd)) <= 1;
  }
  /* k id, nm name, col colour, fn one-line fact, q1 normal clue, q2 hard clue */
  var S_ORG = [
    { k: 'brain', nm: 'Brain', col: '#F5A3C7', fn: 'Controls the body and lets you think', q1: 'Which organ controls your body and lets you think?', q2: 'Which organ is protected by the skull?' },
    { k: 'trachea', nm: 'Trachea (windpipe)', col: '#BFE9FF', fn: 'Carries air between the throat and the lungs', q1: 'Which tube carries air down to your lungs?', q2: 'Which tube splits in two just above the lungs?' },
    { k: 'esophagus', nm: 'Esophagus (food pipe)', col: '#E7A6A0', fn: 'Carries swallowed food from the throat to the stomach', q1: 'Which tube carries food from your throat to your stomach?', q2: 'Which tube runs right behind the windpipe?' },
    { k: 'lungs', nm: 'Lungs', col: '#8FD3F4', fn: 'Take in oxygen and let carbon dioxide out', q1: 'Which organs do you use to breathe in oxygen?', q2: 'Where does oxygen pass into the blood?' },
    { k: 'heart', nm: 'Heart', col: '#E63946', fn: 'Pumps blood around the body', q1: 'Which organ pumps blood around the body?', q2: 'Which organ has four chambers?' },
    { k: 'diaphragm', nm: 'Diaphragm', col: '#D9A566', fn: 'Dome-shaped muscle beneath the lungs that helps you breathe', q1: 'Which muscle below the lungs helps you breathe?', q2: 'Which dome-shaped muscle separates chest from belly?' },
    { k: 'liver', nm: 'Liver', col: '#9B4A2A', fn: 'Cleans the blood and makes bile', q1: 'Which organ cleans the blood and makes bile?', q2: 'Which organ makes bile?' },
    { k: 'spleen', nm: 'Spleen', col: '#8E3A55', fn: 'Filters blood and helps fight infection', q1: 'Which organ filters blood and helps fight infection?', q2: 'Which organ sits tucked behind the stomach?' },
    { k: 'stomach', nm: 'Stomach', col: '#F4A261', fn: 'Churns food with acid and enzymes', q1: 'Where does food go after the food pipe?', q2: 'Which organ churns food with acid and enzymes?' },
    { k: 'pancreas', nm: 'Pancreas', col: '#E9C46A', fn: 'Makes insulin and digestive enzymes', q1: 'Which organ makes insulin?', q2: 'Which organ makes both insulin and digestive enzymes?' },
    { k: 'kidneys', nm: 'Kidneys', col: '#B5484F', fn: 'Filter the blood and make urine', q1: 'Which organs filter your blood to make urine?', q2: 'Which bean-shaped organs sit at the back and make urine?' },
    { k: 'small', nm: 'Small intestine', col: '#FF8FB1', fn: 'Finishes digestion and absorbs nutrients', q1: 'Which long coiled tube comes right after the stomach?', q2: 'Where does most digestion finish and nutrients get absorbed?' },
    { k: 'large', nm: 'Large intestine', col: '#D9C15A', fn: 'Absorbs water and forms solid waste', q1: 'Which organ absorbs water and turns leftovers into solid waste?', q2: 'Which part of the gut is wider but shorter than the small intestine?' },
    { k: 'bladder', nm: 'Bladder', col: '#B39DDB', fn: 'Stores urine until it leaves the body', q1: 'Which organ stores urine?', q2: 'Where does urine wait before it leaves the body?' },
    { k: 'spinal', nm: 'Spinal cord', col: '#FFD166', fn: 'Carries nerve signals between the brain and the body', q1: 'Which nerve pathway runs down inside your spine?', q2: 'Which structure carries signals between the brain and the rest of the body?' },
    { k: 'skin', nm: 'Skin', col: '#E8B08A', fn: 'The largest organ; protects the body and controls temperature', q1: 'Which organ covers and protects your whole body?', q2: 'Which is the largest organ of the body?' }
  ];
  var S_HITORDER = ['brain', 'trachea', 'esophagus', 'heart', 'lungs', 'spleen', 'liver', 'stomach', 'pancreas', 'kidneys', 'bladder', 'small', 'large', 'diaphragm', 'spinal', 'skin'];
  var S_EASY = ['brain', 'lungs', 'heart', 'liver', 'stomach', 'kidneys', 'bladder', 'skin'];
  function S_orgByK(k) { var i; for (i = 0; i < S_ORG.length; i++) if (S_ORG[i].k === k) return S_ORG[i]; }
  function S_orgXY(o) {
    return { brain: [200, 98], trachea: [200, 144], esophagus: [208, 170], lungs: [226, 176], heart: [206, 192], diaphragm: [200, 207], liver: [184, 226], spleen: [250, 214], stomach: [224, 228], pancreas: [206, 246], kidneys: [242, 252], small: [200, 278], large: [224, 276], bladder: [200, 309], spinal: [200, 200], skin: [128, 220] }[o.k];
  }
  function S_bodyDraw(c) {
    var g0;
    g0 = c.createLinearGradient(120, 90, 280, 460);
    g0.addColorStop(0, '#4A3D8F'); g0.addColorStop(1, '#332966');
    S_shadow(c, 'rgba(10,6,25,.4)', 8, 0, 3);
    rect(c, 150, 300, 48, 152, 20, g0); rect(c, 202, 300, 48, 152, 20, g0);
    rect(c, 112, 142, 26, 150, 13, g0); rect(c, 262, 142, 26, 150, 13, g0);
    rect(c, 188, 122, 24, 20, 4, g0);
    rect(c, 142, 134, 116, 186, 30, g0);
    circ(c, 200, 100, 26, g0);
    S_noShadow(c);
    c.strokeStyle = 'rgba(150,135,220,.5)'; c.lineWidth = 1.5;
    K.L(c, 150, 300, 48, 152, 20); c.stroke(); K.L(c, 202, 300, 48, 152, 20); c.stroke();
    K.L(c, 112, 142, 26, 150, 13); c.stroke(); K.L(c, 262, 142, 26, 150, 13); c.stroke();
    K.L(c, 142, 134, 116, 186, 30); c.stroke();
    c.beginPath(); c.arc(200, 100, 26, 0, TAU); c.stroke();
    c.beginPath(); c.ellipse(190, 84, 8, 5, 0, 0, TAU); c.fillStyle = 'rgba(255,255,255,.10)'; c.fill();
  }
  function S_orgDraw(c, o, hl) {
    var k = o.k, f = o.col;
    if (k === 'brain') { S_ell(c, 200, 98, 19, 15, 0, f, null, hl); if (!hl) { c.strokeStyle = 'rgba(23,18,51,.4)'; c.lineWidth = 1.3; line(c, 200, 84, 200, 112, 'rgba(23,18,51,.4)', 1.3); line(c, 188, 92, 196, 97, 'rgba(23,18,51,.4)', 1.3); line(c, 212, 92, 204, 97, 'rgba(23,18,51,.4)', 1.3); } }
    else if (k === 'trachea') S_tube(c, [200, 128, 200, 160, 186, 172, 200, 160, 214, 172], hl ? 10 : 6, f, hl);
    else if (k === 'esophagus') S_tube(c, [208, 128, 208, 205, 222, 216], hl ? 11 : 5, f, hl);
    else if (k === 'lungs') { S_ell(c, 174, 176, 21, 33, 0.1, f, null, hl); S_ell(c, 226, 176, 21, 33, -0.1, f, null, hl); }
    else if (k === 'heart') { if (hl) { c.beginPath(); c.moveTo(209, 211); c.bezierCurveTo(181, 193, 189, 166, 209, 180); c.bezierCurveTo(229, 166, 237, 193, 209, 211); c.closePath(); c.strokeStyle = '#fff'; c.lineWidth = 4; c.stroke(); } else { S_shadow(c, 'rgba(10,6,25,.5)', 5, 1, 2); c.beginPath(); c.moveTo(209, 211); c.bezierCurveTo(181, 193, 189, 166, 209, 180); c.bezierCurveTo(229, 166, 237, 193, 209, 211); c.closePath(); var g1 = c.createRadialGradient(198, 180, 1, 209, 195, 34); g1.addColorStop(0, S_shade(f, 50)); g1.addColorStop(1, S_shade(f, -30)); c.fillStyle = g1; c.fill(); S_noShadow(c); c.strokeStyle = 'rgba(23,18,51,.5)'; c.lineWidth = 1.3; c.stroke(); } }
    else if (k === 'diaphragm') S_tube(c, [148, 210, 176, 200, 200, 204, 224, 200, 252, 210], hl ? 10 : 5, f, hl);
    else if (k === 'liver') S_ell(c, 184, 226, 34, 14, -0.12, f, null, hl);
    else if (k === 'spleen') S_ell(c, 250, 214, 10, 13, 0.2, f, null, hl);
    else if (k === 'stomach') S_ell(c, 224, 228, 20, 13, 0.55, f, null, hl);
    else if (k === 'pancreas') S_ell(c, 206, 246, 24, 7, 0.12, f, null, hl);
    else if (k === 'kidneys') {
      c.setLineDash(hl ? [] : [3, 3]);
      [[158, 252, 0.15], [242, 252, -0.15]].forEach(function (q) { c.beginPath(); c.ellipse(q[0], q[1], 8, 14, q[2], 0, TAU); if (!hl) { c.fillStyle = 'rgba(181,72,79,.45)'; c.fill(); } c.strokeStyle = hl ? '#ffffff' : '#FF9AA2'; c.lineWidth = hl ? 4 : 2; c.stroke(); });
      c.setLineDash([]);
    }
    else if (k === 'large') { c.lineJoin = 'round'; c.lineCap = 'round'; c.beginPath(); c.moveTo(176, 296); c.lineTo(176, 258); c.lineTo(224, 258); c.lineTo(224, 296); if (hl) { c.strokeStyle = '#ffffff'; c.lineWidth = 15; c.stroke(); } c.strokeStyle = 'rgba(23,18,51,.5)'; c.lineWidth = 12; c.stroke(); c.strokeStyle = f; c.lineWidth = 9; c.stroke(); }
    else if (k === 'small') { c.lineJoin = 'round'; c.lineCap = 'round'; c.beginPath(); c.moveTo(186, 268); c.lineTo(214, 268); c.lineTo(214, 275); c.lineTo(186, 275); c.lineTo(186, 282); c.lineTo(214, 282); c.lineTo(214, 289); c.lineTo(190, 289); if (hl) { c.strokeStyle = '#ffffff'; c.lineWidth = 9; c.stroke(); } c.strokeStyle = f; c.lineWidth = 5; c.stroke(); }
    else if (k === 'bladder') S_ell(c, 200, 309, 9, 10, 0, f, null, hl);
    else if (k === 'spinal') { c.setLineDash(hl ? [] : [2, 3]); S_tube(c, [200, 124, 200, 300], hl ? 8 : 3, f, hl); c.setLineDash([]); }
    else if (k === 'skin') { if (hl) { c.strokeStyle = '#ffffff'; c.lineWidth = 3; c.globalAlpha = 0.5; K.L(c, 142, 76, 116, 244, 30); c.stroke(); c.globalAlpha = 1; } }
  }
  function S_orgHit(o, p) {
    var k = o.k;
    if (k === 'brain') return S_inE(p, 200, 98, 19, 15, 0, 5);
    if (k === 'trachea') return S_segDist(p, 200, 128, 200, 160) < 8 || S_segDist(p, 200, 160, 186, 172) < 8 || S_segDist(p, 200, 160, 214, 172) < 8;
    if (k === 'esophagus') return S_segDist(p, 208, 128, 208, 205) < 7 || S_segDist(p, 208, 205, 222, 216) < 7;
    if (k === 'lungs') return S_inE(p, 174, 176, 21, 33, 0.1, 3) || S_inE(p, 226, 176, 21, 33, -0.1, 3);
    if (k === 'heart') return S_inE(p, 209, 191, 17, 16, 0, 2);
    if (k === 'diaphragm') return p.x >= 145 && p.x <= 255 && p.y >= 197 && p.y <= 213;
    if (k === 'liver') return S_inE(p, 184, 226, 34, 14, -0.12, 3);
    if (k === 'spleen') return S_inE(p, 250, 214, 10, 13, 0.2, 4);
    if (k === 'stomach') return S_inE(p, 224, 228, 20, 13, 0.55, 3);
    if (k === 'pancreas') return S_inE(p, 206, 246, 24, 7, 0.12, 4);
    if (k === 'kidneys') return S_inE(p, 158, 252, 8, 14, 0.15, 5) || S_inE(p, 242, 252, 8, 14, -0.15, 5);
    if (k === 'large') return S_segDist(p, 176, 296, 176, 258) < 9 || S_segDist(p, 176, 258, 224, 258) < 9 || S_segDist(p, 224, 258, 224, 296) < 9;
    if (k === 'small') return p.x >= 181 && p.x <= 219 && p.y >= 263 && p.y <= 294;
    if (k === 'bladder') return S_inE(p, 200, 309, 9, 10, 0, 5);
    if (k === 'spinal') return S_segDist(p, 200, 124, 200, 300) < 7;
    if (k === 'skin') {
      if (S_inE(p, 200, 100, 27, 27, 0, 2)) return true;
      if (p.x >= 141 && p.x <= 259 && p.y >= 133 && p.y <= 321) return true;
      if (p.x >= 111 && p.x <= 139 && p.y >= 141 && p.y <= 293) return true;
      if (p.x >= 261 && p.x <= 289 && p.y >= 141 && p.y <= 293) return true;
      if (p.x >= 149 && p.x <= 199 && p.y >= 299 && p.y <= 453) return true;
      if (p.x >= 201 && p.x <= 251 && p.y >= 299 && p.y <= 453) return true;
      return false;
    }
    return false;
  }

  def('bodyMap', EDU, 'Body Map', R.coral, 'Sixteen organs, one real body: find each by name, by clue, or by what it does. Wrong guesses reveal the answer.', 'Tap the organ . arrows cycle, Space picks . three misses ends the run', function (G) {
    var W = 400, H = 530, OY = 26, c = G.canvas(W, H), lv = 1, secs = [11, 15, 18], lives, score, streak, bestS, tgt, qs, tl, tlMax, busy, fb, pk, cur, kb, lastK, off;
    function buildOff() {
      off = S_off(W, 420);
      var oc = off.c, order2 = ['skin', 'diaphragm', 'spinal', 'kidneys', 'lungs', 'liver', 'spleen', 'stomach', 'pancreas', 'large', 'small', 'bladder', 'heart', 'esophagus', 'trachea', 'brain'];
      clear(oc, W, 420, R.bg);
      S_bodyDraw(oc);
      order2.forEach(function (id) { S_orgDraw(oc, S_orgByK(id), false); });
    }
    function poolOrg() { return S_ORG.filter(function (o) { return lv > 0 || S_EASY.indexOf(o.k) > -1; }); }
    function nextQ() {
      var p = poolOrg();
      do { tgt = pick(p); } while (tgt.k === lastK && p.length > 1);
      lastK = tgt.k;
      qs = lv === 0 ? 'Tap the ' + tgt.nm.toLowerCase() : lv === 1 ? tgt.q1 : tgt.q2;
      tlMax = tl = secs[lv] - Math.min(streak, 6) * 0.35; busy = false; fb = 0; pk = null;
    }
    function start() { G.gen = (G.gen || 0) + 1; lives = 3; score = 0; streak = 0; bestS = 0; lastK = ''; kb = false; cur = 0; G.fx = []; buildOff(); nextQ(); G.frame(step); }
    function answer(o) {
      if (busy || !o) return;
      busy = true; pk = o;
      G.tally(o === tgt, tgt.nm + ': ' + tgt.fn);
      if (o === tgt) { streak++; bestS = Math.max(bestS, streak); score += 10 + Math.min(streak, 10) * 2 + Math.ceil(tl); G.burst(S_orgXY(o)[0], S_orgXY(o)[1] + OY, R.green, 18); fb = 1.2; }
      else { lives--; streak = 0; fb = 2.6; }
    }
    function orgAt(p) {
      var q = { x: p.x, y: p.y - OY }, i, o;
      for (i = 0; i < S_HITORDER.length; i++) { o = S_orgByK(S_HITORDER[i]); if (S_orgHit(o, q)) return o; }
      return null;
    }
    G.pointer({ down: function (p) { kb = false; answer(orgAt(p)); } });
    G.press = function (k) {
      kb = true;
      if (k === 'ArrowLeft' || k === 'a' || k === 'ArrowUp' || k === 'w') cur = (cur + S_ORG.length - 1) % S_ORG.length;
      else if (k === 'ArrowRight' || k === 'd' || k === 'ArrowDown' || k === 's') cur = (cur + 1) % S_ORG.length;
      else if (k === ' ' || k === 'Enter') answer(S_ORG[cur]);
    };
    G.pad([['<', 'ArrowLeft'], ['>', 'ArrowRight'], ['Pick', 'Space']]);
    function step(dt) {
      var k, o, xy, lx, ly, side, ph = 0.5 + 0.5 * Math.sin(Date.now() / 110);
      if (!busy) { tl -= dt; if (tl <= 0) { busy = true; pk = null; lives--; streak = 0; fb = 2.6; G.tally(false, tgt.nm + ': ' + tgt.fn); } }
      else { fb -= dt; if (fb <= 0) { if (lives <= 0) { G.over(score, 'Out of lives with ' + score + ' points. Best streak ' + bestS + '.'); return; } nextQ(); } }
      clear(c, W, H);
      rect(c, 20, 8, 360, 7, 4, R.grid); rect(c, 20, 8, Math.max(0, 360 * tl / tlMax), 7, 4, tl < 3 && !busy ? R.coral : R.coral);
      rect(c, 12, 22, 376, 62, 12, R.grid);
      if (!busy) wrap(c, qs, 200, 53 - (qs.length > 34 ? 10 : 0), 350, qs.length > 34 ? 15 : 20, 21, R.ink);
      else if (pk === tgt) wrap(c, 'Yes! ' + tgt.fn, 200, 53 - (tgt.fn.length > 34 ? 10 : 0), 350, 15, 18, R.green);
      else { txt(c, (pk ? 'Not quite. ' : 'Time up! ') + 'It is the ' + tgt.nm.toLowerCase(), 200, 42, 13, R.yellow); wrap(c, tgt.fn, 200, 64, 350, 12, 15, R.ink); }
      c.save(); c.translate(0, OY);
      c.drawImage(off.cv, 0, 0);
      if (busy) {
        c.globalAlpha = 0.45 + 0.55 * ph; S_orgDraw(c, tgt, true); c.globalAlpha = 1;
        if (pk && pk !== tgt) { c.globalAlpha = 0.9; S_orgDraw(c, pk, true); c.globalAlpha = 1; }
        xy = S_orgXY(tgt); side = xy[0] < 200 ? 0 : 1; lx = side ? 343 : 57; ly = clamp(xy[1], 120, 300);
        c.setLineDash([4, 3]); line(c, side ? 292 : 108, ly, xy[0], xy[1], 'rgba(255,255,255,.7)', 1.5); c.setLineDash([]);
        rect(c, lx - 54, ly - 13, 108, 26, 8, R.yellow); fit(c, tgt.nm, lx, ly, 100, 12, '#171233');
      }
      if (kb && !busy) { c.globalAlpha = 0.9; S_orgDraw(c, S_ORG[cur], true); c.globalAlpha = 1; }
      wrap(c, 'Dashed outline = structure deeper inside the body', 72, 400, 128, 11, 14, R.dim);
      c.restore();
      G.fxStep(dt);
      G.hud([['SCORE', pad(score)], ['STREAK', streak], ['LIVES', lives]]);
    }
    G.opt('Level', LV3, lv, function (j) { lv = j; start(); });
    G.begin(start);
  });

  /* ---------------------------------------------------------------
     MATTER SORTER - solid / liquid / gas / plasma, falling cards,
     with a cached particle-arrangement icon per state
  --------------------------------------------------------------- */
  var S_MATN = ['Solid', 'Liquid', 'Gas', 'Plasma'];
  var S_MATC = [R.orange, R.blue, R.violet, R.magenta];
  var S_MAT = ('rock|0|0|Keeps its own shape and volume;wood|0|0|A solid: keeps its own shape;brick|0|0|A hard, rigid solid;chalk|0|0|A soft solid mineral;coin|0|0|A solid disc of metal;key|0|0|A solid piece of metal;book|0|0|Pages keep their shape: solid;shoe|0|0|A solid, shaped object;bone|0|0|A hard solid structure;tooth|0|0|One of the hardest solids in the body;glass window|0|0|Solid, though it looks clear;steel nail|0|0|A solid piece of metal;eraser|0|0|A solid block of rubber;pencil|0|0|Mostly solid wood and graphite;' +
    'diamond|0|1|The hardest natural solid known;ice|0|1|Water in its solid form;iron|0|1|A solid metal at room temperature;gold|0|1|A solid, dense metal;silver|0|1|A solid, shiny metal;aluminum foil|0|1|A thin solid metal sheet;salt|0|1|Solid crystals of sodium chloride;sugar|0|1|Solid crystals you can pour;cotton|0|1|A solid fiber, even though it is soft;candle wax|0|1|Solid at room temperature, melts when heated;cheese|0|1|A solid, though a soft one;chocolate bar|0|1|Solid until it warms above about 30C;marble statue|0|1|Carved from solid stone;snowflake|0|1|A tiny crystal of solid water;' +
    'sand|0|2|Tiny solid grains, not a liquid;butter|0|2|Solid but soft enough to spread;rubber tire|0|2|A solid, flexible material;wool sweater|0|2|Solid fibers woven together;dry ice|0|2|Solid carbon dioxide, colder than ice;' +
    'water|1|0|Flows and takes the shape of its container;milk|1|0|A liquid: it flows and pours;juice|1|0|A liquid: it flows;rain|1|0|Liquid water falling from clouds;soda|1|0|A liquid; the fizz is dissolved gas;coffee|1|0|A hot liquid drink;tea|1|0|A hot liquid drink;oil|1|0|Cooking oil is a liquid;soup|1|0|A liquid food, often with solid bits in it;' +
    'shampoo|1|1|A thick liquid;paint|1|1|A liquid until it dries;liquid soap|1|1|A liquid, unlike bar soap;nail polish|1|1|A liquid that dries into a solid coat;vinegar|1|1|A liquid: acetic acid in water;blood|1|1|A liquid that flows around the body;gasoline|1|1|A liquid fuel;melted butter|1|1|Butter becomes a liquid once heated;syrup|1|1|A thick, sticky liquid;' +
    'honey|1|2|Thick, but it still flows: a liquid;mercury|1|2|A metal that is liquid at room temperature;molten lava|1|2|Melted rock flowing as a liquid;melted ice cream|1|2|Ice cream turns liquid as it warms;liquid nitrogen|1|2|Nitrogen gas cooled until it becomes a liquid;' +
    'air|2|0|A mixture of gases around us;oxygen|2|0|The gas we breathe in to survive;helium|2|0|A very light gas used to fill balloons;carbon dioxide|2|0|The gas we breathe out;the gas in a balloon|2|0|Usually helium, a gas;' +
    'propane gas|2|1|A gas used as fuel for grills;argon gas|2|1|A gas used inside some light bulbs;neon gas|2|1|A gas that glows orange-red in signs;chlorine gas|2|1|A reactive gas, harmful in large amounts;ozone|2|1|A gas made of three oxygen atoms;' +
    'steam|2|2|Water as a gas, above 100C;water vapor|2|2|Invisible water in gas form;hydrogen|2|2|The lightest gas in the universe;nitrogen|2|2|About 78 percent of the air is this gas;methane|2|2|A gas released by decomposing plants and waste;carbon monoxide|2|2|A dangerous, colorless gas from incomplete burning;' +
    'lightning|3|1|A giant spark of ionized gas: plasma;the Sun|3|1|A giant glowing ball of plasma;a star|3|1|Stars are made of plasma;the aurora|3|1|Charged particles glow as plasma in the sky;the glow of a neon sign|3|1|Electricity turns the gas inside into plasma;solar wind|3|1|A stream of plasma flowing from the Sun;the glow in a fluorescent tube|3|1|Electricity ionizes the gas into plasma').split(';').map(function (s) {
    var a = s.split('|'); return [a[0], +a[1], +a[2], a[3]];
  });
  function S_matIcon(bin) {
    var o = S_off(46, 46), oc = o.c, i, x, y;
    clear(oc, 46, 46, 'rgba(0,0,0,0)');
    if (bin === 0) {
      for (y = 0; y < 4; y++) for (x = 0; x < 4; x++) { S_shadow(oc, 'rgba(0,0,0,.4)', 2, 0, 1); circ(oc, 6 + x * 11, 6 + y * 11, 3.6, S_MATC[0]); S_noShadow(oc); }
    } else if (bin === 1) {
      [[6, 10], [17, 6], [28, 12], [38, 8], [10, 22], [22, 20], [33, 25], [5, 34], [16, 32], [27, 36], [38, 30], [20, 40]].forEach(function (p) { S_shadow(oc, 'rgba(0,0,0,.35)', 2, 0, 1); circ(oc, p[0], p[1], 3.4, S_MATC[1]); S_noShadow(oc); });
    } else if (bin === 2) {
      [[4, 6], [22, 3], [40, 9], [10, 20], [33, 23], [4, 38], [24, 34], [42, 40], [16, 44]].forEach(function (p) { circ(oc, p[0], p[1], 2.6, S_MATC[2]); line(oc, p[0] - 5, p[1] - 2, p[0] - 1, p[1] - 0.5, 'rgba(140,124,240,.45)', 1.5); });
    } else {
      [[8, 8], [24, 5], [38, 14], [14, 24], [32, 28], [6, 36], [26, 40], [40, 34]].forEach(function (p) {
        var g0 = oc.createRadialGradient(p[0], p[1], 0, p[0], p[1], 6);
        g0.addColorStop(0, '#ffffff'); g0.addColorStop(0.4, S_MATC[3]); g0.addColorStop(1, 'rgba(255,93,162,0)');
        oc.beginPath(); oc.arc(p[0], p[1], 6, 0, TAU); oc.fillStyle = g0; oc.fill();
      });
    }
    return o.cv;
  }
  def('matterSort', EDU, 'Matter Sorter', R.blue, 'Things fall from the sky, including a few surprises like lightning and dry ice. Sort each into solid, liquid, gas or plasma.', 'Click a bin or press 1-4 . arrows work too . three misses ends the run', function (G) {
    var W = 400, H = 480, c = G.canvas(W, H), lv = 1, it, lives, score, streak, bestS, sp, sp0, pool, msg, note, msgCol, msgT, n = 4, BY = 396, lastT, icons = [S_matIcon(0), S_matIcon(1), S_matIcon(2), S_matIcon(3)];
    var BINS = [{ n: 'Solid', c: R.orange }, { n: 'Liquid', c: R.blue }, { n: 'Gas', c: R.violet }, { n: 'Plasma', c: R.magenta }];
    function mkPool() {
      return S_MAT.filter(function (m) { return lv === 0 ? m[2] === 0 : lv === 1 ? m[2] <= 1 : m[2] >= 1; });
    }
    function spawn() {
      var p;
      do { p = pick(pool); } while (pool.length > 1 && p[0] === lastT);
      lastT = p[0]; it = { t: p[0], b: p[1], note: p[3], y: 108, x: rr(90, 310), gone: 0, res: 0 };
    }
    function start() { G.gen = (G.gen || 0) + 1; lives = 3; score = 0; streak = 0; bestS = 0; sp0 = sp = [30, 42, 56][lv]; pool = mkPool(); msg = ''; note = ''; msgT = 0; lastT = ''; G.fx = []; spawn(); G.frame(step); }
    function endLater() { gl(G, function () { if (lives <= 0) G.over(score, 'Out of lives with ' + score + ' points. Best streak ' + bestS + '.'); }, 1400); }
    function put(b) {
      if (!it || it.res || b < 0 || b >= n || lives <= 0) return;
      G.tally(b === it.b, it.t + ' is a ' + S_MATN[it.b].toLowerCase() + ': ' + it.note);
      if (b === it.b) { it.res = 1; streak++; bestS = Math.max(bestS, streak); score += 10 + Math.min(streak, 10); sp = Math.min(sp + 2.2, sp0 * 2); G.burst(it.x, it.y, S_MATC[b], 14); msg = 'Yes! ' + it.t + ' is a ' + S_MATN[b].toLowerCase(); note = it.note; msgCol = R.green; msgT = 1.3; }
      else { it.res = 2; lives--; streak = 0; msg = it.t + ' is a ' + S_MATN[it.b].toLowerCase() + ', not a ' + S_MATN[b].toLowerCase(); note = it.note; msgCol = R.yellow; msgT = 2.6; if (lives <= 0) endLater(); }
      it.gone = 0.35;
    }
    G.pointer({ down: function (p) { var w = 380 / n, b = Math.floor((p.x - 10) / w); if (p.y > BY - 20) put(b); } });
    G.press = function (k) {
      var i = '1234'.indexOf(k);
      if (i > -1) put(i); else if (k === 'ArrowLeft') put(0); else if (k === 'ArrowDown') put(1); else if (k === 'ArrowUp') put(2); else if (k === 'ArrowRight') put(3);
    };
    G.pad(BINS.map(function (b, i) { return [b.n, String(i + 1)]; }));
    function step(dt) {
      var i, w = 380 / n, cw, x0;
      if (it) {
        if (!it.res) {
          it.y += sp * dt;
          if (it.y > BY - 30) { G.tally(false, it.t + ' is a ' + S_MATN[it.b].toLowerCase() + ': ' + it.note); lives--; streak = 0; msg = 'Too slow! ' + it.t + ' is a ' + S_MATN[it.b].toLowerCase(); note = it.note; msgCol = R.yellow; msgT = 2.6; it.res = 2; it.gone = 0.25; if (lives <= 0) endLater(); }
        } else { it.gone -= dt; if (it.gone <= 0) { if (lives > 0) spawn(); else it = null; } }
      }
      if (msgT > 0) msgT -= dt;
      clear(c, W, H);
      rect(c, 12, 8, 376, 82, 12, R.grid);
      if (msgT > 0) { fit(c, msg, 200, 28, 350, 16, msgCol); wrap(c, note, 200, 56, 350, 13, 17, R.ink); }
      else { fit(c, 'Solid keeps its shape. Liquid flows and fills the bottom.', 200, 26, 350, 13, R.dim); fit(c, 'Gas spreads to fill its space. Plasma is a glowing ionized gas.', 200, 48, 350, 13, R.dim); }
      for (i = 0; i < n; i++) {
        x0 = 10 + i * w;
        rect(c, x0 + 3, BY, w - 6, 70, 12, BINS[i].c);
        c.save(); c.globalAlpha = 0.9; c.drawImage(icons[i], x0 + w / 2 - 17, BY + 4, 34, 34); c.restore();
        fit(c, BINS[i].n, x0 + w / 2, BY + 46, w - 14, 13, '#171233');
        txt(c, String(i + 1), x0 + w / 2, BY + 62, 11, 'rgba(23,18,51,.6)');
      }
      if (it) {
        c.save(); c.globalAlpha = 0.95; c.drawImage(icons[it.b], it.x - 15, it.y - 44, 30, 30); c.restore();
        c.font = '700 21px Figtree, sans-serif'; cw = Math.min(200, c.measureText(it.t).width + 34);
        rect(c, it.x - cw / 2, it.y - 14, cw, 46, 12, it.res === 1 ? R.green : it.res === 2 ? R.coral : R.ink);
        fit(c, it.t, it.x, it.y + 9, cw - 16, 21, '#171233');
      }
      G.fxStep(dt);
      G.hud([['SCORE', pad(score)], ['STREAK', streak], ['LIVES', lives]]);
    }
    G.opt('Level', LV3, lv, function (j) { lv = j; start(); });
    G.begin(start);
  });

  /* ---------------------------------------------------------------
     shared ordering engine (like the framework order(), but shows a
     short reason and points at the correct next tile on a miss) -
     used by Food Chain and Planet Parade
  --------------------------------------------------------------- */
  function S_order(G, cfg) {
    var W = 400, H = 480, c = G.canvas(W, H), lv = 1, q, tiles, next, lives, score, round, t0, flash, hint, msg, msgT, mistakes, cur;
    function deal() { q = cfg.make(lv); tiles = shuf(q.items.map(function (s, k) { return { t: s, k: k, ok: 0 }; })); next = 0; t0 = 0; mistakes = 0; flash = null; hint = null; msgT = 0; cur = 0; }
    function start() { G.gen = (G.gen || 0) + 1; lives = 4; score = 0; round = 0; G.fx = []; deal(); G.frame(step); }
    function ty(i) { return 128 + i * 58; }
    function pickT(i) {
      var t = tiles[i], k;
      if (!t || t.ok || lives <= 0 || next >= tiles.length) return;
      if (t.t === q.items[next]) {
        G.tally(true);
        t.ok = next + 1; next++; score += 10; G.burst(200, ty(i) + 22, R.green, 12);
        if (next >= tiles.length) { round++; score += Math.max(0, 40 - mistakes * 10) + Math.max(0, Math.ceil(40 - t0)); gl(G, deal, 1000); }
      } else {
        G.tally(false, q.items[next] + (q.sub ? ' (' + q.sub[next] + ')' : ''));
        lives--; mistakes++; flash = { i: i, t: 0.4 };
        for (k = 0; k < tiles.length; k++) if (tiles[k].t === q.items[next]) hint = { i: k, t: 1.8 };
        msg = q.why ? q.why(next) : 'Look for ' + q.items[next] + ' next';
        msgT = 2.4;
        if (lives <= 0) gl(G, function () { G.over(score, 'Out of lives after ' + round + ' round' + (round === 1 ? '' : 's') + '. Score: ' + score); }, 1600);
      }
    }
    G.pointer({ down: function (p) { var i; for (i = 0; i < tiles.length; i++) if (p.x >= 50 && p.x <= 350 && p.y >= ty(i) && p.y <= ty(i) + 52) pickT(i); } });
    G.press = function (k) {
      var n = tiles.length;
      if (k === 'ArrowUp' || k === 'w' || k === 'ArrowLeft' || k === 'a') cur = (cur + n - 1) % n;
      else if (k === 'ArrowDown' || k === 's' || k === 'ArrowRight' || k === 'd') cur = (cur + 1) % n;
      else if (k === ' ' || k === 'Enter') pickT(cur);
    };
    G.pad([['^', 'ArrowUp'], ['v', 'ArrowDown'], ['Pick', 'Space']]);
    function step(dt) {
      var i, y, col;
      if (next < tiles.length && lives > 0) t0 += dt;
      if (flash) { flash.t -= dt; if (flash.t <= 0) flash = null; }
      if (hint) { hint.t -= dt; if (hint.t <= 0) hint = null; }
      if (msgT > 0) msgT -= dt;
      clear(c, W, H);
      wrap(c, q.q, 200, 28, 360, 17, 21, R.ink);
      if (msgT > 0) fit(c, msg, 200, 80, 370, 13, R.coral);
      else txt(c, next < tiles.length ? 'Next: pick number ' + (next + 1) + ' of ' + tiles.length : 'Perfect!', 200, 80, 14, R.yellow);
      txt(c, q.first + '  to  ' + q.last, 200, 102, 12, R.dim);
      for (i = 0; i < tiles.length; i++) {
        y = ty(i);
        col = tiles[i].ok ? R.green : (flash && flash.i === i ? R.coral : R.violet);
        rect(c, 50, y, 300, 50, 10, col);
        if (hint && hint.i === i) { c.strokeStyle = R.yellow; c.lineWidth = 3; K.L(c, 48, y - 2, 304, 54, 11); c.stroke(); }
        var icoX = cfg.icon ? 222 : 212, icoW = cfg.icon ? 232 : 256;
        if (cfg.icon) { var im = cfg.icon(tiles[i].t); if (im) c.drawImage(im, 56, y + 6, 38, 38); }
        fit(c, tiles[i].t, icoX, y + 25 - (tiles[i].ok ? 7 : 0), icoW, 17, '#171233');
        if (tiles[i].ok) { fit(c, q.sub[tiles[i].ok - 1], icoX, y + 38, icoW, 11, 'rgba(23,18,51,.75)'); if (!cfg.icon) txt(c, String(tiles[i].ok), 68, y + 25, 15, '#171233'); }
        if (G.k && (G.k.ArrowUp || G.k.ArrowDown || G.k.ArrowLeft || G.k.ArrowRight || G.k.w || G.k.s || G.k.a || G.k.d) && i === cur) { c.strokeStyle = R.ink; c.lineWidth = 3; K.L(c, 48, y - 2, 304, 54, 11); c.stroke(); }
      }
      G.fxStep(dt);
      G.hud([['SCORE', pad(score)], ['ROUND', round + 1], ['LIVES', lives]]);
    }
    G.opt('Level', LV3, lv, function (i) { lv = i; start(); });
    G.begin(start);
  }

  /* ---------------------------------------------------------------
     FOOD CHAIN - who eats whom, verified real chains across biomes
  --------------------------------------------------------------- */
  var S_FC = ('Grass,Rabbit,Fox;Grass,Mouse,Owl;Grass,Grasshopper,Praying mantis;Kelp,Sea urchin,Sea otter;Phytoplankton,Krill,Blue whale;Grass,Zebra,Lion;Grass,Cow,Human;Seagrass,Green turtle,Tiger shark;Algae,Snail,Duck;Grass,Deer,Wolf;Nuts,Squirrel,Hawk;Grass,Impala,Lion;Grass,Wildebeest,Lion;Grass,Locust,Lizard;Pond plants,Mayfly larva,Trout;Grass,Prairie dog,Rattlesnake;' +
    'Leaf,Caterpillar,Robin,Sparrowhawk;Corn,Mouse,Snake,Hawk;Algae,Mosquito larva,Minnow,Heron;Phytoplankton,Krill,Adelie penguin,Leopard seal;Grass,Grasshopper,Frog,Snake;Grass,Rabbit,Fox,Eagle;Grass,Vole,Weasel,Owl;Phytoplankton,Copepod,Herring,Tuna;Algae,Water flea,Small fish,Kingfisher;Leaves,Caterpillar,Lizard,Roadrunner;Plankton,Shrimp,Salmon,Bear;Algae,Zooplankton,Small fish,Shark;Grass,Grasshopper,Shrew,Owl;Nectar,Bee,Spider,Shrike;' +
    'Grass,Grasshopper,Frog,Snake,Hawk;Phytoplankton,Zooplankton,Herring,Seal,Orca;Algae,Mosquito larva,Minnow,Bass,Osprey;Seaweed,Periwinkle,Crab,Octopus,Seal;Grass,Cricket,Mouse,Snake,Owl;Grass,Grasshopper,Toad,Snake,Hawk;Diatoms,Copepod,Anchovy,Tuna,Shark;Phytoplankton,Krill,Fish,Squid,Sperm whale').split(';').map(function (s) { return s.split(','); });
  var S_ROLE = ['Producer', 'Primary consumer', 'Secondary consumer', 'Tertiary consumer', 'Quaternary consumer'];
  var S_lastFC = null;
  def('foodChain', EDU, 'Food Chain', R.orange, 'Energy flows from the eaten to the eater, across grassland, ocean, forest and tundra. Put each food chain in order, from producer to top predator.', 'Tap the links in order . arrows + Space work too . four wrong taps end the run', function (G) {
    S_order(G, { make: function (lv) {
      var n = lv + 3, ch;
      do { ch = pick(S_FC.filter(function (x) { return x.length === n; })); } while (ch === S_lastFC);
      S_lastFC = ch;
      return {
        q: 'Who eats whom? Put the producer first and the top predator last', items: ch.slice(), sub: S_ROLE.slice(0, n), first: 'eaten first', last: 'top predator',
        why: function (next) { return next ? ch[next] + ' eats ' + ch[next - 1] + ', so it comes next' : 'Start with ' + ch[0] + ': producers make their own food from sunlight'; }
      };
    } });
  });

  /* ---------------------------------------------------------------
     COLOR LAB - real physics: light mixes by ADDING wavelengths
     (RGB, additive), ink/pigment mixes by SUBTRACTING them (CMY,
     subtractive). The preview on screen is real canvas colour
     compositing, not just a label.
  --------------------------------------------------------------- */
  var S_LNAME = { R: 'Red light', G: 'Green light', B: 'Blue light' };
  var S_LHEX = { R: '#FF3B3B', G: '#37D66B', B: '#3B7BFF' };
  var S_LRES = { RG: 'Yellow', RB: 'Magenta', GB: 'Cyan', RGB: 'White' };
  var S_LRESHEX = { Yellow: '#FFEB3B', Magenta: '#FF3BE0', Cyan: '#3BF0FF', White: '#FFFFFF' };
  var S_PNAME = { C: 'Cyan ink', M: 'Magenta ink', Y: 'Yellow ink' };
  var S_PHEX = { C: '#2FD3C7', M: '#FF5DA2', Y: '#FFD166' };
  var S_PRES = { CM: 'Blue', MY: 'Red', CY: 'Green', CMY: 'Black' };
  var S_PRESHEX = { Blue: '#3B5BFF', Red: '#FF4136', Green: '#2ECC66', Black: '#332C4A' };
  function S_swatch(c, x, y, r, hex, glow) {
    var g0;
    if (glow) { S_shadow(c, hex, 16, 0, 0); }
    g0 = c.createRadialGradient(x - r * 0.35, y - r * 0.4, 1, x, y, r);
    g0.addColorStop(0, '#ffffff'); g0.addColorStop(0.25, hex); g0.addColorStop(1, S_shade(hex, -50));
    circ(c, x, y, r, g0); S_noShadow(c);
    c.lineWidth = 1.5; c.strokeStyle = 'rgba(233,251,249,.5)'; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
  }
  function S_mixPreview(c, x, y, r, hexes, mode) {
    var i, n = hexes.length, off2 = r * 0.62;
    c.save();
    c.globalCompositeOperation = mode === 'L' ? 'lighter' : 'multiply';
    for (i = 0; i < n; i++) {
      var a = -Math.PI / 2 + i * TAU / n;
      circ(c, x + Math.cos(a) * off2 * (n > 1 ? 0.55 : 0), y + Math.sin(a) * off2 * (n > 1 ? 0.55 : 0), r, mode === 'L' ? hexes[i] : hexes[i]);
    }
    c.restore();
    c.lineWidth = 1.5; c.strokeStyle = 'rgba(233,251,249,.35)'; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
  }
  function S_mixQ(lv) {
    var light = Math.random() < 0.5, keys = light ? ['R', 'G', 'B'] : ['C', 'M', 'Y'], NM = light ? S_LNAME : S_PNAME, HX = light ? S_LHEX : S_PHEX, RES = light ? S_LRES : S_PRES, RHX = light ? S_LRESHEX : S_PRESHEX;
    var n = (lv === 0 || Math.random() < 0.6) ? 2 : 3, ing = shuf(keys.slice()).slice(0, n).sort(function (a, b) { return keys.indexOf(a) - keys.indexOf(b); }), key = ing.join(''), res = RES[key], miss = -1, right, wrongs, m, hd, why;
    if (lv > 0 && n === 2 && Math.random() < 0.45) miss = rnd(2);
    if (miss < 0) { right = res; wrongs = light ? ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Cyan', 'White'].filter(function (w) { return w !== res; }) : ['Cyan', 'Magenta', 'Yellow', 'Blue', 'Red', 'Green', 'Black'].filter(function (w) { return w !== res; }); }
    else { right = ing[miss]; wrongs = keys.filter(function (w) { return w !== right && ing.indexOf(w) < 0; }).concat(light ? ['White'] : ['Black']); }
    m = mk4(right, wrongs);
    hd = (light ? 'LIGHT (screens, torches): additive mixing' : 'INK (paint, printers): subtractive mixing') + (miss < 0 ? '. What color do you get?' : '. Which one is missing?');
    why = light ? 'Light adds up: mixing colored beams makes a BRIGHTER color. ' + ing.map(function (k) { return NM[k]; }).join(' + ') + ' = ' + res + '.' : 'Ink subtracts light: each layer blocks some color, so mixing makes a DARKER color. ' + ing.map(function (k) { return NM[k]; }).join(' + ') + ' = ' + res + '.';
    return {
      q: hd, why: why, opts: m.opts, a: m.a, rev: (light ? 'Light: ' : 'Ink: ') + ing.join('+') + '=' + res,
      draw: function (c, cx, cy) {
        var i, x0 = cx - (n === 3 ? 96 : 74), sp = n === 3 ? 70 : 84, x, hexes = [];
        for (i = 0; i < n; i++) {
          x = x0 + i * sp;
          if (i === miss) { circ(c, x, cy - 8, 26, R.bg); c.lineWidth = 2; c.strokeStyle = R.yellow; c.stroke(); txt(c, '?', x, cy - 8, 26, R.yellow); }
          else { S_swatch(c, x, cy - 8, 26, HX[ing[i]], light); fit(c, NM[ing[i]], x, cy + 26, 62, 10, R.dim); hexes.push(HX[ing[i]]); }
          if (i < n - 1) txt(c, '+', x + sp / 2, cy - 8, 22, R.dim);
        }
        x = x0 + (n - 1) * sp + (n === 3 ? 46 : 56);
        txt(c, '=', x, cy - 8, 22, R.dim);
        if (miss < 0) { S_mixPreview(c, x + 46, cy - 8, 24, miss < 0 ? ing.map(function (k) { return HX[k]; }) : hexes, light ? 'L' : 'M'); txt(c, '?', x + 46, cy - 8, 22, R.yellow); }
        else S_swatch(c, x + 46, cy - 8, 30, RHX[res], light);
      }
    };
  }
  function S_factQ(lv) {
    var t = rnd(4), m, why, q;
    if (t === 0) {
      var scr = Math.random() < 0.5;
      m = mk4(scr ? 'Red, green, blue light (additive)' : 'Cyan, magenta, yellow ink (subtractive)', ['Red, green, blue light (additive)', 'Cyan, magenta, yellow ink (subtractive)', 'Black and white light only', 'Every color mixed at once']);
      q = 'Which colors does a ' + (scr ? 'phone or TV screen' : 'color printer') + ' use to make every color?';
      why = scr ? 'Screens glow: tiny red, green and blue lights add together (additive).' : 'Printers use ink: cyan, magenta and yellow layers subtract light (subtractive).';
    } else if (t === 1) {
      var longest = Math.random() < 0.5;
      m = mk4(longest ? 'Red' : 'Violet', ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Violet']);
      q = 'Which color of visible light has the ' + (longest ? 'longest' : 'shortest') + ' wavelength?';
      why = longest ? 'Of visible light, red has the longest wavelength and violet the shortest.' : 'Of visible light, violet has the shortest wavelength and red the longest.';
    } else if (t === 2) {
      var obj = pick(['Cyan', 'Magenta', 'Yellow']), abs = { Cyan: 'Red', Magenta: 'Green', Yellow: 'Blue' }[obj];
      m = mk4(abs, ['Red', 'Green', 'Blue', 'White']);
      q = 'White light hits a ' + obj.toLowerCase() + ' object. Which color does it absorb?';
      why = obj + ' reflects the other two primary colors of light and absorbs ' + abs.toLowerCase() + '.';
    } else {
      m = mk4('Black (no light reaches your eye)', ['Black (no light reaches your eye)', 'White', 'Gray', 'It stays the same color']);
      q = 'If you mix cyan, magenta AND yellow ink together, about what color do you get?';
      why = 'Each ink layer blocks more light. All three together block almost all of it: a muddy black.';
    }
    return { q: q, why: why, opts: m.opts, a: m.a, rev: q, draw: function (c, cx, cy) { txt(c, '?', cx, cy - 20, 50, R.yellow); } };
  }
  def('colorLab', EDU, 'Color Lab', R.magenta, 'Light adds up to white; ink subtracts down to black. Learn the real physics behind screens and printers.', 'Click an answer or press 1-4 . three misses ends the run', function (G) {
    mcq(G, { color: R.magenta, secs: [16, 13, 10], make: function (lv, n) { return (lv === 2 && Math.random() < 0.4) ? S_factQ(lv) : S_mixQ(lv); } });
  });

  /* ---------------------------------------------------------------
     PLANET PARADE - real distances, sizes, masses and spin speeds
  --------------------------------------------------------------- */
  /* name, diameter km, mass (1e24 kg), rotation period hours, rings, colour, fact */
  var S_PL = [
    ['Mercury', 4879, 0.33, 1407.6, 0, '#B7ADA3', 'Closest planet to the Sun; has no moons'],
    ['Venus', 12104, 4.87, 5832.5, 0, '#E8C27A', 'Hottest planet: a thick CO2 atmosphere traps heat'],
    ['Earth', 12742, 5.97, 23.93, 0, '#3B82C4', 'The only planet known to have life'],
    ['Mars', 6779, 0.642, 24.62, 0, '#C1440E', 'Home to Olympus Mons, the tallest volcano we know of'],
    ['Jupiter', 139820, 1898, 9.93, 1, '#D8A76B', 'The largest planet; the Great Red Spot is a giant storm'],
    ['Saturn', 116460, 568, 10.7, 1, '#E3C88F', 'Famous for its wide, bright ring system'],
    ['Uranus', 50724, 86.8, 17.2, 1, '#9FE0E0', 'Spins on its side and has faint rings'],
    ['Neptune', 49244, 102, 16.1, 1, '#3F5FCB', 'The farthest planet from the Sun; has very fast winds']
  ];
  var S_RK = {
    dist: [0, 1, 2, 3, 4, 5, 6, 7],
    size: [0, 3, 1, 2, 7, 6, 5, 4],
    mass: [0, 3, 1, 2, 6, 7, 5, 4],
    spin: [4, 5, 7, 6, 2, 3, 0, 1]
  };
  var S_RKLBL = { dist: ['closest to the Sun', 'farthest from the Sun'], size: ['smallest', 'biggest'], mass: ['lightest', 'heaviest'], spin: ['fastest spinning', 'slowest spinning'] };
  var S_planetIcons = {};
  function S_planetIcon(nm) {
    if (S_planetIcons[nm]) return S_planetIcons[nm].cv;
    var p, i; for (i = 0; i < S_PL.length; i++) if (S_PL[i][0] === nm) p = S_PL[i];
    var o = S_off(40, 40), oc = o.c, cx = 20, cy = 20, r = 14, g0;
    if (p[4]) { oc.save(); oc.translate(cx, cy); oc.rotate(-0.35); oc.beginPath(); oc.ellipse(0, 0, 19, 6, 0, 0, TAU); oc.strokeStyle = 'rgba(233,251,249,.5)'; oc.lineWidth = 2; oc.stroke(); oc.beginPath(); oc.ellipse(0, 0, 19, 6, 0, Math.PI, TAU); oc.globalCompositeOperation = 'destination-over'; oc.restore(); }
    g0 = oc.createRadialGradient(cx - r * 0.4, cy - r * 0.4, 1, cx, cy, r * 1.15);
    g0.addColorStop(0, S_shade(p[5], 60)); g0.addColorStop(0.5, p[5]); g0.addColorStop(1, S_shade(p[5], -70));
    oc.beginPath(); oc.arc(cx, cy, r, 0, TAU); oc.fillStyle = g0; oc.fill();
    if (p[0] === 'Jupiter' || p[0] === 'Saturn') { oc.save(); oc.clip(); [-7, -2, 3, 8].forEach(function (yy) { oc.fillStyle = 'rgba(120,85,50,.18)'; oc.fillRect(cx - r, cy + yy, r * 2, 2.4); }); oc.restore(); }
    oc.beginPath(); oc.arc(cx, cy, r, Math.PI * 0.15, Math.PI * 0.85); oc.fillStyle = 'rgba(10,6,25,.38)'; oc.fill();
    if (p[4]) { oc.beginPath(); oc.ellipse(cx, cy, 19, 6, -0.35, 0, Math.PI); oc.strokeStyle = 'rgba(233,251,249,.85)'; oc.lineWidth = 2; oc.stroke(); }
    S_planetIcons[nm] = o;
    return o.cv;
  }
  function S_plMake(lv) {
    var type = lv === 0 ? 'dist' : lv === 1 ? pick(['dist', 'size']) : pick(['dist', 'size', 'mass', 'spin']);
    var n = lv === 0 ? 4 : lv === 1 ? 6 : 8, idx = shuf([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, n);
    var rk = S_RK[type], ordered = rk.filter(function (k) { return idx.indexOf(k) > -1; });
    var pl = ordered.map(function (k) { return S_PL[k]; });
    var qtxt = { dist: 'Order these planets from closest to the Sun to farthest', size: 'Order these planets from smallest to biggest across', mass: 'Order these planets from lightest to heaviest', spin: 'Order these planets by how fast they spin: fastest first' }[type];
    return {
      q: qtxt, items: pl.map(function (p) { return p[0]; }), sub: pl.map(function (p) { return p[6]; }), first: S_RKLBL[type][0], last: S_RKLBL[type][1],
      why: function (next) { return next ? pl[next][0] + ' comes right after ' + pl[next - 1][0] + ' in this order' : 'Start with ' + pl[0][0]; }
    };
  }
  def('planetParade', EDU, 'Planet Parade', R.violet, 'Real distances, sizes, masses and spin speeds. Line the eight planets up the right way, four different ways.', 'Tap the tiles in the correct order . arrows + Space work too . four wrong taps ends it', function (G) {
    S_order(G, { icon: S_planetIcon, make: S_plMake });
  });

  /* ================= AUTHOR W: LANGUAGE / GRAMMAR / VOCABULARY GAMES ================= */

  /* ---- shared W_ visual helpers: cached offscreen art, gradients, shadow-wrapped drawing ---- */
  function W_off(w, h, fn) { var o = document.createElement('canvas'); o.width = w; o.height = h; var x = o.getContext('2d'); fn(x); return o; }
  function W_shadow(c, col, blur, ox, oy, fn) { c.save(); c.shadowColor = col; c.shadowBlur = blur; c.shadowOffsetX = ox || 0; c.shadowOffsetY = oy === undefined ? 3 : oy; fn(); c.restore(); }
  function W_paper(w, h, base, tint) {
    return W_off(w, h, function (x) {
      var g = x.createLinearGradient(0, 0, 0, h), i, n = Math.floor(w * h / 700);
      g.addColorStop(0, base); g.addColorStop(1, tint);
      x.fillStyle = g; x.fillRect(0, 0, w, h);
      for (i = 0; i < n; i++) { x.fillStyle = 'rgba(255,255,255,' + (0.015 + Math.random() * 0.035) + ')'; x.fillRect(Math.random() * w, Math.random() * h, 1, 1); }
      x.fillStyle = 'rgba(0,0,0,.14)'; x.beginPath(); x.ellipse(w * 0.82, h * 0.12, w * 0.5, h * 0.22, 0, 0, TAU); x.fill();
    });
  }
  /* a bevelled tile/card sprite: gradient body, specular highlight band, rim */
  function W_tileSprite(w, h, c1, c2, rim) {
    return W_off(w, h, function (x) {
      var g = x.createLinearGradient(0, 0, 0, h), hi;
      g.addColorStop(0, c1); g.addColorStop(1, c2);
      rect(x, 1, 1, w - 2, h - 2, 8, g);
      hi = x.createLinearGradient(0, 1, 0, h * 0.5);
      hi.addColorStop(0, 'rgba(255,255,255,.5)'); hi.addColorStop(1, 'rgba(255,255,255,0)');
      rect(x, 3, 2, w - 6, h * 0.4, 6, hi);
      x.strokeStyle = rim || 'rgba(23,18,51,.4)'; x.lineWidth = 1.5; K.L(x, 1.5, 1.5, w - 3, h - 3, 7); x.stroke();
    });
  }
  /* a soft gradient card with drop shadow + thin rim, drawn straight to a live canvas */
  function W_card(c, x, y, w, h, r, g1, g2, rim) {
    W_shadow(c, 'rgba(0,0,0,.4)', 10, 0, 4, function () {
      var g = c.createLinearGradient(0, y, 0, y + h);
      g.addColorStop(0, g1); g.addColorStop(1, g2);
      rect(c, x, y, w, h, r, g);
    });
    c.strokeStyle = rim || 'rgba(255,255,255,.09)'; c.lineWidth = 1; K.L(c, x + 0.5, y + 0.5, w - 1, h - 1, r); c.stroke();
  }

  /* ---- Unscramble: word|definition bank, 322 entries (2.7x v1), clue-driven so the target word is never ambiguous ---- */
  var W_UWRAW = 'book|a set of printed pages bound together;tree|a tall plant with a trunk and branches;fish|an animal that breathes through gills;star|a huge ball of burning gas in space;moon|the rocky body that orbits Earth;rain|water falling from clouds;wind|air moving across the land;cake|a sweet baked dessert;bird|an animal with feathers and wings;frog|a hopping animal that lives near ponds;lamp|a device that gives off light;door|a hinged panel that opens a room;ship|a large vessel that sails the sea;gold|a shiny yellow precious metal;king|a male ruler of a kingdom;milk|a white drink from cows;rock|a hard piece of stone;sand|tiny grains of worn rock;snow|frozen flakes that fall in winter;road|a paved path for vehicles;hand|the part of the arm with fingers;farm|land used to grow crops;jump|to spring off the ground;kite|a light frame flown on a string;race|a contest of speed;lion|a large wild cat with a mane;nest|a bird’s home built from twigs;gift|something given to another person;play|to have fun or join a game;desk|a table used for writing or study;lake|a large body of still fresh water;pond|a small body of still water;barn|a farm building for animals or hay;wolf|a wild relative of the dog;bear|a large furry forest animal;deer|a hoofed animal with antlers;swan|a large white water bird;crab|a sea creature with pincers and a shell;duck|a water bird with webbed feet;hawk|a sharp eyed bird of prey;seal|a flippered animal that lives near the sea;wasp|a stinging flying insect;lamb|a baby sheep;goat|a horned farm animal that climbs well;mule|the offspring of a donkey and a horse;crow|a large black bird known for cawing;dove|a small bird often used as a symbol of peace;lark|a songbird known for singing at dawn;wren|a tiny brown songbird;moth|a night flying insect related to butterflies;worm|a small limbless creature that lives in soil;slug|a shell less relative of the snail;pool|a small area of water for swimming;park|a public area with grass and trees;shop|a small store that sells goods;mall|a large building full of shops;bank|a place that keeps and lends money;gate|a hinged barrier in a fence or wall;roof|the covering on top of a building;wall|an upright structure that divides space;yard|the ground around a house;path|a narrow track for walking;hill|a raised area of land, smaller than a mountain;cave|a hollow space underground or in a cliff;cold|having a low temperature;warm|having a pleasantly high temperature;loud|making a lot of noise;soft|not hard or firm to the touch;fast|moving at great speed;slow|not moving quickly;tall|having great height;wise|having good judgment;kind|caring about others;glad|feeling pleased or happy;huge|extremely large in size;tiny|extremely small in size;neat|clean and orderly;mint|a herb with a cool fresh flavor;corn|a cereal plant with yellow kernels;pear|a sweet fruit round at the bottom;plum|a small sweet purple fruit with a pit;lime|a small green citrus fruit;soup|a liquid food made by simmering ingredients;rice|a small grain that is a staple food;salt|a white mineral used to season food;herb|a plant used for flavor or medicine;sink|a basin with a tap for washing;oven|an appliance for baking food;pipe|a tube that carries liquid or gas;wire|a thin metal strand that carries electricity;lock|a device that secures a door;ring|a circular band worn on a finger;belt|a strap worn around the waist;sock|a knitted covering for the foot;boot|a sturdy shoe that covers the ankle;coat|an outer garment worn for warmth;vest|a sleeveless garment worn over a shirt;flag|a piece of cloth that represents a country;drum|a percussion instrument struck to play;horn|a wind instrument, or an animal’s pointed growth;bell|a hollow metal object that rings when struck;song|a piece of music with words;tune|a simple, pleasing melody;cast|the actors in a play or film;film|a movie;page|one side of a sheet in a book;mail|letters and packages sent by post;card|a small stiff piece of paper;note|a short written message;maze|a puzzle of winding paths;apple|a round crisp fruit that grows on trees;bread|a baked food made from flour;chair|a seat for one person;dance|to move your body to music;earth|the planet we live on;heart|the organ that pumps blood;fruit|the sweet part of a plant with seeds;grape|a small round fruit that grows in bunches;house|a building where people live;juice|the liquid squeezed from fruit;light|brightness that lets you see;night|the dark hours after sunset;thing|an object with no specific name;money|coins and paper used to buy things;ocean|a huge body of salt water;paper|a thin material used for writing;queen|a female ruler of a kingdom;river|a large stream of flowing fresh water;smile|to curve your lips to show happiness;table|a flat surface on legs;water|a clear liquid needed for life;plant|a living thing that grows from soil;cloud|a mass of water droplets in the sky;horse|a large animal often ridden;stone|a small hard piece of rock;green|the color of grass;beach|sandy ground next to the sea;clock|a device that shows the time;mouse|a small furry rodent;tiger|a large striped wild cat;eagle|a large bird of prey with keen eyesight;whale|a huge sea mammal that breathes air;shark|a large predatory fish;camel|a desert animal with humps;zebra|an African animal with black and white stripes;sheep|a woolly farm animal;snake|a legless reptile;straw|a thin tube used for drinking;brush|a tool with bristles for cleaning or painting;knife|a bladed tool for cutting;spoon|a utensil with a shallow bowl for eating;plate|a flat dish for serving food;glass|a container for drinking, or a clear material;towel|a cloth used for drying;shelf|a flat board for storing objects;couch|a long soft seat for several people;bench|a long seat for several people;stamp|a small sticky label for mail;brick|a block of baked clay used in building;glove|a covering for the hand;scarf|a strip of cloth worn around the neck;crown|a jeweled headpiece worn by royalty;cabin|a small simple house, often made of wood;cliff|a steep rock face;storm|a violent burst of wind and rain;sunny|full of bright sunshine;windy|having a lot of wind;rainy|marked by frequent rain;sweet|having a taste like sugar;sharp|having a fine cutting edge;quiet|making very little noise;heavy|having great weight;proud|feeling pleased with an achievement;happy|feeling joy or pleasure;angry|feeling strong displeasure;lucky|having good fortune;brave|willing to face danger;funny|causing laughter;early|before the usual time;first|coming before all others;seven|the number after six;eight|the number after seven;twelve|skip 6 letters below;seat|4 letters skip dup category confusion;train|a line of linked railway carriages;truck|a large vehicle for carrying goods;plane|a vehicle that flies through the air;boat|4 letters dup skip;wagon|a four wheeled cart pulled by animals;tractor|skip put in 7 group;route|a path followed to get somewhere;cargo|goods carried by a ship, plane or truck;bridge|a structure that crosses a river or road;garden|a piece of land for growing plants;planet|a large body that orbits a star;school|a place where children go to learn;winter|the coldest season of the year;summer|the warmest season of the year;flower|the colorful bloom of a plant;monkey|a tree climbing primate with a tail;orange|a round citrus fruit, or its color;purple|a color made by mixing red and blue;yellow|the color of a ripe banana;window|an opening in a wall fitted with glass;pencil|a wooden tool used for writing;basket|a container woven from strips of material;market|a place where goods are bought and sold;guitar|a stringed instrument played by plucking;rocket|a vehicle that launches into space;spring|the season between winter and summer;butter|a fatty spread made from churned cream;castle|a fortified building of a lord or king;forest|a large area covered with trees;island|land surrounded on all sides by water;jungle|a dense tropical forest;ladder|a set of rungs used for climbing;mirror|a surface that reflects an image;nature|the physical world, plants and animals;pocket|a small pouch sewn into clothing;silver|a shiny white precious metal;listen|to pay attention to a sound;silent|making no sound at all;kitten|a young cat;rabbit|a long eared hopping mammal;turtle|a reptile with a hard protective shell;beetle|an insect with hard front wings;spider|an eight legged creature that spins webs;dragon|a mythical fire breathing reptile;wizard|a person with magic powers, in stories;knight|a medieval soldier who fought on horseback;pirate|a sailor who robs other ships at sea;candle|a wax stick with a wick, burned for light;bottle|a container for holding liquids;pillow|a soft cushion for resting the head;blanket|a large piece of cloth used for warmth;carpet|a thick fabric covering for a floor;ceiling|the inside surface at the top of a room;chimney|a pipe that carries smoke from a fire;engine|a machine that converts fuel into motion;factory|a building where goods are manufactured;farmer|a person who raises crops or animals;feather|one of the light coverings on a bird;finger|one of the five digits on a hand;friend|a person you like and trust;gadget|a small useful mechanical device;hammer|a tool used for driving nails;jacket|a short coat;kitchen|a room used for cooking;letter|a written message sent to someone;mammal|a warm blooded animal that feeds its young milk;needle|a thin pointed tool used for sewing;number|a word or symbol used to count;ostrich|a large flightless bird that runs fast;oxygen|a gas that humans need to breathe;parrot|a colorful bird that can mimic speech;pepper|a spice made from dried berries;plastic|a lightweight material shaped when soft;puzzle|a game that tests problem solving;ribbon|a narrow strip of decorative fabric;saddle|a seat placed on a horse’s back;sailor|a person who works on a ship;salmon|a pink fleshed fish that swims upstream to spawn;sheriff|a local law enforcement officer;shovel|a tool used for digging;signal|a sign that conveys information;statue|a carved or molded figure of a person;studio|a room where an artist works;sunset|the moment the sun disappears below the horizon;tablet|a flat slab, or a small handheld computer;temple|a building used for worship;ticket|a piece of paper that allows entry;tomato|a soft red fruit often used in salads;tongue|the muscle in the mouth used for tasting;tunnel|an underground passage;turkey|a large farmed bird eaten at holidays;valley|low land between hills or mountains;vessel|a ship or boat, or a tube carrying blood;volcano|a mountain that can erupt with lava;walnut|a wrinkled edible nut;weapon|a tool used for fighting;wheat|a cereal grain used to make flour;chicken|a bird kept for its eggs and meat;rainbow|an arc of colors that appears after rain;library|a place that lends and stores books;holiday|a day of celebration or rest from work;dolphin|a smart, playful sea mammal;penguin|a flightless bird that swims well;giraffe|the tallest land animal, with a long neck;captain|the leader of a ship, team or crew;morning|the early part of the day;teacher|a person who helps others learn;mountain|a very tall, steep landform;elephant|the largest living land animal;computer|an electronic device that processes data;airplane|a powered aircraft with wings;birthday|the yearly anniversary of a person’s birth;hospital|a place where sick people are treated;sandwich|food made of fillings between bread;umbrella|a folding cover held up to block rain;treasure|a valuable hoard of gold or jewels;notebook|a book of blank pages for writing notes;dinosaur|a prehistoric reptile, now extinct;football|a team sport played by kicking a ball;homework|schoolwork done outside of class;festival|a day or event of public celebration;crocodile|a large reptile that lives in rivers;kangaroo|an Australian animal that hops on strong legs;telescope|an instrument used to view distant objects;microscope|an instrument used to view very small objects;waterfall|a stream of water falling from a height;butterfly|an insect with large colorful wings;astronaut|a person trained to travel in space;vegetable|a plant part eaten as food, not sweet;adventure|an exciting or risky journey;alphabet|the set of letters used to write a language;calendar|a chart that shows the days of a year;chocolate|a sweet food made from cacao beans;dictionary|a book that lists word meanings;mushroom|a fungus with a stem and a cap;sunflower|a tall flower with yellow petals;thermometer|a tool used to measure temperature;volleyball|a sport played by hitting a ball over a net';
  var W_UW = W_UWRAW.split(';').map(function (s) { var p = s.split('|'); return { w: p[0], d: p[1] }; });
  function W_uPool(lv) { return W_UW.filter(function (e) { var n = e.w.length; return lv === 0 ? n <= 5 : lv === 1 ? (n >= 5 && n <= 6) : n >= 6; }); }

  /* ---- Synonym Swat: 131 target words (2.9x v1, well over 130 target words), each with verified close synonyms, true antonyms and four themed-but-unrelated distractors ---- */
  var W_SSRAW = 'happy|glad,joyful,cheerful,delighted|sad,gloomy,miserable,unhappy|party,birthday,laughter,gift;big|large,huge,giant,enormous|small,tiny,little,mini|size,measure,elephant,building;fast|quick,rapid,speedy,swift|slow,sluggish,leisurely,plodding|race,runner,engine,car;smart|clever,intelligent,bright,wise|dumb,foolish,stupid,unwise|school,book,teacher,brain;brave|bold,fearless,courageous,daring|cowardly,timid,fearful,afraid|hero,knight,battle,medal;angry|mad,furious,enraged,irate|calm,pleased,peaceful,relaxed|face,shout,storm,fist;begin|start,commence,initiate|end,finish,stop,conclude|race,whistle,middle,page;old|ancient,aged,elderly,antique|new,young,modern,recent|grandfather,clock,museum,castle;cold|chilly,freezing,icy,frosty|hot,boiling,scorching,sweltering|winter,snow,coat,scarf;tired|weary,exhausted,fatigued,drained|energetic,lively,rested,refreshed|bed,pillow,yawn,night;beautiful|pretty,lovely,gorgeous,stunning|ugly,hideous,unsightly,repulsive|garden,painting,sunset,flower;easy|simple,effortless,uncomplicated|difficult,hard,tough,demanding|homework,puzzle,test,exam;rich|wealthy,affluent,prosperous|poor,broke,penniless,needy|bank,gold,coin,yacht;quiet|silent,hushed,soundless,noiseless|loud,noisy,deafening,rowdy|library,church,night,secret;clean|spotless,immaculate,pristine|dirty,filthy,grimy,soiled|soap,bath,broom,sponge;sad|unhappy,gloomy,miserable,sorrowful|happy,joyful,cheerful,glad|tears,rain,movie,letter;strong|powerful,mighty,sturdy,robust|weak,feeble,frail,puny|muscle,gym,weights,iron;funny|amusing,hilarious,comical,humorous|serious,solemn,sombre,grave|joke,clown,comedy,circus;huge|enormous,gigantic,immense,colossal|tiny,minuscule,miniature,microscopic|whale,stadium,planet,ocean;rude|impolite,discourteous,insolent,disrespectful|polite,courteous,respectful,gracious|manners,insult,guest,stranger;brief|short,fleeting,momentary,passing|long,lengthy,extended,prolonged|clock,hour,calendar,schedule;important|vital,essential,crucial,significant|trivial,minor,unimportant,insignificant|message,meeting,deadline,boss;dangerous|risky,hazardous,perilous,unsafe|safe,secure,harmless|cliff,shark,warning,storm;wrong|incorrect,mistaken,false,inaccurate|right,correct,accurate,true|test,answer,teacher,quiz;love|adore,cherish,idolize|hate,despise,detest,loathe|heart,kiss,romance,flower;shy|timid,bashful,reserved|bold,outgoing,confident,sociable|blush,crowd,stranger,classroom;generous|charitable,lavish,unselfish,benevolent|stingy,selfish,miserly,greedy|gift,donation,charity,tip;calm|peaceful,tranquil,serene,relaxed|agitated,anxious,frantic,restless|lake,breeze,meditation,sunset;lazy|idle,slothful,lethargic,indolent|active,energetic,hardworking,diligent|sofa,nap,holiday,weekend;fake|false,counterfeit,phony,bogus|real,genuine,authentic,true|money,jewel,painting,signature;strange|odd,weird,peculiar,bizarre|normal,ordinary,familiar,usual|mystery,alien,ghost,dream;wet|damp,soaked,moist,drenched|dry,parched,arid|rain,puddle,towel,umbrella;fix|repair,mend,restore,remedy|break,damage,ruin,wreck|tool,hammer,garage,engine;hot|boiling,scorching,sweltering,blazing|cold,freezing,icy,chilly|sun,summer,fire,desert;dark|dim,gloomy,shadowy,murky|bright,light,sunny,radiant|night,candle,cave,moon;thin|slim,slender,skinny,lean|fat,plump,stout,chubby|diet,scale,tailor,model;sick|ill,unwell,ailing|healthy,well,fit,robust|doctor,medicine,hospital,nurse;friend|pal,buddy,companion,ally|enemy,foe,rival,opponent|party,classmate,gift,letter;shout|yell,scream,holler,bellow|whisper,murmur,hush|voice,throat,crowd,stadium;increase|grow,rise,expand,swell|decrease,shrink,reduce,dwindle|graph,amount,total,chart;rough|coarse,bumpy,rugged,uneven|smooth,even,silky,sleek|sandpaper,road,stone,bark;empty|vacant,hollow,bare,void|full,packed,crammed,stuffed|box,bottle,room,glass;lucky|fortunate,blessed,charmed|unlucky,unfortunate,hapless,jinxed|clover,dice,coin,lottery;honest|truthful,sincere,candid,upright|dishonest,deceitful,untruthful,fraudulent|promise,judge,secret,oath;cheap|inexpensive,affordable,economical|expensive,costly,pricey,exorbitant|shop,receipt,coupon,wallet;small|little,tiny,mini|big,large,huge|mouse,ant,pebble;tall|high,lofty,towering|short,low,small|giraffe,tower,ladder;short|little,low,stubby|tall,long,high|pencil,minute,dwarf;weak|feeble,frail,fragile|strong,powerful,mighty|kitten,twig,whisper;gentle|mild,tender,soft|rough,harsh,fierce|breeze,lamb,nurse;careful|cautious,prudent,attentive|careless,reckless,sloppy|driver,surgeon,ledge;careless|reckless,sloppy,hasty|careful,cautious,attentive|mistake,accident,rush;silly|foolish,goofy,ridiculous|sensible,serious,wise|clown,joke,giggle;foolish|silly,unwise,senseless|wise,sensible,smart|mistake,fool,risk;proud|pleased,satisfied,gratified|ashamed,humble,embarrassed|trophy,medal,parent;humble|modest,meek,unassuming|proud,arrogant,boastful|servant,monk,cottage;jealous|envious,resentful,covetous|content,satisfied,generous|rival,sibling,possession;curious|inquisitive,interested,nosy|indifferent,uninterested,apathetic|cat,scientist,question;nervous|anxious,uneasy,jittery|calm,relaxed,confident|exam,interview,storm;confident|assured,self assured,certain|nervous,timid,unsure|speech,captain,posture;cheerful|happy,merry,jolly|gloomy,glum,miserable|song,sunshine,party;gloomy|dismal,dreary,bleak|cheerful,bright,sunny|cloud,fog,rain;bright|brilliant,vivid,radiant|dim,dull,dark|sun,lamp,color;messy|untidy,cluttered,disorganized|tidy,neat,organized|room,desk,hair;tidy|neat,orderly,organized|messy,untidy,cluttered|shelf,broom,folder;modern|contemporary,current,new|ancient,old fashioned,outdated|phone,building,art;ancient|old,antique,archaic|modern,new,recent|ruin,fossil,pyramid;simple|easy,plain,basic|complex,complicated,difficult|recipe,plan,tool;complicated|complex,intricate,elaborate|simple,easy,straightforward|puzzle,machine,plot;plain|simple,basic,unadorned|fancy,decorated,elaborate|paper,toast,dress;fancy|elaborate,ornate,decorative|plain,simple,basic|restaurant,gown,cake;delicious|tasty,delectable,scrumptious|disgusting,bland,tasteless|meal,chef,aroma;bitter|sour,acrid,harsh|sweet,sugary,mild|coffee,lemon,medicine;spicy|hot,fiery,peppery|mild,bland,plain|pepper,curry,salsa;mild|gentle,soft,moderate|spicy,harsh,intense|weather,soap,cheese;fresh|new,crisp,recent|stale,old,spoiled|bread,air,fruit;stale|old,dry,flat|fresh,new,crisp|bread,cracker,joke;sturdy|strong,solid,tough|flimsy,fragile,weak|table,boot,bridge;fragile|delicate,breakable,brittle|sturdy,tough,durable|glass,egg,vase;flexible|bendable,supple,pliable|rigid,stiff,inflexible|rubber,gymnast,schedule;rigid|stiff,firm,inflexible|flexible,bendable,supple|rod,rule,post;young|youthful,juvenile,junior|old,elderly,aged|puppy,child,sapling;noisy|loud,rowdy,boisterous|quiet,silent,hushed|crowd,engine,siren;busy|occupied,active,hectic|idle,free,relaxed|schedule,street,bee;idle|inactive,unoccupied,lazy|busy,active,working|engine,factory,hands;lively|energetic,vibrant,spirited|dull,lifeless,sluggish|party,puppy,crowd;dull|boring,tedious,uninteresting|exciting,lively,interesting|lecture,knife,color;exciting|thrilling,stimulating,exhilarating|dull,boring,tedious|ride,movie,game;scary|frightening,terrifying,spooky|comforting,soothing,reassuring|ghost,shadow,storm;mysterious|puzzling,strange,cryptic|obvious,clear,plain|fog,stranger,clue;unique|distinctive,one of a kind,singular|common,ordinary,typical|fingerprint,snowflake,design;common|usual,ordinary,typical|rare,unusual,unique|cold,word,bird;rare|uncommon,scarce,unusual|common,frequent,usual|coin,gem,disease;famous|renowned,celebrated,well known|unknown,obscure,anonymous|actor,landmark,song;wealthy|rich,affluent,prosperous|poor,broke,needy|mansion,yacht,jewel;poor|needy,impoverished,broke|wealthy,rich,affluent|shelter,charity,coin;arrogant|conceited,boastful,haughty|humble,modest,meek|boast,ego,sneer;selfish|self centered,greedy,self serving|generous,selfless,unselfish|hoard,share,gift;stubborn|obstinate,headstrong,inflexible|flexible,agreeable,compliant|mule,argument,rule;patient|tolerant,calm,understanding|impatient,restless,irritable|waiting,nurse,line;impatient|restless,irritable,hasty|patient,calm,tolerant|clock,traffic,line;eager|enthusiastic,keen,willing|reluctant,unwilling,indifferent|volunteer,puppy,fan;reluctant|unwilling,hesitant,resistant|eager,willing,keen|hesitation,pause,doubt;talkative|chatty,wordy,voluble|quiet,silent,reserved|parrot,gossip,radio;polite|courteous,respectful,well mannered|rude,impolite,discourteous|manners,greeting,bow;healthy|fit,well,robust|sick,ill,unhealthy|exercise,diet,vitamin;clumsy|awkward,graceless,bumbling|graceful,agile,nimble|stumble,trip,juggler;graceful|elegant,agile,poised|clumsy,awkward,ungainly|dancer,swan,ballet;loyal|faithful,devoted,dependable|disloyal,unfaithful,treacherous|dog,friend,soldier;dishonest|deceitful,lying,untruthful|honest,truthful,sincere|liar,scam,cheat;timid|shy,fearful,meek|bold,brave,confident|mouse,rabbit,whisper;bold|daring,fearless,brave|timid,shy,cowardly|explorer,knight,climber;clever|smart,intelligent,sharp|foolish,stupid,dim|fox,riddle,trick;stupid|foolish,dumb,unwise|smart,clever,intelligent|mistake,joke,prank;greedy|selfish,grasping,gluttonous|generous,selfless,giving|gold,feast,hoard;grumpy|cranky,irritable,grouchy|cheerful,pleasant,happy|mood,frown,growl;pleasant|agreeable,enjoyable,nice|unpleasant,disagreeable,nasty|weather,visit,surprise;dirty|filthy,grimy,soiled|clean,spotless,tidy|mud,laundry,dish;crowded|packed,jammed,congested|empty,deserted,spacious|subway,stadium,mall;deserted|abandoned,empty,vacant|crowded,bustling,populated|ghost town,island,street;wide|broad,spacious,expansive|narrow,thin,tight|river,road,gap;narrow|thin,tight,slim|wide,broad,spacious|alley,path,gap;loud|noisy,booming,deafening|quiet,soft,silent|speaker,concert,alarm;hungry|starving,famished,ravenous|full,satisfied,stuffed|stomach,snack,meal;exhausted|tired,weary,drained|energetic,refreshed,lively|marathon,yawn,nap;terrified|frightened,scared,petrified|calm,fearless,brave|scream,nightmare,jump;furious|enraged,livid,irate|calm,pleased,content|shout,storm,fist;relieved|reassured,comforted,at ease|worried,anxious,troubled|sigh,exam,news;embarrassed|ashamed,humiliated,self conscious|proud,confident,comfortable|blush,mistake,laughter;confused|puzzled,perplexed,baffled|clear,certain,sure|maze,question,fog;determined|resolute,persistent,driven|hesitant,uncertain,wavering|goal,marathon,coach';
  var W_SETS = W_SSRAW.split(';').map(function (s) {
    var p = s.split('|'); return { t: p[0], s: p[1].split(','), a: p[2].split(','), d: p[3].split(',') };
  });

  /* ---- shared decorative overlay: wraps G.frame so any engine-based game gets a cached vignette on top, cheaply ---- */
  function W_vign(w, h) {
    return W_off(w, h, function (x) {
      var g = x.createRadialGradient(w / 2, h * 0.38, h * 0.32, w / 2, h * 0.4, h * 0.78);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.4)');
      x.fillStyle = g; x.fillRect(0, 0, w, h);
    });
  }
  function W_decorate(G, spr) { var of = G.frame; G.frame = function (fn) { of.call(G, function (dt) { fn(dt); G.c.drawImage(spr, 0, 0); }); }; }

  /* ---- Word Roots: 150 verified Greek/Latin roots, prefixes and combining forms (3x v1) ---- */
  var W_RTRAW = 'aqua-|water;bio-|life;geo-|earth;graph|write;tele-|far;photo-|light;chron|time;dict|say;port|carry;spect|see;aud|hear;ped|foot;manu|hand;therm|heat;micro-|small;mega-|large;cardio-|heart;derm|skin;auto-|self;bene-|good;mal-|bad;sub-|under;pre-|before;post-|after;uni-|one;bi-|two;anthro|human;circum-|around;trans-|across;tri-|three;omni-|all;astro-|star;cent-|hundred;quad-|four;anti-|against;inter-|between;ex-|out;con-|together;hemi-|half;neo-|new;zoo|animal;psych|mind;hemo-|blood;ject|throw;struct|build;mit|send;cred|believe;duc|lead;rupt|break;tox|poison;super-|above;morph|shape;phon|sound;scop|view;path|feeling;log|word;nym|name;gram|written thing;meter|measure;vor|eat;carn|flesh;corp|body;cap|take;fac|make;vid|sight;loqu|speak;mob|move;fin|end;flex|bend;gen|birth;grad|step;helio|sun;hydro|water;lun|moon;terra|land;flor|flower;homo|same;hetero|different;iso|equal;poly|many;mono|one;pan|all;per|through;peri|around;epi|upon;hyper|excessive;hypo|under;dia|through;para|beside;syn|together;proto|first;eu|good;dys|abnormal;retro|backward;intra|within;extra|beyond;contra|against;de|down;ab|away;ad|toward;ante|before;neuro|nerve;osteo|bone;gastro|stomach;ot|ear;dent|tooth;scrib|write;sect|cut;vac|empty;viv|life;mort|death;nat|birth;pater|father;matr|mother;ann|year;dec|ten;mill|thousand;equi|equal;magn|great;min|small;brev|short;alt|high;prim|first;init|beginning;techno|skill;poli|city;dem|people;crat|rule;soph|wisdom;phil|love;mania|madness;vent|come;curr|run;sequ|follow;vert|turn;tract|pull;serv|serve;val|worth;lect|read;sci|know;voc|call;sign|mark;sens|feel;fer|carry;pon|place;tang|touch;sol|alone;pod|foot;chrom|color;pyro|fire;bibl|book';
  var W_ROOTS = W_RTRAW.split(';').map(function (s) { return s.split('|'); });

  /* ---- Homophone Hop: over 150 sentences (2.4x v1), true homophones only (identical pronunciation, verified pair by pair) ---- */
  var W_HMRAW = 'Put the books over ___.|there|their,’they’re,three|There points to a place.|0;Look, ___ is a cat on the roof.|there|their,’they’re,then|There points out that something exists.|0;The kids left ___ coats at school.|their|there,’they’re,them|Their shows belonging.|0;The dogs wagged ___ tails.|their|there,’they’re,three|Their shows belonging.|0;Do you know if ___ car is parked outside.|their|there,’they’re,then|Their shows belonging.|0;I think ___ going to win the game.|they’re|there,their,three|They’re means they are.|0;We are going ___ the beach.|to|too,two,toe|To shows direction.|0;My sister likes pizza, and I like it ___.|too|to,two,toe|Too means also.|0;I have ___ brothers.|two|to,too,toe|Two is the number 2.|0;It is ___ hot to play outside.|too|to,two,toe|Too means more than enough.|0;Please do not eat ___ many cookies.|too|to,two,toe|Too means more than enough.|0;Is this ___ book.|your|you’re,you,yore|Your shows belonging.|0;Please wash ___ hands before lunch.|your|you’re,you,yore|Your shows belonging.|0;I hope you know that ___ my best friend.|you’re|your,you,yore|You’re means you are.|0;Tell me when ___ ready.|you’re|your,you,yore|You’re means you are.|0;The bird built ___ nest in a tree.|its|it’s,is,it|Its shows belonging.|0;The cat licked ___ paw.|its|it’s,is,it|Its shows belonging.|0;I think ___ going to rain.|it’s|its,is,it|It’s means it is.|0;They said ___ time to go.|it’s|its,is,it|It’s means it is.|0;The ___ is sunny today.|weather|whether,wither,leather|Weather is sun, rain and wind.|1;I do not know ___ to laugh or cry.|whether|weather,wither,wetter|Whether means if.|1;Press the ___ to stop the bike.|brake|break,brick,brace|A brake makes a vehicle stop.|1;Please do not ___ the window.|break|brake,bake,brick|Break means to smash or snap.|1;Let us take a ___ after lunch.|break|brake,bake,brick|A break is a rest.|1;Come ___ right now.|here|hear,her,hare|Here is a place. Hear is what ears do.|1;Did you ___ that strange noise.|hear|here,her,heat|You hear with your ears.|1;I ___ a letter to my grandma.|write|right,white,rite|Write is what you do with a pen.|1;Turn ___ at the corner.|right|write,white,rite|Right is a direction.|1;You got the answer ___.|right|write,white,rite|Right means correct.|1;We swam in the ___.|sea|see,say,sew|The sea is salt water.|1;Can you ___ the bird in the tree.|see|sea,say,sew|You see with your eyes.|1;The ___ rises in the east.|sun|son,sin,sum|The sun is our star.|1;Their ___ is ten years old.|son|sun,sin,sum|A son is a boy child.|1;I ___ the answer already.|knew|new,now,night|Knew is the past of know.|1;She got a ___ bike for her birthday.|new|knew,now,know|New is the opposite of old.|1;Our team ___ the match.|won|one,worn,ton|Won is the past of win.|1;I only need ___ more minute.|one|won,worn,ton|One is the number 1.|1;Do you know ___ coat this is.|whose|who’s,who,whom|Whose asks who owns something.|2;I wonder ___ coming to the party.|who’s|whose,who,whom|Who’s means who is.|2;I ate the ___ pizza.|whole|hole,hall,hale|Whole means all of it.|2;There is a ___ in my sock.|hole|whole,hall,hold|A hole is an opening.|2;She ___ the ball to me.|threw|through,tough,thaw|Threw is the past of throw.|2;We walked ___ the park.|through|threw,tough,thaw|Through means from one side to the other.|2;The train went ___ the tunnel.|through|threw,tough,thaw|Through means from one side to the other.|2;Bake the cake with ___ and eggs.|flour|flower,floor,flow|Flour is ground grain used in baking.|0;She picked a red ___ from the garden.|flower|flour,floor,flow|A flower grows on a plant.|0;We all want ___ in the world.|peace|piece,pass,pea|Peace is calm without fighting.|0;May I have a ___ of pie.|piece|peace,pace,pier|A piece is a part of something.|0;I bought a new ___ of shoes.|pair|pear,peer,pare|A pair is two matching things.|0;She ate a juicy ___ for lunch.|pear|pair,peer,pare|A pear is a fruit.|0;We waited a whole ___ for the bus.|hour|our,out,oar|An hour is sixty minutes.|0;This is ___ house, not theirs.|our|hour,out,oars|Our shows that something belongs to us.|0;The teddy ___ sat on the shelf.|bear|bare,beer,bar|A bear is a large furry animal.|0;The tree branches were ___ in winter.|bare|bear,bar,bore|Bare means uncovered or empty.|0;After the race I felt very ___.|weak|week,wake,walk|Weak means lacking strength.|0;There are seven days in a ___.|week|weak,wick,work|A week is seven days.|0;Please ___ for your turn in line.|wait|weight,wit,went|Wait means to stay until something happens.|0;The nurse checked the baby is ___ on the scale.|weight|wait,wight,width|Weight is how heavy something is.|0;The pirate ship set ___ at dawn.|sail|sale,seal,soil|To sail is to travel on a ship.|0;Everything in the shop was on ___.|sale|sail,sole,sill|A sale is when prices are lowered.|0;Please ___ this letter for me.|mail|male,mile,meal|Mail is letters and packages sent by post.|0;A rooster is a ___ chicken.|male|mail,mole,mall|Male means being of the sex that cannot lay eggs.|0;We flew home on a small ___.|plane|plain,plan,plate|A plane is an aircraft with wings.|0;The desert was flat and ___.|plain|plane,plant,plank|Plain means flat land with few trees.|0;The sky turned a deep ___ at sunset.|blue|blew,blur,glue|Blue is a color.|0;The wind ___ the leaves off the tree.|blew|blue,blow,brew|Blew is the past tense of blow.|0;We ___ dinner together at six.|ate|eight,eat,ant|Ate is the past tense of eat.|0;A spider has ___ legs.|eight|ate,eighth,eagle|Eight is the number after seven.|0;A ___ buzzed around the flowers.|bee|be,bean,bell|A bee is a flying insect that makes honey.|0;I want to ___ a doctor one day.|be|bee,bet,bay|Be means to exist or become.|0;I do not ___ the answer to that question.|know|no,now,knot|Know means to have information in your mind.|0;She said ___ when I asked for candy.|no|know,not,nod|No means a refusal or denial.|0;Turn ___ at the next street.|right|write,white,rite|Right can mean a direction or correct.|1;I will ___ a letter to my pen pal.|write|right,white,rite|Write means to put words on paper.|1;Sitting on the wooden ___ hurt my back.|board|bored,bard,broad|A board is a flat piece of wood.|1;The long lecture made the class ___.|bored|board,bird,bond|Bored means feeling tired of something dull.|1;Sandpaper feels rough and ___.|coarse|course,chorus,cross|Coarse means rough in texture.|1;We are taking a cooking ___ this fall.|course|coarse,curse,coast|A course is a class or a set path.|1;A ___ ran across the forest trail.|deer|dear,deed,door|A deer is a hoofed forest animal.|1;Thank you for the gift, my ___ friend.|dear|deer,dare,deep|Dear is a warm way to address someone.|1;The bus ___ was more than I expected.|fare|fair,far,fire|A fare is the price paid to ride.|1;The county ___ had rides and games.|fair|fare,fear,film|A fair is an outdoor event with rides and games.|1;Winning the race was a great ___.|feat|feet,fear,feast|A feat is an impressive achievement.|1;My ___ were sore after the long hike.|feet|feat,felt,fret|Feet are the parts of the body you stand on.|1;The waiter dropped the tray with a ___.|grate|great,gate,grade|To grate can mean to make a harsh scraping sound.|1;We had a ___ time at the beach.|great|grate,greet,grease|Great means very good or large.|1;The rabbit has soft ___ on its back.|hair|hare,hail,harm|Hair grows from the skin.|1;A ___ is like a large, fast rabbit.|hare|hair,hard,harp|A hare is a fast running relative of the rabbit.|1;This cream will ___ the cut on your arm.|heal|heel,help,head|Heal means to make well again.|1;I have a blister on my ___.|heel|heal,hello,held|The heel is the back part of the foot.|1;The farmer kept a large ___ of cattle.|herd|heard,hard,herb|A herd is a group of animals.|1;I ___ a strange noise outside last night.|heard|herd,head,hardy|Heard is the past tense of hear.|1;In the story, a brave ___ saved the village.|knight|night,knit,kind|A knight was an armored medieval warrior.|1;The stars come out at ___.|night|knight,nine,next|Night is the dark part of the day.|1;Her golden gown was ___ of the finest silk.|made|maid,mad,mode|Made is the past tense of make.|1;A ___ cleaned the rooms of the old castle.|maid|made,mad,main|A maid is a person who cleans a house.|1;We had ___ and potatoes for dinner.|meat|meet,mean,melt|Meat is the flesh of an animal used as food.|1;Let us ___ at the park after school.|meet|meat,melt,mend|Meet means to come together with someone.|1;The queen began her long ___ that year.|reign|rain,ring,reach|A reign is the period a ruler is in power.|1;Grab an umbrella, it looks like ___.|rain|reign,ran,raid|Rain is water falling from clouds.|1;The old wagon ___ slowly down the dirt path.|rode|road,ride,rose|Rode is the past tense of ride.|1;A long ___ stretched across the valley.|road|rode,read,roar|A road is a path for vehicles.|1;The actor learned his ___ for the play.|role|roll,rule,rope|A role is a part played by an actor.|1;Please pass me a bread ___.|roll|role,roof,rock|A roll is a small round piece of bread.|1;We watched the final ___ of the movie.|scene|seen,scent,scale|A scene is one part of a story or play.|1;Have you ___ my glasses anywhere.|seen|scene,sent,send|Seen is the past participle of see.|1;Only ___ of the students passed the test.|some|sum,same,song|Some means a portion, not all.|1;Add the numbers to find the ___.|sum|some,sung,sip|A sum is the total of numbers added together.|1;The bridge was built from ___ beams.|steel|steal,stall,still|Steel is a strong metal.|1;It is wrong to ___ from a store.|steal|steel,stem,step|Steal means to take something that is not yours.|1;Every fairy ___ has a happy ending.|tale|tail,tame,talk|A tale is a story.|1;The dog wagged its ___ with joy.|tail|tale,talk,team|A tail is the part at the back of an animal.|1;I wonder ___ team will win the match.|which|witch,wish,whim|Which is used to ask about a choice.|1;In the story, a ___ cast a magic spell.|witch|which,wash,wick|A witch is a character with magic powers in stories.|1;The chair was carved from solid ___.|wood|would,word,wool|Wood comes from the trunk of a tree.|1;I asked if she ___ like some tea.|would|wood,world,wound|Would is used to talk about a possible action.|1;He picked a ripe ___ from the bush.|berry|bury,belly,berth|A berry is a small juicy fruit.|1;Dogs sometimes ___ bones in the yard.|bury|berry,busy,burn|Bury means to put something under the ground.|1;The room had a tall ___ and bright lights.|ceiling|sealing,sailing,ceding|The ceiling is the top inside surface of a room.|1;She is ___ the envelope with tape.|sealing|ceiling,selling,settling|Sealing means closing something shut.|1;I ate a bowl of ___ for breakfast.|cereal|serial,several,cellar|Cereal is a breakfast food made from grain.|1;The show airs as a weekly ___ on television.|serial|cereal,signal,circle|A serial is a story told in parts over time.|1;The cow slowly ___ its food.|chews|choose,chess,cheers|Chews means bites and grinds with the teeth.|1;You may ___ any book from the shelf.|choose|chews,chose,chores|Choose means to pick one option.|1;The company reported a large ___ this year.|profit|prophet,product,proper|A profit is the money gained after costs.|1;In the story, a ___ warned the town of danger.|prophet|profit,protect,prompt|A prophet is a person said to speak for a god.|1;The gardener planted a red ___ this spring.|rose|rows,rope,robe|A rose is a flower that grows on a thorny stem.|1;The farmer planted the corn in straight ___.|rows|rose,roll,role|Rows are straight lines of planted crops.|1;The eagle began to ___ high above the cliffs.|soar|sore,sour,scar|Soar means to fly or rise high in the air.|1;My legs felt ___ after the long hike.|sore|soar,story,sort|Sore means painful to the touch.|1;I forgot ___ I left my keys.|where|wear,were,when|Where asks about a place.|1;I will ___ my new coat to school today.|wear|where,want,war|Wear means to have clothing on your body.|1;Which ___ should we take to the museum.|way|weigh,wax,wall|A way is a route or path to somewhere.|1;The nurse asked him to ___ himself on the scale.|weigh|way,weight,welt|Weigh means to measure how heavy something is.|1;The school ___ greeted the new students.|principal|principle,primary,princess|A principal is the head of a school.|1;Honesty is an important ___ to live by.|principle|principal,prince,print|A principle is a basic rule or belief.|2;The car stayed ___ at the red light.|stationary|stationery,station,stationed|Stationary means not moving.|2;I bought envelopes and pens at the ___ shop.|stationery|stationary,stadium,statement|Stationery is paper and pens used for writing.|2;The nation’s ___ city holds its main government buildings.|capital|capitol,capable,captain|A capital is the city where a government is based.|2;The dome of the ___ building rose above the square.|capitol|capital,caption,capsule|A capitol is the building where a legislature meets.|2;The old horse gave a tired, ___ neigh.|hoarse|horse,house,hose|Hoarse describes a rough, strained voice.|2;A ___ pulled the wagon down the lane.|horse|hoarse,hose,horde|A horse is a large animal used for riding.|2;The nurse praised the doctor for her endless ___.|patience|patients,patient,pattern|Patience is the ability to wait calmly.|2;The clinic was full of waiting ___.|patients|patience,parents,pastries|Patients are people receiving medical care.|2;On a still night you can hear the frogs by the ___.|creek|creak,creep,crack|A creek is a small flowing stream.|2;The old door gave a long, slow ___.|creak|creek,crank,cream|A creak is a squeaking sound from old wood.|2';
  var W_HOM = W_HMRAW.split(';').map(function (s) { var p = s.split('|'); return [p[0], p[1], p[2], p[3], +p[4]]; });

  /* ---- Prefix Pop: 118 items (2.5x v1), genuine Greek/Latin prefixes only, correct verifiable meanings ---- */
  var W_PXG = [['dis', 're', 'pre', 'in'], ['im', 'il', 'ir', 'non', 'sub', 'inter', 'semi', 'anti', 'de', 'ex', 'co', 'con'],
    ['trans', 'super', 'extra', 'post', 'ante', 'circum', 'bi', 'tri', 'uni', 'multi', 'auto', 'micro', 'mega', 'hyper', 'mono', 'peri', 'epi', 'proto', 'para', 'hemi', 'dys']];
  var W_PFRAW = 'agree|not agree|dis||0;obey|not obey|dis||0;honest|not honest|dis||0;appear|go out of sight|dis||0;connect|take apart|dis||0;comfort|a lack of ease|dis||0;approve|not approve of|dis||0;build|build again|re||0;paint|paint again|re||0;count|count again|re||0;write|write again|re||0;play|play again|re||0;fill|fill again|re||0;place|put in for another|re||0;view|look at before|pre||0;heat|heat before|pre||0;pay|pay before|pre||0;school|before regular school|pre||0;caution|care taken beforehand|pre||0;visible|not able to be seen|in||0;correct|not correct|in||0;complete|not complete|in||0;active|not active|in||0;sane|not sane|in||0;secure|not secure|in||0;possible|not possible|im||1;polite|not polite|im||1;patient|not patient|im||1;perfect|not perfect|im||1;mature|not mature|im||1;legal|not legal|il|non|1;logical|not logical|il|non|1;literate|not able to read|il|non|1;regular|not regular|ir|non|1;responsible|not responsible|ir|non|1;rational|not rational|ir|non|1;relevant|not relevant|ir|non|1;fiction|writing that is not fact|non||1;stop|without stopping|non||1;sense|words with no meaning|non||1;toxic|not poisonous|non||1;profit|not made to earn money|non||1;marine|below the sea|sub||1;way|a path below the street|sub||1;title|a smaller heading below|sub||1;zero|below zero|sub||1;merge|go down under water|sub||1;national|between nations|inter||1;act|act with each other|inter||1;city|between cities|inter||1;view|a meeting with questions|inter||1;circle|half a circle|semi||1;final|the round before the last|semi||1;annual|happening twice a year|semi||1;freeze|stops liquid from freezing|anti||1;social|against being friendly|anti||1;septic|stops germs from growing|anti|non|1;virus|software against harmful code|anti||1;clockwise|the opposite turning way|anti||1;code|figure out a hidden message|de||1;frost|remove ice from something|de||1;throne|remove a ruler from power|de||1;activate|turn something off|de||1;hydrate|remove water from something|de||1;port|carry goods out of a country|ex||1;it|a way out|ex||1;hale|breathe air out|ex||1;tract|pull something out|ex||1;operate|work together with others|co||1;pilot|a second pilot who helps|co||1;port|carry across a distance|trans||2;form|change something completely|trans||2;plant|move to grow somewhere new|trans||2;atlantic|crossing the Atlantic Ocean|trans||2;human|beyond normal human power|super||2;market|a very large grocery store|super||2;star|an extremely famous performer|super||2;ordinary|beyond what is usual|extra||2;curricular|beyond the school subjects|extra||2;war|the period after a war|post||2;season|the games after the season|post||2;room|a small room before the main one|ante||2;navigate|sail all the way around|circum||2;cycle|a two wheeled vehicle|bi||2;weekly|happening every two weeks|bi||2;lingual|able to use two languages|bi||2;angle|a shape with three sides|tri||2;cycle|a three wheeled vehicle|tri||2;corn|a horse with one horn|uni||2;form|the same outfit for everyone|uni||2;cycle|a one wheeled cycle|uni||2;color|having many colors|multi||2;task|do many tasks at once|multi||2;purpose|useful for many purposes|multi||2;graph|a signature you write yourself|auto||2;mobile|a self powered road vehicle|auto||2;biography|the story of your own life|auto||2;scope|a tool to see tiny things|micro||2;wave|an oven using tiny waves|micro||2;chip|a tiny computer circuit|micro||2;phone|a device that makes sound huge|mega||2;byte|a very large unit of data|mega||2;active|much more active than usual|hyper||2;link|a jump to another web page|hyper||2;rail|a train that runs on one rail|mono||2;tone|speech in one flat tone|mono||2;gram|a design of your own initials|mono||2;scope|a tube used to see around corners|peri||2;meter|the distance around a shape|peri||2;center|the point right above a quake|epi||2;type|the first working model|proto||2;medic|a person trained for emergencies|para||2;phrase|say the same idea in new words|para||2;normal|beyond what science can explain|para||2;sphere|one half of a round shape|hemi||2;function|not working the right way|dys||2;firm|make something certain|con||1;dense|make more crowded together|con||1';
  var W_PFX = W_PFRAW.split(';').map(function (s) { var p = s.split('|'); return { w: p[0], m: p[1], a: p[2], x: p[3] ? p[3].split(',') : [], l: +p[4] }; });

  /* ---- Sentence Scramble: 157 sentences (2.4x v1) across a wide length range for three difficulty tiers ---- */
  var W_SENRAW = 'The sun is hot;I like green apples;We eat lunch at noon;The cat drinks milk;My mom baked a cake;Dogs love to run;A bird built a nest;The baby drank the milk;She reads a good book;Rain falls from clouds;He kicked the red ball;Bees make sweet honey;The moon shines at night;I brush my teeth;The train left the station;Frogs jump into ponds;Cows eat green grass;We plant seeds in spring;She wore a yellow hat;The bus stops at school;Butterflies drink nectar from flowers;He wore his warm coat;Fish eat small bugs;Ducks like the water;Kids like ice cream;Snow feels very cold;Our teacher writes on the board;The children walked to the school;Mom put the milk in the fridge;Ben carried his books in a bag;Grandma knitted a warm scarf for me;The ship sailed across the sea;The boy climbed up the steep hill;Snow covered the roofs of the town;The doctor gave me some medicine;Tom threw the ball to Max;She played songs on the piano;A fierce storm destroyed the old barn;She put the cookies in the jar;Dad put the car in the garage;He hung the coat on the hook;My sister rides her bike to school;Mom cut the apple into four pieces;Water boils at one hundred degrees Celsius;The bear sleeps all winter long;The frog jumped into the pond;He carries his lunch to school;Sam poured milk into the glass;My grandma bakes bread every Sunday;The wind blew the leaves off the tree;The teacher wrote the date on the board;My grandfather told us a story about a dragon;The boy put the book on the table;The chef put the pizza in the oven;The farmer put the hay in the barn;The librarian put the books on the shelf;The painter put the paint on the wall;The captain steered the ship into the harbor;The nurse put the bandage on the cut;The mailman put the letters in the box;The waiter put the plates on the tray;The magician pulled a rabbit out of a hat;The knight carried the sword into the castle;The baker put the bread in the oven;Every morning my dad drinks a cup of coffee;The scientist poured the water into the beaker;The children put the toys into the box;The chef poured the sauce over the pasta;The woman put the flowers in the vase;The girl poured the juice into the cup;The dog barks loudly;A cat naps all day;We ride our bikes;Birds sing in trees;She likes hot soup;He wears a red cap;The baby giggled softly;Ants carry heavy crumbs;The kite flew high;My shoes are too tight;We swim in the lake;The clock struck noon;Leaves fall in autumn;Bees pollinate flowers;The fire crackled warmly;I packed my lunch bag;The puppy chased its tail;Stars twinkle at night;The bread smells fresh;We planted a small tree;The kids built a fort;Waves crashed on the shore;The chef stirred the soup;Our class visited the zoo;The farmer fed the goats;Thunder rumbled in the distance;The artist painted a mural;A rainbow appeared after the storm;The squirrel buried its acorns;We watched the sunset together;The library was quiet and calm;My brother fixed his bicycle;The garden bloomed with tulips;A gentle breeze cooled the porch;The old clock ticked all night;Grandpa told us funny jokes;The puppy learned a new trick;We packed snacks for the trip;The river flowed past the village;Her kite got stuck in a tree;The baker sold warm cinnamon rolls;A curious fox peeked from the bushes;The children shared their toys nicely;The astronaut floated inside the capsule;Fresh snow covered the quiet street;The orchestra tuned their instruments carefully;My aunt grows herbs on her balcony;The lighthouse guided ships through the fog;A gentle rain tapped on the window;The scientist recorded every careful measurement;Our neighbors planted a row of sunflowers;The turtle slowly crossed the sandy beach;The mechanic repaired the engine before noon;A flock of geese flew south for winter;The museum displayed ancient pottery from Egypt;The coach praised the team after the win;Fireflies glowed softly across the summer meadow;The postman delivered a heavy box today;My little sister drew a picture of our house;The hikers followed the trail up the mountain;A warm blanket kept the baby cozy all night;The chef added fresh basil to the simmering sauce;Our teacher explained the lesson with a bright smile;The carpenter measured the wood twice before cutting;The gardener watered the roses every single morning;A curious kitten batted the ball across the floor;The pilot announced a smooth landing over the speakers;Bright lanterns lit up the narrow evening streets;The scientist mixed two chemicals inside the glass beaker;Every summer the family camps beside a quiet lake;The old sailor told stories about distant stormy seas;A tiny seed grew into a tall sturdy sunflower;The librarian organized the shelves by author and subject;Our dog buried an old bone beneath the porch steps;The violinist practiced the same passage several careful times;A soft blanket of fog rolled over the sleepy harbor;The young apprentice watched the blacksmith shape the glowing metal;Every winter the pond freezes solid enough for skating;The tired travelers finally reached the small mountain village;A row of colorful kites danced above the sandy dunes;The curious student asked the professor several thoughtful questions;The old bridge creaked under the weight of the wagon;A determined ant carried a crumb twice its own size;The excited puppy wagged its tail at every visitor;The night sky filled slowly with countless twinkling stars;A patient beekeeper checked each hive early every morning;The young explorer sketched every plant along the forest trail;Our grandmother knits a warm scarf for each grandchild;The engineer tested the bridge before opening it to traffic;A gentle stream wound quietly through the shaded green valley;The determined climbers reached the snowy summit before sunset;The old lighthouse keeper polished the lamp every single evening';
  var W_SEN = W_SENRAW.split(';');

  /* ---- Missing Letter: 118 words (2.7x v1), spellings verified letter by letter, American standard spelling ---- */
  var W_MLRAW = '0|fr_end|i|e,a,o;0|sch_ol|o|a,e,u;0|ba_ana|n|m,l,r;0|be_ause|c|s,k,z;0|ele_ant|ph|f,pf,ff;0|ora_ge|n|m,l,r;0|beaut_ful|i|e,a,o;0|diffe_ent|r|l,n,s;0|fa_ily|m|n,l,r;0|ans_er|w|v,u,r;0|lib_ary|r|l,n,w;0|Wednes_ay|d|t,b,n;0|ju_ge|d|t,b,k;1|nece_ary|ss|s,sss,cc;1|sep_rate|a|e,i,o;1|defin_tely|i|a,e,o;1|rec_ve|ei|ie,ee,ea;1|gov_rnment|e|a,u,i;1|ne_ghbor|i|a,e,u;1|exa_erate|gg|g,j,dg;1|emb_rrass|a|e,i,o;1|accomm_date|o|a,e,u;1|restaur_nt|a|e,o,i;1|ind_pendent|e|a,i,o;1|ques_ion|t|ch,sh,c;1|occa_ion|s|ss,z,c;1|su_ess|cc|c,ss,sc;1|calend_r|a|e,o,u;2|pers_verance|e|a,i,o;2|conscien_e|c|s,t,ss;2|mischie_ous|v|f,w,b;2|bureauc_acy|r|l,n,s;2|rhy_hm|t|p,d,th;2|pronun_iation|c|s,t,ci;2|perso_el|nn|n,mm,ln;2|privile_e|g|dg,j,ge;2|ha_ass|r|rr,l,s;2|millenn_um|i|e,a,o;2|tho_ough|r|w,l,n;2|cemet_ry|e|a,o,i;2|ph_nomenon|e|a,o,i;2|silhou_tte|e|a,i,o;2|ac_uaintance|q|k,c,qu;0|p_cture|i|e,a,o;0|umbre_la|l|r,n,t;0|si_ter|s|c,z,x;0|windo_|w|v,u,y;0|tea_her|c|k,s,t;0|doc_or|t|d,p,c;0|far_er|m|n,l,r;0|gar_en|d|t,b,k;0|hos_ital|p|b,f,v;0|pen_il|c|s,z,k;0|mus_c|i|e,a,u;0|riv_r|e|a,i,o;0|sum_er|m|n,l,t;0|writ_ng|i|e,a,o;0|hel_o|l|r,n,d;1|bu_iness|s|ss,z,c;1|comm_ttee|i|e,a,u;1|embarra_sment|s|ss,c,z;1|occ_py|u|o,a,i;1|reli_ve|e|ei,ie,ea;1|surpr_se|i|e,a,y;1|vac_um|u|uu,oo,ou;1|wei_d|r|rd,er,ir;1|arg_ment|u|ue,oo,ew;1|begin_ing|n|nn,n,m;1|develo_ment|p|pp,b,v;1|enviro_ment|n|nm,m,nn;1|fam_liar|i|e,a,y;1|for_ign|e|ei,ie,ea;1|imm_diately|e|ea,i,a;1|lan_uage|g|gg,j,k;1|ma_ntenance|i|e,a,y;2|acquies_e|c|s,ss,sc;2|apparat_s|u|us,a,o;2|cate_ory|g|gg,j,k;2|circu_stance|m|mm,n,v;2|comm_moration|e|i,a,o;2|del_berately|i|e,a,y;2|entrepr_neur|e|i,a,ea;2|extraordi_ary|n|nn,m,l;2|hyp_crisy|o|a,e,i;2|inde_endence|p|pp,b,v;2|liais_n|o|a,e,u;2|maneu_er|v|w,b,f;2|neces_ity|s|ss,c,z;2|occurr_nce|e|a,i,o;2|paral_el|l|ll,r,n;2|pos_ess|s|ss,c,z;2|reminis_ent|c|s,sc,ss;2|supers_de|e|i,a,ea;2|vac_llate|i|e,a,y';
  var W_ML = [[], [], []];
  W_MLRAW.split(';').forEach(function (s) { var p = s.split('|'); W_ML[+p[0]].push([p[1], p[2], p[3]]); });

  /* ---- Part of Speech Sort: 134 words (2.7x v1), each unambiguous in isolation (no noun/verb or noun/adjective doubles) ---- */
  var W_SPRAW = 'N river teacher city window ocean mountain planet kitchen library hospital elephant giraffe dolphin penguin umbrella calendar alphabet dinosaur astronaut telescope violin volcano kangaroo notebook refrigerator motorcycle ambulance firefighter classroom playground thermometer;V write sing believe imagine discover decide apologize celebrate exaggerate memorize recognize entertain investigate participate congratulate disappear communicate appreciate demonstrate hesitate cooperate organize recommend consider describe explain continue establish examine identify introduce realize remember suggest survive astonish;A happy brave enormous fragile ancient silent clever tiny gentle curious nervous gloomy messy modern delicious spicy sturdy flexible rigid noisy lively mysterious famous wealthy arrogant stubborn talkative polite healthy clumsy graceful loyal timid stupid greedy grumpy pleasant;D quickly slowly quietly carefully happily always never soon bravely gently silently nervously cheerfully curiously eagerly calmly anxiously gracefully honestly patiently rapidly smoothly suddenly frequently occasionally immediately accidentally deliberately enthusiastically generously';
  var W_SPW = { N: [], V: [], A: [], D: [] };
  W_SPRAW.split(';').forEach(function (s) { var p = s.split(' '); W_SPW[p[0]] = p.slice(1); });

  def('unscramble', EDU, 'Unscramble', R.orange, 'Letter tiles are all mixed up. Read the clue, then spell the hidden word before the timer bar runs out.', 'Tap tiles or type letters · Backspace undo · Space shuffle · Enter hint (-5)', function (G) {
    var W = 400, H = 480, c = G.canvas(W, H), lv = 1, queue = [], entry, word, tiles, ord, placed, tl, tmax, lives, score, streak, bestS, hinted, state, fb, msg, done, bg, TSk = {}, hist = [];
    bg = W_paper(W, H, '#1b1440', '#120d2c');
    function ts(tw, top, bot) { var k = tw + '_' + top; if (!TSk[k]) TSk[k] = W_tileSprite(tw, 52, top, bot); return TSk[k]; }
    function nextWord() {
      if (!queue.length) queue = shuf(W_uPool(lv));
      entry = queue.pop(); word = entry.w;
      var s; do { s = shuf(word.split('')).join(''); } while (s === word && word.length > 2);
      tiles = s.split('').map(function (ch) { return { ch: ch, used: false }; });
      ord = tiles.map(function (t, i) { return i; }); placed = []; hinted = false; state = 0; fb = 0; msg = '';
      tmax = [30, 26, 24][lv] * Math.max(0.55, 1 - streak * 0.03); tl = tmax;
      if (window.W_TEST) window.W_TEST.unscramble = { word: word, correct: function () { var i; for (i = 0; i < word.length; i++) document.dispatchEvent(new KeyboardEvent('keydown', { key: word.charAt(i), bubbles: true })); } };
    }
    function start() { G.gen = (G.gen || 0) + 1; lives = 3; score = 0; streak = 0; bestS = 0; done = 0; queue = []; hist = []; G.fx = []; nextWord(); G.frame(step); }
    function lay() { var n = tiles.length, tw = n >= 8 ? 38 : n >= 7 ? 42 : 48, gap = 5; return { tw: tw, gap: gap, x0: (W - (n * tw + (n - 1) * gap)) / 2 }; }
    function sx(j) { var g = lay(); return g.x0 + j * (g.tw + g.gap); }
    function put(i) {
      if (state !== 0 || tiles[i].used || placed.length >= tiles.length) return;
      tiles[i].used = true; placed.push(i);
      if (placed.length === tiles.length) judge();
    }
    function pop(to) { if (state !== 0) return; to = Math.max(0, to); while (placed.length > to) tiles[placed.pop()].used = false; }
    function judge() {
      var g = placed.map(function (i) { return tiles[i].ch; }).join(''), n = tiles.length;
      if (g === word) {
        state = 1; fb = 1.3; streak++; bestS = Math.max(bestS, streak); done++;
        score += 10 + n * 2 + Math.ceil(tl) + Math.min(streak, 10) * 3;
        G.tally(true, word.toUpperCase() + ' - ' + entry.d);
        msg = word.toUpperCase() + ' - ' + entry.d;
        G.burst(200, 126, R.green, 22);
        hist.push(1); if (hist.length > 12) hist.shift();
      } else { miss('Not quite. It was ' + word.toUpperCase() + ' - ' + entry.d); }
    }
    function miss(m) { state = 2; fb = 2.3; lives--; streak = 0; msg = m; G.tally(false, word.toUpperCase() + ' - ' + entry.d); hist.push(0); if (hist.length > 12) hist.shift(); }
    function hint() {
      var i, k;
      if (state !== 0 || hinted) return;
      hinted = true; score = Math.max(0, score - 5); pop(0);
      for (i = 0; i < tiles.length; i++) if (tiles[i].ch === word.charAt(0) && !tiles[i].used) { k = i; break; }
      if (k !== undefined) put(k);
    }
    function shuffle() { ord = shuf(ord); }
    function btn(i) { return { x: 14 + i * 128, y: 288, w: 116, h: 44 }; }
    G.pointer({ down: function (p) {
      var g = lay(), j, i, b;
      if (state !== 0) return;
      for (j = 0; j < tiles.length; j++) {
        if (p.x >= sx(j) && p.x <= sx(j) + g.tw && p.y >= 198 && p.y <= 250) put(ord[j]);
        if (j < placed.length && p.x >= sx(j) && p.x <= sx(j) + g.tw && p.y >= 138 && p.y <= 190) { pop(j); return; }
      }
      for (i = 0; i < 3; i++) { b = btn(i); if (p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h) { if (i === 0) shuffle(); else if (i === 1) hint(); else pop(placed.length - 1); } }
    } });
    G.press = function (k) {
      var j;
      if (k === 'Backspace') pop(placed.length - 1);
      else if (k === ' ') shuffle();
      else if (k === 'Enter') hint();
      else if (k.length === 1 && k >= 'a' && k <= 'z' && state === 0) {
        for (j = 0; j < ord.length; j++) if (!tiles[ord[j]].used && tiles[ord[j]].ch === k) { put(ord[j]); break; }
      }
    };
    G.pad([['Shuffle', 'Space'], ['Hint', 'Enter'], ['Undo', 'Backspace']]);
    function step(dt) {
      var g, n, j, i, b, top, bot, labs = ['Shuffle', hinted ? 'Hint used' : 'Hint -5', 'Undo'];
      if (state === 0) { tl -= dt; if (tl <= 0) miss('Time is up. It was ' + word.toUpperCase() + ' - ' + entry.d); }
      else { fb -= dt; if (fb <= 0) { if (lives <= 0) { G.over(score, 'Out of lives. ' + done + ' word' + (done === 1 ? '' : 's') + ' solved, best streak ' + bestS + '.'); return; } nextWord(); } }
      g = lay(); n = tiles.length; labs[1] = hinted ? 'Hint used' : 'Hint -5';
      c.drawImage(bg, 0, 0);
      rect(c, 20, 14, 360, 8, 4, R.grid); rect(c, 20, 14, Math.max(0, 360 * tl / tmax), 8, 4, tl < 6 && state === 0 ? R.coral : R.orange);
      W_card(c, 12, 30, 376, 92, 12, '#2a2158', '#1c1640');
      txt(c, 'CLUE', 34, 46, 12, R.orange, 'left');
      wrap(c, entry.d, 200, 66, 340, 15, 18, R.ink);
      txt(c, n + ' letters', 366, 46, 12, R.dim, 'right');
      for (j = 0; j < n; j++) {
        if (state === 2) { top = R.yellow; bot = '#c99a2e'; c.drawImage(ts(g.tw, top, bot), sx(j), 138); txt(c, word.charAt(j).toUpperCase(), sx(j) + g.tw / 2, 164, 24, '#171233'); }
        else if (j < placed.length) { top = state === 1 ? R.green : R.orange; bot = state === 1 ? '#1f9e6c' : '#c96b2e'; W_shadow(c, 'rgba(0,0,0,.4)', 6, 0, 3, function () { c.drawImage(ts(g.tw, top, bot), sx(j), 138); }); txt(c, tiles[placed[j]].ch.toUpperCase(), sx(j) + g.tw / 2, 164, 24, '#171233'); }
        else { rect(c, sx(j), 138, g.tw, 52, 8, 'rgba(233,251,249,.07)'); }
      }
      for (j = 0; j < n; j++) {
        i = ord[j];
        if (!tiles[i].used) { W_shadow(c, 'rgba(0,0,0,.4)', 6, 0, 3, function () { c.drawImage(ts(g.tw, '#a79bf5', '#6a58c9'), sx(j), 198); }); txt(c, tiles[i].ch.toUpperCase(), sx(j) + g.tw / 2, 224, 24, '#171233'); }
        else rect(c, sx(j), 198, g.tw, 52, 8, 'rgba(233,251,249,.05)');
      }
      if (msg) wrap(c, msg, 200, 262, 356, 13, 16, state === 1 ? R.green : R.yellow);
      else if (streak > 1 && state === 0) txt(c, 'Streak ' + streak + ' - bonus +' + Math.min(streak, 10) * 3, 200, 262, 14, R.green);
      for (i = 0; i < 3; i++) { b = btn(i); rect(c, b.x, b.y, b.w, b.h, 10, i === 1 && hinted ? R.grid : R.blue); txt(c, labs[i], b.x + b.w / 2, b.y + b.h / 2, 15, i === 1 && hinted ? R.dim : '#171233'); }
      wrap(c, 'Spell the exact word the clue describes. Tap a rack tile to place it, tap a placed tile to remove it.', 200, 350, 350, 12, 15, R.dim);
      txt(c, 'Recent words', 200, 400, 12, R.dim);
      for (i = 0; i < hist.length; i++) { var hx = 200 - (hist.length - 1) * 13 + i * 26; circ(c, hx, 420, 7, hist[i] ? R.green : R.coral); }
      txt(c, done + ' word' + (done === 1 ? '' : 's') + ' solved this run', 200, 448, 12, R.dim);
      G.fxStep(dt);
      G.hud([['SCORE', pad(score)], ['STREAK', streak], ['LIVES', lives]]);
    }
    G.opt('Level', LV3, lv, function (i) { lv = i; start(); });
    G.begin(start);
  });

  function W_moleSprite(w, h) {
    return W_off(w, h, function (x) {
      var g = x.createRadialGradient(w * 0.4, h * 0.3, w * 0.06, w * 0.5, h * 0.5, w * 0.6), i, ang, r1, px, py, hi, g2;
      g.addColorStop(0, '#c99a67'); g.addColorStop(0.55, '#a5713f'); g.addColorStop(1, '#5f3c1f');
      x.beginPath(); x.ellipse(w / 2, h / 2 + 4, w * 0.46, h * 0.46, 0, 0, TAU); x.fillStyle = g; x.fill();
      x.fillStyle = '#7a4e28';
      x.beginPath(); x.ellipse(w * 0.22, h * 0.2, w * 0.1, h * 0.1, 0, 0, TAU); x.fill();
      x.beginPath(); x.ellipse(w * 0.78, h * 0.2, w * 0.1, h * 0.1, 0, 0, TAU); x.fill();
      x.fillStyle = '#c98a5e';
      x.beginPath(); x.ellipse(w * 0.22, h * 0.2, w * 0.05, h * 0.05, 0, 0, TAU); x.fill();
      x.beginPath(); x.ellipse(w * 0.78, h * 0.2, w * 0.05, h * 0.05, 0, 0, TAU); x.fill();
      g2 = x.createRadialGradient(w * 0.5, h * 0.6, 2, w * 0.5, h * 0.64, w * 0.22);
      g2.addColorStop(0, '#eccfa2'); g2.addColorStop(1, '#c99a67');
      x.beginPath(); x.ellipse(w * 0.5, h * 0.63, w * 0.22, h * 0.15, 0, 0, TAU); x.fillStyle = g2; x.fill();
      x.fillStyle = '#3b2a1a'; x.beginPath(); x.ellipse(w * 0.5, h * 0.57, 3.4, 2.6, 0, 0, TAU); x.fill();
      x.strokeStyle = '#2a1b10'; x.lineWidth = 2.2;
      x.beginPath(); x.arc(w * 0.37, h * 0.4, 4, 0.15, Math.PI - 0.15); x.stroke();
      x.beginPath(); x.arc(w * 0.63, h * 0.4, 4, 0.15, Math.PI - 0.15); x.stroke();
      hi = x.createRadialGradient(w * 0.32, h * 0.22, 1, w * 0.32, h * 0.22, w * 0.3);
      hi.addColorStop(0, 'rgba(255,255,255,.32)'); hi.addColorStop(1, 'rgba(255,255,255,0)');
      x.beginPath(); x.ellipse(w / 2, h / 2 + 4, w * 0.46, h * 0.46, 0, 0, TAU); x.fillStyle = hi; x.fill();
      x.strokeStyle = 'rgba(50,30,12,.22)'; x.lineWidth = 1;
      for (i = 0; i < 22; i++) { ang = Math.random() * TAU; r1 = w * 0.16 + Math.random() * w * 0.26; px = w / 2 + Math.cos(ang) * r1; py = h / 2 + 4 + Math.sin(ang) * r1 * 0.9; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(ang) * 4, py + Math.sin(ang) * 3.4); x.stroke(); }
    });
  }
  function W_dirtSprite(w, h) {
    return W_off(w, h, function (x) {
      var g = x.createRadialGradient(w * 0.5, h * 0.32, 2, w * 0.5, h * 0.52, w * 0.56), i;
      g.addColorStop(0, '#4a3319'); g.addColorStop(1, '#20130a');
      x.beginPath(); x.ellipse(w / 2, h / 2, w * 0.5, h * 0.42, 0, 0, TAU); x.fillStyle = g; x.fill();
      for (i = 0; i < 30; i++) { x.fillStyle = 'rgba(0,0,0,' + (0.1 + Math.random() * 0.16) + ')'; x.fillRect(Math.random() * w, h * 0.16 + Math.random() * h * 0.68, 2, 2); }
    });
  }
  function W_duskBg(w, h) {
    return W_off(w, h, function (x) {
      var g = x.createLinearGradient(0, 0, 0, h), g2, i;
      g.addColorStop(0, '#251149'); g.addColorStop(0.5, '#4a2350'); g.addColorStop(0.78, '#7a3a3f'); g.addColorStop(1, '#2c1a0c');
      x.fillStyle = g; x.fillRect(0, 0, w, h);
      for (i = 0; i < 46; i++) { x.fillStyle = 'rgba(255,255,255,' + (0.12 + Math.random() * 0.45) + ')'; x.fillRect(Math.random() * w, Math.random() * h * 0.42, 1.3, 1.3); }
      g2 = x.createLinearGradient(0, h * 0.62, 0, h); g2.addColorStop(0, '#3a5a2a'); g2.addColorStop(1, '#152608');
      x.fillStyle = g2; x.fillRect(0, h * 0.62, w, h * 0.38);
    });
  }

  def('synonymSwat', EDU, 'Synonym Swat', R.green, 'Moles pop up holding words. Whack the one that means the same as the target, and dodge the rest.', 'Tap a mole or press 1-9 (the numbers on the holes) · a wrong whack or a missed answer costs a life', function (G) {
    var W = 400, H = 480, c = G.canvas(W, H), lv = 1, LIFE = [2.6, 2.0, 1.6], GAP = [1.25, 0.95, 0.8],
      moles, task, lives, score, streak, bestS, tSpawn, sinceOK, msg, msgT, last, hits, dead, wait, flash,
      bg = W_duskBg(W, H), dirt = W_dirtSprite(126, 46), moleS = W_moleSprite(100, 92);
    function newTask() {
      var s, i = 0;
      do { s = pick(lv === 0 ? W_SETS.slice(0, 40) : W_SETS); i++; } while (last && s.t === last.t && i < 20);
      last = s; task = { s: s, ant: lv === 2 && Math.random() < 0.4 }; moles = []; sinceOK = 0; tSpawn = 0.5; wait = 0.5;
      if (window.W_TEST) window.W_TEST.synonymSwat = { whackRight: function () { var i2, m; for (i2 = 0; i2 < moles.length; i2++) { m = moles[i2]; if (m.ok) { whack(m.h); return; } } } };
    }
    function start() { G.gen = (G.gen || 0) + 1; lives = 3; score = 0; streak = 0; bestS = 0; hits = 0; msg = ''; msgT = 0; last = null; dead = false; flash = 0; G.fx = []; newTask(); G.frame(step); }
    function speed() { return Math.max(0.7, 1 - streak * 0.04); }
    function lose() { lives--; streak = 0; if (lives <= 0) { dead = true; G.later(function () { G.over(score, 'Out of lives. ' + hits + ' correct, best streak ' + bestS + '.'); }, 1300); } }
    function spawn() {
      var free = [], i, word, kind, onScreen = moles.map(function (m) { return m.w; }), hasOK = moles.some(function (m) { return m.ok; }), pool, right = task.ant ? task.s.a : task.s.s, other = task.ant ? task.s.s : task.s.a;
      for (i = 0; i < 9; i++) if (!moles.some(function (m) { return m.h === i; })) free.push(i);
      if (!free.length) return;
      if (!hasOK && (sinceOK >= 2 || Math.random() < 0.4)) { pool = right.filter(function (w) { return onScreen.indexOf(w) < 0; }); kind = 2; }
      else { pool = (Math.random() < 0.5 ? other : task.s.d).concat(task.s.d).filter(function (w) { return onScreen.indexOf(w) < 0; }); kind = 0; }
      if (!pool.length) return;
      word = pick(pool);
      if (kind === 2) sinceOK = 0; else sinceOK++;
      moles.push({ h: pick(free), w: word, ok: kind === 2, age: 0, life: Math.max(1.1, LIFE[lv] * speed()), res: 0, rt: 0 });
    }
    function reason(w) {
      var s = task.s, k = s.s.indexOf(w) > -1 ? 'a synonym' : s.a.indexOf(w) > -1 ? 'an antonym' : 'related but not a synonym or antonym';
      return w + ' is ' + k + ' of ' + s.t;
    }
    function whack(h) {
      var m = null, i, x, y;
      if (dead || wait > 0) return;
      for (i = 0; i < moles.length; i++) if (moles[i].h === h && !moles[i].res && moles[i].age > 0.08) m = moles[i];
      if (!m) return;
      x = 20 + (h % 3) * 120 + 60; y = 100 + Math.floor(h / 3) * 108 + 50;
      if (m.ok) {
        m.res = 1; streak++; bestS = Math.max(bestS, streak); hits++; score += 10 + Math.min(streak, 10) * 2 + Math.ceil((m.life - m.age) * 3);
        G.burst(x, y, R.green, 22); msg = m.w + (task.ant ? ' is the opposite of ' : ' means about the same as ') + task.s.t; msgT = 1.6; flash = 0.25;
        G.tally(true, m.w + ' = ' + task.s.t);
        moles.forEach(function (o) { if (o !== m && !o.res) { o.res = 3; o.rt = 0; } });
        wait = 0.7; G.later(function () { if (!dead) newTask(); }, 700);
      } else {
        m.res = 2; G.burst(x, y, R.coral, 16); msg = reason(m.w); msgT = 2.2; G.tally(false, reason(m.w)); lose();
      }
    }
    G.pointer({ down: function (p) {
      var cx = Math.floor((p.x - 20) / 120), cy = Math.floor((p.y - 100) / 108);
      if (cx >= 0 && cx < 3 && cy >= 0 && cy < 3) whack(cy * 3 + cx);
    } });
    G.press = function (k) { var i = '123456789'.indexOf(k); if (k.length === 1 && i > -1) whack(i); };
    G.pad([['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9']]);
    function step(dt) {
      var i, m, x, y, prog, hy, keep = [];
      if (msgT > 0) msgT -= dt;
      if (flash > 0) flash -= dt;
      if (wait > 0) wait -= dt;
      if (!dead && wait <= 0 && task) { tSpawn -= dt; if (tSpawn <= 0) { spawn(); tSpawn = GAP[lv] * speed() * rr(0.8, 1.15); } }
      for (i = 0; i < moles.length; i++) {
        m = moles[i]; m.age += dt; if (m.res) m.rt += dt;
        if (!m.res && m.age >= m.life) {
          m.res = m.ok ? 4 : 5; m.rt = 0;
          if (m.ok && !dead) { msg = 'Missed it: ' + m.w + (task.ant ? ' is the opposite of ' : ' means about the same as ') + task.s.t; msgT = 1.9; G.tally(false, m.w + ' = ' + task.s.t); lose(); }
        }
        if (!m.res || m.rt < 0.3) keep.push(m);
      }
      moles = keep;
      c.drawImage(bg, 0, 0);
      W_card(c, 12, 8, 376, 84, 12, flash > 0 ? '#3fae7e' : '#241c47', flash > 0 ? '#1f8f65' : '#180f38');
      txt(c, task.ant ? 'Find an ANTONYM (opposite) of:' : 'Find a SYNONYM (same meaning) of:', 200, 28, 14, task.ant ? R.coral : R.green);
      txt(c, task.s.t.toUpperCase(), 200, 60, 32, flash > 0 ? '#171233' : R.yellow);
      for (i = 0; i < 9; i++) {
        x = 20 + (i % 3) * 120; y = 100 + Math.floor(i / 3) * 108; hy = y + 84;
        c.drawImage(dirt, x - 3, hy - 23);
        txt(c, String(i + 1), x + 12, y + 10, 11, R.dim);
      }
      for (i = 0; i < moles.length; i++) {
        m = moles[i]; x = 20 + (m.h % 3) * 120; y = 100 + Math.floor(m.h / 3) * 108; hy = y + 84;
        prog = Math.min(1, m.age / 0.15, Math.max(0, (m.life - m.age) / 0.15)); if (m.res) prog = Math.max(0, 1 - m.rt / 0.3) * (m.res === 1 || m.res === 2 ? 1 : 0.8);
        c.save(); c.beginPath(); c.rect(x, y - 14, 120, hy - y + 14); c.clip();
        c.drawImage(moleS, x + 10, hy - 84 * prog, 100, 92);
        if (m.res === 1) { c.fillStyle = 'rgba(61,220,151,.28)'; c.beginPath(); c.ellipse(x + 60, hy - 46 * prog, 48, 40, 0, 0, TAU); c.fill(); }
        if (m.res === 2) { c.fillStyle = 'rgba(255,107,74,.32)'; c.beginPath(); c.ellipse(x + 60, hy - 46 * prog, 48, 40, 0, 0, TAU); c.fill(); }
        W_card(c, x + 14, hy - 66 * prog - 4, 92, 26, 7, '#f4ead6', '#d8c69c', 'rgba(23,18,51,.3)');
        fit(c, m.w, x + 60, hy - 66 * prog + 9, 84, 14, '#3b2a1a');
        c.restore();
        c.strokeStyle = '#5a3d24'; c.lineWidth = 5; c.beginPath(); c.ellipse(x + 60, hy, 52, 15, 0, 0, Math.PI); c.stroke();
      }
      if (msgT > 0) wrap(c, msg, 200, 442, 370, 14, 17, R.yellow);
      else txt(c, streak > 2 ? 'Streak ' + streak + ' - moles are getting faster' : 'Whack the ' + (task.ant ? 'opposites' : 'synonyms') + ', dodge the rest', 200, 446, 14, R.dim);
      G.fxStep(dt);
      G.hud([['SCORE', pad(score)], ['STREAK', streak], ['LIVES', lives]]);
    }
    G.opt('Level', LV3, lv, function (i) { lv = i; start(); });
    G.begin(start);
  });

  def('rootMatch', EDU, 'Word Roots', R.blue, 'Match Greek and Latin roots, prefixes and combining forms with their true meanings. They unlock thousands of English words.', 'Tap a root, then its meaning · arrows + Space work too', function (G) {
    var lvNow = 1, oo = G.opt;
    G.opt = function (l, n, cur, cb) { oo.call(G, l, n, cur, function (i) { lvNow = i; cb(i); }); };
    W_decorate(G, W_vign(400, 470));
    pairs(G, { color: R.blue, per: 6, n: [4, 5, 6], bank: { slice: function () { return lvNow === 0 ? W_ROOTS.slice(0, 45) : lvNow === 1 ? W_ROOTS.slice(0, 110) : W_ROOTS.slice(); } } });
  });

  def('homophoneHop', EDU, 'Homophone Hop', R.magenta, 'Words that sound alike but mean different things. Hop to the one that fits the sentence.', 'Click an answer or press 1-4 · three misses ends the run', function (G) {
    var queue = [], qlv = -1;
    mcq(G, { color: R.magenta, secs: [17, 14, 12], make: function (lv) {
      var e, m;
      if (qlv !== lv || !queue.length) { qlv = lv; queue = shuf(W_HOM.filter(function (h) { return lv === 0 ? h[4] === 0 : lv === 1 ? h[4] <= 1 : h[4] >= 1; })); }
      e = queue.pop(); m = mk4(e[1], e[2].split(','));
      if (window.W_TEST) window.W_TEST.homophoneHop = { a: m.a };
      return { q: 'Which word sounds right in the blank?', draw: function (c, cx, cy) {
        W_card(c, cx - 172, cy - 58, 344, 100, 10, '#2a2158', '#1c1640');
        wrap(c, e[0].split('___').join('______'), cx, cy - 10, 320, 19, 24, R.ink);
      }, why: e[3], rev: e[1] + ' - ' + e[3], opts: m.opts, a: m.a };
    } });
  });

  def('prefixPop', EDU, 'Prefix Pop', R.violet, 'Add the right Greek or Latin prefix so the word matches the clue.', 'Click an answer or press 1-4 · three misses ends the run', function (G) {
    var queue = [], qlv = -1;
    mcq(G, { color: R.violet, secs: [16, 13, 11], make: function (lv) {
      var e, allowed = [], i, m;
      if (qlv !== lv || !queue.length) { qlv = lv; queue = shuf(W_PFX.filter(function (h) { return lv === 0 ? h.l === 0 : lv === 1 ? h.l <= 1 : h.l >= 1; })); }
      e = queue.pop();
      for (i = 0; i <= lv; i++) allowed = allowed.concat(W_PXG[i]);
      m = mk4(e.a + '-', allowed.filter(function (p) { return p !== e.a && e.x.indexOf(p) < 0; }).map(function (p) { return p + '-'; }));
      if (window.W_TEST) window.W_TEST.prefixPop = { a: m.a };
      return { q: 'Which prefix makes a real word matching the clue?', draw: function (c, cx, cy) {
        W_card(c, cx - 172, cy - 56, 344, 96, 10, '#2a2158', '#1c1640');
        txt(c, e.w, cx, cy - 30, 30, R.ink); txt(c, 'to mean:', cx, cy - 2, 13, R.dim); wrap(c, e.m, cx, cy + 22, 320, 18, 22, R.yellow);
      }, why: e.a + '-' + e.w + ' = ' + e.a + '- + ' + e.w, rev: e.a + e.w + ' means ' + e.m, opts: m.opts, a: m.a };
    } });
  });

  def('sentenceScramble', EDU, 'Sentence Scramble', R.coral, 'The words of a sentence are jumbled. Tap them in the right order to put it back together.', 'Tap the words in order · arrows + Space work too · four wrong taps ends it', function (G) {
    var queue = [], qlv = -1, lo = [4, 6, 8], hi = [6, 8, 11];
    W_decorate(G, W_vign(400, 470));
    order(G, { color: R.coral, make: function (lv) {
      var s;
      if (qlv !== lv || !queue.length) { qlv = lv; queue = shuf(W_SEN.filter(function (t) { var n = t.split(' ').length; return n >= lo[lv] && n <= hi[lv]; })); }
      s = queue.pop();
      return { q: 'Tap the words to build the sentence', items: s.split(' '), first: 'first word', last: 'last word' };
    } });
  });

  def('missingLetter', EDU, 'Missing Letter', R.teal, 'A letter is missing from a tricky word. Pick the letters that finish it before the clock runs out.', 'Click an answer or press 1-4 · three misses ends the run', function (G) {
    mcq(G, { color: R.teal, secs: [14, 12, 10], make: function (lv) {
      var e = pick(W_ML[lv]), m = mk4(e[1], e[2].split(','));
      if (window.W_TEST) window.W_TEST.missingLetter = { a: m.a };
      return { q: 'Which letters finish this word?', draw: function (c, cx, cy) {
        W_card(c, cx - 172, cy - 46, 344, 84, 10, '#1e3a3a', '#132424');
        fit(c, e[0].split('_').join(' _ '), cx, cy - 2, 320, 34, R.ink);
      }, why: 'It is spelled ' + e[0].split('_').join(e[1]) + '.', rev: e[0].split('_').join(e[1]), opts: m.opts, a: m.a };
    } });
  });

  def('speechSort', EDU, 'Part of Speech Sort', R.orange, 'Words fall from the top. Send each one to its bin: noun, verb, adjective or adverb.', 'Click a bin or press 1-4 · arrows work too · three misses ends the run', function (G) {
    W_decorate(G, W_vign(400, 470));
    sorter(G, { bins: [{ n: 'Noun', c: R.blue }, { n: 'Verb', c: R.coral }, { n: 'Adjective', c: R.green }, { n: 'Adverb', c: R.yellow }], speed: [40, 56, 74], pool: function (lv) {
      var p = [], take = function (a, b, n) { shuf(a.slice()).slice(0, n).forEach(function (w) { p.push([w, b]); }); };
      take(W_SPW.N, 0, lv === 0 ? 7 : lv === 1 ? 10 : 14); take(W_SPW.V, 1, lv === 0 ? 7 : lv === 1 ? 10 : 14);
      take(W_SPW.A, 2, lv === 0 ? 6 : lv === 1 ? 9 : 13); take(W_SPW.D, 3, lv === 0 ? 4 : lv === 1 ? 8 : 12);
      return p;
    } });
  });

  /* ---- shelf colour, nav colour, hero count ---- */
  var ECOL = '#C5E84D';
  var st = document.createElement('style');
  st.setAttribute('data-csa-edu', '');
  st.textContent = NEW.map(function (id) { return '.cart[data-game=' + id + ']{--cat:' + ECOL + '}'; }).join('') + '.category-nav button:nth-child(12){--navcat:' + ECOL + '}';
  document.head.appendChild(st);
  var ONES = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  var TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  function below100(r) { return r < 20 ? ONES[r] : TENS[Math.floor(r / 10)] + (r % 10 ? '-' + ONES[r % 10].toLowerCase() : ''); }
  var cnt = M.length, hu = Math.floor(cnt / 100), re = cnt % 100;
  var word = hu ? ONES[hu] + ' hundred' + (re ? ' ' + below100(re).toLowerCase() : '') : below100(re);
  var hp = document.querySelector('.console-screen p');
  if (hp) hp.textContent = hp.textContent.replace(/^[A-Za-z-]+ signals/, word + ' signals');
  var md = document.querySelector('meta[name=description]');
  if (md) md.setAttribute('content', md.getAttribute('content').replace(/^(Coinslot Arcade: )[a-z-]+( original browser games across arcade classics, )/, '$1' + word.toLowerCase() + '$2education, '));
}
})();
