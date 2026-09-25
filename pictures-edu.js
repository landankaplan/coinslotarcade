!function(t){'use strict';try{var n=t.CSA_ART;if(!n)return
;var r=String.fromCharCode(34),o='#0b0518',e='#ffffff',a='#5b4aa8',i='rgba(255,255,255,.55)',c='rgba(11,5,24,.35)';function h(t){var n,o=''
;for(n in t)void 0!==t[n]&&null!==t[n]&&(o+=' '+n+'='+r+t[n]+r);return o}function l(t,n,r){return'<'+t+h(n)+(r?'>'+r+'</'+t+'>':'/>')}
function L(t,n,r,o,e,a,i,c){return l('rect',{x:t,y:n,width:r,height:o,fill:e||'none',rx:a,stroke:i,'stroke-width':i?c||2:void 0})}function F(t,n,r,o,e,a){
return l('circle',{cx:t,cy:n,r:r,fill:o||'none',stroke:e,'stroke-width':e?a||2:void 0})}function d(t,n,r,o,e,a,i){return l('ellipse',{cx:t,cy:n,rx:r,ry:o,
fill:e||'none',stroke:a,'stroke-width':a?i||2:void 0})}function C(t,n,r,o,e){var a={d:t,fill:n||'none'};return r&&(a.stroke=r,a['stroke-width']=o||2,
a['stroke-linecap']='round',a['stroke-linejoin']='round'),e&&(a['stroke-dasharray']=e),l('path',a)}function p(t,n,r,o,e,a,i){
return C('M'+t+' '+n+'L'+r+' '+o,0,e,a,i)}function v(t,n,r,o,e){return l('text',{x:t,y:n,'font-size':r,'font-family':'ui-monospace,Menlo,Consolas,monospace',
'font-weight':700,'text-anchor':'middle',fill:e},o)}function m(t,n){return l('g',{transform:t},n)}function Q(t,n,r,o){var e,a,i,c=''
;for(e=0;e<10;e++)a=-Math.PI/2+e*Math.PI/5,c+=(e?'L':'M')+(t+(i=e%2?.45*r:r)*Math.cos(a)).toFixed(1)+' '+(n+i*Math.sin(a)).toFixed(1);return C(c+'Z',o)}
function S(t,n,r,o){
return C('M'+t+' '+(n-r)+'Q'+t+' '+n+' '+(t+r)+' '+n+'Q'+t+' '+n+' '+t+' '+(n+r)+'Q'+t+' '+n+' '+(t-r)+' '+n+'Q'+t+' '+n+' '+t+' '+(n-r)+'Z',o)}
function A(t,n,r,o){var e=r>t?-1:1;return p(t,n,r,n,o,3)+C('M'+(r+8*e)+' '+(n-6)+'L'+r+' '+n+'L'+(r+8*e)+' '+(n+6),0,o,3)}var u={mathRain:function(){
return d(129,22,46,15,e)+d(100,26,24,12,e)+d(160,27,26,11,e)+v(96,62,20,'7+3',o)+v(150,80,20,'9x4',o)+v(200,58,18,'=?',o)+v(62,82,16,'12',o)+v(222,84,14,'5',o)+p(112,42,110,46,o,2)+p(140,46,138,50,o,2)+p(176,42,174,46,o,2)+p(80,44,78,48,o,2)
},timesGrid:function(){var t,n,r='';for(t=0;t<4;t++)for(n=0;n<6;n++)r+=L(66+21*n,10+19*t,18,16,2===t&&3===n?o:e,3)
;return r+v(59,74,14,'3',o)+v(129,88,12,'4',o)+C('M186 60L204 78M204 60L186 78',0,o,4)+''},fractionSlice:function(){var t,n,r=F(129,46,36,e,o,3)
;for(t=0;t<8;t++)n=t*Math.PI/4,
t<3&&(r+=C('M129 46L'+(129+36*Math.cos(n)).toFixed(1)+' '+(46+36*Math.sin(n)).toFixed(1)+'A36 36 0 0 1 '+(129+36*Math.cos(n+Math.PI/4)).toFixed(1)+' '+(46+36*Math.sin(n+Math.PI/4)).toFixed(1)+'Z',o))
;for(t=0;t<8;t++)n=t*Math.PI/4,r+=p(129,46,129+36*Math.cos(n),46+36*Math.sin(n),a,2)
;return r+v(196,42,22,'3',o)+p(184,48,208,48,o,3)+v(196,70,22,'8',o)+F(150,30,3,e)+F(112,60,3,e)},balanceScales:function(){
return C('M129 30L110 78H148Z',o)+p(70,30,188,30,o,5)+F(129,30,6,e)+p(76,32,60,62,o,2)+p(76,32,92,62,o,2)+L(52,62,48,6,o,3)+L(64,46,16,16,e,3)+v(72,59,14,'x',o)+L(82,50,12,12,e,2)+v(88,60,10,'5',o)+p(182,32,166,62,o,2)+p(182,32,198,62,o,2)+L(158,62,48,6,o,3)+L(166,48,14,14,e,3)+v(173,59,11,'6',o)+L(182,48,14,14,e,3)+v(189,59,11,'3',o)+L(96,78,66,6,o,3)
},lineDart:function(){var t,n=p(44,66,214,66,o,4);for(t=0;t<=10;t++)n+=p(44+17*t,66,44+17*t,t%5?60:54,o,3)
;return n+v(44,86,12,'0',o)+v(214,86,12,'1',o)+C('M146 64L138 22L154 22Z',e)+C('M138 22L126 8L132 26Z',o)+C('M154 22L166 8L160 26Z',o)+F(146,64,3,o)},
coinChange:function(){var t,n='';for(t=0;t<3;t++)n+=d(98,72-6*t,26,10,e,o,3);return n+=d(98,54,26,10,e,o,3)+v(98,58,11,'25',o),
(n+=F(160,46,26,e,o,3)+F(160,46,19,0,o,2)+v(160,53,22,'5',o)+v(176,34,10,'c',o))+F(206,62,16,e,o,3)+v(206,67,15,'1',o)+Q(218,20,8,e)+Q(72,24,5,e)},
clockMaster:function(){var t,n,r=F(129,46,38,e,o,4);for(t=0;t<12;t++)n=t*Math.PI/6,
r+=p(129+31*Math.sin(n),46-31*Math.cos(n),129+35*Math.sin(n),46-35*Math.cos(n),o,t%3?2:4)
;return r+p(129,46,129+20*Math.sin(1.6),46-20*Math.cos(1.6),o,5)+p(129,46,129+30*Math.sin(3.2),46-30*Math.cos(3.2),o,3)+F(129,46,4,o)+v(196,52,22,'3:15',e)+C('M158 46L176 46',0,o,3,'0.1 6')
},numberHunt:function(){var t,n,r='',a=[[7,16,25],[36,9,14],[4,49,12],[30,64,5]]
;for(t=0;t<4;t++)for(n=0;n<3;n++)r+=L(74+38*n,8+21*t,34,18,[16,25,36,9,4,49,64].indexOf(a[t][n])>-1?o:e,5),
r+=v(91+38*n,22+21*t,14,a[t][n],[16,25,36,9,4,49,64].indexOf(a[t][n])>-1?e:o);return r+C('M196 34L204 44L222 22',0,e,6)},bitFlip:function(){
var t,n='',r=[1,0,1,1,0,1],a=[32,16,8,4,2,1];for(t=0;t<6;t++)n+=F(58+28*t,50,12,r[t]?e:0,o,3)+v(58+28*t,55,14,r[t],o)+v(58+28*t,28,11,a[t],o)
;return n+v(129,84,14,'32+8+4+1=45',o)},whatNext:function(){var t,n='',r=['2','4','8']
;for(t=0;t<3;t++)n+=L(38+48*t,26,40,40,e,8)+v(58+48*t,55,26,r[t],o)+(t<2?C('M80 46L86 46',0,o,3):'')
;return(n+=L(182,26,40,40,0,8,o,3)+v(202,55,28,'?',o))+C('M38 18Q100 4 182 18',0,o,3,'0.1 6')+v(112,84,12,'x2  x2  x2',o)},cipherWheel:function(){
var t,n,r=F(129,46,38,e,o,3)+F(129,46,25,0,o,3)+F(129,46,5,o),i='ABCDEFGHIJKL';for(t=0;t<12;t++)n=t*Math.PI/6,
r+=v(129+31.5*Math.sin(n),46-31.5*Math.cos(n)+4,11,i.charAt(t),o);for(t=0;t<12;t++)n=t*Math.PI/6+.5,
r+=v(129+16*Math.sin(n),46-16*Math.cos(n)+3,9,i.charAt((t+3)%12),a)
;return r+C('M184 40L206 40',0,o,3)+C('M198 33L206 40L198 47',0,o,3)+v(224,45,18,'D',o)+v(38,45,18,'A',o)},unscramble:function(){
var t,n='',a=['T','C','A'],i=[-12,8,-6],c=[30,22,34]
;for(t=0;t<3;t++)n+=m('rotate('+i[t]+' '+(76+40*t)+' '+(c[t]+18)+')',L(56+40*t,c[t],36,36,e,6,o,3)+v(74+40*t,c[t]+28,26,a[t],o))
;return n+C('M180 46Q192 30 204 46',0,o,3)+C('M198 36L205 47L193 47',o)+m('rotate(6 226 48)',L(208,30,36,36,o,6)+v(226,58,26,'CAT',e).replace('font-size='+r+'26'+r,'font-size='+r+'13'+r))
},synonymSwat:function(){
return d(129,74,52,10,c)+C('M84 74Q84 40 129 40Q174 40 174 74Z',o)+F(114,56,4,e)+F(144,56,4,e)+F(114,57,2,o)+F(144,57,2,o)+C('M120 66Q129 72 138 66',0,e,3)+m('rotate(-35 200 24)',L(190,8,26,20,e,5,o,3)+p(203,28,203,74,o,5))+Q(176,22,7,e)+Q(160,12,4,e)+L(40,24,44,18,e,6)+v(62,38,12,'happy',o)
},rootMatch:function(){
return L(36,26,68,40,e,8,o,3)+v(70,54,22,'bio',o)+L(154,26,68,40,o,8)+v(188,54,22,'life',e)+p(104,46,154,46,o,4,'0.1 8')+F(129,46,10,e,o,3)+C('M124 46L128 50L135 42',0,o,3)+v(70,16,11,'root',o)+v(188,16,11,'meaning',o)
},homophoneHop:function(){var t,n='',r=['to','two','too'];for(t=0;t<3;t++)n+=L(40+62*t,42,52,30,2===t?o:e,8,2===t?0:o,3)+v(66+62*t,63,20,r[t],2===t?e:o)
;return n+C('M66 34Q96 2 128 34',0,o,3,'0.1 6')+C('M128 34Q158 2 190 34',0,o,3,'0.1 6')+C('M182 28L191 35L181 40',0,o,3)+F(66,24,8,e)+F(64,22,2,o)},
prefixPop:function(){
return F(78,46,28,e,o,3)+v(78,53,22,'un-',o)+v(112,52,24,'+',o)+L(128,30,52,34,o,8)+v(154,54,20,'do',e)+C('M188 46L204 46',0,o,3)+Q(222,44,20,e)+Q(222,44,9,o)+Q(190,16,5,e)+Q(238,78,4,e)
},sentenceScramble:function(){var t='';return t+=L(46,14,44,20,e,6)+L(96,14,62,20,o,6)+L(164,14,36,20,e,6),
t+=L(46,44,58,20,o,6)+L(110,44,34,20,e,6)+L(150,44,66,20,e,6),
(t+=C('M60 76L80 76L80 82',0,o,3)+L(52,72,30,14,0,4,o,2)+L(90,72,44,14,0,4,o,2)+L(142,72,24,14,0,4,o,2))+v(68,29,13,'the',o)+v(127,29,13,'cat',e)+v(182,29,13,'sat',o)+v(75,59,13,'on',e)+v(127,59,13,'a',o)+v(183,59,13,'mat',o)
},elementHunt:function(){var t,n,r=''
;for(t=0;t<4;t++)for(n=0;n<8;n++)0===t&&n>0&&n<7||1===t&&n>1&&n<6||2===t&&n>1&&n<6||(r+=L(38+15*n,8+15*t,12,12,3===t&&3===n?o:i,2))
;return r+L(150,34,54,54,e,8,o,3)+v(160,48,11,'26',o)+v(177,74,26,'Fe',o)},bodyMap:function(){
return F(129,16,10,e,o,3)+L(100,28,58,54,e,14,o,3)+d(115,46,10,15,c)+d(143,46,10,15,c)+C('M129 60C118 52 116 42 123 40C126 39 129 42 129 44C129 42 132 39 135 40C142 42 140 52 129 60Z',o)+C('M108 70Q125 64 148 72Q140 80 118 78Z',a)+p(129,26,129,34,o,3)+L(78,34,16,40,e,7,o,3)+L(164,34,16,40,e,7,o,3)+C('M183 34L206 28M183 44L210 44M183 54L206 60',0,o,3,'0.1 6')+v(226,32,11,'heart',o)+v(226,62,11,'lungs',o)
},matterSort:function(){
return L(30,50,54,34,e,8,o,3)+L(44,24,26,26,o,4)+v(57,44,16,'S',e)+L(102,50,54,34,e,8,o,3)+C('M129 18Q117 36 129 44Q141 36 129 18Z',o)+v(129,74,16,'L',o)+L(174,50,54,34,e,8,o,3)+F(190,32,8,0,o,3)+F(208,22,6,0,o,3)+F(206,40,5,0,o,3)+v(201,74,16,'G',o)
},timelineSort:function(){var t,n=p(30,50,206,50,o,5),r=[48,90,132,174],a=['1066','1492','1776','1969']
;for(t=0;t<4;t++)n+=F(r[t],50,8,2===t?o:e,o,3)+L(r[t]-20,t%2?60:18,40,16,2===t?o:e,4)+v(r[t],t%2?72:30,12,a[t],2===t?e:o)+p(r[t],t%2?58:34,r[t],t%2?50:42,o,2)
;return n+C('M198 43L210 50L198 57',0,o,4)},gridPilot:function(){var t,n=''
;for(t=0;t<6;t++)n+=p(56+28*t,10,56+28*t,82,i,1.5)+(t<4?p(42,14+20*t,214,14+20*t,i,1.5):'')
;return n+p(42,74,214,74,o,3)+p(70,10,70,84,o,3)+C('M98 74L98 46L168 46',0,o,3,'0.1 7')+Q(168,30,10,e)+m('rotate(90 98 46)',C('M98 34L106 52L98 48L90 52Z',o))},
continentClick:function(){var t=F(129,46,38,e,o,3)
;return(t+=C('M105 30Q112 22 124 26Q130 32 122 38Q116 44 108 40Z',o)+C('M128 44Q138 40 144 48Q142 62 134 68Q128 60 130 52Z',o)+C('M136 26Q150 20 160 30Q154 40 142 38Z',o)+C('M152 50Q162 48 164 56Q158 62 152 58Z',o))+C('M176 52L176 78L184 70L192 84L198 80L190 68L200 66Z',e,o,2)
},unitSnap:function(){var t,n=L(38,22,130,26,e,4,o,3);for(t=0;t<13;t++)n+=p(46+10*t,22,46+10*t,t%2?32:38,o,2)
;return(n+=v(60,66,12,'cm',o)+v(160,66,12,'m',o)+C('M52 74L154 74',0,o,3)+C('M60 68L52 74L60 80M146 68L154 74L146 80',0,o,3))+F(206,36,16,e,o,3)+C('M195 30Q206 20 217 30',0,o,3)+p(206,36,212,28,o,3)+L(190,58,32,22,o,4)+v(206,74,13,'kg',e)
},foodChain:function(){
return C('M40 60Q40 28 62 22Q62 44 50 62Z',o)+p(50,62,50,76,o,3)+A(70,46,96,o)+d(118,48,14,12,e,o,3)+d(112,30,4,12,e,o,2)+d(125,30,4,12,e,o,2)+F(114,46,2,o)+F(123,46,2,o)+A(140,46,164,o)+C('M172 66L182 26L192 40L204 26L212 66Z',e,o,3)+F(192,54,3,o)+F(184,48,2,o)+F(200,48,2,o)
},colorLab:function(){
return C('M112 10H146V32L170 72Q176 84 164 84H94Q82 84 88 72L112 32Z',e,o,3)+C('M96 62Q129 52 162 62L168 76Q170 80 164 80H94Q88 80 90 76Z',o)+F(120,68,3,e)+F(134,62,4,e)+F(146,72,3,e)+F(126,44,4,o)+F(138,30,3,o)+F(130,18,3,o)+L(108,6,42,6,o,3)+F(196,30,14,c)+F(210,30,14,i)+F(203,44,14,o)+F(58,34,12,i)+F(72,40,12,c)
},missingLetter:function(){var t,n='',r=['B','O','?','K']
;for(t=0;t<4;t++)n+=2===t?L(38+46*t,24,40,44,0,8,o,3)+v(58+46*t,56,30,'?',o):L(38+46*t,24,40,44,e,8,o,3)+v(58+46*t,56,30,r[t],o)
;return n+p(38,80,218,80,o,3,'0.1 8')+v(130,15,11,'B O _ K',o)},capitalMatch:function(){
return C('M86 22Q108 10 128 20Q150 30 170 18Q184 26 176 50Q160 72 130 68Q100 74 84 56Q76 40 86 22Z',e,o,3)+C('M170 34C158 34 152 46 170 66C188 46 182 34 170 34Z',o)+F(170,44,4,e)+Q(116,44,10,o)+p(126,46,160,46,o,3,'0.1 7')+v(60,80,12,'CAPITAL',o)+L(190,62,42,20,o,6)+v(211,77,12,'city',e)
},planetParade:function(){var t,n=C('M30 6A40 40 0 0 1 30 86Z',o),r=[62,90,122,160,206],a=[5,7,8,14,18]
;for(t=0;t<5;t++)n+=F(r[t],46,a[t],3===t?0:e,o,3===t?0:2)+''
;return n+d(160,46,26,6,0,o,3)+F(160,46,13,e,o,3)+C('M138 50Q160 60 182 42',0,o,3)+p(70,70,210,70,o,3,'0.1 8')},speechSort:function(){
var t,n='',r=['N','V','Adj','Adv'],a=[24,10,30,16]
;for(t=0;t<4;t++)n+=L(30+52*t,56,46,28,t%2?o:e,7,o,3)+v(53+52*t,76,14,r[t],t%2?e:o)+L(38+52*t,a[t],30,18,t%2?e:o,5)+v(53+52*t,a[t]+13,11,['cat','run','big','fast'][t],t%2?o:e)+p(53+52*t,a[t]+20,53+52*t,52,o,2,'0.1 5')
;return n}},f=[[18,16],[240,14],[236,78],[20,76],[12,46],[248,48]];function D(t){var n,r=0;for(n=0;n<t.length;n++)r=31*r+t.charCodeAt(n)>>>0;return r}
function x(t){var n,r,o=D(t),a=o%6,i='';for(n=0;n<3;n++)i+=S((r=f[(a+2*n)%6])[0],r[1],3+(o>>n+2)%3,e);return i}var M=n.has,s=n.svg;n.has=function(t){
return'function'==typeof u[t]||M.call(n,t)},n.svg=function(t,o,e){var a;if('function'!=typeof u[t])return s.call(n,t,o,e);try{a=u[t](o||'#24f2ff')}catch(t){
return''}
return'<svg class='+r+(e||'art')+r+' viewBox='+r+'0 0 258 92'+r+' preserveAspectRatio='+r+'xMidYMid slice'+r+' aria-hidden='+r+'true'+r+' focusable='+r+'false'+r+'>'+a+'<g opacity='+r+'.7'+r+'>'+x(t)+'</g></svg>'
},t.CSA_EDU_GAMES={mathRain:['Math Rain','#2FD3C7'],timesGrid:['Times Grid','#FF9770'],fractionSlice:['Fraction Slice','#FF5DA2'],
balanceScales:['Balance Scales','#8C7CF0'],lineDart:['Line Dart','#FFD166'],coinChange:['Coin Change','#FFD166'],clockMaster:['Clock Master','#4DA6FF'],
numberHunt:['Number Hunt','#3DDC97'],bitFlip:['Bit Flip','#FF6B4A'],whatNext:['What Comes Next','#FF5DA2'],cipherWheel:['Cipher Wheel','#2FD3C7'],
unscramble:['Unscramble','#FF9770'],synonymSwat:['Synonym Swat','#3DDC97'],rootMatch:['Word Roots','#4DA6FF'],homophoneHop:['Homophone Hop','#FF5DA2'],
prefixPop:['Prefix Pop','#8C7CF0'],sentenceScramble:['Sentence Scramble','#FF6B4A'],elementHunt:['Element Hunt','#2FD3C7'],bodyMap:['Body Map','#FF6B4A'],
matterSort:['Matter Sorter','#4DA6FF'],timelineSort:['Timeline Sort','#FFD166'],gridPilot:['Grid Pilot','#3DDC97'],continentClick:['Continent Click','#4DA6FF'],
unitSnap:['Unit Snap','#3DDC97'],foodChain:['Food Chain','#FF9770'],colorLab:['Color Lab','#FF5DA2'],missingLetter:['Missing Letter','#2FD3C7'],
capitalMatch:['Capital Match','#4DA6FF'],planetParade:['Planet Parade','#8C7CF0'],speechSort:['Part of Speech Sort','#FF9770']}}catch(b){}}(window);