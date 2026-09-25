/* Coinslot Arcade - cartridge art. Decorative inline SVG on a 258x92 canvas.
Ink + white shapes read on every cabinet colour; `k` is the cabinet colour. */
(function (root) {
'use strict';
var Q = String.fromCharCode(34);
var I = '#0b0518', W = '#ffffff', M = '#5b4aa8';
var DOT = ' stroke-dasharray=' + Q + '0.1 7' + Q + '';
function f(v) { return v ? v : 'none'; }
function R(x, y, w, h, fl, rx, st) { return '<rect x=' + Q + '' + x + '' + Q + ' y=' + Q + '' + y + '' + Q + ' width=' + Q + '' + w + '' + Q + ' height=' + Q + '' + h + '' + Q + ' fill=' + Q + '' + f(fl) + '' + Q + '' + (rx ? ' rx=' + Q + '' + rx + '' + Q + '' : '') + (st ? ' stroke=' + Q + '' + st + '' + Q + ' stroke-width=' + Q + '2' + Q + '' : '') + '/>'; }
function C(x, y, r, fl, st, sw, ex) { return '<circle cx=' + Q + '' + x + '' + Q + ' cy=' + Q + '' + y + '' + Q + ' r=' + Q + '' + r + '' + Q + ' fill=' + Q + '' + f(fl) + '' + Q + '' + (st ? ' stroke=' + Q + '' + st + '' + Q + ' stroke-width=' + Q + '' + (sw || 2) + '' + Q + '' : '') + (ex || '') + '/>'; }
function E(x, y, rx, ry, fl, st, sw, ex) { return '<ellipse cx=' + Q + '' + x + '' + Q + ' cy=' + Q + '' + y + '' + Q + ' rx=' + Q + '' + rx + '' + Q + ' ry=' + Q + '' + ry + '' + Q + ' fill=' + Q + '' + f(fl) + '' + Q + '' + (st ? ' stroke=' + Q + '' + st + '' + Q + ' stroke-width=' + Q + '' + (sw || 2) + '' + Q + '' : '') + (ex || '') + '/>'; }
function P(d, fl, st, sw, ex) { return '<path d=' + Q + '' + d + '' + Q + ' fill=' + Q + '' + f(fl) + '' + Q + '' + (st ? ' stroke=' + Q + '' + st + '' + Q + ' stroke-width=' + Q + '' + (sw || 2) + '' + Q + ' stroke-linecap=' + Q + 'round' + Q + ' stroke-linejoin=' + Q + 'round' + Q + '' : '') + (ex || '') + '/>'; }
function L(a, b, c, d, st, sw, ex) { return P('M' + a + ' ' + b + 'L' + c + ' ' + d, 0, st, sw, ex); }
function T(x, y, sz, t, fl) { return '<text x=' + Q + '' + x + '' + Q + ' y=' + Q + '' + y + '' + Q + ' font-size=' + Q + '' + sz + '' + Q + ' font-family=' + Q + 'ui-monospace,Menlo,Consolas,monospace' + Q + ' font-weight=' + Q + '700' + Q + ' text-anchor=' + Q + 'middle' + Q + ' fill=' + Q + '' + fl + '' + Q + '>' + t + '</text>'; }
function G(t, s) { return '<g transform=' + Q + '' + t + '' + Q + '>' + s + '</g>'; }
function STAR(cx, cy, s, fl) {
var d = '', i, a, r;
for (i = 0; i < 10; i++) { a = -Math.PI / 2 + i * Math.PI / 5; r = i % 2 ? s * 0.45 : s; d += (i ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1); }
return P(d + 'Z', fl);
}
function SP(x, y, s, fl) {
return P('M' + x + ' ' + (y - s) + 'Q' + x + ' ' + y + ' ' + (x + s) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y + s) + 'Q' + x + ' ' + y + ' ' + (x - s) + ' ' + y + 'Q' + x + ' ' + y + ' ' + x + ' ' + (y - s) + 'Z', fl);
}
function HEART(cx, cy, s, fl) {
return P('M' + cx + ' ' + (cy + s) + 'C' + (cx - 2 * s) + ' ' + (cy - s * 0.2) + ' ' + (cx - s * 0.9) + ' ' + (cy - s * 1.6) + ' ' + cx + ' ' + (cy - s * 0.6) + 'C' + (cx + s * 0.9) + ' ' + (cy - s * 1.6) + ' ' + (cx + 2 * s) + ' ' + (cy - s * 0.2) + ' ' + cx + ' ' + (cy + s) + 'Z', fl);
}
var ART = {};

/* ---------- Arcade Classics ---------- */
ART.snake = function (k) {
var path = 'M58 70H108V36H158V62H188';
return P(path, 0, I, 13) + P(path, 0, W, 3, DOT) + C(196, 62, 10, I) + C(199, 58, 2.8, W) + P('M206 62h10m-4-3 4 3-4 3', 0, I, 1.8) + R(66, 20, 12, 12, W, 2) + R(70, 24, 4, 4, I);
};
ART.g2048 = function (k) {
return R(38, 24, 44, 44, I, 6) + T(60, 55, 26, '2', W) + R(92, 24, 44, 44, I, 6) + T(114, 55, 26, '2', W) + P('M144 46h20m-7-7 7 7-7 7', 0, I, 4) + R(174, 24, 44, 44, W, 6, I) + T(196, 55, 26, '4', I);
};
ART.brick = function (k) {
var s = '', r, c;
for (r = 0; r < 3; r++) for (c = 0; c < 8; c++) {
if ((r === 1 && c === 3) || (r === 2 && (c === 3 || c === 4))) continue;
s += R(34 + c * 24, 9 + r * 12, 21, 9, (r + c) % 3 === 0 ? W : I, 1.5);
}
return s + P('M160 30L143 55', 0, I, 2, DOT) + C(140, 60, 5, W, I, 2) + R(102, 76, 56, 8, I, 4);
};
ART.flap = function (k) {
return R(42, -2, 22, 28, I) + R(38, 22, 30, 8, I, 2) + R(42, 58, 22, 40, I) + R(38, 56, 30, 8, I, 2)
+ R(190, -2, 22, 16, I) + R(186, 12, 30, 8, I, 2) + R(190, 50, 22, 50, I) + R(186, 48, 30, 8, I, 2)
+ P('M104 42C92 28 82 30 80 40C86 38 92 42 98 48Z', I) + P('M134 42C146 28 156 30 158 40C152 38 146 42 140 48Z', I)
+ C(119, 46, 15, W, I, 3) + C(119, 46, 9, 0, I, 2) + T(119, 51, 13, '$', I);
};
ART.memory = function (k) {
var s = '', i, j, cx, cy, up, faces = { '0,0': 'S', '3,1': 'S', '2,0': 'H', '0,1': 'H' };
for (j = 0; j < 2; j++) for (i = 0; i < 4; i++) {
cx = 69 + i * 40; cy = 25 + j * 42; up = faces[i + ',' + j];
if (up) s += R(cx - 17, cy - 17, 34, 34, W, 5, I) + (up === 'S' ? STAR(cx, cy, 11, I) : HEART(cx, cy - 1, 6, I));
else s += R(cx - 17, cy - 17, 34, 34, I, 5) + P('M' + cx + ' ' + (cy - 6) + 'l6 6-6 6-6-6z', W);
}
return s;
};
ART.glitch = function (k) {
return L(90, 46, 72, 36, I, 3) + L(88, 54, 68, 56, I, 3) + L(92, 62, 76, 74, I, 3) + L(134, 46, 152, 36, I, 3) + L(136, 54, 150, 58, I, 3) + L(132, 62, 146, 74, I, 3)
+ L(104, 34, 96, 22, I, 3) + L(120, 34, 128, 22, I, 3)
+ E(112, 50, 27, 18, I) + R(84, 52, 56, 3, k) + R(92, 59, 52, 2, W)
+ C(104, 45, 5, W) + C(121, 45, 5, W) + C(105, 46, 2, I) + C(122, 46, 2, I)
+ G('rotate(35 190 40)', R(172, 12, 36, 20, I, 4) + R(186, 30, 8, 46, I, 3))
+ STAR(150, 24, 8, W);
};
ART.stack = function (k) {
var s = '', x0 = 70, y0 = 78, sz = 13, rows = [[0, 1, 2, 3, 5, 6, 7, 8], [0, 1, 2, 3, 5, 6, 8], [1, 2, 6]], r, i;
function cell(c, rw, fl, st) { return R(x0 + c * sz + 1, y0 - rw * sz + 1, sz - 2, sz - 2, fl, 2, st); }
for (r = 0; r < rows.length; r++) for (i = 0; i < rows[r].length; i++) s += cell(rows[r][i], r, I);
s += P('M128.5 55V74', 0, I, 1.6, ' stroke-dasharray=' + Q + '2 4' + Q + '');
return s + cell(3, 4, W, I) + cell(4, 4, W, I) + cell(5, 4, W, I) + cell(4, 3, W, I);
};
ART.pong = function (k) {
return R(44, 24, 9, 42, I, 3) + R(205, 40, 9, 42, I, 3) + P('M129 6V86', 0, I, 2, ' stroke-dasharray=' + Q + '4 6' + Q + '')
+ T(100, 26, 18, '3', I) + T(158, 26, 18, '5', I) + P('M92 34L142 50', 0, I, 2, DOT) + C(150, 53, 7, W, I, 2);
};

/* ---------- Sports ---------- */
ART.hoop = function (k) {
return R(170, 8, 8, 42, I, 2) + E(152, 52, 17, 4.5, 0, I, 3)
+ P('M136 54L142 78M145 55L147 80M153 56V81M161 55L159 80M169 54L163 78', 0, I, 1.6) + P('M139 64H165M141 72H163', 0, I, 1.4)
+ P('M50 76Q70 20 138 44', 0, I, 2, DOT) + C(84, 30, 12, W, I, 2) + P('M72 30H96M84 18V42M75 22Q83 30 75 38M93 22Q85 30 93 38', 0, I, 1.3);
};
ART.penalty = function (k) {
var s = P('M48 84V22H210V84', 0, I, 5), x, y;
for (x = 62; x < 210; x += 14) s += L(x, 24, x, 82, I, 1, ' stroke-opacity=' + Q + '.45' + Q + '');
for (y = 36; y < 84; y += 14) s += L(50, y, 208, y, I, 1, ' stroke-opacity=' + Q + '.45' + Q + '');
return s + C(129, 38, 7, I) + R(123, 45, 12, 22, I, 4) + L(123, 49, 106, 34, I, 5) + L(135, 49, 152, 34, I, 5)
+ L(126, 67, 120, 82, I, 5) + L(132, 67, 138, 82, I, 5) + C(105, 33, 4, W) + C(153, 33, 4, W)
+ C(188, 74, 9, W, I, 2) + P('M188 69l4 3-1.5 5h-5l-1.5-5z', I);
};
ART.airhockey = function (k) {
return '<rect x=' + Q + '40' + Q + ' y=' + Q + '9' + Q + ' width=' + Q + '178' + Q + ' height=' + Q + '74' + Q + ' rx=' + Q + '28' + Q + ' fill=' + Q + 'none' + Q + ' stroke=' + Q + '' + I + '' + Q + ' stroke-width=' + Q + '3' + Q + '/>'
+ L(129, 9, 129, 83, I, 2) + C(129, 46, 14, 0, I, 2)
+ C(80, 46, 14, I) + C(80, 46, 6, W) + C(178, 36, 14, I) + C(178, 36, 6, W) + C(112, 60, 6, W, I, 2) + P('M96 54L108 58', 0, I, 2, DOT);
};
ART.tennis = function (k) {
var op = ' stroke-opacity=' + Q + '.5' + Q + '';
return '<rect x=' + Q + '34' + Q + ' y=' + Q + '10' + Q + ' width=' + Q + '190' + Q + ' height=' + Q + '72' + Q + ' fill=' + Q + 'none' + Q + ' stroke=' + Q + '' + I + '' + Q + ' stroke-width=' + Q + '2' + Q + '' + op + '/>'
+ L(129, 10, 129, 82, I, 2, op) + L(84, 10, 84, 82, I, 1.5, op) + L(174, 10, 174, 82, I, 1.5, op) + L(84, 46, 174, 46, I, 1.5, op)
+ G('rotate(-28 78 46)', E(78, 40, 15, 20, 0, I, 3.5) + P('M78 21V59M64 40H92M67 30Q78 36 89 30M67 50Q78 44 89 50', 0, I, 1.2) + R(74, 59, 8, 22, I, 3))
+ P('M104 32Q142 6 170 28', 0, I, 2, DOT) + C(178, 32, 8, W, I, 2) + P('M172 28Q178 32 173 38M184 27Q178 32 183 38', 0, I, 1.2);
};
ART.boxing = function (k) {
return R(54, 26, 48, 38, I, 18) + R(38, 34, 20, 22, I, 4) + R(52, 34, 5, 22, W) + P('M64 36Q74 30 88 34', 0, W, 3)
+ R(156, 26, 48, 38, I, 18) + R(200, 34, 20, 22, I, 4) + R(201, 34, 5, 22, W) + P('M170 36Q184 30 194 34', 0, W, 3)
+ P('M129 20l6 14 15-4-9 13 14 8-16 2 2 15-12-10-12 10 2-15-16-2 14-8-9-13 15 4z', W, I, 2);
};
ART.golf = function (k) {
return P('M14 92Q129 34 244 92Z', I) + E(166, 76, 11, 4, W) + L(166, 74, 166, 16, W, 3) + P('M166 16L190 25 166 34Z', W, I, 1.5)
+ P('M108 74Q136 62 154 74', 0, W, 2, DOT) + C(102, 74, 6, W, k, 1.5) + L(78, 84, 56, 44, W, 3) + P('M78 84L66 90', 0, W, 6);
};
ART.derby = function (k) {
return P('M54 74L122 42', 0, I, 9) + C(52, 75, 6, I) + P('M126 40Q170 -8 216 30', 0, I, 2, DOT)
+ C(176, 14, 9, W, I, 2) + P('M170 8Q176 14 170 20M182 8Q176 14 182 20', 0, I, 1.2) + T(214, 76, 18, 'HR', I) + SP(96, 20, 6, W);
};
function PIN(cx, cy) {
return P('M' + (cx - 3) + ' ' + (cy - 14) + 'C' + (cx - 3) + ' ' + (cy - 19) + ' ' + (cx + 3) + ' ' + (cy - 19) + ' ' + (cx + 3) + ' ' + (cy - 14)
+ 'C' + (cx + 3) + ' ' + (cy - 9) + ' ' + (cx + 6) + ' ' + (cy - 5) + ' ' + (cx + 6) + ' ' + (cy + 3)
+ 'C' + (cx + 6) + ' ' + (cy + 11) + ' ' + (cx + 3) + ' ' + (cy + 14) + ' ' + cx + ' ' + (cy + 14)
+ 'C' + (cx - 3) + ' ' + (cy + 14) + ' ' + (cx - 6) + ' ' + (cy + 11) + ' ' + (cx - 6) + ' ' + (cy + 3)
+ 'C' + (cx - 6) + ' ' + (cy - 5) + ' ' + (cx - 3) + ' ' + (cy - 9) + ' ' + (cx - 3) + ' ' + (cy - 14) + 'Z', W, I, 2)
+ L(cx - 3.5, cy - 9, cx + 3.5, cy - 9, I, 2);
}
ART.bowling = function (k) {
return PIN(190, 24) + PIN(178, 46) + PIN(202, 46) + PIN(166, 68) + PIN(190, 68) + PIN(214, 68)
+ L(26, 48, 48, 48, I, 3) + L(32, 60, 50, 60, I, 3) + L(38, 72, 56, 72, I, 3)
+ C(84, 58, 18, I) + C(78, 51, 2.8, W) + C(87, 49, 2.8, W) + C(84, 60, 2.8, W);
};
ART.fieldgoal = function (k) {
return P('M170 32V8M210 32V8M164 32H216M190 32V86', 0, I, 5) + P('M84 50Q126 -6 190 20', 0, I, 2, DOT)
+ G('rotate(-25 70 62)', E(70, 62, 17, 10, W, I, 2.5) + P('M62 62H78M66 58V66M70 58V66M74 58V66', 0, I, 1.5))
+ P('M112 74H144M138 69L144 74L138 79', 0, I, 2.5) + P('M120 84H146M140 79L146 84L140 89', 0, I, 2.5);
};
ART.darts = function (k) {
return C(129, 46, 38, I) + C(129, 46, 30, W) + C(129, 46, 22, I) + C(129, 46, 14, W) + C(129, 46, 6, I)
+ L(143, 36, 174, 15, W, 7) + L(143, 36, 174, 15, I, 3.5) + P('M168 19L184 8l4 5-8 15z', W, I, 2)
+ L(112, 58, 86, 76, W, 7) + L(112, 58, 86, 76, I, 3.5) + P('M90 72L74 82l6 6 12-12z', W, I, 2);
};

/* ---------- Trivia (icon + question bubble) ---------- */
function TQ(icon) {
return G('translate(-8 0)', G('translate(58 16)', icon)
+ P('M154 16H206Q216 16 216 26V54Q216 64 206 64H180L164 78V64H154Q144 64 144 54V26Q144 16 154 16Z', W, I, 2.5) + T(180, 55, 40, '?', I));
}
ART.triviaSports = function (k) {
return TQ(P('M16 8H44V22A14 14 0 0 1 16 22Z', I) + P('M16 12H8Q8 26 20 28M44 12H52Q52 26 40 28', 0, I, 4) + R(26, 34, 8, 12, I) + R(18, 46, 24, 8, I, 2) + STAR(30, 20, 7, W));
};
ART.triviaMovies = function (k) {
return TQ(R(8, 24, 44, 30, I, 3) + G('rotate(-10 8 22)', R(8, 10, 44, 12, I, 2) + P('M18 10L13 22M30 10L25 22M42 10L37 22M54 10L49 22', 0, W, 3)) + P('M26 32L40 40L26 48Z', W));
};
ART.triviaScience = function (k) {
return TQ(P('M24 6H36V24L52 48Q55 56 46 56H14Q5 56 8 48L24 24Z', I) + R(20, 3, 20, 5, I, 2) + P('M14 44H46L50 50Q52 55 46 55H14Q8 55 10 50Z', W) + C(28, 34, 3, W) + C(35, 28, 2, W));
};
ART.triviaMusic = function (k) {
return TQ(E(18, 45, 9, 7, I) + E(44, 39, 9, 7, I) + R(24, 10, 4, 35, I) + R(50, 4, 4, 35, I) + P('M24 10L54 4V14L24 20Z', I));
};
ART.triviaHistory = function (k) {
return TQ(P('M4 22L30 6L56 22Z', I) + R(8, 24, 44, 5, I) + R(12, 31, 7, 20, I) + R(26.5, 31, 7, 20, I) + R(41, 31, 7, 20, I) + R(6, 51, 48, 6, I, 1));
};
ART.triviaGeography = function (k) {
return TQ(C(30, 30, 25, 0, I, 4) + E(30, 30, 11, 25, 0, I, 3) + L(5, 30, 55, 30, I, 3) + P('M9 17Q30 25 51 17M9 43Q30 35 51 43', 0, I, 3));
};
ART.triviaGaming = function (k) {
return TQ(R(4, 18, 52, 30, I, 15) + R(13, 30, 16, 5, W, 1) + R(18.5, 25, 5, 15, W, 1) + C(40, 36, 3.5, W) + C(47, 29, 3.5, W));
};
ART.triviaFood = function (k) {
return TQ(P('M6 28Q6 8 30 8T54 28Z', I) + E(20, 18, 2.6, 1.5, W) + E(30, 13, 2.6, 1.5, W) + E(40, 18, 2.6, 1.5, W)
+ P('M4 34Q10 39 16 34T28 34T40 34T52 34', 0, I, 4) + R(6, 39, 48, 7, I, 3) + P('M6 49H54Q54 58 44 58H16Q6 58 6 49Z', I));
};
ART.triviaAnimals = function (k) {
return TQ(P('M16 44Q16 32 30 32T44 44Q44 54 30 54T16 44Z', I) + E(11, 30, 5, 7, I) + E(23, 19, 5.5, 8, I) + E(37, 19, 5.5, 8, I) + E(49, 30, 5, 7, I));
};

/* ---------- Reflex ---------- */
ART.reactionQuick = function (k) {
return C(96, 52, 26, 0, I, 5) + R(90, 14, 12, 7, I, 2) + L(96, 21, 96, 26, I, 4) + L(96, 52, 96, 34, I, 4) + L(96, 52, 108, 58, I, 4) + C(96, 52, 3, I)
+ P('M176 10L152 48H168L160 82L196 36H178Z', W, I, 2.5) + L(202, 30, 228, 30, I, 3) + L(208, 46, 234, 46, I, 3) + L(202, 62, 226, 62, I, 3);
};
ART.whack = function (k) {
return E(70, 76, 26, 7, I) + E(129, 76, 26, 7, I) + E(188, 76, 26, 7, I)
+ P('M104 76Q104 38 129 38T154 76Z', W, I, 3) + C(120, 55, 4, I) + C(138, 55, 4, I) + P('M118 40L110 24M140 40L148 24', 0, I, 3) + C(110, 22, 3.5, I) + C(148, 22, 3.5, I)
+ G('rotate(28 196 34)', R(178, 8, 38, 22, I, 4) + R(192, 30, 9, 40, I, 3)) + SP(96, 40, 7, W) + SP(170, 46, 5, W);
};
ART.simon = function (k) {
var s = '', px = [96, 132, 96, 132], py = [13, 13, 49, 49], i;
for (i = 0; i < 4; i++) s += R(px[i], py[i], 32, 32, i === 1 ? W : I, 9, i === 1 ? I : 0);
return s + SP(184, 14, 8, W) + SP(198, 32, 5, W) + C(44, 46, 4, I) + C(56, 46, 4, I) + C(68, 46, 4, I) + C(190, 64, 4, I) + C(202, 64, 4, I) + C(214, 64, 4, I);
};

/* ---------- Puzzle ---------- */
ART.tictactoe = function (k) {
function X(cx, cy) { return L(cx - 8, cy - 8, cx + 8, cy + 8, I, 4.5) + L(cx + 8, cy - 8, cx - 8, cy + 8, I, 4.5); }
function O(cx, cy) { return C(cx, cy, 8, 0, W, 4.5); }
return L(109, 10, 109, 82, I, 4) + L(148, 10, 148, 82, I, 4) + L(72, 34, 186, 34, I, 4) + L(72, 58, 186, 58, I, 4)
+ X(90, 22) + O(129, 22) + O(168, 22) + O(90, 46) + X(129, 46) + O(129, 70) + X(168, 70)
+ L(78, 12, 180, 80, W, 3.5);
};
ART.connect4 = function (k) {
var s = R(56, 6, 146, 80, I, 9), i, j, fl;
var A = { '1,4': 1, '2,3': 1, '3,2': 1, '4,1': 1 };
var B = { '0,4': 1, '2,4': 1, '3,4': 1, '3,3': 1, '4,4': 1, '4,3': 1, '4,2': 1, '5,4': 1 };
for (i = 0; i < 7; i++) for (j = 0; j < 5; j++) {
if (A[i + ',' + j]) s += C(74 + i * 18.5, 20 + j * 15, 6.5, k, W, 2.5);
else s += C(74 + i * 18.5, 20 + j * 15, 6.5, B[i + ',' + j] ? W : '#2a1a55');
}
return s;
};
ART.minesweeper = function (k) {
var g = ['#F1.1#', '#2111#', '##1*1#'], s = '', r, c, x, y, ch;
for (r = 0; r < 3; r++) for (c = 0; c < 6; c++) {
x = 55 + c * 25; y = 10 + r * 25; ch = g[r].charAt(c);
if (ch === '#' || ch === 'F') {
s += R(x, y, 22, 22, I, 2) + R(x + 2, y + 2, 18, 3, M, 1);
if (ch === 'F') s += L(x + 8, y + 17, x + 8, y + 6, W, 2) + P('M' + (x + 8) + ' ' + (y + 6) + 'l9 4-9 4z', W);
} else {
s += R(x, y, 22, 22, W, 2);
if (ch === '*') s += C(x + 11, y + 11, 5, I) + P('M' + (x + 3) + ' ' + (y + 11) + 'h16M' + (x + 11) + ' ' + (y + 3) + 'v16M' + (x + 5.5) + ' ' + (y + 5.5) + 'l11 11M' + (x + 16.5) + ' ' + (y + 5.5) + 'l-11 11', 0, I, 2);
else if (ch !== '.') s += T(x + 11, y + 17, 15, ch, I);
}
}
return s;
};
ART.codeword = function (k) {
var rows = ['BYTES', 'CODES'], st = [[0, 1, 2, 0, 2], [2, 2, 2, 2, 2]], s = '', r, c, x, y, v;
for (r = 0; r < 2; r++) for (c = 0; c < 5; c++) {
x = 54 + c * 31; y = 10 + r * 41; v = st[r][c];
s += R(x, y, 27, 31, v === 2 ? W : (v === 1 ? M : I), 4) + T(x + 13.5, y + 22, 19, rows[r].charAt(c), v === 2 ? I : W);
}
return s;
};

/* ---------- Idle ---------- */
ART.byteFarm = function (k) {
var s = C(214, 22, 11, W), i, a, x;
for (i = 0; i < 8; i++) { a = i * Math.PI / 4; s += L((214 + Math.cos(a) * 15).toFixed(1), (22 + Math.sin(a) * 15).toFixed(1), (214 + Math.cos(a) * 20).toFixed(1), (22 + Math.sin(a) * 20).toFixed(1), W, 2.5); }
s += R(24, 64, 210, 24, I, 3) + P('M30 76H228', 0, W, 2, ' stroke-dasharray=' + Q + '6 8' + Q + '');
for (i = 0; i < 6; i++) {
x = 50 + i * 32;
s += L(x, 64, x, 52 - (i % 3) * 4, I, 3) + P('M' + x + ' 58q-11-1-13-12q11-1 13 12', I) + P('M' + x + ' 54q11-1 13-12q-11-1-13 12', I);
}
return s + T(70, 30, 13, '01', I) + T(104, 16, 13, '10', I) + T(150, 28, 13, '11', I);
};
ART.deepMine = function (k) {
return P('M14 92V54L38 44L62 52L82 40L112 50L140 38L170 50L196 42L226 52L244 46V92Z', I)
+ P('M110 58L120 68L110 82L100 68Z', W) + P('M164 66L171 73L164 83L157 73Z', W) + P('M66 68L72 74L66 82L60 74Z', W)
+ L(176, 46, 206, 12, I, 6) + P('M184 22Q206 -2 232 24', 0, I, 6) + STAR(178, 50, 6, W);
};
ART.cloudLegion = function (k) {
var parts = [[100, 54, 15], [126, 42, 22], [156, 50, 17]], s = '', i;
for (i = 0; i < 3; i++) s += C(parts[i][0], parts[i][1], parts[i][2], I, I, 6);
s += R(100, 54, 58, 15, I, 0, I);
for (i = 0; i < 3; i++) s += C(parts[i][0], parts[i][1], parts[i][2], W);
s += R(100, 54, 58, 14, W);
return s + P('M113 34H145V52Q145 64 129 70Q113 64 113 52Z', I) + STAR(129, 50, 8, W)
+ L(194, 34, 194, 12, I, 3) + P('M194 12L214 18 194 25Z', I) + SP(60, 22, 6, W) + SP(222, 60, 5, W);
};

/* ---------- RPG ---------- */
ART.dungeonDelver = function (k) {
return P('M90 88V46A39 32 0 0 1 168 46V88Z', I) + P('M108 88V78H150V88M116 78V68H142V78M124 68V60H134V68', 0, W, 2.5)
+ L(72, 56, 72, 80, I, 4) + P('M72 54Q62 46 68 34Q72 42 78 40Q78 48 82 50Q80 56 72 54Z', W, I, 1.5)
+ L(186, 56, 186, 80, I, 4) + P('M186 54Q176 46 182 34Q186 42 192 40Q192 48 196 50Q194 56 186 54Z', W, I, 1.5);
};
ART.arenaChampion = function (k) {
return P('M96 10H162V46Q162 68 129 82Q96 68 96 46Z', I) + L(104, 24, 154, 64, W, 5) + L(154, 24, 104, 64, W, 5)
+ C(103, 23, 4, W) + C(155, 23, 4, W) + P('M84 26Q70 46 84 70', 0, I, 3, DOT) + P('M174 26Q188 46 174 70', 0, I, 3, DOT) + STAR(129, 46, 7, W);
};
ART.bossRush = function (k) {
return P('M92 42L74 6L104 24Z', I) + P('M166 42L184 6L154 24Z', I)
+ P('M86 42Q86 22 129 22T172 42V66Q172 84 152 84H106Q86 84 86 66Z', I)
+ P('M98 44L124 52L120 60L98 54Z', W) + P('M160 44L134 52L138 60L160 54Z', W)
+ P('M104 74L112 66L120 74L128 66L136 74L144 66L152 74', 0, W, 3) + SP(58, 60, 6, W) + SP(200, 70, 6, W);
};

/* ---------- Upgrades ---------- */
ART.byteRunner = function (k) {
return C(112, 24, 9, I) + L(112, 34, 106, 54, I, 8) + L(110, 40, 128, 46, I, 5) + L(108, 42, 92, 38, I, 5)
+ L(106, 54, 124, 62, I, 7) + L(124, 62, 120, 80, I, 7) + L(106, 54, 90, 64, I, 7) + L(90, 64, 76, 58, I, 7)
+ L(26, 84, 232, 84, I, 3) + L(36, 30, 66, 30, I, 3) + L(44, 44, 72, 44, I, 3) + L(36, 58, 62, 58, I, 3)
+ C(162, 52, 9, W, I, 2.5) + C(186, 42, 9, W, I, 2.5) + C(210, 52, 9, W, I, 2.5) + T(162, 56, 11, '$', I) + T(186, 46, 11, '$', I) + T(210, 56, 11, '$', I);
};
ART.towerAscent = function (k) {
return R(100, 30, 58, 62, I) + R(100, 20, 12, 12, I) + R(123, 20, 12, 12, I) + R(146, 20, 12, 12, I)
+ L(129, 20, 129, 2, I, 3) + P('M129 2L147 8 129 14Z', I) + R(122, 40, 14, 20, W, 7) + R(120, 68, 18, 24, W, 8)
+ P('M198 70V30M188 40L198 30L208 40', 0, I, 5) + P('M30 88H58V76H86V64', 0, I, 4) + SP(60, 24, 6, W) + SP(222, 16, 5, W);
};
ART.meteorMiner = function (k) {
return L(150, 12, 206, 2, I, 3) + L(160, 26, 222, 10, I, 3) + L(158, 40, 214, 24, I, 3)
+ P('M96 32L118 18L146 24L168 40L166 64L148 78L120 76L98 60Z', I) + C(122, 40, 6, W) + C(150, 46, 5, W) + C(132, 62, 4, W) + C(112, 58, 3, W)
+ P('M36 60L60 50L68 60L60 70Z', W, I, 2) + L(70, 58, 98, 48, I, 2.5, ' stroke-dasharray=' + Q + '4 4' + Q + '') + STAR(100, 46, 7, W) + SP(74, 22, 6, W);
};
ART.zombieSiege = function (k) {
return L(96, 60, 66, 44, I, 7) + L(162, 60, 192, 44, I, 7) + C(64, 42, 6, I) + C(194, 42, 6, I)
+ P('M96 46Q96 22 129 22T162 46V64Q162 80 129 80T96 64Z', I) + C(116, 44, 6, W) + C(117, 45, 2.4, I) + P('M133 39L145 51M145 39L133 51', 0, W, 3)
+ L(112, 66, 146, 66, W, 3) + P('M120 62V70M129 62V70M138 62V70', 0, W, 2)
+ R(38, 68, 182, 8, W, 1, I) + R(50, 58, 12, 34, W, 1, I) + R(96, 58, 12, 34, W, 1, I) + R(150, 58, 12, 34, W, 1, I) + R(196, 58, 12, 34, W, 1, I);
};

/* ---------- Fifty more cabinets: Arcade Classics ---------- */
ART.orbitRaiders = function (k) {
var s = '', i, j, x;
for (j = 0; j < 2; j++) for (i = 0; i < 6; i++) { x = 46 + i * 28 + (j ? 7 : 0); s += R(x, 10 + j * 17, 16, 9, I, 2) + R(x + 3, 6 + j * 17, 3, 5, I) + R(x + 10, 6 + j * 17, 3, 5, I); }
return s + P('M129 86L143 62H115Z', I) + R(127, 40, 4, 13, W, 1) + P('M34 88Q129 60 224 88', 0, I, 2, DOT);
};
ART.rockDrift = function (k) {
return P('M46 30L62 18L82 22L90 40L76 54L54 48Z', 0, I, 4) + P('M170 58L184 48L206 56L208 74L188 82L168 74Z', 0, I, 4) + C(104, 72, 5, I) + C(212, 24, 6, I)
+ G('rotate(-20 129 46)', P('M129 26L143 62L129 54L115 62Z', I)) + L(122, 28, 98, 14, W, 3, DOT) + STAR(96, 12, 7, W);
};
ART.pelletProwler = function (k) {
return P('M36 24H100V52H60V78H120', 0, I, 8) + P('M222 24H158V52H198V78H138', 0, I, 8) + P('M46 66H86', 0, W, 4, DOT) + P('M170 66H212', 0, W, 4, DOT)
+ P('M112 44L114 30L122 38Z', I) + P('M146 44L144 30L136 38Z', I) + E(129, 50, 19, 16, I) + C(122, 47, 4, W) + C(136, 47, 4, W) + C(122, 48, 1.6, I) + C(136, 48, 1.6, I)
+ L(116, 54, 104, 52, W, 1.5) + L(142, 54, 154, 52, W, 1.5) + P('M126 54L129 57L132 54Z', W);
};
ART.laneLeaper = function (k) {
return R(22, 8, 64, 12, I, 6) + R(112, 8, 90, 12, I, 6) + R(214, 8, 30, 12, I, 6)
+ E(129, 50, 17, 13, I) + C(119, 38, 6, W, I, 3) + C(139, 38, 6, W, I, 3) + C(119, 38, 2, I) + C(139, 38, 2, I)
+ P('M113 56L98 66L108 70', 0, I, 4) + P('M145 56L160 66L150 70', 0, I, 4)
+ R(28, 74, 46, 11, I, 4) + C(38, 86, 4, W) + C(64, 86, 4, W) + R(168, 74, 46, 11, I, 4) + C(178, 86, 4, W) + C(204, 86, 4, W);
};
ART.swarmStrike = function (k) {
var s = '', i, x, y;
for (i = 0; i < 5; i++) { x = 129 + (i - 2) * 30; y = 16 + Math.abs(i - 2) * 8; s += E(x, y, 9, 6, I) + P('M' + (x - 9) + ' ' + y + 'L' + (x - 17) + ' ' + (y - 6) + 'L' + (x - 13) + ' ' + (y + 5) + 'Z', I) + P('M' + (x + 9) + ' ' + y + 'L' + (x + 17) + ' ' + (y - 6) + 'L' + (x + 13) + ' ' + (y + 5) + 'Z', I) + C(x, y - 1, 2, W); }
return s + G('rotate(25 76 50)', E(76, 50, 9, 6, I) + P('M67 50L59 44L63 55Z', I) + P('M85 50L93 44L89 55Z', I)) + L(84, 56, 118, 70, W, 3, DOT) + P('M129 84L141 88H117Z', I) + R(127, 68, 4, 14, I);
};
ART.vineCrawler = function (k) {
var s = '', i, x, y;
for (i = 0; i < 7; i++) { x = 44 + i * 22; y = 24 + (i % 2) * 14; s += C(x, y, 10 - i * 0.3, I) + C(x, y, 3, W); }
return s + C(196, 44, 14, I) + C(191, 40, 4, W) + C(201, 40, 4, W) + C(191, 40, 1.6, I) + C(201, 40, 1.6, I) + P('M186 34L182 26M206 34L210 26', 0, I, 3)
+ R(60, 76, 138, 8, I, 4) + P('M98 76V66M142 76V62', 0, I, 3) + C(98, 63, 5, W, I, 2) + C(142, 59, 5, W, I, 2);
};
ART.skyShield = function (k) {
var s = '', i, h = [14, 24, 18, 28, 16, 22];
for (i = 0; i < 6; i++) s += R(40 + i * 33, 84 - h[i], 22, h[i], I, 2);
return s + L(30, 4, 100, 62, I, 2, DOT) + L(228, 4, 170, 64, I, 2, DOT) + L(129, 2, 129, 58, W, 2, DOT) + C(129, 44, 22, 0, I, 3) + C(129, 44, 12, W, I, 2) + SP(129, 44, 6, I);
};
ART.softTouchdown = function (k) {
return P('M112 26H146L152 44H106Z', I) + R(120, 30, 18, 8, W, 3) + L(112, 44, 102, 66, I, 4) + L(146, 44, 156, 66, I, 4) + L(98, 66, 108, 66, I, 4) + L(150, 66, 160, 66, I, 4)
+ P('M120 50L129 70L138 50Z', W) + R(76, 70, 106, 6, I, 3) + R(0, 80, 258, 12, I) + STAR(200, 30, 7, W);
};
ART.neonTrails = function (k) {
return P('M36 72H106V30H152', 0, I, 9) + P('M36 72H106V30H152', 0, W, 2) + P('M222 20H168V62H126', 0, I, 9) + P('M222 20H168V62H126', 0, W, 2) + R(148, 24, 14, 12, W, 3, I) + R(116, 56, 14, 12, I, 3);
};
ART.silverBall = function (k) {
return C(80, 26, 12, I) + C(80, 26, 5, W) + C(178, 26, 12, I) + C(178, 26, 5, W) + C(129, 46, 9, W, I, 3) + P('M74 68L124 80L120 86L70 76Z', I) + P('M184 68L134 80L138 86L188 76Z', I)
+ L(48, 22, 48, 60, I, 3) + L(210, 22, 210, 60, I, 3) + P('M100 8H158', 0, I, 2, DOT);
};
ART.caveCopter = function (k) {
return P('M0 0H258V14L220 24L180 10L140 26L100 12L60 28L20 14L0 22Z', I) + P('M0 92V78L40 68L80 80L120 70L160 82L200 68L258 78V92Z', I)
+ R(110, 40, 32, 16, W, 8, I) + L(142, 47, 168, 42, I, 4) + L(112, 33, 142, 33, I, 3) + L(127, 33, 127, 40, I, 3) + L(114, 62, 140, 62, I, 3) + C(122, 47, 4, I);
};
ART.skyHopper = function (k) {
return R(40, 74, 52, 7, I, 3) + R(166, 58, 52, 7, I, 3) + R(96, 34, 52, 7, I, 3)
+ E(122, 18, 11, 12, W, I, 3) + C(118, 15, 2, I) + C(126, 15, 2, I) + P('M115 29L111 34M129 29L133 34', 0, I, 3) + P('M108 22Q104 30 108 34', 0, I, 2)
+ P('M62 66V48M56 54L62 48L68 54', 0, I, 2, DOT) + P('M196 50V30M190 36L196 30L202 36', 0, I, 2, DOT);
};
ART.pyramidHop = function (k) {
var s = '', r, c, cx, cy;
for (r = 0; r < 3; r++) for (c = 0; c <= r; c++) {
cx = 129 + (c * 2 - r) * 17; cy = 14 + r * 24;
s += P('M' + (cx - 17) + ' ' + cy + 'L' + cx + ' ' + (cy + 8) + 'V' + (cy + 26) + 'L' + (cx - 17) + ' ' + (cy + 18) + 'Z', k, I, 2) + P('M' + (cx + 17) + ' ' + cy + 'L' + cx + ' ' + (cy + 8) + 'V' + (cy + 26) + 'L' + (cx + 17) + ' ' + (cy + 18) + 'Z', I, I, 2)
+ P('M' + cx + ' ' + (cy - 8) + 'L' + (cx + 17) + ' ' + cy + 'L' + cx + ' ' + (cy + 8) + 'L' + (cx - 17) + ' ' + cy + 'Z', (r + c) % 2 ? W : M, I, 2);
}
return s + C(129, 6, 5, I) + C(127, 5, 1.4, W) + C(131, 5, 1.4, W);
};
ART.dirtDigger = function (k) {
return R(0, 40, 258, 52, I) + L(0, 40, 258, 40, I, 5) + P('M30 62H150V78', 0, k, 14) + P('M60 52H80M180 60H200M40 82H70M200 76H230', 0, M, 4, DOT)
+ C(150, 78, 11, W, I, 3) + C(146, 76, 2, I) + C(154, 76, 2, I) + C(92, 62, 8, W) + C(90, 61, 1.5, I) + C(96, 61, 1.5, I) + C(190, 22, 15, I) + C(185, 17, 4, M) + L(60, 40, 60, 28, I, 3) + L(52, 28, 68, 28, I, 3);
};
ART.craterCruiser = function (k) {
return P('M0 74H70A20 12 0 0 0 110 74H170A16 10 0 0 0 202 74H258V92H0Z', I) + R(38, 46, 46, 15, W, 6, I) + R(52, 39, 18, 9, W, 4, I) + C(50, 65, 8, I) + C(72, 65, 8, I) + C(50, 65, 3, W) + C(72, 65, 3, W)
+ L(84, 50, 96, 42, I, 3) + C(142, 62, 12, I) + E(200, 22, 20, 6, I) + P('M188 20Q200 6 212 20Z', I) + L(200, 32, 200, 50, W, 3, DOT) + STAR(110, 22, 7, W);
};
ART.botSwarm = function (k) {
return R(112, 26, 34, 28, I, 6) + R(119, 33, 8, 8, W, 1) + R(132, 33, 8, 8, W, 1) + L(129, 26, 129, 14, I, 3) + C(129, 12, 4, I) + R(118, 58, 22, 10, I, 3)
+ R(172, 54, 22, 16, I, 4) + C(180, 60, 2.4, W) + C(188, 60, 2.4, W) + R(206, 44, 18, 14, I, 4) + C(212, 49, 2, W) + C(218, 49, 2, W)
+ C(56, 52, 6, W, I, 2) + L(56, 58, 56, 74, I, 3) + L(48, 66, 64, 66, I, 3) + L(56, 74, 48, 84, I, 3) + L(56, 74, 64, 84, I, 3) + L(86, 40, 106, 40, W, 3, DOT) + L(86, 46, 106, 50, W, 3, DOT);
};
ART.landGrab = function (k) {
return R(58, 12, 142, 68, 0, 4, I) + R(58, 12, 62, 68, I, 4) + P('M120 12V50H166', 0, W, 4) + C(166, 50, 6, W, I, 2) + SP(186, 26, 10, I) + P('M70 30H108M70 46H108M70 62H108', 0, W, 2, DOT);
};

/* ---------- Reflex ---------- */
ART.fruitSlash = function (k) {
return G('rotate(-30 129 46)', P('M97 38A32 32 0 0 1 161 38Z', I) + P('M104 38A25 25 0 0 1 154 38Z', W) + L(129, 38, 129, 16, I, 2) + L(129, 38, 111, 22, I, 2) + L(129, 38, 147, 22, I, 2)
+ P('M97 54A32 32 0 0 0 161 54Z', I) + P('M104 54A25 25 0 0 0 154 54Z', W) + L(129, 54, 129, 76, I, 2) + L(129, 54, 111, 70, I, 2) + L(129, 54, 147, 70, I, 2))
+ L(66, 82, 192, 10, W, 3) + C(44, 26, 10, I) + L(44, 16, 48, 8, I, 3) + C(216, 70, 9, I) + L(216, 62, 220, 56, I, 3);
};
ART.towerStack = function (k) {
return R(90, 72, 80, 12, I, 3) + R(96, 58, 72, 12, W, 3, I) + R(90, 44, 74, 12, I, 3) + R(98, 30, 62, 12, W, 3, I) + R(150, 14, 56, 12, I, 3) + P('M60 20H90M84 14L90 20L84 26', 0, I, 3, DOT) + STAR(48, 62, 7, W);
};
ART.helixFall = function (k) {
return R(122, 0, 14, 92, I) + R(70, 62, 48, 9, I, 4) + R(142, 62, 48, 9, I, 4) + R(90, 40, 40, 9, I, 4) + R(150, 40, 44, 9, W, 4, I) + R(70, 20, 48, 9, W, 4, I) + R(142, 20, 48, 9, I, 4)
+ C(129, 12, 8, W, I, 3) + P('M129 24V34', 0, I, 3, DOT);
};
ART.hueHopper = function (k) {
return P('M129 14A32 32 0 0 1 161 46', 0, I, 10) + P('M161 46A32 32 0 0 1 129 78', 0, W, 10) + P('M129 78A32 32 0 0 1 97 46', 0, I, 10) + P('M97 46A32 32 0 0 1 129 14', 0, M, 10)
+ C(129, 46, 7, W, I, 3) + P('M129 4V2', 0, I, 2) + P('M60 60V36M54 42L60 36L66 42', 0, I, 3, DOT) + P('M198 60V36M192 42L198 36L204 42', 0, I, 3, DOT);
};
ART.beatTiles = function (k) {
var s = '', c, r, pos = [1, 3, 0, 2];
for (c = 0; c < 5; c++) s += L(80 + c * 24, 0, 80 + c * 24, 92, I, 1.5);
for (r = 0; r < 4; r++) s += R(81 + pos[r] * 24, 6 + r * 22, 22, 19, I, 3);
return s + R(81 + 3 * 24, 6 + 2 * 22, 22, 19, W, 3, I) + STAR(50, 24, 8, W) + STAR(214, 66, 8, W);
};
ART.perfectTen = function (k) {
var s = '', i, a;
for (i = 0; i < 12; i++) { a = i * Math.PI / 6; s += L((129 + Math.sin(a) * 25).toFixed(1), (52 - Math.cos(a) * 25).toFixed(1), (129 + Math.sin(a) * 29).toFixed(1), (52 - Math.cos(a) * 29).toFixed(1), I, 2); }
return C(129, 52, 32, W, I, 4) + s + R(122, 10, 14, 9, I, 2) + L(129, 52, 129, 32, I, 3) + L(129, 52, 141, 60, I, 3) + C(129, 52, 4, I) + L(154, 22, 162, 14, I, 4) + T(60, 56, 22, '10', I) + T(200, 56, 22, '.00', I);
};
ART.coinCatcher = function (k) {
return P('M94 58H164L154 84H104Z', I) + R(90, 54, 78, 7, W, 3, I) + C(110, 18, 10, W, I, 3) + T(110, 22, 11, '$', I) + C(152, 32, 10, W, I, 3) + T(152, 36, 11, '$', I) + C(56, 44, 8, W, I, 3) + C(200, 12, 7, I) + L(200, 5, 204, 1, I, 3) + L(129, 8, 129, 36, I, 2, DOT);
};
ART.typeRush = function (k) {
return R(38, 8, 64, 22, I, 5) + T(70, 24, 13, 'type', W) + R(150, 24, 66, 22, I, 5) + T(183, 40, 13, 'rush', W) + R(92, 54, 52, 22, W, 5, I) + T(118, 70, 13, 'go', I) + P('M70 34V44M183 50V60', 0, I, 2, DOT) + R(20, 84, 218, 8, I, 3);
};
ART.targetBlitz = function (k) {
return C(129, 46, 34, W, I, 4) + C(129, 46, 23, I) + C(129, 46, 12, W) + C(129, 46, 4, I) + C(56, 26, 14, W, I, 3) + C(56, 26, 6, I) + C(204, 66, 14, W, I, 3) + C(204, 66, 6, I) + L(129, 4, 129, 14, I, 3) + L(129, 78, 129, 88, I, 3) + L(88, 46, 98, 46, I, 3) + L(160, 46, 170, 46, I, 3);
};

/* ---------- Puzzle ---------- */
ART.jewelJam = function (k) {
return P('M62 20L84 44L62 68L40 44Z', I) + P('M62 20L84 44H40Z', W) + P('M129 20L150 32V56L129 68L108 56V32Z', W, I, 3) + P('M129 30L140 37V51L129 58L118 51V37Z', I) + P('M196 20L220 66H172Z', I) + C(196, 52, 4, W)
+ SP(100, 16, 6, I) + SP(226, 24, 5, I);
};
ART.slideSort = function (k) {
var s = '', n = ['5', '1', '3', '4', '', '2', '7', '8', '6'], i, x, y;
for (i = 0; i < 9; i++) { if (!n[i]) continue; x = 84 + (i % 3) * 30; y = 3 + Math.floor(i / 3) * 30; s += R(x, y, 27, 27, I, 5) + T(x + 13.5, y + 20, 17, n[i], W); }
return s + P('M60 46H76M70 40L76 46L70 52', 0, I, 3);
};
ART.switchGrid = function (k) {
var s = '', r, c, lit = { '2,2': 1, '1,2': 1, '3,2': 1, '2,1': 1, '2,3': 1 };
for (r = 0; r < 5; r++) for (c = 0; c < 5; c++) s += lit[r + ',' + c] ? C(86 + c * 21.5, 12 + r * 17, 7, W, I, 3) : C(86 + c * 21.5, 12 + r * 17, 7, I);
return s;
};
ART.diskTower = function (k) {
return R(56, 18, 5, 58, I, 2) + R(126, 18, 5, 58, I, 2) + R(196, 18, 5, 58, I, 2) + R(24, 76, 210, 7, I, 3)
+ R(38, 62, 40, 12, W, 4, I) + R(44, 50, 28, 12, I, 4) + R(50, 38, 16, 12, W, 4, I) + R(170, 62, 54, 12, I, 4) + P('M84 30Q100 12 118 30M112 24L118 30L110 34', 0, I, 3, DOT);
};
ART.cratePush = function (k) {
return R(96, 20, 56, 54, W, 6, I) + R(102, 26, 44, 42, 0, 3, I) + L(104, 28, 144, 66, I, 4) + L(144, 28, 104, 66, I, 4) + C(206, 62, 11, 0, I, 3) + C(206, 62, 3, I) + C(58, 56, 12, I) + C(54, 52, 3, W) + C(62, 52, 3, W) + L(74, 56, 90, 56, I, 3, DOT);
};
ART.codeBreaker = function (k) {
return C(60, 28, 11, I) + C(90, 28, 11, W, I, 3) + C(120, 28, 11, I) + C(150, 28, 11, W, I, 3) + C(60, 64, 11, 0, I, 3) + C(90, 64, 11, 0, I, 3) + C(120, 64, 11, 0, I, 3) + C(150, 64, 11, 0, I, 3)
+ C(192, 22, 5, I) + C(206, 22, 5, W, I, 2) + C(192, 36, 5, W, I, 2) + C(206, 36, 5, 0, I, 2) + T(206, 72, 16, '?', I);
};
ART.pixelCross = function (k) {
var s = '', pat = ['01110', '11011', '11111', '01110', '00100'], r, c, i;
for (r = 0; r < 5; r++) for (c = 0; c < 5; c++) s += R(112 + c * 14, 22 + r * 14, 12, 12, pat[r].charAt(c) === '1' ? I : 0, 2, pat[r].charAt(c) === '1' ? 0 : I);
return s + T(126, 15, 9, '2', I) + T(140, 15, 9, '4', I) + T(154, 15, 9, '4', I) + T(168, 15, 9, '4', I) + T(182, 15, 9, '2', I)
+ T(100, 31, 10, '3', I) + T(100, 45, 10, '22', I) + T(100, 59, 10, '5', I) + T(100, 73, 10, '3', I) + T(100, 87, 10, '1', I);
};
ART.tubeSort = function (k) {
var s = '', i, x, cols = [[I, W, I], [W, W, I], [I, W, W], []];
for (i = 0; i < 4; i++) {
x = 58 + i * 40;
cols[i].forEach(function (cl, j) { s += R(x + 2, 60 - j * 15, 20, 14, cl, 3, cl === W ? I : 0); });
s += P('M' + x + ' 10V64A12 12 0 0 0 ' + (x + 24) + ' 64V10', 0, I, 3);
}
return s + P('M182 6Q198 -2 212 14', 0, I, 3, DOT);
};
ART.blockFit = function (k) {
var s = '', r, c, fill = { '4,0': 1, '4,1': 1, '4,2': 1, '4,3': 1, '4,5': 1, '3,0': 1, '3,1': 1, '3,5': 1, '2,0': 1 };
for (r = 0; r < 5; r++) for (c = 0; c < 6; c++) s += R(56 + c * 15, 12 + r * 15, 13, 13, fill[r + ',' + c] ? I : 0, 2, fill[r + ',' + c] ? 0 : M);
return s + R(160, 22, 14, 14, W, 2, I) + R(174, 22, 14, 14, W, 2, I) + R(160, 36, 14, 14, W, 2, I) + R(200, 46, 14, 14, W, 2, I) + R(214, 46, 14, 14, W, 2, I) + R(214, 60, 14, 14, W, 2, I) + P('M158 60H176', 0, I, 3, DOT);
};
ART.floodFill = function (k) {
var s = '', r, c, pat = ['001102', '011122', '011222', '110222', '100202'], cl = [I, W, M], t;
for (r = 0; r < 5; r++) for (c = 0; c < 6; c++) { t = +pat[r].charAt(c); s += R(80 + c * 16, 6 + r * 16, 16, 16, cl[t], 0, 0); }
return s + R(80, 6, 96, 80, 0, 0, I) + P('M80 6H128V22H112V38H80Z', 0, W, 3) + SP(196, 24, 10, I) + SP(60, 70, 7, I);
};
ART.oddTileOut = function (k) {
var s = '', r, c;
for (r = 0; r < 3; r++) for (c = 0; c < 4; c++) s += (r === 1 && c === 2) ? R(70 + c * 30, 6 + r * 28, 26, 26, W, 5, I) : R(70 + c * 30, 6 + r * 28, 26, 26, I, 5);
return s;
};
ART.numberGrid = function (k) {
return R(72, 6, 114, 80, 0, 8, I) + R(78, 12, 30, 30, I, 5) + T(93, 34, 19, '2', W) + R(112, 12, 30, 30, W, 5, I) + T(127, 34, 19, '8', I) + R(78, 46, 30, 30, W, 5, I) + T(93, 68, 15, '16', I) + R(146, 46, 30, 30, I, 5) + T(161, 68, 19, '4', W)
+ P('M196 46H224M216 38L224 46L216 54', 0, I, 4) + P('M34 46H56M48 38L56 46L48 54', 0, I, 3, DOT);
};

/* ---------- Board & Strategy ---------- */
ART.discFlip = function (k) {
return C(60, 46, 22, W, I, 3) + P('M60 24A22 22 0 0 0 60 68Z', I) + E(129, 46, 10, 22, I, W, 2) + C(198, 46, 22, I) + P('M198 24A22 22 0 0 1 198 68Z', W) + C(198, 46, 22, 0, I, 3) + P('M92 46H108M150 46H166', 0, I, 3, DOT);
};
ART.draughts = function (k) {
return R(20, 78, 218, 8, I, 2) + C(86, 52, 24, I) + C(86, 52, 16, 0, W, 2) + P('M72 46L76 34L82 42L86 32L90 42L96 34L100 46Z', W) + C(172, 52, 24, W, I, 3) + C(172, 52, 16, 0, I, 2) + C(172, 46, 24, W, I, 3) + C(172, 46, 16, 0, I, 2) + P('M118 34Q129 18 140 34M134 28L141 34L132 38', 0, I, 3, DOT);
};
ART.seedSow = function (k) {
var s = '', i, x, j;
s += R(20, 12, 218, 68, I, 34);
for (i = 0; i < 6; i++) { x = 66 + i * 25; s += C(x, 30, 10, M) + C(x, 62, 10, M); }
for (i = 0; i < 6; i++) { x = 66 + i * 25; for (j = 0; j < (i % 3) + 1; j++) { s += C(x - 3 + j * 3, 62 - j * 2, 2.6, W); if (i % 2) s += C(x - 3 + j * 3, 30 + j * 2, 2.6, W); } }
return s + E(40, 46, 9, 22, M) + E(218, 46, 9, 22, M) + C(218, 46, 3, W) + C(215, 52, 3, W) + P('M150 84Q129 92 108 84', 0, I, 2, DOT);
};
ART.fiveInRow = function (k) {
var s = '', i;
for (i = 0; i < 9; i++) s += L(58 + i * 18, 8, 58 + i * 18, 84, I, 1.5);
for (i = 0; i < 5; i++) s += L(58, 12 + i * 17, 202, 12 + i * 17, I, 1.5);
for (i = 0; i < 5; i++) s += C(76 + i * 18, 46, 7.5, I);
return s + L(76, 46, 148, 46, W, 2) + C(94, 29, 7.5, W, I, 2.5) + C(130, 29, 7.5, W, I, 2.5) + C(112, 63, 7.5, W, I, 2.5) + C(166, 63, 7.5, W, I, 2.5) + C(184, 29, 7.5, W, I, 2.5);
};
ART.fleetHunt = function (k) {
return P('M44 58H214L196 74H62Z', I) + R(110, 42, 44, 16, I, 3) + R(124, 32, 16, 10, I, 2) + L(132, 32, 132, 18, I, 3) + P('M132 18L148 24L132 30Z', W) + C(74, 62, 3, W) + C(100, 66, 3, W) + C(160, 66, 3, W) + C(186, 62, 3, W)
+ P('M14 82Q34 74 54 82T94 82T134 82T174 82T214 82T254 82', 0, I, 3) + C(226, 26, 12, 0, I, 3) + L(226, 10, 226, 42, I, 2) + L(210, 26, 242, 26, I, 2) + C(226, 26, 3, W);
};
ART.boxLine = function (k) {
var s = '', i, j;
s += R(90, 24, 30, 26, W, 0);
s += P('M90 24H150M90 50H150M90 76H120M90 24V76M120 24V76M150 24V50', 0, I, 4);
for (i = 0; i < 4; i++) for (j = 0; j < 3; j++) s += C(90 + i * 30, 24 + j * 26, 5, I);
return s + P('M150 50V76', 0, W, 4, DOT) + T(105, 42, 14, 'A', I) + P('M176 62L166 74', 0, I, 3);
};
ART.laneDefense = function (k) {
var s = '', i, y, ex = [200, 168, 214];
for (i = 0; i < 3; i++) {
y = 20 + i * 26;
s += R(28, y - 11, 202, 22, 0, 6, I) + C(50, y, 8, I) + R(55, y - 3, 13, 6, I, 3) + P('M74 ' + y + 'H' + (110 + i * 12), 0, W, 3, DOT) + C(ex[i], y, 9, W, I, 3) + C(ex[i] - 3, y - 2, 1.8, I) + C(ex[i] + 3, y - 2, 1.8, I);
}
return s;
};

/* ---------- Cards & Words ---------- */
ART.golfCards = function (k) {
return G('rotate(-16 92 84)', R(66, 12, 44, 62, W, 6, I) + T(80, 32, 14, '7', I)) + R(100, 10, 44, 62, W, 6, I) + T(114, 30, 14, '8', I) + T(122, 56, 24, '♠', I) + G('rotate(16 152 84)', R(134, 12, 44, 62, W, 6, I) + T(148, 32, 14, '9', I))
+ L(206, 24, 206, 76, I, 3) + P('M206 24L228 32L206 40Z', I) + C(206, 78, 5, W, I, 2);
};
ART.twentyOne = function (k) {
return G('rotate(-8 100 50)', R(78, 12, 50, 68, W, 6, I) + T(92, 32, 16, 'A', I) + T(103, 62, 28, '♠', I)) + G('rotate(10 160 50)', R(138, 10, 50, 68, W, 6, I) + T(152, 30, 16, 'K', I) + T(163, 60, 28, '♥', I))
+ C(214, 70, 12, I) + C(214, 70, 7, 0, W, 2) + C(44, 70, 12, W, I, 3) + C(44, 70, 7, 0, I, 2);
};
ART.higherLower = function (k) {
return R(96, 8, 66, 76, W, 7, I) + T(112, 30, 16, '7', I) + T(129, 64, 34, '♦', I) + P('M52 46L68 22L84 46Z', I) + P('M174 46L190 70L206 46Z', I) + P('M52 62H84M174 30H206', 0, I, 3, DOT);
};
ART.hangWord = function (k) {
return C(100, 56, 26, I) + circle_shine(88, 46) + R(94, 24, 14, 9, I, 2) + P('M101 24Q112 6 136 12', 0, I, 4) + SP(142, 12, 9, W) + STAR(142, 12, 4, I)
+ R(162, 46, 22, 26, W, 5, I) + T(173, 66, 18, 'W', I) + R(188, 46, 22, 26, W, 5, I) + T(199, 66, 18, 'O', I) + R(214, 46, 22, 26, W, 5, I) + L(219, 68, 231, 68, I, 3);
};
function circle_shine(x, y) { return C(x, y, 6, 'rgba(255,255,255,.25)'); }
ART.wordHunt = function (k) {
var s = '', rows = ['QWRTEYU', 'ZCOINXV', 'PLKJHGB', 'MNSDFAT'], r, c;
s += R(76, 33, 90, 24, 0, 12, I);
for (r = 0; r < 4; r++) for (c = 0; c < 7; c++) s += T(68 + c * 21, 24 + r * 22 + (r === 0 ? -2 : 0), 14, rows[r].charAt(c), (r === 1 && c > 0 && c < 5) ? I : M);
return s;
};

/* ---------- public API ---------- */
var SLOTS = [[18, 16], [240, 14], [236, 78], [20, 76], [12, 46], [248, 48]];
function hash(s) { var h = 0, i; for (i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function twinkles(id) {
var h = hash(id), st = h % 6, out = '', i, p;
for (i = 0; i < 3; i++) { p = SLOTS[(st + i * 2) % 6]; out += SP(p[0], p[1], 3 + ((h >> (i + 2)) % 3), W); }
return out;
}
root.CSA_ART = {
ids: function () { return Object.keys(ART); },
has: function (id) { return typeof ART[id] === 'function'; },
svg: function (id, k, cls) {
var body;
if (typeof ART[id] !== 'function') return '';
try { body = ART[id](k || '#24f2ff'); } catch (e) { return ''; }
return '<svg class=' + Q + '' + (cls || 'art') + '' + Q + ' viewBox=' + Q + '0 0 258 92' + Q + ' preserveAspectRatio=' + Q + 'xMidYMid slice' + Q + ' aria-hidden=' + Q + 'true' + Q + ' focusable=' + Q + 'false' + Q + '>' + body + '<g opacity=' + Q + '.7' + Q + '>' + twinkles(id) + '</g></svg>';
}
};
})(window);
