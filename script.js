/* CYBER COMMAND CENTER — Network Security Operations Platform */
(function () {
/* =====================================================================
   CYBER COMMAND CENTER — core (helpers, icons, state, simulation)
   ===================================================================== */
"use strict";
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- tiny DOM helpers ---------- */
function el(tag, props, children){
  var e = document.createElement(tag);
  if (props) for (var k in props){
    var v = props[k];
    if (v == null) continue;
    if (k === "class") e.className = v;
    else if (k === "html") e.innerHTML = v;
    else if (k === "text") e.textContent = v;
    else if (k === "style" && typeof v === "object") Object.assign(e.style, v);
    else if (k.slice(0,2) === "on" && typeof v === "function") e.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === "dataset") for (var d in v) e.dataset[d] = v[d];
    else if (v === true) e.setAttribute(k, "");
    else if (v !== false) e.setAttribute(k, v);
  }
  if (children != null) append(e, children);
  return e;
}
function append(parent, c){
  if (c == null) return;
  if (Array.isArray(c)) { c.forEach(function(x){ append(parent, x); }); return; }
  if (c.nodeType) { parent.appendChild(c); return; }
  parent.appendChild(document.createTextNode(String(c)));
}
function qs(s,c){ return (c||document).querySelector(s); }
function qsa(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); }
function clear(node){ while(node && node.firstChild) node.removeChild(node.firstChild); return node; }
function esc(s){ return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];}); }
var SVGNS = "http://www.w3.org/2000/svg";
function sel(tag, attrs){ var e = document.createElementNS(SVGNS, tag); if(attrs) for(var k in attrs){ if(attrs[k]!=null) e.setAttribute(k, attrs[k]); } return e; }

/* ---------- random ---------- */
function rnd(a,b){ return a + Math.random()*(b-a); }
function ri(a,b){ return Math.floor(rnd(a,b+1)); }
function pick(arr){ return arr[ri(0,arr.length-1)]; }
function chance(p){ return Math.random() < p; }
function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
function pad(n){ return n<10 ? "0"+n : ""+n; }
function nowClock(d){ d=d||new Date(); return pad(d.getHours())+":"+pad(d.getMinutes())+":"+pad(d.getSeconds()); }
function fmtNum(n){ return n.toLocaleString("en-US"); }
function randIP(prefixList){
  var pfx = prefixList || ["185","91","45","103","193","89","62","141","5","212","77","209","198"];
  return pick(pfx)+"."+ri(0,255)+"."+ri(0,255)+"."+ri(1,254);
}
function randIntIP(){ return "10."+ri(0,4)+"."+ri(0,40)+"."+ri(2,240); }

/* ---------- Lucide-style inline icons ---------- */
var ICONS = {
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  "shield-check":'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  "shield-alert":'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  activity:'<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  "alert-triangle":'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  "alert-octagon":'<path d="M7.9 2h8.2L22 7.9v8.2L16.1 22H7.9L2 16.1V7.9z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  radar:'<path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/>',
  network:'<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
  server:'<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01"/><path d="M6 17h.01"/>',
  "server-cog":'<rect x="2" y="3" width="20" height="8" rx="2"/><path d="M6 7h.01"/><rect x="2" y="13" width="12" height="8" rx="2"/><circle cx="19" cy="17" r="3"/><path d="M19 13v1M19 20v1M23 17h-1M16 17h-1"/>',
  cpu:'<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M9 2v2M15 20v2M9 20v2M20 15h2M20 9h2M2 15h2M2 9h2"/>',
  database:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
  globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/>',
  terminal:'<path d="m4 17 6-6-6-6"/><path d="M12 19h8"/>',
  "terminal-square":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m7 11 3 3-3 3"/><path d="M13 17h4"/>',
  zap:'<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
  lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  wifi:'<path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.8a15 15 0 0 1 20 0"/><path d="M12 20h.01"/>',
  router:'<rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6.01 18H6M10 18h-.01"/><path d="M15 10a3 3 0 0 0-3-3 3 3 0 0 0-3 3"/><path d="M18 8a6 6 0 0 0-12 0"/><path d="M15 14v.01M18 14v.01"/>',
  flame:'<path d="M12 2c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 1-3 .5 2 2 2.5 2 2.5-1-3 2-4 2-9z"/>',
  "git-branch":'<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  "bell-off":'<path d="M8.7 3A6 6 0 0 1 18 8c0 3 .6 5 1.4 6.4M6 8c0 7-3 9-3 9h14M18 8l3 3"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="m2 2 20 20"/>',
  volume:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
  "volume-x":'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  filter:'<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
  trash:'<path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  "chevron-down":'<path d="m6 9 6 6 6-6"/>',
  "chevron-right":'<path d="m9 18 6-6-6-6"/>',
  play:'<polygon points="6 3 20 12 6 21 6 3"/>',
  crosshair:'<circle cx="12" cy="12" r="10"/><path d="M22 12h-4M6 12H2M12 6V2M12 22v-4"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  "eye-off":'<path d="M9.9 4.24A9 9 0 0 1 12 4c6.5 0 10 7 10 7a13 13 0 0 1-2.16 2.88M6.6 6.6A13 13 0 0 0 2 11s3.5 7 10 7a9 9 0 0 0 4-1"/><line x1="2" y1="2" x2="22" y2="22"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  bug:'<path d="M8 2l1.5 1.5M16 2l-1.5 1.5"/><path d="M9 7.5h6"/><rect x="8" y="6" width="8" height="12" rx="4"/><path d="M8 12H4M20 12h-4M8 9l-4-1M20 8l-4 1M8 15l-4 1M20 16l-4-1M12 18v4"/>',
  skull:'<circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M8 20v2h8v-2"/><path d="M12.5 17l-.5-1-.5 1z"/><path d="M16 20a2 2 0 0 0 1.56-3.25A8 8 0 1 0 4 16a2 2 0 0 0 1.56 3.25"/><path d="M9.82 20H8v2M14.18 20H16v2"/>',
  fingerprint:'<path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M2 12a10 10 0 0 1 18-6"/><path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M8.65 22c.21-.66.45-1.32.57-2"/><path d="M9 6.8a6 6 0 0 1 9 5.2v2"/>',
  layers:'<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
  "scan-line":'<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
  power:'<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.8 0"/>',
  gauge:'<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  "trending-up":'<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  "trending-down":'<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>',
  minus:'<path d="M5 12h14"/>',
  "arrow-up":'<path d="M12 19V5M5 12l7-7 7 7"/>',
  "arrow-down":'<path d="M12 5v14M19 12l-7 7-7-7"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  "check-circle":'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  ban:'<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
  "arrow-up-right":'<path d="M7 17 17 7M8 7h9v9"/>',
  monitor:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  hexagon:'<path d="M21 16.05V7.95a2 2 0 0 0-1-1.73l-7-4.05a2 2 0 0 0-2 0l-7 4.05a2 2 0 0 0-1 1.73v8.1a2 2 0 0 0 1 1.73l7 4.05a2 2 0 0 0 2 0l7-4.05a2 2 0 0 0 1-1.73z"/>',
  key:'<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
  mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/>',
  "hard-drive":'<line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/>',
  refresh:'<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  maximize:'<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',
  "file-text":'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/>',
  briefcase:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  "list-checks":'<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8M13 12h8M13 18h8"/>',
  broadcast:'<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14"/>'
};
function icon(name, cls){
  var span = document.createElement("span");
  span.style.display="inline-flex"; if(cls) span.className = cls;
  span.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">'+(ICONS[name]||ICONS.info)+'</svg>';
  return span;
}
function iconHTML(name){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[name]||ICONS.info)+'</svg>'; }

/* =====================================================================
   STATE + PUB/SUB
   ===================================================================== */
var listeners = {};
function on(evt, fn){ (listeners[evt]=listeners[evt]||[]).push(fn); return fn; }
function emit(evt, data){ (listeners[evt]||[]).forEach(function(fn){ try{fn(data);}catch(e){console.error(e);} }); }

var S = {
  booted:false,
  view:"overview",
  soundOn:false,
  redTeam:false,
  rootMode:false,
  navOpen:false,
  collapsed:false,
  seq:1,
  incSeq:0,
  // core metrics
  threat:14,            // 0-100
  blockedAttacks:1284,
  suspicious:6,
  devicesTotal:0, devicesOnline:0,
  availability:99.98,
  score:94,
  // collections
  events:[],
  incidents:[],
  logs:[],
  firewall:[],
  attacks:[],           // threat map
  devices:[],
  servers:[],
  mitre:[],
  eventFilter:"ALL",
  logFilter:"ALL",
  fwFilter:"ALL",
  threatHistory:[],
  trafficHistory:[],
  scoreHistory:[],
  eggFound:{},
  stats:{ eventsToday:0, attacksSimulated:0 }
};

/* threat level label */
function threatLabel(v){
  if (v>=80) return {t:"CRITICAL",c:"crit"};
  if (v>=60) return {t:"HIGH",c:"high"};
  if (v>=40) return {t:"ELEVATED",c:"med"};
  if (v>=20) return {t:"GUARDED",c:"low"};
  return {t:"LOW",c:"ok"};
}

/* =====================================================================
   SEED DATA
   ===================================================================== */
var GEO = { // simplified lon/lat of source cities and our datacenters
  cities:[
    {n:"Moscow",lon:37.6,lat:55.7},{n:"Beijing",lon:116.4,lat:39.9},{n:"Kyiv",lon:30.5,lat:50.4},
    {n:"São Paulo",lon:-46.6,lat:-23.5},{n:"Lagos",lon:3.4,lat:6.5},{n:"Tehran",lon:51.4,lat:35.7},
    {n:"Mumbai",lon:72.8,lat:19.1},{n:"Seoul",lon:127.0,lat:37.5},{n:"Singapore",lon:103.8,lat:1.35},
    {n:"Amsterdam",lon:4.9,lat:52.4},{n:"New York",lon:-74.0,lat:40.7},{n:"Los Angeles",lon:-118.2,lat:34.0},
    {n:"Istanbul",lon:29.0,lat:41.0},{n:"Hanoi",lon:105.8,lat:21.0},{n:"Cairo",lon:31.2,lat:30.0},
    {n:"Jakarta",lon:106.8,lat:-6.2},{n:"Bogotá",lon:-74.1,lat:4.7},{n:"Sydney",lon:151.2,lat:-33.9}
  ],
  dc:[ // our protected datacenters
    {n:"DC-EU / Prishtina",lon:21.16,lat:42.66},
    {n:"DC-US / Ashburn",lon:-77.5,lat:39.0},
    {n:"DC-EU / Frankfurt",lon:8.68,lat:50.11}
  ]
};

var ATTACK_TYPES = {
  portscan:{ id:"portscan", name:"Port Scan", icon:"scan-line", sev:"MEDIUM", mitre:"T1046",
    desc:"Enumerate open TCP/UDP services across a subnet.",
    devTypes:["firewall","router","web"],
    log:function(ip,dst){ return [["NET","port-scan sweep src="+ip+" dst="+dst+" ports=22,80,443,3389,8080"],["NET","SYN scan detected 42 ports/2s from "+ip],["ALERT","network-service-scan pattern src="+ip]]; },
    msg:function(ip){ return {b:"Port scan detected",x:"src="+ip}; } },
  bruteforce:{ id:"bruteforce", name:"Brute Force", icon:"key", sev:"HIGH", mitre:"T1110",
    desc:"Repeated credential guessing against exposed auth.",
    devTypes:["windows","vpn","linux"],
    log:function(ip,dst){ return [["AUTH","AUTH FAILED user=admin src="+ip+" dst="+dst],["AUTH","AUTH FAILED user=admin src="+ip],["AUTH","AUTH FAILED user=administrator src="+ip],["ALERT","brute-force-pattern detected src="+ip+" attempts=94"]]; },
    msg:function(ip){ return {b:"Brute-force attack detected",x:"src="+ip}; } },
  ddos:{ id:"ddos", name:"DDoS Flood", icon:"broadcast", sev:"CRITICAL", mitre:"T1499",
    desc:"Volumetric flood overwhelming edge capacity.",
    devTypes:["router","firewall","web"],
    log:function(ip,dst){ return [["NET","traffic spike 4.2 Gbps ingress dst="+dst],["FW","DROP flood SYN src="+ip+" rate=182k pps"],["ALERT","volumetric-ddos in progress target="+dst]]; },
    msg:function(ip){ return {b:"DDoS flood in progress",x:"target edge"}; } },
  malware:{ id:"malware", name:"Malware Beacon", icon:"bug", sev:"HIGH", mitre:"T1071",
    desc:"Endpoint beaconing to a known C2 host.",
    devTypes:["ws","windows"],
    log:function(ip,dst){ return [["SEC","edr: suspicious child process powershell -enc …"],["NET","c2 beacon dst="+ip+" interval=60s jitter=12%"],["ALERT","malware-beacon classified family=AgentTesla"]]; },
    msg:function(ip){ return {b:"Malware beacon to C2",x:"c2="+ip}; } },
  phishing:{ id:"phishing", name:"Phishing", icon:"mail", sev:"MEDIUM", mitre:"T1566",
    desc:"Credential-harvest email delivered to a user.",
    devTypes:["ws","windows"],
    log:function(ip,dst){ return [["SEC","mail-gw: lookalike domain darty-secure[.]net"],["SEC","user clicked link → sandbox detonation flagged"],["ALERT","phishing-campaign targeting 3 mailboxes"]]; },
    msg:function(ip){ return {b:"Phishing attempt flagged",x:"3 mailboxes"}; } },
  login:{ id:"login", name:"Suspicious Login", icon:"fingerprint", sev:"MEDIUM", mitre:"T1078",
    desc:"Impossible-travel sign-in on a valid account.",
    devTypes:["windows","vpn"],
    log:function(ip,dst){ return [["AUTH","login OK user=j.doe src="+ip+" geo=RU"],["SEC","impossible-travel: 2 logins 1400km / 3min"],["ALERT","suspicious-login valid-account anomaly"]]; },
    msg:function(ip){ return {b:"Suspicious login (impossible travel)",x:"src="+ip}; } },
  sqli:{ id:"sqli", name:"SQL Injection", icon:"database", sev:"HIGH", mitre:"T1190",
    desc:"Injection attempt against the web app tier.",
    devTypes:["web","db"],
    log:function(ip,dst){ return [["SEC","waf: payload ' OR 1=1-- on /api/login src="+ip],["SEC","waf: UNION SELECT probe blocked src="+ip],["ALERT","sql-injection attempt dst="+dst]]; },
    msg:function(ip){ return {b:"SQL injection attempt",x:"src="+ip}; } },
  ransomware:{ id:"ransomware", name:"Ransomware", icon:"skull", sev:"CRITICAL", mitre:"T1486",
    desc:"Mass file-encryption behavior on a host.",
    devTypes:["windows","db","linux"],
    log:function(ip,dst){ return [["SEC","edr: 1,204 files renamed .lockbit in 40s"],["SEC","shadow copies deletion vssadmin detected"],["ALERT","ransomware-behavior host="+dst+" ISOLATE recommended"]]; },
    msg:function(ip){ return {b:"Ransomware behavior detected",x:"host quarantine advised"}; } }
};

var MITRE = [
  {id:"T1595",nm:"Active Scanning",tac:"Reconnaissance"},
  {id:"T1590",nm:"Gather Victim Network Info",tac:"Reconnaissance"},
  {id:"T1566",nm:"Phishing",tac:"Initial Access"},
  {id:"T1190",nm:"Exploit Public-Facing App",tac:"Initial Access"},
  {id:"T1078",nm:"Valid Accounts",tac:"Initial Access"},
  {id:"T1059",nm:"Command & Scripting Interpreter",tac:"Execution"},
  {id:"T1053",nm:"Scheduled Task/Job",tac:"Execution"},
  {id:"T1547",nm:"Boot/Logon Autostart",tac:"Persistence"},
  {id:"T1136",nm:"Create Account",tac:"Persistence"},
  {id:"T1548",nm:"Abuse Elevation Control",tac:"Privilege Escalation"},
  {id:"T1484",nm:"Domain Policy Modification",tac:"Privilege Escalation"},
  {id:"T1562",nm:"Impair Defenses",tac:"Defense Evasion"},
  {id:"T1070",nm:"Indicator Removal",tac:"Defense Evasion"},
  {id:"T1110",nm:"Brute Force",tac:"Credential Access"},
  {id:"T1003",nm:"OS Credential Dumping",tac:"Credential Access"},
  {id:"T1046",nm:"Network Service Scanning",tac:"Discovery"},
  {id:"T1021",nm:"Remote Services",tac:"Lateral Movement"},
  {id:"T1071",nm:"Application Layer Protocol",tac:"Command & Control"},
  {id:"T1499",nm:"Endpoint DoS",tac:"Impact"},
  {id:"T1486",nm:"Data Encrypted for Impact",tac:"Impact"}
];

/* network topology: layered layout with x%,y% */
var DEVICES = [
  {id:"inet", nm:"Internet",  ip:"0.0.0.0/0",   type:"globe",   layer:0, x:50, y:7,  st:"ONLINE", role:"WAN uplink · BGP"},
  {id:"fw",   nm:"Firewall",  ip:"10.0.0.1",    type:"shield",  layer:1, x:50, y:22, st:"ONLINE", role:"NGFW · 1,204 rules · IPS on"},
  {id:"rtr",  nm:"Core Router",ip:"10.0.0.2",   type:"router",  layer:2, x:50, y:37, st:"ONLINE", role:"BGP/OSPF · 6.2 Gbps"},
  {id:"sw1",  nm:"Switch A",  ip:"10.0.1.10",   type:"network", layer:3, x:26, y:52, st:"ONLINE", role:"Core L3 · VLAN 10-40"},
  {id:"sw2",  nm:"Switch B",  ip:"10.0.1.11",   type:"network", layer:3, x:74, y:52, st:"ONLINE", role:"Access L2 · VLAN 50-60"},
  {id:"dns",  nm:"DNS Server",ip:"10.0.10.5",   type:"globe",   layer:4, x:10, y:70, st:"ONLINE", role:"BIND9 · authoritative"},
  {id:"dhcp", nm:"DHCP Server",ip:"10.0.10.6",  type:"server",  layer:4, x:27, y:70, st:"ONLINE", role:"Kea · 3 scopes"},
  {id:"web",  nm:"Web Server",ip:"10.0.20.20",  type:"server",  layer:4, x:44, y:70, st:"ONLINE", role:"nginx · TLS1.3"},
  {id:"db",   nm:"DB Server", ip:"10.0.20.30",  type:"database",layer:4, x:60, y:70, st:"ONLINE", role:"PostgreSQL 16 · repl"},
  {id:"windows",nm:"Windows Server",ip:"10.0.30.10",type:"server-cog",layer:4, x:77, y:70, st:"ONLINE", role:"AD DS · DC01"},
  {id:"linux",nm:"Linux Server",ip:"10.0.30.11", type:"server", layer:4, x:90, y:70, st:"ONLINE", role:"Ubuntu 24.04 LTS"},
  {id:"vpn",  nm:"VPN Gateway",ip:"10.0.0.9",    type:"lock",    layer:3, x:50, y:52, st:"ONLINE", role:"WireGuard · 38 peers"},
  {id:"ws",   nm:"Workstations",ip:"10.0.40.0/24",type:"monitor",layer:5, x:35, y:88, st:"ONLINE", role:"64 endpoints · EDR"},
  {id:"ws2",  nm:"Field Laptops",ip:"10.0.41.0/24",type:"monitor",layer:5, x:65, y:88, st:"ONLINE", role:"22 endpoints · VPN"}
];
var EDGES = [["inet","fw"],["fw","rtr"],["rtr","sw1"],["rtr","sw2"],["rtr","vpn"],["sw1","dns"],["sw1","dhcp"],["sw1","web"],["sw2","db"],["sw2","windows"],["sw2","linux"],["sw1","ws"],["sw2","ws2"],["vpn","ws2"]];

var SERVERS = [
  {id:"win", nm:"Windows Server 2022", os:"AD DS · DC01", ip:"10.0.30.10", icon:"server-cog", cpu:34, ram:58, disk:62, net:18, up:"142d 06h", hist:[]},
  {id:"ubu", nm:"Ubuntu Server 24.04", os:"web / reverse proxy", ip:"10.0.30.11", icon:"server", cpu:22, ram:41, disk:37, net:44, up:"233d 11h", hist:[]},
  {id:"pg",  nm:"Database Server", os:"PostgreSQL 16", ip:"10.0.20.30", icon:"database", cpu:47, ram:71, disk:69, net:26, up:"88d 19h", hist:[]},
  {id:"web", nm:"Web Server", os:"nginx 1.27", ip:"10.0.20.20", icon:"globe", cpu:29, ram:38, disk:24, net:57, up:"61d 02h", hist:[]}
];
/* =====================================================================
   SIMULATION ENGINE
   ===================================================================== */
function seedInit(){
  S.devices = DEVICES.map(function(d){ return Object.assign({}, d); });
  S.devicesTotal = S.devices.length;
  if (typeof enrichDevices==="function") enrichDevices();
  S.servers = SERVERS.map(function(s){ s = Object.assign({}, s); s.hist = []; for(var i=0;i<40;i++) s.hist.push(s.cpu + rnd(-6,6)); return s; });
  S.mitre = MITRE.map(function(m){ return {id:m.id, nm:m.nm, tac:m.tac, count:0, hotUntil:0}; });
  for (var i=0;i<40;i++){ S.threatHistory.push(clamp(S.threat+rnd(-4,4),4,30)); S.trafficHistory.push(rnd(2.4,4.8)); S.scoreHistory.push(S.score+rnd(-2,2)); }
  recomputeDevices();
  // seed a few ambient events + logs + firewall + one incident
  var seedEv = [
    ["LOW","New device connected","dhcp lease "+randIntIP(),"SYS"],
    ["LOW","VPN peer handshake completed","10.0.41.14","NET"],
    ["MEDIUM","Certificate expiring in 14 days","web-01","SEC"],
    ["LOW","Backup job completed","srv-file01","SYS"],
    ["MEDIUM","Port scan detected","src="+randIP(),"NET"]
  ];
  seedEv.forEach(function(e,i){ addEvent(e[0], e[1], e[2], e[3], true); });
  for (var j=0;j<26;j++) addLog(pick(["AUTH","NET","SYS","FW","SEC"]), ambientLog(), true);
  for (var k=0;k<16;k++) addFirewall(true);
  // baseline incident
  createIncident({
    title:"Repeated failed VPN logins",
    sev:"MEDIUM", src:randIP(), target:"VPN-Gateway", mitre:"T1110",
    status:"INVESTIGATING", devId:"vpn"
  }, true);
}

function recomputeDevices(){
  S.devicesOnline = S.devices.filter(function(d){ return d.st!=="OFFLINE"; }).length;
}

/* ---------- EVENTS (SIEM) ---------- */
function addEvent(sev, b, x, kind, silent){
  var ev = { id:S.seq++, t:new Date(), sev:sev, b:b, x:x||"", kind:kind||"SEC" };
  S.events.unshift(ev);
  if (S.events.length>260) S.events.pop();
  S.stats.eventsToday++;
  emit("event", ev);
  if (!silent) { emit("metrics"); }
  return ev;
}
function ambientLog(){
  var opts = [
    "session established dst=10.0.20.20:443",
    "dhcp ACK "+randIntIP()+" lease=24h",
    "ntp sync offset=2.1ms",
    "ospf neighbor 10.0.0.2 FULL",
    "tls handshake ok cipher=TLS_AES_256",
    "health-check web-01 200 OK 8ms",
    "backup snapshot srv-file01 delta=1.2GB",
    "AUTH OK user=svc-monitor src="+randIntIP(),
    "DROP src="+randIP()+" dpt=23 proto=tcp",
    "query A darty.local → 10.0.20.20"
  ];
  return pick(opts);
}
/* ---------- LOGS ---------- */
function addLog(kind, msg, silent){
  var l = { id:S.seq++, t:new Date(), k:kind, m:msg };
  S.logs.unshift(l);
  if (S.logs.length>400) S.logs.pop();
  if (!silent) emit("log", l);
  return l;
}
/* ---------- FIREWALL (rule-engine driven) ---------- */
function internalDevPick(){
  var pool = (S.devices||[]).filter(function(d){ return d.zone && d.zone!=="INTERNET" && (d.ip||"").indexOf("/")<0; });
  return pool.length? pick(pool) : null;
}
function buildFlow(forcedSrcIP, forcedDst){
  var ext = chance(.45);
  var proto = pick(["TCP","TCP","TCP","UDP","ICMP"]);
  var port = pick([22,53,80,443,443,443,3389,8080,25,123,161,445,5432,1194]);
  var dstDev = forcedDst || pick((S.devices||[]).filter(function(d){ return d.zone && d.zone!=="INTERNET"; }));
  var dstZone = dstDev? dstDev.zone : "SERVER";
  var dstVlan = dstDev? dstDev.vlan : 20;
  var dstIP = forcedDst? forcedDst.ip.split("/")[0] : (dstDev? dstDev.ip.split("/")[0] : "10.10.20.20");
  var srcZone, srcVlan, srcIP;
  if (ext && !forcedSrcIP){ srcZone="INTERNET"; srcVlan=null; srcIP=randIP(); }
  else { var s=internalDevPick(); srcZone=s?s.zone:"USER"; srcVlan=s?s.vlan:30; srcIP=forcedSrcIP||(s?s.ip.split("/")[0]:randIntIP()); }
  if (forcedSrcIP && (""+forcedSrcIP).indexOf("10.")!==0){ srcZone="INTERNET"; srcVlan=null; }
  var f = { id:S.seq++, t:simNow(), src:srcIP, dst:dstIP, srcZone:srcZone, dstZone:dstZone, srcVlan:srcVlan, dstVlan:dstVlan,
            port:port, proto:proto, size:ri(64,1480), dir: srcZone==="INTERNET"?"IN":"E-W" };
  var res = evaluateFlow(f);
  f.action = res.action; f.ruleId = res.rule; f.logged = res.log;
  return f;
}
function addFirewall(silent){
  var row = buildFlow();
  S.firewall.unshift(row);
  if (S.firewall.length>200) S.firewall.pop();
  if (row.action!=="ALLOW") S.blockedAttacks += 1;
  if (!silent) emit("firewall", row);
  return row;
}
/* ---------- INCIDENTS ---------- */
function createIncident(o, silent){
  S.incSeq++;
  var d = simNow();
  var id = "INC-"+d.getFullYear()+"-"+pad(d.getMonth()+1)+pad(d.getDate())+"-"+pad(S.incSeq);
  var inc = {
    id:id, title:o.title, sev:o.sev, src:o.src, target:o.target, mitre:o.mitre||"—",
    status:o.status||"NEW", devId:o.devId||null, kind:o.kind||"SECURITY",
    assignee:o.assignee||"Unassigned", opened:d, updated:d, sel:false,
    evidence:o.evidence||null, rca:o.rca||null, notes:[],
    timeline:[{t:nowClock(d), m:(o.kind==="NETWORK"?"Network incident opened · detected by NOC monitoring":"Incident created · auto-detected by correlation engine")}]
  };
  S.incidents.unshift(inc);
  if (typeof pushTimeline==="function") pushTimeline(inc.sev, "Incident "+inc.id+" created — "+inc.title, inc.kind);
  if (typeof pushNotif==="function"&&!silent) pushNotif("INCIDENT", inc.sev, "New incident "+inc.id, inc.title, "incidents");
  if (!silent){ emit("incident", inc); emit("metrics"); }
  return inc;
}
function incTimeline(inc, msg){ inc.timeline.unshift({t:nowClock(), m:msg}); }
function openIncidentsCount(){ return S.incidents.filter(function(i){ return i.status!=="MITIGATED"&&i.status!=="CLOSED"; }).length; }
function criticalCount(){ return S.events.filter(function(e){ return e.sev==="CRITICAL" && (Date.now()-e.t.getTime()<1000*60*15); }).length; }
function activeAttacks(){ return S.attacks.filter(function(a){ return a.until>Date.now(); }).length; }

/* ---------- MITRE highlight ---------- */
function hitMitre(tid){
  var m = S.mitre.find(function(x){ return x.id===tid; });
  if (m){ m.count++; m.hotUntil = Date.now()+9000; emit("mitre", m); }
}

/* ---------- THREAT MAP attack ---------- */
function addMapAttack(sev, srcCity, label){
  var src = srcCity || pick(GEO.cities);
  var dst = pick(GEO.dc);
  var a = { id:S.seq++, sev:sev, src:src, dst:dst, t:new Date(), until:Date.now()+ (sev==="CRITICAL"?16000:11000), label:label };
  S.attacks.unshift(a);
  if (S.attacks.length>40) S.attacks.pop();
  emit("mapattack", a);
  return a;
}

/* =====================================================================
   SECURITY SCORE
   ===================================================================== */
function computeScore(){
  var openInc = openIncidentsCount();
  var crit = criticalCount();
  var act = activeAttacks();
  var penalty = openInc*4 + crit*6 + act*3 + Math.max(0,(S.threat-15))*0.35 + S.suspicious*0.4;
  var avail = (S.availability-99)*8; // small positive
  var blockBonus = Math.min(6, S.blockedAttacks/500);
  var raw = 100 - penalty + avail*0 + blockBonus*0.5;
  return clamp(Math.round(raw), 2, 100);
}
function scoreFactors(){
  return [
    {l:"Active threats", v:activeAttacks(), good:activeAttacks()===0},
    {l:"Open incidents", v:openIncidentsCount(), good:openIncidentsCount()<=1},
    {l:"Critical alerts (15m)", v:criticalCount(), good:criticalCount()===0},
    {l:"Blocked attacks", v:fmtNum(S.blockedAttacks), good:true},
    {l:"Availability", v:S.availability.toFixed(2)+"%", good:S.availability>99.5},
    {l:"Suspicious conns", v:S.suspicious, good:S.suspicious<10}
  ];
}

/* =====================================================================
   ATTACK ORCHESTRATION  (the centerpiece)
   ===================================================================== */
function launchAttack(typeId, opts){
  opts = opts||{};
  var A = ATTACK_TYPES[typeId];
  if (!A) return;
  S.stats.attacksSimulated++;
  var ip = opts.src || randIP();
  var devId = opts.devId || pick(A.devTypes);
  var dev = S.devices.find(function(d){ return d.id===devId; }) || S.devices.find(function(d){return d.id==="web";});
  var dst = dev ? dev.ip : "10.0.20.20";

  // 1) threat level up
  var bump = A.sev==="CRITICAL"?26 : A.sev==="HIGH"?17 : 10;
  S.threat = clamp(S.threat + bump + rnd(-2,3), 0, 100);
  S.suspicious += ri(2,6);

  // 2) IDS/IPS detection → SIEM alert(s)  (attack observed → rule fires → event)
  var ids = idsForMitre(A.mitre);
  if (typeof pushTimeline==="function") pushTimeline(A.sev, "IDS "+ids.id+" ("+ids.nm+") triggered · src="+ip, "SECURITY");
  addLog("SEC", "ids: "+ids.id+" "+ids.action+" — "+ids.nm+" src="+ip);
  var m = A.msg(ip);
  addEvent(A.sev, m.b, m.x, "SEC");
  S._lastDetections = S._lastDetections || [];
  S._lastDetections.unshift({ t:simNow(), rule:ids, src:ip, mitre:A.mitre }); if(S._lastDetections.length>60) S._lastDetections.pop();

  // 3) log lines (staggered)
  var lines = A.log(ip, dst);
  lines.forEach(function(ln,i){ setTimeout(function(){ addLog(ln[0], ln[1]); }, i*260); });

  // 4) firewall reaction — flows from the attacker, decided by the rule engine
  var drops=0;
  for (var f=0; f<ri(3,7); f++){
    (function(){ var flow=buildFlow(ip, dev); if(flow.action!=="ALLOW") drops++; S.firewall.unshift(flow); if(S.firewall.length>200) S.firewall.pop(); setTimeout(function(){ emit("firewall", flow); }, f*170); })();
  }
  if (typeof pushTimeline==="function") pushTimeline(A.sev, "Firewall blocked "+drops+" flow(s) from "+ip+" → "+(dev?dev.nm:dst), "SECURITY");

  // 5) device status
  if (dev){
    dev._prev = dev.st;
    dev.st = "ATTACK";
    recomputeDevices();
    emit("device", dev);
    // auto de-escalate to WARNING then ONLINE unless isolated
    var holdBase = A.sev==="CRITICAL"?15000:10000;
    dev._recoverT = setTimeout(function(){
      if (dev.st==="ATTACK"){ dev.st="WARNING"; emit("device", dev);
        setTimeout(function(){ if(dev.st==="WARNING"){ dev.st="ONLINE"; recomputeDevices(); emit("device", dev); } }, 6000);
      }
    }, holdBase);
  }

  // 6) threat map
  addMapAttack(A.sev, opts.city, A.name);

  // 7) MITRE highlight
  hitMitre(A.mitre);

  // 8) incident
  var inc = createIncident({
    title:A.name+" against "+(dev?dev.nm:"asset"),
    sev:A.sev, src:ip, target:(dev?dev.nm:"—"), mitre:A.mitre,
    status:"INVESTIGATING", devId:devId
  });

  // 9) blocked counter climbs
  S.blockedAttacks += ri(3,14);

  // propagate to health scores + timeline + notification
  var prevScore = S.score;
  if (typeof recomputeHealth==="function") recomputeHealth();
  if (typeof pushTimeline==="function"){
    pushTimeline(A.sev, "Device "+(dev?dev.nm:"asset")+" → UNDER ATTACK · MITRE "+A.mitre+" active", "SECURITY");
    pushTimeline(A.sev, "Incident "+inc.id+" opened · security score "+prevScore+" → "+S.score, "SECURITY");
  }
  if (typeof pushNotif==="function") pushNotif("SECURITY", A.sev, "Attack detected: "+A.name, m.b+" · "+m.x, "incidents");

  // toast
  toast(A.sev, "Attack detected: "+A.name, m.b+" · "+m.x, A.icon);
  beep(A.sev);

  emit("metrics"); emit("score");
  emit("attackLaunched", {type:A, inc:inc, dev:dev, ip:ip});
  return inc;
}

/* =====================================================================
   TICK LOOP  — makes everything feel alive
   ===================================================================== */
var tickN = 0;
function tick(){
  tickN++;
  // threat decays toward baseline
  var base = S.redTeam? 22 : 12;
  if (S.threat > base) S.threat = Math.max(base, S.threat - rnd(.6,1.8));
  else S.threat = clamp(S.threat + rnd(-.6,.6), 6, 100);
  // suspicious drifts down
  if (S.suspicious>4 && chance(.4)) S.suspicious=Math.max(3,S.suspicious-1);
  // availability jitter
  S.availability = clamp(S.availability + rnd(-.01,.008), 99.2, 100);
  if (activeAttacks()>0 && chance(.3)) S.availability = clamp(S.availability-rnd(.01,.05),98.5,100);
  // blocked attacks slowly climb (background noise)
  if (chance(.6)) S.blockedAttacks += ri(0,3);

  // ambient events
  if (chance(.28)){
    var amb = pick([
      ["LOW","New device connected","dhcp "+randIntIP(),"SYS"],
      ["LOW","DNS query resolved","darty.local","NET"],
      ["LOW","VPN session established","10.0.41."+ri(2,40),"NET"],
      ["MEDIUM","Outbound to flagged IP throttled","dst="+randIP(),"SEC"],
      ["LOW","Firewall rule sync completed","1,204 rules","SYS"],
      ["MEDIUM","Port scan detected","src="+randIP(),"NET"],
      ["LOW","Endpoint EDR heartbeat","64/64 online","SYS"]
    ]);
    addEvent(amb[0],amb[1],amb[2],amb[3]);
  }
  // ambient logs
  if (chance(.7)) addLog(pick(["AUTH","NET","SYS","FW","SEC"]), ambientLog());
  // ambient firewall
  if (chance(.85)) addFirewall();
  // occasional autonomous minor attack when idle (frequency from settings)
  var freq = (S.settings&&S.settings.threatFreq)||"normal";
  var atkChance = freq==="high"?0.14 : freq==="low"?0.02 : 0.05;
  if (S.threat<22 && S.settings && S.settings.autoIncident!==false && chance(atkChance)) launchAttack(pick(["portscan","login","phishing","malware"]), {});
  // rare autonomous NETWORK infrastructure incident (distinct from cyber)
  if (typeof triggerNetIncident==="function" && chance(freq==="high"?0.035:0.015) && S.wan && S.wan[0].status==="ONLINE"){
    triggerNetIncident(pick(["loss","latency","dhcp","dns","ap","overload"]));
  }
  // decay network conditions toward baseline
  if (S.packetLoss>0.2) S.packetLoss=Math.max(0.2, S.packetLoss-rnd(.4,1.6));
  if (S.latency>6) S.latency=Math.max(6, S.latency-rnd(3,12));

  // servers
  S.servers.forEach(function(s){
    var load = activeAttacks()>0 ? rnd(0,10) : 0;
    s.cpu = clamp(s.cpu + rnd(-5,5) + load, 6, 97);
    s.ram = clamp(s.ram + rnd(-2,2.4), 20, 94);
    s.disk = clamp(s.disk + rnd(-.3,.35), 15, 95);
    s.net = clamp(s.net + rnd(-8,8) + load, 3, 98);
    s.hist.push(s.cpu); if (s.hist.length>40) s.hist.shift();
  });

  // history buffers
  S.threatHistory.push(S.threat); if (S.threatHistory.length>40) S.threatHistory.shift();
  var tr = 2.6 + Math.sin(tickN/9)*0.7 + rnd(-.4,.6) + activeAttacks()*rnd(.3,1.2);
  S.trafficHistory.push(clamp(tr,1.2,9)); if (S.trafficHistory.length>40) S.trafficHistory.shift();
  if (typeof recomputeHealth==="function") recomputeHealth(); else S.score=computeScore();
  S.scoreHistory.push(S.score); if (S.scoreHistory.length>40) S.scoreHistory.shift();
  if (!S.netHealthHistory) S.netHealthHistory=[]; S.netHealthHistory.push(S.health?S.health.net.v:99); if(S.netHealthHistory.length>40) S.netHealthHistory.shift();

  if (tickN%6===0 && typeof saveState==="function") saveState();

  emit("tick");
  emit("metrics");
  emit("score");
}

/* =====================================================================
   SOUND (WebAudio, only when enabled)
   ===================================================================== */
var actx = null;
function beep(sev){
  if (!S.soundOn) return;
  try{
    if (!actx) actx = new (window.AudioContext||window.webkitAudioContext)();
    var freq = sev==="CRITICAL"?880 : sev==="HIGH"?660 : sev==="MEDIUM"?520 : 420;
    var o = actx.createOscillator(), g = actx.createGain();
    o.type="sine"; o.frequency.value=freq;
    g.gain.value=0.0001; o.connect(g); g.connect(actx.destination);
    var t = actx.currentTime;
    g.gain.exponentialRampToValueAtTime(0.09, t+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t+0.32);
    o.start(t); o.stop(t+0.34);
    if (sev==="CRITICAL"){ var o2=actx.createOscillator(),g2=actx.createGain(); o2.type="sine";o2.frequency.value=freq*1.5;g2.gain.value=0.0001;o2.connect(g2);g2.connect(actx.destination);g2.gain.exponentialRampToValueAtTime(0.06,t+0.16);g2.gain.exponentialRampToValueAtTime(0.0001,t+0.42);o2.start(t+0.14);o2.stop(t+0.44); }
  }catch(e){}
}

/* =====================================================================
   TOASTS
   ===================================================================== */
function toast(sev, title, msg, ic){
  var host = qs("#toasts");
  var t = el("div",{class:"toast",dataset:{sev:sev}},[
    el("div",{class:"tic",html:iconHTML(ic||"alert-triangle")}),
    el("div",{class:"tbody"},[
      el("div",{class:"ttl"},[ el("span",{class:"chip "+sevClass(sev),text:sev}), title ]),
      el("div",{class:"tmsg",text:msg})
    ]),
    el("button",{class:"tx","aria-label":"Dismiss",html:iconHTML("x"),onclick:function(){ dismiss(t); }})
  ]);
  host.appendChild(t);
  var to = setTimeout(function(){ dismiss(t); }, sev==="CRITICAL"?8000:5500);
  function dismiss(node){ clearTimeout(to); node.classList.add("out"); setTimeout(function(){ node.remove(); },350); }
  // cap
  while (host.children.length>4) host.firstChild.remove();
}
function sevClass(sev){ return {CRITICAL:"crit",HIGH:"high",MEDIUM:"med",LOW:"low",INFO:"acc"}[sev]||"acc"; }
function sevColorVar(sev){ return {CRITICAL:"--crit",HIGH:"--high",MEDIUM:"--med",LOW:"--low"}[sev]||"--acc"; }
/* =====================================================================
   CHART PRIMITIVES (custom SVG)
   ===================================================================== */
function sparkline(data, opts){
  opts = opts||{};
  var w = opts.w||74, h = opts.h||26, pad=2;
  var min = Math.min.apply(null,data), max = Math.max.apply(null,data);
  var rng = (max-min)||1;
  var stepX = (w-pad*2)/(data.length-1);
  var pts = data.map(function(v,i){ return [pad+i*stepX, h-pad-((v-min)/rng)*(h-pad*2)]; });
  var d = pts.map(function(p,i){ return (i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1); }).join(" ");
  var area = d+" L"+pts[pts.length-1][0].toFixed(1)+" "+h+" L"+pts[0][0].toFixed(1)+" "+h+" Z";
  var color = opts.color||"var(--acc)";
  var uid = "sg"+(chartId++);
  var svg = sel("svg",{viewBox:"0 0 "+w+" "+h,class:opts.class||"spark",preserveAspectRatio:"none"});
  var defs = sel("defs"); var grad = sel("linearGradient",{id:uid,x1:0,y1:0,x2:0,y2:1});
  grad.appendChild(sel("stop",{offset:"0%","stop-color":color,"stop-opacity":.32}));
  grad.appendChild(sel("stop",{offset:"100%","stop-color":color,"stop-opacity":0}));
  defs.appendChild(grad); svg.appendChild(defs);
  svg.appendChild(sel("path",{d:area,fill:"url(#"+uid+")",stroke:"none"}));
  svg.appendChild(sel("path",{d:d,fill:"none",stroke:color,"stroke-width":opts.sw||1.5,"stroke-linejoin":"round","stroke-linecap":"round","vector-effect":"non-scaling-stroke"}));
  if (opts.dot!==false){ var last=pts[pts.length-1]; svg.appendChild(sel("circle",{cx:last[0],cy:last[1],r:opts.dr||1.8,fill:color})); }
  return svg;
}
var chartId = 0;

function areaChart(data, opts){
  opts = opts||{};
  var w = 100, h = opts.h||46;
  var min = opts.min!=null?opts.min:Math.min.apply(null,data);
  var max = opts.max!=null?opts.max:Math.max.apply(null,data);
  var rng = (max-min)||1;
  var stepX = w/(data.length-1);
  var pts = data.map(function(v,i){ return [i*stepX, h-((v-min)/rng)*(h-4)-2]; });
  var d = pts.map(function(p,i){ return (i?"L":"M")+p[0].toFixed(2)+" "+p[1].toFixed(2); }).join(" ");
  var area = d+" L"+w+" "+h+" L0 "+h+" Z";
  var color = opts.color||"var(--acc)";
  var uid="ag"+(chartId++);
  var svg = sel("svg",{viewBox:"0 0 "+w+" "+h,preserveAspectRatio:"none",style:"width:100%;height:"+(opts.px||h)+"px;display:block"});
  var defs=sel("defs"),grad=sel("linearGradient",{id:uid,x1:0,y1:0,x2:0,y2:1});
  grad.appendChild(sel("stop",{offset:"0%","stop-color":color,"stop-opacity":.34}));
  grad.appendChild(sel("stop",{offset:"100%","stop-color":color,"stop-opacity":.02}));
  defs.appendChild(grad); svg.appendChild(defs);
  if (opts.grid) for (var g=1;g<3;g++){ svg.appendChild(sel("line",{x1:0,y1:h*g/3,x2:w,y2:h*g/3,stroke:"rgba(130,160,210,.08)","stroke-width":.5,"vector-effect":"non-scaling-stroke"})); }
  svg.appendChild(sel("path",{d:area,fill:"url(#"+uid+")"}));
  svg.appendChild(sel("path",{d:d,fill:"none",stroke:color,"stroke-width":opts.sw||1.6,"stroke-linejoin":"round","vector-effect":"non-scaling-stroke"}));
  return svg;
}

function donut(segments, opts){
  opts = opts||{};
  var size = opts.size||150, r=size/2-14, cx=size/2, cy=size/2, C=2*Math.PI*r;
  var total = segments.reduce(function(a,s){return a+s.v;},0)||1;
  var svg = sel("svg",{viewBox:"0 0 "+size+" "+size,style:"width:100%;max-width:"+size+"px;height:auto;display:block;margin:0 auto"});
  var g = sel("g",{transform:"rotate(-90 "+cx+" "+cy+")"});
  svg.appendChild(sel("circle",{cx:cx,cy:cy,r:r,fill:"none",stroke:"rgba(255,255,255,.05)","stroke-width":opts.sw||16}));
  var off=0;
  segments.forEach(function(s){
    var frac=s.v/total, len=frac*C;
    if (s.v>0){
      var c=sel("circle",{cx:cx,cy:cy,r:r,fill:"none",stroke:s.c,"stroke-width":opts.sw||16,"stroke-dasharray":len.toFixed(2)+" "+(C-len).toFixed(2),"stroke-dashoffset":(-off).toFixed(2),"stroke-linecap":"butt"});
      g.appendChild(c);
    }
    off+=len;
  });
  svg.appendChild(g);
  return svg;
}

function barsChart(items, opts){
  opts=opts||{};
  var max = Math.max.apply(null, items.map(function(i){return i.v;}))||1;
  var wrap = el("div",{class:"stack",style:{gap:"9px"}});
  items.forEach(function(it){
    wrap.appendChild(el("div",{},[
      el("div",{class:"flex items-center",style:{justifyContent:"space-between",marginBottom:"4px"}},[
        el("span",{class:"small",style:{color:"var(--txt-2)"},text:it.l}),
        el("span",{class:"mono-num small",style:{color:it.c||"var(--txt)",fontWeight:"600"},text:it.v})
      ]),
      el("div",{class:"gbar",style:{height:"6px",borderRadius:"99px",background:"rgba(255,255,255,.06)",overflow:"hidden"}},
        el("i",{style:{display:"block",height:"100%",width:(it.v/max*100)+"%",background:it.c||"var(--acc)",borderRadius:"99px",transition:"width .6s var(--ease)"}}))
    ]));
  });
  return wrap;
}

/* =====================================================================
   SHARED PANEL BUILDERS
   ===================================================================== */
function panel(title, opts, body){
  opts = opts||{};
  var head = el("div",{class:"panel-h"},[
    el("h3",{},[ opts.icon?el("span",{html:iconHTML(opts.icon)}):null, title ]),
    opts.sub?el("span",{class:"sub",text:opts.sub}):null,
    el("span",{class:"sp"}),
    opts.right||null
  ]);
  var b = el("div",{class:"panel-b"+(opts.flush?" flush":"")});
  if (opts.bstyle) Object.assign(b.style, opts.bstyle);
  if (body) append(b, body);
  return el("div",{class:"panel"+(opts.class?" "+opts.class:""),id:opts.id||null},[head,b]);
}

function metricCard(cfg){
  // cfg: {key,label,icon,color(rgb string),value,unit,fmt,spark,bar,deltaKind}
  var card = el("div",{class:"metric",dataset:{key:cfg.key},style:{"--mc-rgb":cfg.color||"var(--acc-rgb)"}});
  var valEl = el("span",{class:"mval"});
  var deltaEl = el("span",{class:"mdelta flat"});
  var sparkHost = el("span",{class:"spark"});
  var barHost = cfg.bar? el("div",{class:"mbar"}, el("i")) : null;
  card.appendChild(el("div",{class:"mtop"},[
    el("span",{class:"mlabel",text:cfg.label}),
    el("span",{class:"mic",html:iconHTML(cfg.icon)})
  ]));
  card.appendChild(valEl);
  card.appendChild(el("div",{class:"mfoot"},[ deltaEl, sparkHost ]));
  if (barHost) card.appendChild(barHost);
  card._val=valEl; card._delta=deltaEl; card._spark=sparkHost; card._bar=barHost; card._cfg=cfg; card._last=null;
  updateMetric(card);
  return card;
}
function updateMetric(card){
  var cfg = card._cfg;
  var d = cfg.get();
  var display = cfg.fmt? cfg.fmt(d.v) : fmtNum(d.v);
  card._val.innerHTML = display + (cfg.unit?'<span class="u">'+cfg.unit+'</span>':"");
  if (cfg.color2) card._val.style.color = d.color||"";
  // delta
  if (card._last!=null){
    var diff = d.v - card._last;
    var dv = card._delta;
    dv.className = "mdelta "+(diff>0.001?(cfg.upBad?"up":"down"):diff<-0.001?(cfg.upBad?"down":"up"):"flat");
    if (cfg.upBad){ dv.className = "mdelta "+(diff>0.001?"up":diff<-0.001?"down":"flat"); }
    var ico = diff>0.001?"arrow-up":diff<-0.001?"arrow-down":"minus";
    dv.innerHTML = iconHTML(ico)+"<span>"+(cfg.deltaFmt?cfg.deltaFmt(diff):(Math.abs(diff)<0.01?"stable":(diff>0?"+":"")+ (cfg.deltaInt!==false?Math.round(diff):diff.toFixed(1))))+"</span>";
    if (Math.abs(diff)>0.001 && cfg.flash){ card.classList.remove("flash"); void card.offsetWidth; card.classList.add("flash"); }
  } else {
    card._delta.innerHTML = iconHTML("minus")+"<span>"+(cfg.baseline||"baseline")+"</span>";
  }
  card._last = d.v;
  // spark
  if (cfg.spark){ clear(card._spark); card._spark.appendChild(sparkline(cfg.spark(), {color:d.sparkColor||"rgb("+(cfg.color||"var(--acc-rgb)")+")"})); }
  // bar
  if (card._bar){ card._bar.firstChild.style.width = clamp(d.pct!=null?d.pct:d.v,0,100)+"%"; if(d.barColor) card._bar.firstChild.style.background=d.barColor; }
}

/* status LED helper */
function ledFor(st){ return {ONLINE:"",WARNING:" warn",ATTACK:" crit",OFFLINE:" off"}[st]||""; }

/* =====================================================================
   VIEW REGISTRY
   ===================================================================== */
var VIEWS = {}; // id -> {title,sub,icon,build(main)}
function registerView(id, cfg){ VIEWS[id]=cfg; }
var activeBindings = []; // {evt,fn} for current view — cleared on switch
function bind(evt, fn){ var h=on(evt,fn); activeBindings.push({evt:evt,fn:h}); return fn; }
function clearBindings(){
  activeBindings.forEach(function(b){ var arr=listeners[b.evt]; if(arr){ var i=arr.indexOf(b.fn); if(i>-1) arr.splice(i,1); } });
  activeBindings = [];
}

function renderView(id){
  clearBindings();
  S.view = id;
  var main = qs("#main");
  clear(main);
  var cfg = VIEWS[id];
  var v = el("div",{class:"view"});
  var head = el("div",{class:"view-head"},[
    el("div",{class:"vt"},[
      el("div",{class:"vic",html:iconHTML(cfg.icon)}),
      el("div",{},[ el("h1",{text:cfg.title}), el("div",{class:"vs",text:cfg.sub}) ])
    ]),
    cfg.actions? cfg.actions() : null
  ]);
  v.appendChild(head);
  cfg.build(v);
  main.appendChild(v);
  main.scrollTop = 0;
  // update sidebar active
  qsa(".nav-item").forEach(function(n){ n.classList.toggle("active", n.dataset.view===id); });
  emit("viewchange", id);
}

/* =====================================================================
   OVERVIEW VIEW
   ===================================================================== */
registerView("overview", {
  title:"Command Overview", sub:"Real-time security posture · all systems", icon:"gauge",
  build:function(v){
    // metric cards
    var metricsWrap = el("div",{class:"metrics"});
    var defs = metricDefs();
    var cards = defs.map(function(d){ return metricCard(d); });
    cards.forEach(function(c){ metricsWrap.appendChild(c); });
    v.appendChild(metricsWrap);
    bind("metrics", function(){ cards.forEach(updateMetric); });

    // three separate health scores (security / network / infrastructure)
    if (typeof healthCards==="function"){
      var healthWrap = el("div",{style:{marginTop:"14px"}}, healthCards());
      v.appendChild(healthWrap);
      bind("tick", function(){ if(tickN%2===0 && healthWrap.firstChild){ healthWrap.firstChild.replaceWith(healthCards()); } });
    }

    var dash = el("div",{class:"dash",style:{marginTop:"14px"}});

    /* threat map (mini) */
    var mapHost = el("div",{class:"span-8"});
    var mapPanel = panel("Live Threat Map", {icon:"radar", sub:"global attack telemetry", flush:true,
      right: el("button",{class:"btn xs ghost",onclick:function(){ go("threatmap"); }},[ "Expand", el("span",{html:iconHTML("maximize")}) ])
    });
    var mapEl = buildThreatMap();
    qs(".panel-b", mapPanel).appendChild(mapEl.node);
    mapHost.appendChild(mapPanel);
    dash.appendChild(mapHost);

    /* security score */
    var scoreHost = el("div",{class:"span-4"});
    scoreHost.appendChild(buildScorePanel());
    dash.appendChild(scoreHost);

    /* threat trend */
    var trendHost = el("div",{class:"span-8"});
    var trendBody = el("div");
    var trendPanel = panel("Threat Level Trend", {icon:"activity", sub:"last 40 intervals",
      right: el("span",{class:"chip",id:"ovThreatChip"})
    }, trendBody);
    trendHost.appendChild(trendPanel);
    dash.appendChild(trendHost);
    function drawTrend(){
      clear(trendBody);
      trendBody.appendChild(areaChart(S.threatHistory.slice(), {px:120, min:0, max:100, grid:true, color:"rgb("+({crit:'var(--crit-rgb)'})+")"}));
      var lbl = threatLabel(S.threat);
      trendBody.lastChild && trendBody.firstChild;
      var chip = qs("#ovThreatChip");
      if (chip){ chip.className="chip "+lbl.c; chip.textContent = Math.round(S.threat)+" · "+lbl.t; }
      // recolor line by level
      var col = lbl.c==="crit"?"var(--crit)":lbl.c==="high"?"var(--high)":lbl.c==="med"?"var(--med)":lbl.c==="low"?"var(--low)":"var(--ok)";
      clear(trendBody); trendBody.appendChild(areaChart(S.threatHistory.slice(), {px:120,min:0,max:100,grid:true,color:col}));
    }
    drawTrend();
    bind("tick", drawTrend);

    /* attack distribution donut */
    var distHost = el("div",{class:"span-4"});
    var distBody = el("div");
    distHost.appendChild(panel("Alerts by Severity", {icon:"alert-triangle"}, distBody));
    dash.appendChild(distHost);
    function drawDist(){
      clear(distBody);
      var counts = {CRITICAL:0,HIGH:0,MEDIUM:0,LOW:0};
      S.events.slice(0,80).forEach(function(e){ counts[e.sev]=(counts[e.sev]||0)+1; });
      var segs=[{v:counts.CRITICAL,c:"var(--crit)"},{v:counts.HIGH,c:"var(--high)"},{v:counts.MEDIUM,c:"var(--med)"},{v:counts.LOW,c:"var(--low)"}];
      var d = donut(segs,{size:140});
      var wrap = el("div",{style:{position:"relative"}}, d);
      wrap.appendChild(el("div",{style:{position:"absolute",inset:"0",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}},[
        el("b",{class:"mono-num",style:{fontSize:"22px"},text:S.events.length}),
        el("span",{class:"mono",style:{fontSize:"8.5px",letterSpacing:".14em",color:"var(--txt-3)",textTransform:"uppercase"},text:"events"})
      ]));
      distBody.appendChild(wrap);
      var leg = el("div",{class:"stack",style:{gap:"6px",marginTop:"12px"}});
      [["CRITICAL","var(--crit)",counts.CRITICAL],["HIGH","var(--high)",counts.HIGH],["MEDIUM","var(--med)",counts.MEDIUM],["LOW","var(--low)",counts.LOW]].forEach(function(r){
        leg.appendChild(el("div",{class:"flex items-center",style:{gap:"9px",fontSize:"11.5px"}},[
          el("i",{style:{width:"8px",height:"8px",borderRadius:"2px",background:r[1]}}),
          el("span",{style:{flex:"1",color:"var(--txt-2)"},text:r[0]}),
          el("span",{class:"mono-num",style:{fontWeight:"600",color:r[1]},text:r[2]})
        ]));
      });
      distBody.appendChild(leg);
    }
    drawDist();
    bind("event", drawDist);

    /* recent events */
    var evHost = el("div",{class:"span-8"});
    var streamBody = el("div",{class:"stream",style:{"--stream-h":"340px",overflow:"auto",maxHeight:"340px"}});
    evHost.appendChild(panel("Security Event Stream", {icon:"list-checks", sub:"SIEM · live",
      right: el("button",{class:"btn xs ghost",onclick:function(){ go("events"); }},"View all")
    }, streamBody));
    dash.appendChild(evHost);
    renderStreamInto(streamBody, function(){ return S.events.slice(0,18); });
    bind("event", function(ev){ prependEvent(streamBody, ev, 18); });

    /* quick server health */
    var srvHost = el("div",{class:"span-4"});
    var srvBody = el("div",{class:"stack"});
    srvHost.appendChild(panel("Server Health", {icon:"server",
      right: el("button",{class:"btn xs ghost",onclick:function(){ go("servers"); }},"Details")
    }, srvBody));
    dash.appendChild(srvHost);
    function drawSrv(){
      clear(srvBody);
      S.servers.forEach(function(s){
        var col = s.cpu>85?"var(--crit)":s.cpu>65?"var(--warn)":"var(--acc)";
        srvBody.appendChild(el("div",{},[
          el("div",{class:"flex items-center",style:{justifyContent:"space-between",marginBottom:"5px"}},[
            el("span",{class:"small",style:{fontWeight:"500"},text:s.nm.replace(" Server","")}),
            el("span",{class:"mono-num tny",style:{color:col,fontWeight:"600"},text:"CPU "+Math.round(s.cpu)+"%"})
          ]),
          el("div",{class:"gbar",style:{height:"5px",borderRadius:"99px",background:"rgba(255,255,255,.06)",overflow:"hidden"}},
            el("i",{style:{display:"block",height:"100%",width:s.cpu+"%",background:col,borderRadius:"99px",transition:"width .5s var(--ease)"}}))
        ]));
      });
    }
    drawSrv();
    bind("tick", drawSrv);

    v.appendChild(dash);

    // keep mini-map fed
    bind("mapattack", function(a){ mapEl.addAttack(a); });
    bind("tick", function(){ mapEl.tickPulses(); });
    bind("score", function(){ updateScorePanel(); });
  }
});

function metricDefs(){
  return [
    { key:"threat", label:"Threat Level", icon:"alert-octagon", color:"var(--crit-rgb)", color2:true, upBad:true, flash:true, bar:true,
      get:function(){ var l=threatLabel(S.threat); var col=l.c==="crit"?"var(--crit)":l.c==="high"?"var(--high)":l.c==="med"?"var(--med)":l.c==="low"?"var(--low)":"var(--ok)"; return {v:Math.round(S.threat),color:col,pct:S.threat,barColor:col,sparkColor:col}; },
      fmt:function(v){ return v+'<span class="u">'+threatLabel(v).t+'</span>'; }, unit:"", spark:function(){return S.threatHistory.slice(-16);}, baseline:"nominal" },
    { key:"incidents", label:"Active Incidents", icon:"alert-triangle", color:"var(--high-rgb)", upBad:true, flash:true,
      get:function(){ return {v:openIncidentsCount()}; }, spark:function(){ return S.threatHistory.slice(-16).map(function(x){return x/10;}); }, baseline:"tracked" },
    { key:"critical", label:"Critical Alerts", icon:"shield-alert", color:"var(--crit-rgb)", upBad:true, flash:true,
      get:function(){ return {v:criticalCount()}; }, spark:function(){ return S.threatHistory.slice(-16).map(function(x){return x/12;}); }, baseline:"15m window" },
    { key:"suspicious", label:"Suspicious Conns", icon:"crosshair", color:"var(--med-rgb)", upBad:true,
      get:function(){ return {v:S.suspicious}; }, spark:function(){ return S.trafficHistory.slice(-16); }, baseline:"monitored" },
    { key:"blocked", label:"Blocked Attacks", icon:"shield-check", color:"var(--ok-rgb)", upBad:false,
      get:function(){ return {v:S.blockedAttacks}; }, spark:function(){ return S.threatHistory.slice(-16); }, deltaFmt:function(d){ return d>0?"+"+Math.round(d)+" blocked":"stable"; }, baseline:"cumulative" },
    { key:"devices", label:"Devices Online", icon:"network", color:"var(--acc-rgb)", upBad:false, bar:true,
      get:function(){ return {v:S.devicesOnline, pct:S.devicesOnline/S.devicesTotal*100}; }, fmt:function(v){ return v+'<span class="u">/ '+S.devicesTotal+'</span>'; }, spark:function(){return S.trafficHistory.slice(-16);}, baseline:"enrolled" },
    { key:"avail", label:"Network Availability", icon:"activity", color:"var(--ok-rgb)", upBad:false, bar:true,
      get:function(){ return {v:S.availability, pct:S.availability, barColor:S.availability>99.5?"var(--ok)":"var(--warn)"}; }, fmt:function(v){ return v.toFixed(2); }, unit:"%", deltaInt:false, spark:function(){return S.trafficHistory.slice(-16);}, baseline:"SLA 99.9%" },
    { key:"score", label:"Security Score", icon:"shield", color:"var(--acc-rgb)", color2:true, upBad:false, bar:true, flash:true,
      get:function(){ var col=S.score>=80?"var(--ok)":S.score>=55?"var(--warn)":"var(--crit)"; return {v:S.score,color:col,pct:S.score,barColor:col,sparkColor:col}; }, fmt:function(v){ return v+'<span class="u">/100</span>'; }, spark:function(){return S.scoreHistory.slice(-16);}, baseline:"computed" }
  ];
}

/* =========== EVENT STREAM helpers =========== */
function eventRow(ev){
  return el("div",{class:"evt",dataset:{sev:ev.sev}},[
    el("span",{class:"etime mono",text:nowClock(ev.t)}),
    el("span",{class:"esev",text:ev.sev}),
    el("span",{class:"emsg",html:"<b>"+esc(ev.b)+"</b>"}),
    el("span",{class:"esrc",text:ev.x})
  ]);
}
function renderStreamInto(host, getList){
  clear(host);
  getList().forEach(function(ev){ host.appendChild(eventRow(ev)); });
}
function prependEvent(host, ev, cap){
  if (S.eventFilter && S.eventFilter!=="ALL" && ev.sev!==S.eventFilter) return;
  host.insertBefore(eventRow(ev), host.firstChild);
  while (host.children.length>(cap||120)) host.lastChild.remove();
}

/* =========== SECURITY SCORE panel =========== */
var scorePanelRefs = null;
function buildScorePanel(){
  var ringHost = el("div",{class:"score-ring"});
  var factorsHost = el("div",{class:"score-factors"});
  var chip = el("span",{class:"chip"});
  var p = panel("Security Score", {icon:"shield-check", right:chip}, [
    ringHost, el("div",{class:"hr"}), factorsHost
  ]);
  scorePanelRefs = {ring:ringHost, factors:factorsHost, chip:chip};
  updateScorePanel();
  return p;
}
function updateScorePanel(){
  if (!scorePanelRefs) return;
  var sc = S.score, r=88, C=2*Math.PI*r;
  var col = sc>=80?"var(--ok)":sc>=55?"var(--warn)":"var(--crit)";
  clear(scorePanelRefs.ring);
  var svg = sel("svg",{viewBox:"0 0 200 200"});
  svg.appendChild(sel("circle",{class:"track",cx:100,cy:100,r:r}));
  var prog = sel("circle",{class:"prog",cx:100,cy:100,r:r,stroke:col,"stroke-dasharray":C,"stroke-dashoffset":C*(1-sc/100)});
  svg.appendChild(prog);
  scorePanelRefs.ring.appendChild(svg);
  scorePanelRefs.ring.appendChild(el("div",{class:"score-mid"},[
    el("b",{style:{color:col},text:sc}),
    el("span",{text: sc>=80?"SECURE":sc>=55?"DEGRADED":"AT RISK"})
  ]));
  scorePanelRefs.chip.className="chip "+(sc>=80?"ok":sc>=55?"warn":"crit");
  scorePanelRefs.chip.textContent = sc>=80?"HEALTHY":sc>=55?"WATCH":"CRITICAL";
  clear(scorePanelRefs.factors);
  scoreFactors().forEach(function(f){
    scorePanelRefs.factors.appendChild(el("div",{class:"sf"},[
      el("i",{class:"sfd",style:{background:f.good?"var(--ok)":"var(--warn)",boxShadow:"0 0 6px "+(f.good?"var(--ok)":"var(--warn)")}}),
      el("span",{class:"sfl",text:f.l}),
      el("span",{class:"sfv",style:{color:f.good?"var(--txt)":"var(--warn)"},text:f.v})
    ]));
  });
}
/* =====================================================================
   THREAT MAP
   ===================================================================== */
var MAPW = 1000, MAPH = 500;
function lonlat(p){ return { x:(p.lon+180)/360*MAPW, y:(90-p.lat)/180*MAPH }; }
var CONTINENTS = [ // rough ellipses [cx,cy,rx,ry] approximating landmasses
  [200,150,88,66],   // N. America
  [155,205,40,34],   // Central America
  [320,335,58,88],   // S. America
  [500,132,74,50],   // Europe
  [540,255,66,96],   // Africa
  [700,165,150,88],  // Asia
  [760,255,44,40],   // SE Asia / India tip
  [845,360,58,40],   // Australia
  [500,430,120,30]   // hint of Antarctica edge
];
function genGeoDots(){
  var dots=[];
  CONTINENTS.forEach(function(c){
    var area = c[2]*c[3]; var n = Math.round(area/150);
    for (var i=0;i<n;i++){
      var ang=rnd(0,Math.PI*2), rr=Math.sqrt(Math.random());
      var x=c[0]+Math.cos(ang)*rr*c[2], y=c[1]+Math.sin(ang)*rr*c[3];
      if (x>4&&x<MAPW-4&&y>4&&y<MAPH-4) dots.push([x,y, rr]);
    }
  });
  return dots;
}
var GEO_DOTS = null;

function buildThreatMap(){
  if (!GEO_DOTS) GEO_DOTS = genGeoDots();
  var wrap = el("div",{class:"map-wrap"});
  var svg = sel("svg",{viewBox:"0 0 "+MAPW+" "+MAPH, preserveAspectRatio:"xMidYMid slice"});

  // graticule
  var grat = sel("g");
  for (var lo=-180; lo<=180; lo+=30){ var x=(lo+180)/360*MAPW; grat.appendChild(sel("line",{class:"grat",x1:x,y1:0,x2:x,y2:MAPH})); }
  for (var la=-60; la<=60; la+=30){ var y=(90-la)/180*MAPH; grat.appendChild(sel("line",{class:"grat",x1:0,y1:y,x2:MAPW,y2:y})); }
  svg.appendChild(grat);
  // geo dots (denser near centre of each landmass → reads as terrain)
  var gd = sel("g");
  GEO_DOTS.forEach(function(d){ gd.appendChild(sel("circle",{class:"geo-dot",cx:d[0].toFixed(1),cy:d[1].toFixed(1),r:(2.3-(d[2]||0)*0.9).toFixed(2),"fill-opacity":(0.9-(d[2]||0)*0.5).toFixed(2)})); });
  svg.appendChild(gd);
  // datacenters (destinations)
  var dcG = sel("g");
  GEO.dc.forEach(function(dc){ var p=lonlat(dc);
    dcG.appendChild(sel("circle",{cx:p.x,cy:p.y,r:5,class:"map-node dest"}));
    dcG.appendChild(sel("circle",{cx:p.x,cy:p.y,r:9,fill:"none",stroke:"var(--acc-2)","stroke-width":1,opacity:.5}));
  });
  svg.appendChild(dcG);
  var arcG = sel("g"); svg.appendChild(arcG);
  var nodeG = sel("g"); svg.appendChild(nodeG);
  wrap.appendChild(svg);

  // legend + counter
  wrap.appendChild(el("div",{class:"map-legend"},[
    el("span",{},[ el("i",{style:{background:"var(--crit)"}}), "Critical" ]),
    el("span",{},[ el("i",{style:{background:"var(--high)"}}), "High" ]),
    el("span",{},[ el("i",{style:{background:"var(--med)"}}), "Medium" ]),
    el("span",{},[ el("i",{style:{background:"var(--acc-2)"}}), "Protected DC" ])
  ]));
  var statB = el("b",{text:"0"});
  wrap.appendChild(el("div",{class:"map-stat"},[ statB, el("span",{text:"active attacks"}) ]));

  var arcs = []; // {a, x1,y1,x2,y2,cx,cy, path, pulse, hit}
  var sevCol = {CRITICAL:"var(--crit)",HIGH:"var(--high)",MEDIUM:"var(--med)",LOW:"var(--acc-2)"};

  function addAttack(a){
    var s = lonlat(a.src), d = lonlat(a.dst);
    var mx=(s.x+d.x)/2, my=(s.y+d.y)/2;
    var dx=d.x-s.x, dy=d.y-s.y, dist=Math.sqrt(dx*dx+dy*dy);
    var cx = mx - dy/dist*dist*0.28, cy = my + dx/dist*dist*0.28 - dist*0.14;
    var col = sevCol[a.sev]||"var(--acc)";
    var dstr = "M"+s.x+" "+s.y+" Q"+cx+" "+cy+" "+d.x+" "+d.y;
    var path = sel("path",{class:"arc",d:dstr,stroke:col,opacity:0});
    arcG.appendChild(path);
    var src = sel("circle",{cx:s.x,cy:s.y,r:0,fill:col,class:"map-hit"});
    nodeG.appendChild(src);
    var ring = sel("circle",{cx:s.x,cy:s.y,r:3,fill:"none",stroke:col,"stroke-width":1.2,opacity:.9});
    nodeG.appendChild(ring);
    var pulse = sel("circle",{class:"arc-pulse",r:2.4,fill:"#fff",opacity:0});
    arcG.appendChild(pulse);
    var hit = sel("path",{d:dstr,stroke:"transparent","stroke-width":16,fill:"none",class:"map-hit"});
    arcG.appendChild(hit);
    hit.addEventListener("click", function(){ openAttackModal(a); });
    src.addEventListener("click", function(){ openAttackModal(a); });
    var rec = {a:a, path:path, pulse:pulse, src:src, ring:ring, hit:hit, born:performance.now(),
      s:s, d:d, cx:cx, cy:cy, col:col };
    arcs.push(rec);
  }

  function sample(rec, t){
    var mt=1-t;
    var x = mt*mt*rec.s.x + 2*mt*t*rec.cx + t*t*rec.d.x;
    var y = mt*mt*rec.s.y + 2*mt*t*rec.cy + t*t*rec.d.y;
    return [x,y];
  }

  var raf=0;
  function frame(now){
    var alive=0;
    for (var i=arcs.length-1;i>=0;i--){
      var r=arcs[i], age=(now-r.born)/1000;
      var life = r.a.until - Date.now();
      if (life<=0){ r.path.remove(); r.pulse.remove(); r.src.remove(); r.ring.remove(); r.hit.remove(); arcs.splice(i,1); continue; }
      alive++;
      // draw-in then hold
      var drawIn = clamp(age/0.7,0,1);
      r.path.setAttribute("opacity", (0.85*drawIn*Math.min(1, life/1200)).toFixed(2));
      r.src.setAttribute("r", (3.4*drawIn).toFixed(1));
      // expanding ring pulse
      var rp = (age%1.6)/1.6;
      r.ring.setAttribute("r", (3+rp*9).toFixed(1));
      r.ring.setAttribute("opacity", (0.8*(1-rp)).toFixed(2));
      // moving pulse dot after draw-in
      if (drawIn>=1){
        var t=(age%1.6)/1.6;
        var p=sample(r,t);
        r.pulse.setAttribute("cx",p[0].toFixed(1)); r.pulse.setAttribute("cy",p[1].toFixed(1));
        r.pulse.setAttribute("opacity", (0.9*(1-Math.abs(t-0.5)*0.7)).toFixed(2));
      }
    }
    statB.textContent = alive;
    statB.style.color = alive>0?"var(--crit)":"var(--txt-3)";
    if (document.contains(wrap) && !document.hidden && !reduceMotion){ raf=requestAnimationFrame(frame); }
    else raf=0;
  }
  function start(){ if(!raf && !reduceMotion) raf=requestAnimationFrame(frame); }
  // seed existing attacks
  S.attacks.filter(function(a){return a.until>Date.now();}).forEach(addAttack);
  setTimeout(start,30);

  return { node:wrap, addAttack:function(a){ addAttack(a); start(); }, tickPulses:function(){ start(); if(reduceMotion){ statB.textContent=activeAttacks(); } } };
}

function openAttackModal(a){
  var geo = a.src.n + " → " + a.dst.n;
  openModal({
    icon:"radar", iconSev:a.sev, title:a.label||"Attack", sub:a.sev+" · "+nowClock(a.t),
    rows:[
      ["Vector", a.label||"—"],
      ["Severity", a.sev],
      ["Origin", a.src.n+"  ("+a.src.lat.toFixed(1)+", "+a.src.lon.toFixed(1)+")"],
      ["Target DC", a.dst.n],
      ["Source IP", randIP()],
      ["First seen", nowClock(a.t)],
      ["Status", a.until>Date.now()?"MITIGATING":"CONTAINED"],
      ["Geo path", geo]
    ],
    foot: el("div",{class:"flex gap-2 wrap"},[
      el("button",{class:"btn danger sm",onclick:function(){ toast("INFO","Origin blocked","Null-route pushed to edge for "+a.src.n,"ban"); closeModal(); }},[el("span",{html:iconHTML("ban")}),"Block Origin"]),
      el("button",{class:"btn sm",onclick:function(){ go("incidents"); closeModal(); }},[el("span",{html:iconHTML("briefcase")}),"Open Incident"]),
      el("button",{class:"btn ghost sm",onclick:closeModal},"Close")
    ])
  });
}

/* threat map full view */
registerView("threatmap", {
  title:"Live Threat Map", sub:"Global attack origins · destination servers · active vectors", icon:"radar",
  actions:function(){ return el("button",{class:"btn sm danger",onclick:function(){ launchAttack(pick(["ddos","bruteforce","sqli","ransomware"]),{}); }},[el("span",{html:iconHTML("zap")}),"Simulate Inbound"]); },
  build:function(v){
    var map = buildThreatMap();
    var mp = panel("Global Threat Telemetry",{icon:"globe",flush:true,sub:"equirectangular · live"});
    qs(".panel-b",mp).appendChild(map.node);
    v.appendChild(mp);
    bind("mapattack", function(a){ map.addAttack(a); refreshList(); });
    bind("tick", function(){ map.tickPulses(); });

    var grid = el("div",{class:"dash",style:{marginTop:"14px"}});
    var listHost = el("div",{class:"span-6"});
    var listBody = el("div",{class:"stream",style:{maxHeight:"320px",overflow:"auto"}});
    listHost.appendChild(panel("Active Attack Log",{icon:"crosshair",sub:"click to inspect"}, listBody));
    grid.appendChild(listHost);

    var topHost = el("div",{class:"span-6"});
    var topBody = el("div");
    topHost.appendChild(panel("Top Attack Origins",{icon:"globe"}, topBody));
    grid.appendChild(topHost);
    v.appendChild(grid);

    function refreshList(){
      clear(listBody);
      var list = S.attacks.slice(0,20);
      if (!list.length){ listBody.appendChild(emptyState("radar","No active vectors. Launch a simulation.")); }
      list.forEach(function(a){
        listBody.appendChild(el("div",{class:"evt",dataset:{sev:a.sev},style:{cursor:"pointer",gridTemplateColumns:"auto auto 1fr auto"},onclick:function(){ openAttackModal(a); }},[
          el("span",{class:"etime mono",text:nowClock(a.t)}),
          el("span",{class:"esev",text:a.sev}),
          el("span",{class:"emsg",html:"<b>"+esc(a.label||"Attack")+"</b>"}),
          el("span",{class:"esrc",text:a.src.n+" → "+a.dst.n})
        ]));
      });
      // top origins
      clear(topBody);
      var counts={};
      S.attacks.forEach(function(a){ counts[a.src.n]=(counts[a.src.n]||0)+1; });
      var arr=Object.keys(counts).map(function(k){return {l:k,v:counts[k]};}).sort(function(a,b){return b.v-a.v;}).slice(0,7);
      if (!arr.length){ topBody.appendChild(emptyState("globe","Telemetry will populate as attacks arrive.")); }
      else topBody.appendChild(barsChart(arr.map(function(x){return {l:x.l,v:x.v,c:"var(--crit)"};})));
    }
    refreshList();
    bind("tick", function(){ if (tickN%3===0) refreshList(); });
  }
});

/* =====================================================================
   NETWORK TOPOLOGY VIEW
   ===================================================================== */
function deviceStatusList(st){ return {ONLINE:{c:"ok",t:"ONLINE"},WARNING:{c:"warn",t:"WARNING"},OFFLINE:{c:"off",t:"OFFLINE"},ATTACK:{c:"crit",t:"UNDER ATTACK"}}[st]; }

function buildTopology(){
  var topo = el("div",{class:"topo"});
  var svg = sel("svg",{viewBox:"0 0 100 100",preserveAspectRatio:"none"});
  var layer = el("div",{class:"node-layer"});
  var edgeEls = {};
  EDGES.forEach(function(e){
    var a=S.devices.find(function(d){return d.id===e[0];}), b=S.devices.find(function(d){return d.id===e[1];});
    var line = sel("path",{class:"edge",d:"M"+a.x+" "+a.y+" L"+b.x+" "+b.y});
    svg.appendChild(line); edgeEls[e[0]+"-"+e[1]]={line:line,a:a,b:b};
  });
  topo.appendChild(svg);
  var devEls = {};
  S.devices.forEach(function(d){
    var st = d.st==="ATTACK"?"ATTACK":d.st;
    var node = el("button",{class:"dev",dataset:{st:st,id:d.id},style:{left:d.x+"%",top:d.y+"%"},onclick:function(){ openDeviceModal(d); }},[
      el("span",{class:"dev-st"}, el("span",{class:"led"+ledFor(d.st)})),
      el("span",{class:"dev-ic",html:iconHTML(d.type)}),
      el("span",{class:"dev-nm",text:d.nm}),
      el("span",{class:"dev-ip mono",text:d.ip})
    ]);
    devEls[d.id]=node; layer.appendChild(node);
  });
  topo.appendChild(layer);

  function updateDev(d){
    var n = devEls[d.id]; if(!n) return;
    var st = d.st==="ATTACK"?"ATTACK":d.st;
    n.dataset.st = st;
    var led = qs(".led", n); if(led) led.className="led"+ledFor(d.st);
    // flow highlight edges touching an attacked device
    Object.keys(edgeEls).forEach(function(k){
      var e=edgeEls[k];
      var hot = (e.a.st==="ATTACK"||e.b.st==="ATTACK");
      e.line.classList.toggle("flow", hot);
    });
  }
  S.devices.forEach(updateDev);
  return { node:topo, update:updateDev, updateAll:function(){ S.devices.forEach(updateDev); } };
}

function openDeviceModal(d){
  var sl = deviceStatusList(d.st);
  var isAtk = d.st==="ATTACK";
  openModal({
    icon:d.type, iconSev: isAtk?"CRITICAL":(d.st==="WARNING"?"MEDIUM":"INFO"),
    title:d.nm, sub:d.ip,
    rows:[
      ["Hostname", d.nm],
      ["IP / CIDR", d.ip],
      ["Role", d.role],
      ["Status", sl.t],
      ["Layer", ["Edge","Perimeter","Core","Distribution","Services","Access"][d.layer]||"—"],
      ["Uptime", (98+Math.random()*2).toFixed(3)+"%"],
      ["Last seen", nowClock()]
    ],
    foot: el("div",{class:"flex gap-2 wrap"},[
      isAtk? el("button",{class:"btn danger sm",onclick:function(){ isolateDevice(d); closeModal(); }},[el("span",{html:iconHTML("power")}),"Isolate Device"]) : null,
      d.st==="OFFLINE"? el("button",{class:"btn sm",onclick:function(){ d.st="ONLINE"; recomputeDevices(); emit("device",d); toast("INFO","Device restored",d.nm+" back online","check-circle"); closeModal(); }},[el("span",{html:iconHTML("power")}),"Bring Online"])
        : el("button",{class:"btn warn sm",onclick:function(){ d.st="OFFLINE"; recomputeDevices(); emit("device",d); toast("MEDIUM","Device offline",d.nm+" administratively down","power"); closeModal(); }},[el("span",{html:iconHTML("power")}),"Take Offline"]),
      el("button",{class:"btn ghost sm",onclick:function(){ addLog("NET","ping "+d.ip+" → 4/4 · avg 0.8ms"); toast("INFO","Diagnostics run","ping "+d.ip+" OK","activity"); }},[el("span",{html:iconHTML("activity")}),"Run Diagnostics"]),
      el("button",{class:"btn ghost sm",onclick:closeModal},"Close")
    ])
  });
}
function isolateDevice(d){
  if (d._recoverT) clearTimeout(d._recoverT);
  d.st="OFFLINE"; recomputeDevices(); emit("device",d);
  addEvent("HIGH","Device isolated from network",d.nm,"SEC");
  addLog("SEC","containment: "+d.ip+" quarantined via NAC");
  toast("HIGH","Containment applied",d.nm+" isolated from the network","power");
}

registerView("network", {
  title:"Network Topology", sub:"Internet → firewall → core → services → endpoints", icon:"network",
  actions:function(){ return el("div",{class:"flex gap-2 wrap"},[
    el("span",{class:"chip ok",id:"netOnlineChip"}),
    el("button",{class:"btn sm ghost",onclick:function(){ S.devices.forEach(function(d){ if(d.st!=="ONLINE"){ if(d._recoverT)clearTimeout(d._recoverT); d.st="ONLINE"; } }); recomputeDevices(); emit("device",{}); toast("INFO","Topology reset","All devices restored to ONLINE","refresh"); }},[el("span",{html:iconHTML("refresh")}),"Reset All"])
  ]); },
  build:function(v){
    var topo = buildTopology();
    var tp = panel("Live Network Map",{icon:"git-branch",flush:true,sub:"click a device for details"});
    qs(".panel-b",tp).appendChild(topo.node);
    v.appendChild(tp);

    // legend + inventory
    var grid = el("div",{class:"dash",style:{marginTop:"14px"}});
    var invHost = el("div",{class:"span-8"});
    var invBody = el("div",{class:"tbl-wrap"});
    invHost.appendChild(panel("Device Inventory",{icon:"list-checks",sub:S.devices.length+" assets"}, invBody));
    grid.appendChild(invHost);
    var statHost = el("div",{class:"span-4"});
    var statBody = el("div",{class:"stack"});
    statHost.appendChild(panel("Status Summary",{icon:"activity"}, statBody));
    grid.appendChild(statHost);
    v.appendChild(grid);

    function drawInv(){
      clear(invBody);
      var tbl = el("table",{class:"tbl"});
      tbl.appendChild(el("thead",{},el("tr",{},[
        el("th",{text:"Device"}),el("th",{text:"IP / CIDR"}),el("th",{text:"Role"}),el("th",{text:"Status"})
      ])));
      var tb = el("tbody");
      S.devices.forEach(function(d){
        var sl=deviceStatusList(d.st);
        tb.appendChild(el("tr",{style:{cursor:"pointer"},onclick:function(){ openDeviceModal(d); }},[
          el("td",{},[ el("span",{class:"flex items-center gap-2"},[ el("span",{style:{color:"var(--acc)"},html:iconHTML(d.type)}), el("span",{style:{fontFamily:"var(--sans)",fontWeight:"500"},text:d.nm}) ]) ]),
          el("td",{style:{color:"var(--txt-2)"},text:d.ip}),
          el("td",{style:{color:"var(--txt-3)",fontFamily:"var(--sans)",whiteSpace:"normal"},text:d.role}),
          el("td",{}, el("span",{class:"flex items-center gap-2"},[ el("span",{class:"led"+ledFor(d.st)}), el("span",{style:{color:"var(--"+sl.c+")",fontSize:"11px"},text:sl.t}) ]))
        ]));
      });
      tbl.appendChild(tb); invBody.appendChild(tbl);
    }
    function drawStat(){
      clear(statBody);
      var counts={ONLINE:0,WARNING:0,ATTACK:0,OFFLINE:0};
      S.devices.forEach(function(d){ counts[d.st==="ATTACK"?"ATTACK":d.st]++; });
      [["ONLINE","ok","Online"],["WARNING","warn","Warning"],["ATTACK","crit","Under attack"],["OFFLINE","off","Offline"]].forEach(function(r){
        statBody.appendChild(el("div",{class:"flex items-center",style:{gap:"11px",padding:"9px 0",borderBottom:"1px solid var(--line)"}},[
          el("span",{class:"led"+(r[1]==="ok"?"":" "+r[1])}),
          el("span",{style:{flex:"1",fontSize:"12.5px",color:"var(--txt-2)"},text:r[2]}),
          el("span",{class:"mono-num",style:{fontWeight:"700",fontSize:"16px",color:"var(--"+r[1]+")"},text:counts[r[0]]})
        ]));
      });
      var chip=qs("#netOnlineChip"); if(chip) chip.textContent=S.devicesOnline+"/"+S.devicesTotal+" ONLINE";
    }
    drawInv(); drawStat();
    bind("device", function(d){ if(d&&d.id) topo.update(d); else topo.updateAll(); drawInv(); drawStat(); });
  }
});

/* =====================================================================
   EVENTS (SIEM) VIEW
   ===================================================================== */
registerView("events", {
  title:"Security Events", sub:"SIEM correlation · live event stream", icon:"list-checks",
  build:function(v){
    var streamBody = el("div",{class:"stream"});
    var filterRow = el("div",{class:"flex items-center gap-2 wrap",style:{marginBottom:"14px",justifyContent:"space-between"}});
    var seg = el("div",{class:"seg"});
    ["ALL","CRITICAL","HIGH","MEDIUM","LOW"].forEach(function(f){
      seg.appendChild(el("button",{dataset:{sev:f!=="ALL"?f:""},class:S.eventFilter===f?"on":"",onclick:function(){
        S.eventFilter=f; qsa("button",seg).forEach(function(b){ b.classList.toggle("on", b.textContent===f); }); redraw();
      },text:f}));
    });
    var counter = el("span",{class:"chip",id:"evCount"});
    filterRow.appendChild(seg); filterRow.appendChild(counter);
    v.appendChild(filterRow);

    var p = panel("Event Stream",{icon:"broadcast",flush:true,sub:"newest first",
      right: el("button",{class:"btn xs ghost",onclick:function(){ toast("INFO","Export ready","siem-events-"+Date.now()+".json","download"); }},[el("span",{html:iconHTML("download")}),"Export"])
    });
    qs(".panel-b",p).appendChild(el("div",{style:{maxHeight:"62vh",overflow:"auto"}}, streamBody));
    v.appendChild(p);

    function list(){ return S.events.filter(function(e){ return S.eventFilter==="ALL"||e.sev===S.eventFilter; }); }
    function redraw(){
      renderStreamInto(streamBody, function(){ return list().slice(0,160); });
      if (!streamBody.children.length) streamBody.appendChild(emptyState("list-checks","No "+S.eventFilter.toLowerCase()+" events."));
      counter.textContent = list().length+" EVENTS";
    }
    redraw();
    bind("event", function(ev){
      if (S.eventFilter!=="ALL" && ev.sev!==S.eventFilter){ counter.textContent=list().length+" EVENTS"; return; }
      if (streamBody.firstChild && streamBody.firstChild.classList && streamBody.firstChild.classList.contains("empty")) clear(streamBody);
      streamBody.insertBefore(eventRow(ev), streamBody.firstChild);
      while (streamBody.children.length>160) streamBody.lastChild.remove();
      counter.textContent=list().length+" EVENTS";
    });
  }
});
/* =====================================================================
   SHARED: modal, empty state, navigation
   ===================================================================== */
function emptyState(ic, msg){ return el("div",{class:"empty"},[ el("span",{html:iconHTML(ic)}), el("div",{text:msg}) ]); }
function go(id){ renderView(id); if(window.innerWidth<=860){ S.navOpen=false; document.body.classList.remove("app-navopen"); } }

var _modalEl=null;
function openModal(cfg){
  closeModal();
  var sevIco = cfg.iconSev||"INFO";
  var bg = el("div",{class:"modal-bg",onclick:function(e){ if(e.target===bg) closeModal(); }});
  var modal = el("div",{class:"modal",role:"dialog","aria-modal":"true"});
  modal.appendChild(el("div",{class:"modal-h"},[
    el("div",{class:"mh-ic",style:{color:"var("+sevColorVar(sevIco)+")",background:"rgba(var("+({CRITICAL:"--crit-rgb",HIGH:"--high-rgb",MEDIUM:"--med-rgb",LOW:"--low-rgb",INFO:"--acc-rgb"}[sevIco])+"),.14)"},html:iconHTML(cfg.icon)}),
    el("div",{style:{flex:"1"}},[ el("h3",{text:cfg.title}), cfg.sub?el("div",{class:"mh-sub",text:cfg.sub}):null ]),
    el("button",{class:"tb-icon",style:{width:"32px",height:"32px"},"aria-label":"Close",html:iconHTML("x"),onclick:closeModal})
  ]));
  var b = el("div",{class:"modal-b"});
  if (cfg.rows){
    var kv = el("div",{class:"kv-list"});
    cfg.rows.forEach(function(r){ kv.appendChild(el("div",{class:"row"},[ el("span",{class:"k",text:r[0]}), el("span",{class:"v",text:r[1]}) ])); });
    b.appendChild(kv);
  }
  if (cfg.body) append(b, cfg.body);
  if (cfg.foot){ b.appendChild(el("div",{style:{marginTop:"16px"}}, cfg.foot)); }
  modal.appendChild(b); bg.appendChild(modal); document.body.appendChild(bg); _modalEl=bg;
}
function closeModal(){ if(_modalEl){ _modalEl.remove(); _modalEl=null; } }
document.addEventListener("keydown", function(e){ if(e.key==="Escape") closeModal(); });

/* =====================================================================
   INCIDENT RESPONSE VIEW
   ===================================================================== */
var INC_ACTIONS = [
  {k:"investigate", label:"Investigate", icon:"search", cls:"", to:"INVESTIGATING", note:"Analyst assigned · investigation started"},
  {k:"isolate", label:"Isolate", icon:"power", cls:"warn", to:"CONTAINED", note:"Affected host isolated via NAC"},
  {k:"block", label:"Block IP", icon:"ban", cls:"danger", to:"CONTAINED", note:function(i){ return "Source "+i.src+" null-routed at edge firewall"; }},
  {k:"fp", label:"False Positive", icon:"check-circle", cls:"ghost", to:"CLOSED", note:"Marked false positive · closed"},
  {k:"escalate", label:"Escalate", icon:"trending-up", cls:"danger", to:"ESCALATED", note:"Escalated to Tier-2 / on-call lead"},
  {k:"mitigate", label:"Mark Mitigated", icon:"shield-check", cls:"", to:"MITIGATED", note:"Threat neutralized · incident mitigated"}
];
function doIncAction(inc, act){
  inc.status = act.to;
  var note = typeof act.note==="function"?act.note(inc):act.note;
  incTimeline(inc, note);
  if (act.k==="isolate"||act.k==="block"){
    var dev = inc.devId && S.devices.find(function(d){return d.id===inc.devId;});
    if (dev){ if(dev._recoverT) clearTimeout(dev._recoverT); dev.st = act.k==="isolate"?"OFFLINE":"WARNING"; recomputeDevices(); emit("device",dev);
      if (act.k==="isolate") setTimeout(function(){ if(dev.st==="OFFLINE"){ dev.st="ONLINE"; recomputeDevices(); emit("device",dev); } },9000);
    }
    S.suspicious = Math.max(3, S.suspicious-ri(2,5));
    S.threat = Math.max(8, S.threat-ri(6,12));
    addLog("SEC", act.k==="block"?("iptables -A INPUT -s "+inc.src+" -j DROP"):("containment applied · "+(inc.target)));
  }
  if (act.k==="mitigate"){ S.threat=Math.max(8,S.threat-14); addEvent("LOW","Incident mitigated",inc.id,"SEC"); }
  addEvent(inc.sev==="CRITICAL"?"HIGH":"MEDIUM","Incident "+inc.id+" → "+act.to, inc.title.slice(0,40),"SEC");
  toast("INFO","Response action executed",act.label+" · "+inc.id,"list-checks");
  emit("incident-update", inc); emit("metrics"); emit("score");
}

registerView("incidents", {
  title:"Incident Response", sub:"Triage · contain · remediate", icon:"briefcase",
  build:function(v){
    var wrap = el("div",{class:"stack"});
    var head = el("div",{class:"flex items-center gap-2 wrap",style:{justifyContent:"space-between",marginBottom:"4px"}});
    var counts = el("div",{class:"flex gap-2 wrap"});
    head.appendChild(counts);
    head.appendChild(el("button",{class:"btn sm danger",onclick:function(){ launchAttack(pick(["bruteforce","ransomware","sqli","malware"]),{}); }},[el("span",{html:iconHTML("zap")}),"Trigger Incident"]));
    v.appendChild(head);
    var listHost = el("div",{class:"stack"});
    v.appendChild(listHost);

    function drawCounts(){
      clear(counts);
      var open=openIncidentsCount(), esc=S.incidents.filter(function(i){return i.status==="ESCALATED";}).length, mit=S.incidents.filter(function(i){return i.status==="MITIGATED"||i.status==="CLOSED";}).length;
      [["OPEN",open,"high"],["ESCALATED",esc,"crit"],["RESOLVED",mit,"ok"]].forEach(function(r){
        counts.appendChild(el("span",{class:"chip "+r[2]},[r[0]+" · "+r[1]]));
      });
    }
    function card(inc){
      var wrapC = el("div",{class:"inc"+(inc.sel?" sel":"")});
      var body = el("div");
      var h = el("div",{class:"inc-h",onclick:function(){ inc.sel=!inc.sel; body.style.display=inc.sel?"":"none"; wrapC.classList.toggle("sel",inc.sel); }},[
        el("span",{class:"led "+(inc.sev==="CRITICAL"?"crit":inc.sev==="HIGH"?"warn":"")}),
        el("span",{class:"iid mono",text:inc.id}),
        el("span",{class:"ittl",text:inc.title}),
        el("span",{class:"chip "+sevClass(inc.sev),text:inc.sev}),
        el("span",{class:"st-badge st-"+inc.status,text:inc.status}),
        el("span",{style:{color:"var(--txt-3)"},html:iconHTML(inc.sel?"chevron-down":"chevron-right")})
      ]);
      body.className="inc-b"; body.style.display=inc.sel?"":"none";
      body.appendChild(el("div",{class:"inc-meta"},[
        incKV("Incident ID", inc.id), incKV("Severity", inc.sev),
        incKV("Source IP", inc.src||"—"), incKV("Target", inc.target||"—"),
        incKV("MITRE", inc.mitre||"—"), incKV("Opened", nowClock(inc.opened))
      ]));
      var acts = el("div",{class:"inc-actions"});
      INC_ACTIONS.forEach(function(a){
        acts.appendChild(el("button",{class:"btn xs "+a.cls,onclick:function(ev){ ev.stopPropagation(); doIncAction(inc,a); }},[ el("span",{html:iconHTML(a.icon)}), a.label ]));
      });
      body.appendChild(el("div",{},[ el("div",{class:"tny mono",style:{color:"var(--txt-3)",marginBottom:"7px",letterSpacing:".08em",textTransform:"uppercase"},text:"Response actions"}), acts ]));
      var tl = el("ul",{class:"inc-time"});
      inc.timeline.forEach(function(t){ tl.appendChild(el("li",{},[ el("span",{class:"tt",text:t.t}), t.m ])); });
      body.appendChild(el("div",{},[ el("div",{class:"tny mono",style:{color:"var(--txt-3)",marginBottom:"9px",letterSpacing:".08em",textTransform:"uppercase"},text:"Activity timeline"}), tl ]));
      wrapC.appendChild(h); wrapC.appendChild(body);
      return wrapC;
    }
    function draw(){
      clear(listHost); drawCounts();
      if (!S.incidents.length){ listHost.appendChild(panel("Incidents",{icon:"briefcase"}, emptyState("check-circle","No open incidents. Environment nominal."))); return; }
      S.incidents.forEach(function(inc){ listHost.appendChild(card(inc)); });
    }
    draw();
    bind("incident", function(){ draw(); });
    bind("incident-update", function(){ draw(); });
  }
});
function incKV(k,val){ return el("div",{class:"inc-kv"},[ el("div",{class:"k",text:k}), el("div",{class:"v",text:val}) ]); }

/* =====================================================================
   ATTACK SIMULATOR VIEW
   ===================================================================== */
registerView("simulator", {
  title:"Attack Simulator", sub:"Launch a simulated attack and watch the SOC respond", icon:"zap",
  actions:function(){ return el("span",{class:"chip",id:"simCount",text:S.stats.attacksSimulated+" LAUNCHED"}); },
  build:function(v){
    v.appendChild(el("div",{class:"rt-banner"},[
      el("span",{html:iconHTML("info")}),
      el("div",{},[ el("b",{text:"Simulation only. "}), "Every attack here is synthetic — it drives the dashboard, SIEM, incidents, network map and MITRE panel. Nothing leaves your browser." ])
    ]));
    var grid = el("div",{class:"atk-grid"});
    Object.keys(ATTACK_TYPES).forEach(function(k){
      var A = ATTACK_TYPES[k];
      var btn = el("button",{class:"atk",onclick:function(){ runSim(btn,A); }},[
        el("span",{class:"aic",html:iconHTML(A.icon)}),
        el("h4",{text:A.name}),
        el("p",{text:A.desc}),
        el("div",{class:"amitre mono",text:"MITRE "+A.mitre+" · "+A.sev}),
        el("div",{class:"arun",text:"⟳ EXECUTING…"})
      ]);
      grid.appendChild(btn);
    });
    v.appendChild(grid);

    // chained scenario + effects panel
    var dash = el("div",{class:"dash",style:{marginTop:"16px"}});
    var effHost = el("div",{class:"span-7"});
    var effBody = el("div",{class:"stream",style:{maxHeight:"300px",overflow:"auto"}});
    effHost.appendChild(panel("Detection Pipeline",{icon:"activity",sub:"what the SOC does on each launch"}, effBody));
    dash.appendChild(effHost);

    var scenHost = el("div",{class:"span-5"});
    var scenBody = el("div",{class:"stack"});
    scenHost.appendChild(panel("Kill-Chain Scenarios",{icon:"layers",sub:"multi-stage"}, scenBody));
    [
      {nm:"APT Intrusion", desc:"Recon → phishing → brute force → ransomware", steps:["portscan","phishing","bruteforce","ransomware"], sev:"CRITICAL"},
      {nm:"Web App Breach", desc:"Scan → SQL injection → suspicious login", steps:["portscan","sqli","login"], sev:"HIGH"},
      {nm:"Edge Saturation", desc:"Port scan → DDoS flood", steps:["portscan","ddos"], sev:"CRITICAL"}
    ].forEach(function(sc){
      scenBody.appendChild(el("div",{class:"flex items-center gap-2",style:{padding:"11px",border:"1px solid var(--line-2)",borderRadius:"10px",background:"var(--panel-2)"}},[
        el("div",{style:{flex:"1"}},[ el("div",{style:{fontWeight:"600",fontSize:"13px"},text:sc.nm}), el("div",{class:"tny",style:{color:"var(--txt-3)",marginTop:"2px"},text:sc.desc}) ]),
        el("button",{class:"btn xs danger",onclick:function(){ runScenario(sc); }},[el("span",{html:iconHTML("play")}),"Run"])
      ]));
    });
    dash.appendChild(scenHost);
    v.appendChild(dash);

    function pipeStep(txt, ok){
      var row = el("div",{class:"evt",style:{gridTemplateColumns:"auto 1fr",gap:"11px"}},[
        el("span",{style:{color:ok?"var(--ok)":"var(--acc)"},html:iconHTML(ok?"check":"chevron-right")}),
        el("span",{class:"small",style:{color:"var(--txt-2)"},html:txt})
      ]);
      effBody.insertBefore(row, effBody.firstChild);
      while (effBody.children.length>40) effBody.lastChild.remove();
    }

    window.__simPipe = pipeStep;
    function runSim(btn, A){
      if (btn.classList.contains("running")) return;
      btn.classList.add("running"); btn.disabled=true;
      var steps = [
        "Threat correlation engine flags <b>"+A.name+"</b>",
        "SIEM alert raised · severity <b class='text-crit'>"+A.sev+"</b>",
        "Firewall pushing DROP rules to edge",
        "Network map: affected device → <b class='text-crit'>UNDER ATTACK</b>",
        "Threat map plotting inbound vector",
        "MITRE technique <b>"+A.mitre+"</b> highlighted",
        "Incident auto-created & queued for triage"
      ];
      steps.forEach(function(s,i){ setTimeout(function(){ pipeStep(s, false); }, i*220); });
      setTimeout(function(){
        launchAttack(A.id,{});
        pipeStep("Pipeline complete — SOC engaged", true);
        btn.classList.remove("running"); btn.disabled=false;
        var c=qs("#simCount"); if(c) c.textContent=S.stats.attacksSimulated+" LAUNCHED";
      }, steps.length*220+120);
    }
    function runScenario(sc){
      pipeStep("<b class='text-crit'>▶ SCENARIO:</b> "+sc.nm, false);
      sc.steps.forEach(function(st,i){
        setTimeout(function(){ launchAttack(st,{}); pipeStep("stage "+(i+1)+"/"+sc.steps.length+" · "+ATTACK_TYPES[st].name+" executed", true); var c=qs("#simCount"); if(c) c.textContent=S.stats.attacksSimulated+" LAUNCHED"; }, i*1400);
      });
      toast(sc.sev,"Scenario launched",sc.nm+" · "+sc.steps.length+" stages","layers");
    }
    window.__runScenario = runScenario;
  }
});

/* =====================================================================
   LOG ANALYZER VIEW
   ===================================================================== */
registerView("logs", {
  title:"Log Analyzer", sub:"Aggregated syslog · auth · firewall · security", icon:"file-text",
  build:function(v){
    var q="";
    var toolbar = el("div",{class:"flex items-center gap-2 wrap",style:{marginBottom:"14px"}});
    var searchWrap = el("div",{class:"inp-ic",style:{flex:"1",minWidth:"180px"}},[ el("span",{html:iconHTML("search")}), el("input",{class:"inp",placeholder:"Search logs (ip, user, keyword)…",oninput:function(e){ q=e.target.value.toLowerCase(); draw(); }}) ]);
    var seg = el("div",{class:"seg"});
    ["ALL","AUTH","NET","FW","SEC","ALERT","SYS"].forEach(function(f){
      seg.appendChild(el("button",{class:S.logFilter===f?"on":"",onclick:function(){ S.logFilter=f; qsa("button",seg).forEach(function(b){b.classList.toggle("on",b.textContent===f);}); draw(); },text:f}));
    });
    toolbar.appendChild(searchWrap); toolbar.appendChild(seg);
    toolbar.appendChild(el("button",{class:"btn sm",onclick:function(){ analyze(); }},[el("span",{html:iconHTML("scan-line")}),"Analyze"]));
    toolbar.appendChild(el("button",{class:"btn sm ghost",onclick:function(){ toast("INFO","Logs exported","system-logs-"+Date.now()+".log · "+S.logs.length+" lines","download"); }},[el("span",{html:iconHTML("download")}),"Export"]));
    toolbar.appendChild(el("button",{class:"btn sm ghost",onclick:function(){ S.logs=[]; draw(); toast("INFO","Logs cleared","Buffer flushed","trash"); }},[el("span",{html:iconHTML("trash")}),"Clear"]));
    v.appendChild(toolbar);

    var findings = el("div",{style:{marginBottom:"14px",display:"none"}});
    v.appendChild(findings);

    var p = panel("Log Stream",{icon:"terminal-square",flush:true,sub:"live tail",right:el("span",{class:"chip",id:"logCount"})});
    var body = el("div",{style:{maxHeight:"60vh",overflow:"auto"}});
    qs(".panel-b",p).appendChild(body);
    v.appendChild(p);

    function match(l){
      if (S.logFilter!=="ALL"){ if (S.logFilter==="ALERT"){ if(l.k!=="ALERT"&&!/alert|brute|ransom|inject|beacon/i.test(l.m)) return false; } else if (l.k!==S.logFilter) return false; }
      if (q && (l.m.toLowerCase().indexOf(q)<0 && l.k.toLowerCase().indexOf(q)<0)) return false;
      return true;
    }
    function line(l){
      var hi = l.m;
      if (q){ var idx=hi.toLowerCase().indexOf(q); if(idx>=0){ hi=esc(hi.slice(0,idx))+'<span style="background:rgba(var(--acc-rgb),.28);color:#fff;border-radius:3px">'+esc(hi.slice(idx,idx+q.length))+'</span>'+esc(hi.slice(idx+q.length)); } else hi=esc(hi); }
      else hi=esc(hi);
      var sus = /fail|brute|ransom|inject|beacon|ddos|scan|impossible|c2|\.lockbit|malware/i.test(l.m);
      return el("div",{class:"logline"+(sus?" hit":""),dataset:{k:l.k}},[
        el("span",{class:"lt",text:nowClock(l.t)}),
        el("span",{class:"lk",text:l.k}),
        el("span",{class:"lm",html:hi})
      ]);
    }
    function draw(){
      clear(body);
      var list = S.logs.filter(match).slice(0,220);
      list.forEach(function(l){ body.appendChild(line(l)); });
      if (!list.length) body.appendChild(emptyState("file-text","No matching log lines."));
      var c=qs("#logCount"); if(c) c.textContent=S.logs.filter(match).length+" LINES";
    }
    function analyze(){
      findings.style.display="";
      var susp = S.logs.filter(function(l){ return /fail|brute|ransom|inject|beacon|ddos|scan|impossible|c2|malware|\.lockbit/i.test(l.m); });
      var ips={}; S.logs.forEach(function(l){ var m=l.m.match(/(\d{1,3}\.){3}\d{1,3}/); if(m){ ips[m[0]]=(ips[m[0]]||0)+1; } });
      var top=Object.keys(ips).map(function(k){return {ip:k,n:ips[k]};}).sort(function(a,b){return b.n-a.n;}).slice(0,4);
      clear(findings);
      var pf = panel("Analysis Result",{icon:"scan-line",sub:"heuristic",right:el("button",{class:"btn xs ghost",onclick:function(){ findings.style.display="none"; }},"Dismiss")});
      var pb = qs(".panel-b",pf);
      pb.appendChild(el("div",{class:"grid cols-2"},[
        el("div",{},[
          el("div",{class:"tny mono",style:{color:"var(--txt-3)",marginBottom:"8px",textTransform:"uppercase",letterSpacing:".08em"},text:"Suspicious indicators"}),
          susp.length? el("div",{class:"flex items-center gap-2",style:{fontSize:"13px"}},[ el("span",{class:"led crit"}), el("b",{class:"text-crit",text:susp.length+" suspicious lines"}), el("span",{class:"muted small",text:"of "+S.logs.length}) ]) : el("div",{class:"flex items-center gap-2"},[el("span",{class:"led"}),"No suspicious patterns"]),
          el("div",{style:{marginTop:"10px"}}, barsChart([
            {l:"Auth failures",v:S.logs.filter(function(l){return /AUTH FAILED|fail/i.test(l.m);}).length,c:"var(--med)"},
            {l:"Alerts",v:S.logs.filter(function(l){return l.k==="ALERT"||/alert/i.test(l.m);}).length,c:"var(--crit)"},
            {l:"FW drops",v:S.logs.filter(function(l){return /DROP/i.test(l.m);}).length,c:"var(--acc-2)"}
          ]))
        ]),
        el("div",{},[
          el("div",{class:"tny mono",style:{color:"var(--txt-3)",marginBottom:"8px",textTransform:"uppercase",letterSpacing:".08em"},text:"Top talkers (IP)"}),
          top.length? el("div",{class:"stack",style:{gap:"6px"}}, top.map(function(t){ return el("div",{class:"flex items-center gap-2",style:{fontSize:"12px"}},[ el("span",{class:"mono",style:{flex:"1",color:"var(--txt-2)"},text:t.ip}), el("span",{class:"chip"+(t.n>3?" high":""),text:t.n+"×"}) ]); })) : el("div",{class:"muted small",text:"No IPs observed yet."})
        ])
      ]));
      findings.appendChild(pf);
      toast("INFO","Analysis complete",susp.length+" suspicious lines flagged","scan-line");
    }
    draw();
    bind("log", function(l){ if(match(l)){ if(body.firstChild&&body.firstChild.classList&&body.firstChild.classList.contains("empty")) clear(body); body.insertBefore(line(l), body.firstChild); while(body.children.length>220) body.lastChild.remove(); } var c=qs("#logCount"); if(c) c.textContent=S.logs.filter(match).length+" LINES"; });
  }
});

/* =====================================================================
   FIREWALL MONITOR VIEW
   ===================================================================== */
registerView("firewall", {
  title:"Firewall Monitor", sub:"Live packet decisions · NGFW edge", icon:"shield",
  build:function(v){
    var seg = el("div",{class:"seg"});
    ["ALL","ALLOW","DROP","REJECT"].forEach(function(f){
      seg.appendChild(el("button",{class:S.fwFilter===f?"on":"",onclick:function(){ S.fwFilter=f; qsa("button",seg).forEach(function(b){b.classList.toggle("on",b.textContent===f);}); draw(); },text:f}));
    });
    v.appendChild(el("div",{class:"flex items-center gap-2 wrap",style:{marginBottom:"14px",justifyContent:"space-between"}},[ seg, el("span",{class:"chip",id:"fwCount"}) ]));

    // stat strip
    var stat = el("div",{class:"grid cols-3",style:{marginBottom:"14px"}});
    v.appendChild(stat);
    function drawStat(){
      clear(stat);
      var win = S.firewall.slice(0,120);
      var a=win.filter(function(r){return r.action==="ALLOW";}).length, d=win.filter(function(r){return r.action==="DROP";}).length, rj=win.filter(function(r){return r.action==="REJECT";}).length;
      [["ALLOW",a,"var(--ok)","check-circle"],["DROP",d,"var(--crit)","ban"],["REJECT",rj,"var(--high)","x"]].forEach(function(r){
        stat.appendChild(el("div",{class:"metric",style:{"--mc-rgb":r[2]==="var(--ok)"?"var(--ok-rgb)":r[2]==="var(--crit)"?"var(--crit-rgb)":"var(--high-rgb)"}},[
          el("div",{class:"mtop"},[ el("span",{class:"mlabel",text:r[0]+" (last 120)"}), el("span",{class:"mic",html:iconHTML(r[3])}) ]),
          el("span",{class:"mval mono-num",style:{color:r[2]},text:r[1]})
        ]));
      });
    }

    var p = panel("Traffic Log",{icon:"activity",flush:true,sub:"newest first"});
    var tw = el("div",{class:"tbl-wrap",style:{maxHeight:"58vh",overflow:"auto"}});
    var tbl = el("table",{class:"tbl"});
    tbl.appendChild(el("thead",{},el("tr",{},["Time","Source IP","Dest IP","Port","Proto","Action"].map(function(h){return el("th",{text:h});}))));
    var tbody = el("tbody"); tbl.appendChild(tbody); tw.appendChild(tbl);
    qs(".panel-b",p).appendChild(tw);
    v.appendChild(p);

    function row(r){
      return el("tr",{},[
        el("td",{style:{color:"var(--txt-3)"},text:nowClock(r.t)}),
        el("td",{style:{color:r.src.indexOf("10.")===0?"var(--txt-2)":"var(--high)"},text:r.src}),
        el("td",{style:{color:"var(--txt-2)"},text:r.dst}),
        el("td",{text:r.port}),
        el("td",{style:{color:"var(--txt-3)"},text:r.proto}),
        el("td",{}, el("span",{class:"act-tag act-"+r.action,text:r.action}))
      ]);
    }
    function match(r){ return S.fwFilter==="ALL"||r.action===S.fwFilter; }
    function draw(){
      clear(tbody);
      S.firewall.filter(match).slice(0,120).forEach(function(r){ tbody.appendChild(row(r)); });
      drawStat();
      var c=qs("#fwCount"); if(c) c.textContent=S.firewall.filter(match).length+" FLOWS";
    }
    draw();
    bind("firewall", function(r){ if(match(r)){ tbody.insertBefore(row(r), tbody.firstChild); while(tbody.children.length>120) tbody.lastChild.remove(); } if(tickN%2===0) drawStat(); var c=qs("#fwCount"); if(c) c.textContent=S.firewall.filter(match).length+" FLOWS"; });
    bind("tick", function(){ if(tickN%4===0) drawStat(); });
  }
});

/* =====================================================================
   SERVER MONITORING VIEW
   ===================================================================== */
registerView("servers", {
  title:"Server Monitoring", sub:"Compute health · CPU · RAM · disk · network", icon:"server",
  build:function(v){
    var grid = el("div",{class:"grid cols-2"});
    v.appendChild(grid);
    var refs = {};
    S.servers.forEach(function(s){
      var card = el("div",{class:"srv"});
      card.appendChild(el("div",{class:"srv-h"},[
        el("span",{class:"sic",html:iconHTML(s.icon)}),
        el("div",{},[ el("div",{class:"snm",text:s.nm}), el("div",{class:"sos mono",text:s.os+" · "+s.ip}) ]),
        el("div",{class:"sup"},[ el("b",{class:"mono",text:s.up}), el("span",{text:"uptime"}) ])
      ]));
      var gr = el("div",{class:"gauge-row"});
      var bars = {};
      [["cpu","CPU"],["ram","RAM"],["disk","DISK"],["net","NET"]].forEach(function(m){
        var iEl = el("i"), vEl = el("span",{class:"gv"});
        gr.appendChild(el("div",{class:"gauge"},[ el("span",{class:"gk",text:m[1]}), el("div",{class:"gbar"}, iEl), vEl ]));
        bars[m[0]]={i:iEl,v:vEl};
      });
      card.appendChild(gr);
      var chartHost = el("div",{class:"srv-chart"});
      card.appendChild(chartHost);
      grid.appendChild(card);
      refs[s.id]={bars:bars, chart:chartHost, card:card};
      update(s);
    });
    function update(s){
      var r = refs[s.id]; if(!r) return;
      ["cpu","ram","disk","net"].forEach(function(k){
        var val=Math.round(s[k]);
        var col = val>85?"var(--crit)":val>65?"var(--warn)":k==="net"?"var(--acc-2)":"var(--acc)";
        r.bars[k].i.style.width=val+"%"; r.bars[k].i.style.background=col;
        r.bars[k].v.textContent=val+"%"; r.bars[k].v.style.color=col;
      });
      clear(r.chart); r.chart.appendChild(areaChart(s.hist.slice(), {px:46,min:0,max:100,color:s.cpu>75?"var(--warn)":"var(--acc)"}));
      r.card.style.borderColor = s.cpu>88? "rgba(var(--crit-rgb),.5)" : "var(--line)";
    }
    bind("tick", function(){ S.servers.forEach(update); });
  }
});

/* =====================================================================
   MITRE ATT&CK VIEW
   ===================================================================== */
registerView("mitre", {
  title:"MITRE ATT&CK", sub:"Techniques observed across simulated attacks", icon:"target",
  build:function(v){
    var tactics = [];
    S.mitre.forEach(function(m){ if(tactics.indexOf(m.tac)<0) tactics.push(m.tac); });
    var host = el("div",{class:"stack"});
    v.appendChild(host);
    var cellRefs = {};
    function draw(){
      clear(host);
      tactics.forEach(function(tac){
        var techs = S.mitre.filter(function(m){return m.tac===tac;});
        var body = el("div",{class:"mitre-grid"});
        techs.forEach(function(m){
          var hot = m.hotUntil>Date.now();
          var cell = el("div",{class:"tech"+(hot?" hot":""),dataset:{id:m.id},onclick:function(){ mitreInfo(m); }},[
            m.count?el("span",{class:"tcount mono",text:"×"+m.count}):null,
            el("div",{class:"tid mono",text:m.id}),
            el("div",{class:"tnm",text:m.nm}),
            el("div",{class:"ttac mono",text:m.tac})
          ]);
          cellRefs[m.id]=cell;
          body.appendChild(cell);
        });
        host.appendChild(panel(tac,{icon:"layers",sub:techs.length+" techniques"}, body));
      });
    }
    draw();
    bind("mitre", function(m){ var c=cellRefs[m.id]; if(c){ c.classList.add("hot"); var cnt=qs(".tcount",c); if(cnt) cnt.textContent="×"+m.count; else c.insertBefore(el("span",{class:"tcount mono",text:"×"+m.count}), c.firstChild); } });
    bind("tick", function(){ if(tickN%3===0){ Object.keys(cellRefs).forEach(function(id){ var m=S.mitre.find(function(x){return x.id===id;}); cellRefs[id].classList.toggle("hot", m.hotUntil>Date.now()); }); } });
  }
});
function mitreInfo(m){
  openModal({ icon:"target", iconSev: m.hotUntil>Date.now()?"CRITICAL":"INFO", title:m.id+" · "+m.nm, sub:m.tac,
    rows:[["Technique ID",m.id],["Name",m.nm],["Tactic",m.tac],["Observations",String(m.count)],["Status", m.hotUntil>Date.now()?"ACTIVE — recently observed":"Not currently active"]],
    foot: el("button",{class:"btn ghost sm",onclick:closeModal},"Close")
  });
}
/* =====================================================================
   PRODUCTION UPGRADE — PLATFORM ENGINE (data model + subsystems)
   Everything here extends the single shared state `S`. All components
   read/write this one model so the platform stays internally consistent.
   ===================================================================== */

/* ---------- centralized simulation clock ---------- */
function simNow(){ return new Date(); }
function relTime(d){
  var s = Math.max(0, Math.round((Date.now()-d.getTime())/1000));
  if (s<3) return "just now";
  if (s<60) return s+"s ago";
  var m=Math.floor(s/60); if (m<60) return m+"m ago";
  var h=Math.floor(m/60); if (h<24) return h+"h ago";
  return Math.floor(h/24)+"d ago";
}
function absTime(d){ return d.toLocaleTimeString("en-GB")+" · "+d.toLocaleDateString("en-GB"); }
function fmtBps(mbps){ return mbps>=1000 ? (mbps/1000).toFixed(2)+" Gbps" : Math.round(mbps)+" Mbps"; }
function macAddr(){ var h="0123456789ABCDEF"; var o=[]; for(var i=0;i<6;i++) o.push(h[ri(0,15)]+h[ri(0,15)]); o[0]="0"+pick(["2","6","A","E"]); return o.join(":"); }

/* ---------- security zones ---------- */
var ZONES = [
  {id:"INTERNET",  nm:"Internet",   c:"var(--txt-3)",     rgb:"130,160,210", trust:0},
  {id:"DMZ",       nm:"DMZ",        c:"var(--high)",      rgb:"255,138,61",  trust:20},
  {id:"SERVER",    nm:"Server",     c:"var(--acc-2)",     rgb:"61,139,255",  trust:70},
  {id:"USER",      nm:"User",       c:"var(--acc)",       rgb:"34,224,200",  trust:60},
  {id:"MGMT",      nm:"Management",  c:"var(--ok)",       rgb:"47,224,138",  trust:90},
  {id:"GUEST",     nm:"Guest",      c:"var(--med)",       rgb:"255,207,71",  trust:10},
  {id:"IOT",       nm:"IoT / OT",   c:"var(--crit)",      rgb:"255,77,106",  trust:15}
];
function zone(id){ return ZONES.find(function(z){return z.id===id;})||ZONES[0]; }

/* ---------- VLANs ---------- */
var VLANS = [
  {id:10, nm:"MANAGEMENT", zone:"MGMT",   cidr:"10.10.10.0/24", desc:"Switch/router/firewall mgmt planes"},
  {id:20, nm:"SERVERS",    zone:"SERVER", cidr:"10.10.20.0/24", desc:"AD, DB, app & file servers"},
  {id:30, nm:"USERS",      zone:"USER",   cidr:"10.10.30.0/24", desc:"Staff workstations"},
  {id:40, nm:"GUEST",      zone:"GUEST",  cidr:"10.10.40.0/24", desc:"Guest wifi · internet-only"},
  {id:50, nm:"CCTV",       zone:"IOT",    cidr:"10.10.50.0/24", desc:"IP cameras / NVR"},
  {id:60, nm:"IOT",        zone:"IOT",    cidr:"10.10.60.0/24", desc:"Printers, sensors, OT"}
];
function vlan(id){ return VLANS.find(function(v){return v.id===id;}); }

/* ---------- WAN links (primary + backup, for failover) ---------- */
var WAN_SEED = [
  {id:"wan1", isp:"IPKO Fiber",     role:"PRIMARY", status:"ONLINE",  ip:"212.60.14.2",  bw:1000, latency:6,  loss:0.0},
  {id:"wan2", isp:"Kujtesa Backup", role:"BACKUP",  status:"STANDBY", ip:"46.99.150.9",  bw:500,  latency:14, loss:0.0}
];

/* ---------- FIREWALL RULE ENGINE ---------- */
var FW_RULES_SEED = [
  {id:"FW-001", src:"USER",   dst:"SERVER",   port:443,  proto:"TCP",  action:"ALLOW",  log:true,  enabled:true,  note:"Staff → app tier (HTTPS)"},
  {id:"FW-002", src:"USER",   dst:"SERVER",   port:53,   proto:"UDP",  action:"ALLOW",  log:false, enabled:true,  note:"Internal DNS"},
  {id:"FW-003", src:"DMZ",    dst:"SERVER",   port:5432, proto:"TCP",  action:"ALLOW",  log:true,  enabled:true,  note:"Web → DB (scoped)"},
  {id:"FW-004", src:"INTERNET",dst:"DMZ",     port:443,  proto:"TCP",  action:"ALLOW",  log:true,  enabled:true,  note:"Public → reverse proxy"},
  {id:"FW-005", src:"GUEST",  dst:"SERVER",   port:"any",proto:"any",  action:"DROP",   log:true,  enabled:true,  note:"Guest isolation"},
  {id:"FW-006", src:"IOT",    dst:"USER",     port:"any",proto:"any",  action:"DROP",   log:true,  enabled:true,  note:"IoT east-west block"},
  {id:"FW-007", src:"INTERNET",dst:"SERVER",  port:"any",proto:"any",  action:"DROP",   log:true,  enabled:true,  note:"No direct inbound to servers"},
  {id:"FW-008", src:"USER",   dst:"MGMT",     port:22,   proto:"TCP",  action:"REJECT", log:true,  enabled:true,  note:"SSH to mgmt requires jump host"},
  {id:"FW-009", src:"MGMT",   dst:"any",      port:"any",proto:"any",  action:"ALLOW",  log:false, enabled:true,  note:"Admin plane"},
  {id:"FW-010", src:"INTERNET",dst:"INTERNET",port:"any",proto:"any",  action:"DROP",   log:true,  enabled:true,  note:"Default deny (implicit)"}
];
function fwMatch(port, val){ return val==="any" || String(val)===String(port); }
function evaluateFlow(f){
  for (var i=0;i<S.fwRules.length;i++){
    var r=S.fwRules[i];
    if (!r.enabled) continue;
    if (r.src!=="any" && r.src!==f.srcZone) continue;
    if (r.dst!=="any" && r.dst!==f.dstZone) continue;
    if (!fwMatch(f.port, r.port)) continue;
    if (r.proto!=="any" && r.proto!==f.proto) continue;
    return { rule:r.id, action:r.action, log:r.log };
  }
  // implicit default: deny from untrusted, allow internal
  var untrusted = f.srcZone==="INTERNET"||f.srcZone==="GUEST"||f.srcZone==="IOT";
  return { rule:"—", action:untrusted?"DROP":"ALLOW", log:untrusted };
}

/* ---------- IDS / IPS RULES ---------- */
var IDS_RULES_SEED = [
  {id:"SID-1001", nm:"Multiple failed authentication attempts", sev:"HIGH",     mitre:"T1110", action:"BLOCKED",   desc:">10 auth failures from a single source in 60s"},
  {id:"SID-1002", nm:"Network service scanning",               sev:"MEDIUM",    mitre:"T1046", action:"MONITORED", desc:"Sequential connection attempts across many ports"},
  {id:"SID-1003", nm:"Abnormal ICMP / flood traffic",          sev:"CRITICAL",  mitre:"T1499", action:"BLOCKED",   desc:"ICMP or SYN rate above volumetric threshold"},
  {id:"SID-1004", nm:"Suspicious DNS activity",                sev:"MEDIUM",    mitre:"T1071", action:"MONITORED", desc:"High-entropy / DGA-like domain resolution"},
  {id:"SID-1005", nm:"Unusual outbound / C2 beacon",           sev:"HIGH",      mitre:"T1071", action:"DETECTED",  desc:"Periodic beacon to low-reputation host"},
  {id:"SID-1006", nm:"SQL injection signature",                sev:"HIGH",      mitre:"T1190", action:"BLOCKED",   desc:"Union/boolean injection pattern in HTTP"},
  {id:"SID-1007", nm:"Credential-harvest / phishing link",     sev:"MEDIUM",    mitre:"T1566", action:"DETECTED",  desc:"Lookalike domain in inbound mail"},
  {id:"SID-1008", nm:"Mass file encryption behaviour",         sev:"CRITICAL",  mitre:"T1486", action:"BLOCKED",   desc:"Rapid file rename + shadow-copy deletion"},
  {id:"SID-1009", nm:"Impossible-travel sign-in",              sev:"MEDIUM",    mitre:"T1078", action:"DETECTED",  desc:"Two logins geographically impossible in time"}
];
function idsForMitre(m){ return S.idsRules.find(function(r){return r.mitre===m;}) || S.idsRules[1]; }

/* ---------- device metadata (rich, enterprise properties) ---------- */
var VENDORS = {
  fw:{v:"FortiNet-Sim",m:"FG-100F",fw:"FortiOS 7.4.3"},
  rtr:{v:"MikroTik-Sim",m:"CCR2004-16G",fw:"RouterOS 7.14"},
  sw:{v:"Aruba-Sim",m:"CX-6300M",fw:"AOS-CX 10.12"},
  srv:{v:"Dell-Sim",m:"PowerEdge R760",fw:"BIOS 1.9.2"},
  ap:{v:"Ubiquiti-Sim",m:"U6-Pro",fw:"6.6.55"},
  vpn:{v:"WireGuard-Sim",m:"vGW-2",fw:"wg 1.0.2"},
  ep:{v:"Lenovo-Sim",m:"ThinkCentre",fw:"—"},
  iot:{v:"Hikvision-Sim",m:"DS-2CD",fw:"5.7.3"},
  prn:{v:"HP-Sim",m:"LaserJet E60",fw:"5.2"}
};
var DEVICE_META = {
  inet:{zone:"INTERNET",vlan:null, kind:"cloud", meta:VENDORS.rtr},
  fw:  {zone:"DMZ",     vlan:10,  kind:"fw",    meta:VENDORS.fw},
  rtr: {zone:"MGMT",    vlan:10,  kind:"router",meta:VENDORS.rtr},
  sw1: {zone:"SERVER",  vlan:20,  kind:"switch",meta:VENDORS.sw},
  sw2: {zone:"USER",    vlan:30,  kind:"switch",meta:VENDORS.sw},
  dns: {zone:"MGMT",    vlan:10,  kind:"server",meta:VENDORS.srv},
  dhcp:{zone:"MGMT",    vlan:10,  kind:"server",meta:VENDORS.srv},
  web: {zone:"DMZ",     vlan:20,  kind:"server",meta:VENDORS.srv},
  db:  {zone:"SERVER",  vlan:20,  kind:"server",meta:VENDORS.srv},
  windows:{zone:"SERVER",vlan:20, kind:"server",meta:VENDORS.srv},
  linux:{zone:"SERVER", vlan:20,  kind:"server",meta:VENDORS.srv},
  vpn: {zone:"DMZ",     vlan:10,  kind:"vpn",   meta:VENDORS.vpn},
  ws:  {zone:"USER",    vlan:30,  kind:"endpoint",meta:VENDORS.ep},
  ws2: {zone:"USER",    vlan:30,  kind:"endpoint",meta:VENDORS.ep}
};
/* extra assets (inventory / segmentation / search — not on the core diagram) */
var DEVICE_EXTRA = [
  {id:"rproxy",nm:"Reverse Proxy",ip:"10.10.20.5",type:"globe",  role:"HAProxy · DMZ ingress", st:"ONLINE", zone:"DMZ",   vlan:20, kind:"server",  meta:VENDORS.srv, diagram:false},
  {id:"ap1",   nm:"AP-Floor-1",  ip:"10.10.30.240",type:"wifi",  role:"Wi-Fi 6 · 34 clients",  st:"ONLINE", zone:"USER",  vlan:30, kind:"ap",      meta:VENDORS.ap,  diagram:false},
  {id:"ap2",   nm:"AP-Guest",    ip:"10.10.40.240",type:"wifi",  role:"Guest SSID · isolated", st:"ONLINE", zone:"GUEST", vlan:40, kind:"ap",      meta:VENDORS.ap,  diagram:false},
  {id:"cam1",  nm:"NVR / Cameras",ip:"10.10.50.10",type:"eye",   role:"12 IP cameras",         st:"ONLINE", zone:"IOT",   vlan:50, kind:"iot",     meta:VENDORS.iot, diagram:false},
  {id:"prn1",  nm:"Printer-HR",  ip:"10.10.60.20", type:"file-text",role:"Shared MFP",         st:"WARNING",zone:"IOT",   vlan:60, kind:"printer", meta:VENDORS.prn, diagram:false},
  {id:"iot1",  nm:"HVAC Controller",ip:"10.10.60.30",type:"cpu", role:"BMS · Modbus/TCP",      st:"ONLINE", zone:"IOT",   vlan:60, kind:"iot",     meta:VENDORS.iot, diagram:false}
];
function ifRole(kind, i){
  if (kind==="fw") return ["WAN1","WAN2","LAN","DMZ"][i]||"port";
  if (kind==="router") return ["WAN","CORE","MGMT","SPARE"][i]||"port";
  if (kind==="switch") return ["UPLINK","SERVER","SERVER","ACCESS","ACCESS","ACCESS"][i]||"port";
  if (kind==="server") return ["NIC0","NIC1"][i]||"nic";
  if (kind==="ap") return ["UPLINK","RADIO-2G","RADIO-5G"][i]||"radio";
  return ["eth0"][i]||"if";
}
function genInterfaces(dev){
  var kind = dev.kind||"server";
  var count = kind==="switch"?6 : kind==="fw"?4 : kind==="router"?4 : kind==="ap"?3 : kind==="server"?2 : 1;
  var ifs=[];
  for (var i=0;i<count;i++){
    var role=ifRole(kind,i);
    var down = (dev.st==="OFFLINE") || (kind==="fw"&&role==="WAN2"&&(!S.wan||S.wan[1].status!=="ONLINE")) || (i>=count-1 && chance(.18));
    var speed = kind==="ap"?"866 Mbps":(kind==="switch"||kind==="router"||kind==="fw")?(role==="UPLINK"||role==="CORE"||role.indexOf("WAN")===0?"10 Gbps":"1 Gbps"):"1 Gbps";
    var rx = down?0:rnd(2,role==="UPLINK"||role==="CORE"?820:340);
    var tx = down?0:rnd(2,role==="UPLINK"||role==="CORE"?540:220);
    ifs.push({ name:(kind==="fw"||kind==="router")?"ether"+(i+1):(kind==="ap"?["eth0","2.4GHz","5GHz"][i]:(kind==="switch"?"1/1/"+(i+1):"eth"+i)),
      role:role, speed:speed, status:down?"DOWN":"UP", rx:rx, tx:tx, cap:speed.indexOf("10")===0?10000:speed.indexOf("866")===0?866:1000,
      errors:down?0:ri(0,3), drops:down?0:ri(0,6) });
  }
  dev.ifs=ifs; return ifs;
}

/* ---------- backups / DR ---------- */
var BACKUPS_SEED = [
  {id:"bk-db",  nm:"Database (PostgreSQL)", status:"SUCCESS", last:"02:00", size:"48.2 GB", rpo:"15 min", rto:"45 min", repl:"HEALTHY"},
  {id:"bk-ad",  nm:"Active Directory / DC01",status:"SUCCESS", last:"01:30", size:"12.6 GB", rpo:"60 min", rto:"30 min", repl:"HEALTHY"},
  {id:"bk-file",nm:"File Server",            status:"WARNING", last:"00:15", size:"210 GB",  rpo:"24 h",   rto:"4 h",    repl:"LAGGING"},
  {id:"bk-cfg", nm:"Network configs",        status:"SUCCESS", last:"03:00", size:"84 MB",   rpo:"24 h",   rto:"1 h",    repl:"HEALTHY"}
];

/* ---------- roles ---------- */
var ROLES = {
  soc:{ nm:"SOC Analyst", short:"SOC", perms:{investigate:true, respond:true, diag:true, fw:false, settings:true, net:false} },
  netadmin:{ nm:"Network Admin", short:"NET", perms:{investigate:true, respond:false, diag:true, fw:true, settings:true, net:true} },
  secadmin:{ nm:"Security Admin", short:"SEC", perms:{investigate:true, respond:true, diag:true, fw:true, settings:true, net:true} },
  viewer:{ nm:"Viewer", short:"RO", perms:{investigate:false, respond:false, diag:false, fw:false, settings:false, net:false} }
};
function can(p){ var r=ROLES[S.role]||ROLES.soc; return !!r.perms[p]; }

/* ---------- network infrastructure incident catalogue ---------- */
var NET_SCENARIOS = {
  isp:{ nm:"ISP / WAN Outage", sev:"CRITICAL", dev:"fw", symptom:"Primary internet uplink unreachable",
    evidence:"WAN1 loss 100% · BGP session down", cause:"Upstream ISP fibre cut on IPKO segment",
    impact:"All internet-bound traffic halted until failover", rec:"Fail over to backup WAN (Kujtesa)", failover:true },
  dns:{ nm:"DNS Resolution Failure", sev:"HIGH", dev:"dns", symptom:"Internal name resolution failing",
    evidence:"BIND9 SERVFAIL rate 78% · query timeouts", cause:"Primary resolver zone-transfer stalled",
    impact:"Services using FQDNs intermittently unreachable", rec:"Restart named / promote secondary resolver" },
  dhcp:{ nm:"DHCP Scope Exhaustion", sev:"MEDIUM", dev:"dhcp", symptom:"New devices not receiving addresses",
    evidence:"VLAN30 pool 100% allocated · 0 free leases", cause:"Lease time too long + guest surge",
    impact:"New user endpoints cannot join the network", rec:"Extend scope / reduce lease time on VLAN30" },
  router:{ nm:"Core Router Instability", sev:"HIGH", dev:"rtr", symptom:"Routing flaps between segments",
    evidence:"OSPF adjacency resets · CPU 96%", cause:"Control-plane overload / possible loop",
    impact:"Latency spikes and intermittent drops core-wide", rec:"Check for loop, throttle, schedule failover" },
  switch:{ nm:"Access Switch Failure", sev:"HIGH", dev:"sw2", symptom:"User VLAN segment offline",
    evidence:"1/1/x ports down · MAC table cleared", cause:"PSU fault on access switch",
    impact:"Workstations on that switch lose connectivity", rec:"Move to redundant uplink / replace PSU" },
  vpn:{ nm:"VPN Tunnel Down", sev:"MEDIUM", dev:"vpn", symptom:"Remote users cannot connect",
    evidence:"WireGuard handshakes failing · 0/38 peers", cause:"Expired pre-shared key rotation",
    impact:"Remote workforce offline", rec:"Re-issue keys / restart gateway" },
  loss:{ nm:"High Packet Loss", sev:"MEDIUM", dev:"rtr", symptom:"Degraded throughput on core path",
    evidence:"Packet loss 17% on WAN egress", cause:"Congestion / upstream jitter",
    impact:"VoIP and remote sessions degraded", rec:"Enable QoS / failover if sustained" },
  latency:{ nm:"High Latency", sev:"LOW", dev:"rtr", symptom:"Elevated round-trip times",
    evidence:"Avg RTT 180ms (baseline 6ms)", cause:"Sub-optimal path / peering issue",
    impact:"Sluggish cloud app response", rec:"Investigate routing, consider backup path" },
  overload:{ nm:"Server Overload", sev:"HIGH", dev:"db", symptom:"Database server saturated",
    evidence:"CPU 98% · connection pool exhausted", cause:"Runaway query / traffic spike",
    impact:"Application timeouts for users", rec:"Kill offending session / scale resources" },
  ap:{ nm:"Access Point Failure", sev:"LOW", dev:"ws", symptom:"Wi-Fi coverage gap on a floor",
    evidence:"AP-Floor-1 unresponsive · 34 clients dropped", cause:"PoE budget exceeded on switch",
    impact:"Wireless users in that area offline", rec:"Rebalance PoE / reboot AP" },
  fwmiscfg:{ nm:"Firewall Misconfiguration", sev:"HIGH", dev:"fw", symptom:"Legitimate traffic being dropped",
    evidence:"Rule FW-003 shadowed by broader deny", cause:"Rule ordering change not reviewed",
    impact:"Web tier cannot reach database", rec:"Reorder rules / restore last-known-good config" },
  vlanmiscfg:{ nm:"VLAN Misconfiguration", sev:"MEDIUM", dev:"sw1", symptom:"Cross-VLAN leakage detected",
    evidence:"GUEST(40) frames seen on SERVER(20)", cause:"Trunk allowed-VLAN list too broad",
    impact:"Segmentation boundary weakened", rec:"Prune trunk allowed VLANs / audit access ports" }
};

/* ---------- DIAGNOSTICS (simulated) ---------- */
var DIAG_KINDS = [
  {k:"ping", nm:"Ping", icon:"activity"},
  {k:"trace", nm:"Traceroute", icon:"git-branch"},
  {k:"dns", nm:"DNS Lookup", icon:"globe"},
  {k:"port", nm:"Port Check", icon:"scan-line"},
  {k:"latency", nm:"Latency Test", icon:"clock"},
  {k:"loss", nm:"Packet Loss", icon:"trending-down"}
];

/* =====================================================================
   HEALTH SCORES (three separate scores, each with a breakdown)
   ===================================================================== */
function healthSecurity(){
  var f=[]; var v=100;
  var threats=activeAttacks(); if(threats){ v-=threats*7; f.push({l:"Active threats",d:-threats*7}); }
  var open=S.incidents.filter(function(i){return i.kind!=="NETWORK"&&i.status!=="RESOLVED"&&i.status!=="MITIGATED"&&i.status!=="CLOSED"&&i.status!=="FALSE POSITIVE";}).length;
  if(open){ v-=open*4; f.push({l:"Open security incidents",d:-open*4}); }
  var crit=criticalCount(); if(crit){ v-=crit*6; f.push({l:"Critical alerts (15m)",d:-crit*6}); }
  var idsOn=S.idsRules.length; f.push({l:"IDS/IPS coverage ("+idsOn+" rules)",d:+6}); v+=6;
  var fwOn=S.fwRules.filter(function(r){return r.enabled;}).length; f.push({l:"Firewall protection ("+fwOn+" rules)",d:+8}); v+=8;
  v=clamp(Math.round(v),2,100);
  return {v:v, f:f};
}
function healthNetwork(){
  var f=[]; var v=100;
  var down=S.devices.filter(function(d){return d.st==="OFFLINE";}).length; if(down){ v-=down*9; f.push({l:down+" device(s) offline",d:-down*9}); }
  var warn=S.devices.filter(function(d){return d.st==="WARNING";}).length; if(warn){ v-=warn*3; f.push({l:warn+" device(s) degraded",d:-warn*3}); }
  var wanDown=S.wan&&S.wan[0].status!=="ONLINE"; if(wanDown){ v-=18; f.push({l:"Primary WAN down (failover)",d:-18}); }
  if(S.packetLoss>2){ v-=Math.round(S.packetLoss); f.push({l:"Packet loss "+S.packetLoss.toFixed(1)+"%",d:-Math.round(S.packetLoss)}); }
  if(S.latency>40){ v-=Math.round((S.latency-40)/6); f.push({l:"Latency "+Math.round(S.latency)+"ms",d:-Math.round((S.latency-40)/6)}); }
  f.push({l:"Availability "+S.availability.toFixed(2)+"%",d:S.availability>99.5?+5:-4}); v+=S.availability>99.5?5:-4;
  v=clamp(Math.round(v),2,100); return {v:v,f:f};
}
function healthInfra(){
  var f=[]; var v=100;
  var over=S.servers.filter(function(s){return s.cpu>90;}).length; if(over){ v-=over*8; f.push({l:over+" server(s) overloaded",d:-over*8}); }
  var disk=S.servers.filter(function(s){return s.disk>85;}).length; if(disk){ v-=disk*5; f.push({l:disk+" server(s) low disk",d:-disk*5}); }
  var bkWarn=S.backups.filter(function(b){return b.status!=="SUCCESS";}).length; if(bkWarn){ v-=bkWarn*6; f.push({l:bkWarn+" backup(s) not clean",d:-bkWarn*6}); }
  f.push({l:"Replication healthy",d:+6}); v+=6;
  f.push({l:"Backups within RPO",d:+4}); v+=4;
  v=clamp(Math.round(v),2,100); return {v:v,f:f};
}
function recomputeHealth(){
  S.health.sec=healthSecurity(); S.health.net=healthNetwork(); S.health.infra=healthInfra();
  S.score=S.health.sec.v; // security score drives legacy metric card
}

/* =====================================================================
   TIMELINE · AUDIT · NOTIFICATIONS
   ===================================================================== */
function pushTimeline(sev, msg, cat){
  var e={ id:S.seq++, t:simNow(), sev:sev, msg:msg, cat:cat||"SECURITY" };
  S.timeline.unshift(e); if(S.timeline.length>300) S.timeline.pop();
  emit("timeline", e); return e;
}
function pushAudit(action, target, result){
  var a={ id:S.seq++, t:simNow(), user:S.operator, role:(ROLES[S.role]||ROLES.soc).short, action:action, target:target||"—", result:result||"OK" };
  S.audit.unshift(a); if(S.audit.length>300) S.audit.pop();
  emit("audit", a); return a;
}
function pushNotif(cat, sev, title, msg, link){
  var n={ id:S.seq++, t:simNow(), cat:cat, sev:sev, title:title, msg:msg||"", link:link||null, read:false };
  S.notifications.unshift(n); if(S.notifications.length>120) S.notifications.pop();
  emit("notif", n); return n;
}
function unreadNotif(){ return S.notifications.filter(function(n){return !n.read;}).length; }
function markAllRead(){ S.notifications.forEach(function(n){n.read=true;}); emit("notif"); saveState(); }

/* =====================================================================
   WAN FAILOVER
   ===================================================================== */
function wanFailover(){
  var w1=S.wan[0], w2=S.wan[1];
  if (w1.status!=="ONLINE") return;
  w1.status="OFFLINE"; w1.loss=100;
  pushTimeline("CRITICAL","WAN1 ("+w1.isp+") went OFFLINE — link loss 100%","NETWORK");
  var t0=Date.now();
  setTimeout(function(){
    w2.status="ONLINE"; w2.role="ACTIVE";
    S.availability=clamp(S.availability-0.6,97,100);
    pushTimeline("HIGH","Failover initiated → WAN2 ("+w2.isp+") now ACTIVE ("+((Date.now()-t0)/1000).toFixed(1)+"s)","NETWORK");
    pushNotif("NETWORK","HIGH","WAN failover complete","Traffic migrated to backup ISP · "+((Date.now()-t0)/1000).toFixed(1)+"s","network");
    emit("wan"); emit("metrics"); recomputeHealth(); emit("score");
  }, reduceMotion?200:1600);
  emit("wan");
}
function wanRestore(){
  var w1=S.wan[0], w2=S.wan[1];
  w1.status="ONLINE"; w1.loss=0; w2.status="STANDBY"; w2.role="BACKUP";
  S.availability=clamp(S.availability+0.4,97,100);
  pushTimeline("LOW","Primary link restored — WAN1 ("+w1.isp+") back ONLINE","NETWORK");
  pushNotif("NETWORK","LOW","Primary WAN restored","Reverted from backup to WAN1","network");
  emit("wan"); emit("metrics"); recomputeHealth(); emit("score");
}

/* =====================================================================
   NETWORK INFRASTRUCTURE INCIDENT  (distinct from cyber attack)
   ===================================================================== */
function triggerNetIncident(typeId){
  var sc=NET_SCENARIOS[typeId]; if(!sc) return;
  var dev=S.devices.find(function(d){return d.id===sc.dev;});
  if(dev && dev.st!=="OFFLINE"){ dev._prev=dev.st; dev.st = (sc.sev==="CRITICAL"?"OFFLINE":"WARNING"); recomputeDevices(); emit("device",dev); }
  // network-specific side effects
  if (typeId==="loss"||typeId==="isp") S.packetLoss=clamp((S.packetLoss||0)+ (typeId==="isp"?100:17), 0, 100);
  if (typeId==="latency") S.latency=clamp((S.latency||6)+174,6,400);
  if (typeId==="overload"){ var srv=S.servers.find(function(s){return s.id==="pg";}); if(srv) srv.cpu=98; }
  S.availability=clamp(S.availability - (sc.sev==="CRITICAL"?1.4:sc.sev==="HIGH"?0.5:0.15), 96, 100);

  var inc=createIncident({
    title:sc.nm, sev:sc.sev, src:"infrastructure", target:(dev?dev.nm:"network"), mitre:"—",
    status:"NEW", devId:sc.dev, kind:"NETWORK",
    rca:{ symptom:sc.symptom, evidence:sc.evidence, component:(dev?dev.nm:sc.dev), cause:sc.cause, impact:sc.impact, rec:sc.rec }
  });
  addEvent(sc.sev==="LOW"?"LOW":sc.sev==="MEDIUM"?"MEDIUM":"HIGH","NETWORK: "+sc.nm, sc.evidence, "NET");
  addLog("NET","incident: "+sc.symptom+" · "+sc.evidence);
  pushTimeline(sc.sev,"Network incident — "+sc.nm+" on "+(dev?dev.nm:sc.dev),"NETWORK");
  pushNotif("NETWORK",sc.sev,"Network: "+sc.nm,sc.impact,"incidents");
  toast(sc.sev,"Network incident: "+sc.nm, sc.symptom, "network");
  if (sc.failover) wanFailover();
  beep(sc.sev); recomputeHealth(); emit("metrics"); emit("score"); emit("incident",inc);
  return inc;
}

/* =====================================================================
   DIAGNOSTICS RUNNER (simulated, streamed to a callback)
   ===================================================================== */
function runDiag(dev, kind, onLine, onDone){
  var target=dev.ip.split("/")[0];
  var offline = dev.st==="OFFLINE";
  function line(cls,txt){ onLine && onLine(cls,txt); }
  if (kind==="ping"){
    line("head","PING "+target+" 56 bytes");
    var i=0,recv=0,times=[];
    var iv=setInterval(function(){
      if(i>=4){ clearInterval(iv); var loss=Math.round((4-recv)/4*100); var avg=times.length?(times.reduce(function(a,b){return a+b;},0)/times.length):0;
        line("res","--- "+target+" statistics ---");
        line(loss>0?"warn":"ok","4 sent · "+recv+" received · "+loss+"% loss · avg "+avg.toFixed(1)+"ms");
        onDone&&onDone({loss:loss,avg:avg}); return; }
      var drop = offline || (dev.st==="WARNING"&&chance(.4)) || chance(.05);
      if(drop){ line("err","Request timeout for icmp_seq "+i); }
      else { var t=(dev.st==="WARNING"?rnd(30,180):rnd(0.4,4)); recv++; times.push(t); line("res","64 bytes from "+target+": icmp_seq="+i+" ttl=64 time="+t.toFixed(1)+"ms"); }
      i++;
    }, reduceMotion?40:280);
  } else if (kind==="trace"){
    line("head","traceroute to "+target+", 30 hops max");
    var hops=[["10.10.10.1","core-rtr"],["10.10.0.1","edge-fw"],[S.wan[0].ip,S.wan[0].isp],["8.8.8.8","upstream"],[target,dev.nm]];
    var h=0; var iv2=setInterval(function(){ if(h>=hops.length||(offline&&h>=2)){ clearInterval(iv2); if(offline) line("err","* * *  destination unreachable"); else line("ok","trace complete · "+hops.length+" hops"); onDone&&onDone(); return; }
      line("res"," "+(h+1)+"  "+hops[h][0]+"  ("+hops[h][1]+")  "+rnd(0.3,6+h*2).toFixed(2)+" ms"); h++; }, reduceMotion?40:260);
  } else if (kind==="dns"){
    line("head","dig "+ (dev.nm.toLowerCase().replace(/[^a-z0-9]/g,"")||"host") +".darty.local");
    setTimeout(function(){ line("res","; ANSWER SECTION:"); line("ok",(dev.nm.toLowerCase().replace(/[^a-z0-9]/g,""))+".darty.local. 3600 IN A "+target); line("res","; Query time: "+ri(1,8)+" msec · SERVER: 10.10.10.5"); onDone&&onDone(); }, reduceMotion?60:520);
  } else if (kind==="port"){
    line("head","port-check "+target);
    var ports=[22,80,443,3389,445,53]; var i3=0;
    var iv3=setInterval(function(){ if(i3>=ports.length){ clearInterval(iv3); line("ok","scan complete"); onDone&&onDone(); return; }
      var open = !offline && chance(.5); line(open?"warn":"res","  "+target+":"+ports[i3]+"  "+(open?"OPEN":"closed")); i3++; }, reduceMotion?30:170);
  } else if (kind==="latency"){
    line("head","latency probe "+target+" (10 samples)");
    var samples=[]; var i4=0;
    var iv4=setInterval(function(){ if(i4>=10){ clearInterval(iv4); var avg=samples.reduce(function(a,b){return a+b;},0)/samples.length; var min=Math.min.apply(null,samples),max=Math.max.apply(null,samples);
        line(avg>50?"warn":"ok","min "+min.toFixed(1)+" / avg "+avg.toFixed(1)+" / max "+max.toFixed(1)+" ms · jitter "+(max-min).toFixed(1)+"ms"); onDone&&onDone(); return; }
      var t=dev.st==="WARNING"?rnd(40,170):rnd(0.5,5); samples.push(t); line("res","sample "+(i4+1)+": "+t.toFixed(1)+"ms"); i4++; }, reduceMotion?25:120);
  } else if (kind==="loss"){
    line("head","packet-loss test "+target+" (100 pkts)");
    setTimeout(function(){ var loss= offline?100 : dev.st==="WARNING"?ri(6,22):ri(0,1); line(loss>2?"err":"ok","sent 100 · recv "+(100-loss)+" · loss "+loss+"%"); onDone&&onDone({loss:loss}); }, reduceMotion?80:700);
  }
}

/* =====================================================================
   PERSISTENCE (localStorage) — settings, prefs, incidents, notes, rules
   ===================================================================== */
var LS_KEY = "ccc_state_v2";
function snapshot(){
  return {
    v:2, ts:Date.now(),
    settings:S.settings, role:S.role, theme:document.documentElement.getAttribute("data-theme"),
    soundOn:S.soundOn, redTeam:S.redTeam, blockedAttacks:S.blockedAttacks,
    fwRules:S.fwRules.map(function(r){return {id:r.id,enabled:r.enabled};}),
    notif:S.notifications.slice(0,60).map(function(n){return {id:n.id,cat:n.cat,sev:n.sev,title:n.title,msg:n.msg,link:n.link,read:n.read,t:n.t.getTime()};}),
    incidents:S.incidents.slice(0,40).map(function(i){return {id:i.id,title:i.title,sev:i.sev,src:i.src,target:i.target,mitre:i.mitre,status:i.status,devId:i.devId,kind:i.kind,assignee:i.assignee,notes:i.notes||[],evidence:i.evidence,rca:i.rca,opened:i.opened.getTime(),timeline:i.timeline};}),
    incSeq:S.incSeq
  };
}
var _saveT=null;
function saveState(){ if(!S.settings||S.settings.persist===false) return; clearTimeout(_saveT); _saveT=setTimeout(function(){ try{ localStorage.setItem(LS_KEY, JSON.stringify(snapshot())); S.lastSaved=Date.now(); }catch(e){} }, 400); }
function loadState(){
  var raw; try{ raw=localStorage.getItem(LS_KEY); }catch(e){ return false; }
  if(!raw) return false;
  try{
    var d=JSON.parse(raw); if(!d||d.v!==2) return false;
    if(d.settings) S.settings=Object.assign(S.settings,d.settings);
    if(d.role) S.role=d.role;
    if(typeof d.soundOn==="boolean") S.soundOn=d.soundOn;
    if(typeof d.blockedAttacks==="number") S.blockedAttacks=d.blockedAttacks;
    if(d.theme==="red"){ S.redTeam=true; document.documentElement.setAttribute("data-theme","red"); }
    if(d.fwRules) d.fwRules.forEach(function(sr){ var r=S.fwRules.find(function(x){return x.id===sr.id;}); if(r) r.enabled=sr.enabled; });
    if(d.notif) S.notifications=d.notif.map(function(n){ n.t=new Date(n.t); return n; });
    if(typeof d.incSeq==="number") S.incSeq=d.incSeq;
    if(d.incidents&&d.incidents.length){ S.incidents=d.incidents.map(function(i){ i.opened=new Date(i.opened); i.sel=false; i.notes=i.notes||[]; return i; }); }
    return true;
  }catch(e){ return false; }
}
function resetState(){
  try{ localStorage.removeItem(LS_KEY); }catch(e){}
  location.reload();
}

/* =====================================================================
   EXPORT (JSON / CSV)
   ===================================================================== */
function downloadFile(name, content, mime){
  try{
    var blob=new Blob([content],{type:mime||"text/plain"});
    var url=URL.createObjectURL(blob);
    var a=document.createElement("a"); a.href=url; a.download=name; document.body.appendChild(a); a.click();
    setTimeout(function(){ a.remove(); URL.revokeObjectURL(url); },100);
    return true;
  }catch(e){ toast("MEDIUM","Export blocked","Browser prevented the download","download"); return false; }
}
function toCSV(rows){ return rows.map(function(r){ return r.map(function(c){ c=String(c==null?"":c); return /[",\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c; }).join(","); }).join("\n"); }
function exportKind(kind, fmt){
  var name, content, mime;
  if(kind==="events"){ var rows=[["time","severity","kind","message","source"]].concat(S.events.map(function(e){return [absTime(e.t),e.sev,e.kind,e.b,e.x];}));
    if(fmt==="csv"){ content=toCSV(rows); mime="text/csv"; name="events.csv"; } else { content=JSON.stringify(S.events.map(function(e){return {time:e.t.toISOString(),severity:e.sev,kind:e.kind,message:e.b,source:e.x};}),null,2); mime="application/json"; name="events.json"; } }
  else if(kind==="firewall"){ var fr=[["time","src","dst","port","proto","action","rule"]].concat(S.firewall.map(function(f){return [absTime(f.t),f.src,f.dst,f.port,f.proto,f.action,f.ruleId||"—"];})); content=toCSV(fr); mime="text/csv"; name="firewall-flows.csv"; fmt="csv"; }
  else if(kind==="incidents"){ if(fmt==="csv"){ var ir=[["id","title","severity","status","kind","source","target","mitre","opened"]].concat(S.incidents.map(function(i){return [i.id,i.title,i.sev,i.status,i.kind||"SECURITY",i.src,i.target,i.mitre,absTime(i.opened)];})); content=toCSV(ir); mime="text/csv"; name="incidents.csv"; } else { content=JSON.stringify(S.incidents.map(function(i){return {id:i.id,title:i.title,severity:i.sev,status:i.status,kind:i.kind||"SECURITY",source:i.src,target:i.target,mitre:i.mitre,opened:i.opened.toISOString(),assignee:i.assignee,notes:i.notes,timeline:i.timeline,rca:i.rca};}),null,2); mime="application/json"; name="incidents.json"; } }
  else if(kind==="devices"){ content=JSON.stringify(S.devices.map(function(d){return {id:d.id,name:d.nm,ip:d.ip,type:d.type,zone:d.zone,vlan:d.vlan,vendor:d.meta&&d.meta.v,model:d.meta&&d.meta.m,firmware:d.meta&&d.meta.fw,mac:d.mac,status:d.st,role:d.role};}),null,2); mime="application/json"; name="devices.json"; fmt="json"; }
  else if(kind==="audit"){ var ar=[["time","user","role","action","target","result"]].concat(S.audit.map(function(a){return [absTime(a.t),a.user,a.role,a.action,a.target,a.result];})); content=toCSV(ar); mime="text/csv"; name="audit-log.csv"; fmt="csv"; }
  if(content){ downloadFile(name, content, mime); pushAudit("Exported "+kind, name, "OK"); toast("INFO","Export ready",name+" downloaded","download"); }
}

/* =====================================================================
   HISTORICAL DATA — synthesize a series for a chosen range
   ===================================================================== */
function histFor(metric, points, cur, lo, hi){
  var arr=[], v=cur;
  for(var i=points-1;i>=0;i--){ arr.unshift(clamp(v,lo,hi)); v = cur + Math.sin(i/5)* (hi-lo)*0.06 + rnd(-(hi-lo)*0.04,(hi-lo)*0.04); }
  arr[arr.length-1]=clamp(cur,lo,hi); return arr;
}
var RANGES={ "1h":{pts:30,lbl:"Last 1 hour"}, "6h":{pts:36,lbl:"Last 6 hours"}, "24h":{pts:48,lbl:"Last 24 hours"}, "7d":{pts:56,lbl:"Last 7 days"} };

/* =====================================================================
   PLATFORM INIT — merge new model into shared state
   ===================================================================== */
function platformInit(){
  S.operator="B. Misimi";
  S.role="soc";
  S.timeline=[]; S.audit=[]; S.notifications=[];
  S.fwRules=FW_RULES_SEED.map(function(r){return Object.assign({},r);});
  S.idsRules=IDS_RULES_SEED.map(function(r){return Object.assign({},r);});
  S.vlans=VLANS; S.zones=ZONES;
  S.wan=WAN_SEED.map(function(w){return Object.assign({},w);});
  S.backups=BACKUPS_SEED.map(function(b){return Object.assign({},b);});
  S.packetLoss=0.2; S.latency=6;
  S.health={sec:{v:94,f:[]},net:{v:99,f:[]},infra:{v:97,f:[]}};
  S.range="1h";
  S.settings={ persist:true, simSpeedMs:2000, threatFreq:"normal", autoIncident:true, reducedMotionForce:false, demoMode:true };
  S.lastSaved=0;
}
/* enrich the device list with rich metadata + extra assets + interfaces */
function enrichDevices(){
  S.devices.forEach(function(d){
    var m=DEVICE_META[d.id];
    if(m){ d.zone=m.zone; d.vlan=m.vlan; d.kind=m.kind; d.meta=m.meta; }
    d.mac=d.mac||(d.id==="inet"?"—":macAddr());
    d.fwv=d.meta?d.meta.fw:"—";
    d.diagram = d.diagram!==false;
    genInterfaces(d);
  });
  // append extra (non-diagram) assets
  DEVICE_EXTRA.forEach(function(e){
    if(S.devices.find(function(x){return x.id===e.id;})) return;
    var dd=Object.assign({ layer:5, x:0, y:0 }, e); dd.mac=macAddr(); dd.fwv=e.meta.fw; genInterfaces(dd);
    S.devices.push(dd);
  });
  S.devicesTotal=S.devices.length; recomputeDevices();
}

/* ---------- baseline seeding for platform panels ---------- */
function seedPlatform(){
  if (!S.timeline.length){
    [["LOW","Platform initialised · monitoring "+S.devices.length+" assets","SYSTEM"],
     ["LOW","Firewall policy loaded · "+S.fwRules.length+" rules active","SECURITY"],
     ["LOW","IDS/IPS engine online · "+S.idsRules.length+" signatures","SECURITY"],
     ["LOW","WAN1 ("+S.wan[0].isp+") up · WAN2 on standby","NETWORK"]].forEach(function(e){ pushTimeline(e[0],e[1],e[2]); });
  }
  if (!S.notifications.length){
    pushNotif("SYSTEM","LOW","Welcome back, "+S.operator,"Session authenticated · role "+(ROLES[S.role]||ROLES.soc).nm,null);
    pushNotif("NETWORK","LOW","Backups healthy","3 of 4 jobs SUCCESS · file-server LAGGING","reports");
  }
  if (!S.audit.length){
    S.audit.push({id:S.seq++,t:new Date(Date.now()-3600000),user:S.operator,role:(ROLES[S.role]||ROLES.soc).short,action:"Signed in",target:"console",result:"OK"});
  }
  recomputeHealth();
}
/* =====================================================================
   PRODUCTION UPGRADE — PLATFORM UX + NEW VIEWS
   Registered via registerPlatformViews() during init (overrides base
   registrations for firewall/incidents; adds segmentation/infra/etc).
   ===================================================================== */

/* small helpers */
function kv2(k,v,mono){ return el("div",{class:"inc-kv"},[ el("div",{class:"k",text:k}), el("div",{class:"v",style:mono===false?{fontFamily:"var(--sans)"}:null,text:v}) ]); }
function healthColor(v){ return v>=80?"var(--ok)":v>=55?"var(--warn)":"var(--crit)"; }
function healthCards(){
  var wrap=el("div",{class:"health"});
  [["sec","Security Health","shield-check"],["net","Network Health","network"],["infra","Infrastructure Health","server"]].forEach(function(h){
    var d=S.health[h[0]];
    var card=el("div",{class:"hcard"});
    card.appendChild(el("div",{class:"htop"},[
      el("span",{class:"hlabel",text:h[1]}),
      el("span",{style:{color:"var(--acc)"},html:iconHTML(h[2])})
    ]));
    card.appendChild(el("div",{class:"hbig",style:{color:healthColor(d.v)},text:d.v}));
    card.appendChild(el("div",{class:"hbar"}, el("i",{style:{width:d.v+"%",background:healthColor(d.v)}})));
    var facs=el("div");
    (d.f||[]).slice(0,4).forEach(function(f){ facs.appendChild(el("div",{class:"hf"},[ el("span",{text:f.l}), el("b",{class:f.d>=0?"up":"dn",text:(f.d>0?"+":"")+f.d}) ])); });
    card.appendChild(facs);
    wrap.appendChild(card);
  });
  return wrap;
}

/* =====================================================================
   ENHANCED DEVICE MODAL (Overview / Interfaces / Diagnostics)
   ===================================================================== */
function openDeviceModal(d){
  var sl = deviceStatusList(d.st);
  var isAtk = d.st==="ATTACK";
  var body = el("div");
  var tabsRow = el("div",{class:"mtabs"});
  var content = el("div",{style:{padding:"18px"}});
  var tabs = [
    {k:"ov", nm:"Overview"},
    {k:"if", nm:"Interfaces ("+((d.ifs||[]).length)+")"},
    {k:"diag", nm:"Diagnostics"}
  ];
  var cur="ov";
  tabs.forEach(function(t,idx){ tabsRow.appendChild(el("button",{class:cur===t.k?"on":"",onclick:function(){ cur=t.k; qsa("button",tabsRow).forEach(function(b,i){ b.classList.toggle("on", tabs[i].k===cur); }); draw(); },text:t.nm})); });
  var ifTimer=null;
  function drawOverview(){
    content.appendChild(el("div",{class:"kv-list"},[
      row2("Hostname", d.nm), row2("Management IP", d.ip),
      row2("MAC", d.mac||"—"), row2("Vendor / Model", d.meta?(d.meta.v+" · "+d.meta.m):"—"),
      row2("Firmware", d.fwv||"—"), row2("Zone", d.zone?zone(d.zone).nm:"—"),
      row2("VLAN", d.vlan?("VLAN "+d.vlan+" ("+(vlan(d.vlan)?vlan(d.vlan).nm:"")+")"):"—"),
      row2("Role", d.role), row2("Status", sl.t), row2("Security", isAtk?"UNDER ATTACK":d.st==="WARNING"?"DEGRADED":"PROTECTED"),
      row2("Uptime", (98+Math.random()*2).toFixed(3)+"% · seen "+relTime(simNow()))
    ]));
  }
  function row2(k,v){ return el("div",{class:"row"},[ el("span",{class:"k",text:k}), el("span",{class:"v",text:v}) ]); }
  function drawIf(){
    if(!d.ifs||!d.ifs.length){ content.appendChild(emptyState("network","No interfaces on this asset.")); return; }
    var tbl=el("table",{class:"if-tbl"});
    tbl.appendChild(el("thead",{},el("tr",{},["IF","Role","Speed","Status","RX","TX","Err","Drp","Util"].map(function(h){return el("th",{text:h});}))));
    var tb=el("tbody"); tbl.appendChild(tb);
    function fill(){
      clear(tb);
      d.ifs.forEach(function(f){
        // live jitter
        if(f.status==="UP"){ f.rx=clamp(f.rx+rnd(-30,30),0,f.cap); f.tx=clamp(f.tx+rnd(-20,20),0,f.cap*0.7); }
        var util=Math.round((f.rx+f.tx)/f.cap*100);
        tb.appendChild(el("tr",{},[
          el("td",{style:{color:"var(--txt)"},text:f.name}),
          el("td",{style:{color:"var(--txt-3)"},text:f.role}),
          el("td",{text:f.speed}),
          el("td",{}, el("span",{class:f.status==="UP"?"if-up":"if-down",text:f.status})),
          el("td",{text:f.status==="UP"?fmtBps(f.rx):"—"}),
          el("td",{text:f.status==="UP"?fmtBps(f.tx):"—"}),
          el("td",{style:{color:f.errors?"var(--warn)":"var(--txt-3)"},text:f.errors}),
          el("td",{style:{color:f.drops?"var(--warn)":"var(--txt-3)"},text:f.drops}),
          el("td",{class:"if-util"}, el("div",{class:"ib"}, el("i",{style:{width:Math.min(util,100)+"%",background:util>80?"var(--crit)":util>50?"var(--warn)":"var(--acc)"}})))
        ]));
      });
    }
    content.appendChild(tbl);
    fill();
    if(!reduceMotion){ ifTimer=setInterval(function(){ if(document.contains(tbl)) fill(); else clearInterval(ifTimer); }, 1400); }
  }
  function drawDiag(){
    if(!can("diag")){ content.appendChild(el("div",{class:"rt-banner"},[ el("span",{html:iconHTML("lock")}), el("div",{},[el("b",{text:"Diagnostics restricted. "}),"Your role ("+(ROLES[S.role]||ROLES.soc).nm+") cannot run diagnostics. Switch to Network Admin in Settings."]) ])); return; }
    var out=el("div",{class:"diag-out"}); out.appendChild(el("div",{class:"dl res",text:"Select a diagnostic to run against "+d.ip.split("/")[0]+" …"}));
    var btns=el("div",{class:"diag-btns"});
    DIAG_KINDS.forEach(function(dk){
      btns.appendChild(el("button",{class:"btn xs",onclick:function(ev){
        var b=ev.currentTarget; b.disabled=true;
        clear(out);
        runDiag(d, dk.k, function(cls,txt){ out.appendChild(el("div",{class:"dl "+cls,text:txt})); out.scrollTop=out.scrollHeight; }, function(){ b.disabled=false; pushAudit("Ran "+dk.nm, d.nm, "OK"); });
      }},[el("span",{html:iconHTML(dk.icon)}), dk.nm]));
    });
    content.appendChild(btns); content.appendChild(out);
  }
  function draw(){
    if(ifTimer){ clearInterval(ifTimer); ifTimer=null; }
    clear(content);
    if(cur==="ov") drawOverview(); else if(cur==="if") drawIf(); else drawDiag();
  }
  body.appendChild(tabsRow); body.appendChild(content);
  // footer actions
  var foot=el("div",{class:"flex gap-2 wrap",style:{padding:"0 18px 18px"}},[
    isAtk&&can("respond")? el("button",{class:"btn danger sm",onclick:function(){ isolateDevice(d); closeModal(); }},[el("span",{html:iconHTML("power")}),"Isolate Device"]) : null,
    (d.st==="OFFLINE")? el("button",{class:"btn sm",onclick:function(){ d.st="ONLINE"; recomputeDevices(); recomputeHealth&&recomputeHealth(); emit("device",d); pushAudit("Restored device",d.nm,"OK"); toast("INFO","Device restored",d.nm+" back online","check-circle"); closeModal(); }},[el("span",{html:iconHTML("power")}),"Bring Online"])
      : (can("respond")? el("button",{class:"btn warn sm",onclick:function(){ d.st="OFFLINE"; recomputeDevices(); recomputeHealth&&recomputeHealth(); emit("device",d); pushAudit("Took device offline",d.nm,"OK"); toast("MEDIUM","Device offline",d.nm+" administratively down","power"); closeModal(); }},[el("span",{html:iconHTML("power")}),"Take Offline"]) : null),
    el("button",{class:"btn ghost sm",onclick:closeModal},"Close")
  ]);
  body.appendChild(foot);
  openModal({ icon:d.type, iconSev:isAtk?"CRITICAL":(d.st==="WARNING"?"MEDIUM":"INFO"), title:d.nm, sub:(d.meta?d.meta.v+" "+d.meta.m+" · ":"")+d.ip, body:body });
  draw();
  // stop interface timer when modal closes
  var mo=new MutationObserver(function(){ if(!document.querySelector(".modal-bg")){ if(ifTimer)clearInterval(ifTimer); mo.disconnect(); } });
  mo.observe(document.body,{childList:true});
}

/* =====================================================================
   ENHANCED INCIDENT ACTIONS (audit + health + timeline + persistence)
   ===================================================================== */
var ANALYSTS=["B. Misimi","A. Krasniqi","D. Berisha","Tier-2 On-call"];
function incAct(inc, act){
  if(!can("respond")){ toast("MEDIUM","Permission denied","Your role cannot run response actions","lock"); return; }
  inc.status=act.to; inc.updated=simNow();
  var note=typeof act.note==="function"?act.note(inc):act.note;
  incTimeline(inc, note);
  if(act.k==="isolate"||act.k==="block"){
    var dev=inc.devId && S.devices.find(function(d){return d.id===inc.devId;});
    if(dev){ if(dev._recoverT) clearTimeout(dev._recoverT); dev.st=act.k==="isolate"?"OFFLINE":"WARNING"; recomputeDevices(); emit("device",dev);
      if(act.k==="isolate") setTimeout(function(){ if(dev.st==="OFFLINE"){ dev.st="ONLINE"; recomputeDevices(); emit("device",dev); recomputeHealth(); } },9000); }
    S.suspicious=Math.max(3,S.suspicious-ri(2,5)); S.threat=Math.max(8,S.threat-ri(6,12));
    addLog("SEC", act.k==="block"?("iptables -A INPUT -s "+inc.src+" -j DROP"):("containment applied · "+inc.target));
  }
  if(act.k==="mitigate"||act.k==="resolve"){ S.threat=Math.max(8,S.threat-14); addEvent("LOW","Incident "+act.to.toLowerCase(),inc.id,"SEC"); }
  addEvent(inc.sev==="CRITICAL"?"HIGH":"MEDIUM","Incident "+inc.id+" → "+act.to, inc.title.slice(0,40),"SEC");
  pushAudit(act.audit||act.label, inc.id, "OK");
  pushTimeline(inc.sev, "Analyst "+act.label.toLowerCase()+" · "+inc.id, inc.kind);
  toast("INFO","Response action executed",act.label+" · "+inc.id,"list-checks");
  recomputeHealth(); saveState();
  emit("incident-update", inc); emit("metrics"); emit("score");
}
var INC_ACTS=[
  {k:"triage",label:"Triage",icon:"search",cls:"",to:"TRIAGED",note:"Triaged · analyst assigned",audit:"Triaged incident"},
  {k:"investigate",label:"Investigate",icon:"eye",cls:"",to:"INVESTIGATING",note:"Investigation in progress",audit:"Started investigation"},
  {k:"isolate",label:"Isolate",icon:"power",cls:"warn",to:"CONTAINED",note:"Affected host isolated via NAC",audit:"Isolated device"},
  {k:"block",label:"Block IP",icon:"ban",cls:"danger",to:"CONTAINED",note:function(i){return "Source "+i.src+" null-routed at edge firewall";},audit:"Blocked source IP"},
  {k:"escalate",label:"Escalate",icon:"trending-up",cls:"danger",to:"ESCALATED",note:"Escalated to Tier-2 / on-call",audit:"Escalated incident"},
  {k:"fp",label:"False Positive",icon:"check-circle",cls:"ghost",to:"FALSE POSITIVE",note:"Reviewed · marked false positive",audit:"Marked false positive"},
  {k:"resolve",label:"Resolve",icon:"shield-check",cls:"",to:"RESOLVED",note:"Threat neutralized · incident resolved",audit:"Resolved incident"}
];

/* =====================================================================
   REGISTER ALL PLATFORM VIEWS
   ===================================================================== */
function registerPlatformViews(){

  /* ---------------- FIREWALL (rule engine + flows + inspector) ------- */
  registerView("firewall", {
    title:"Firewall Monitor", sub:"Rule base · live flow evaluation · NGFW edge", icon:"shield",
    actions:function(){ return el("div",{class:"flex gap-2 wrap"},[
      el("span",{class:"chip",id:"fwRuleChip"}),
      el("button",{class:"btn sm ghost",onclick:function(){ exportKind("firewall","csv"); }},[el("span",{html:iconHTML("download")}),"Export CSV"])
    ]); },
    build:function(v){
      // rule base
      var ruleBody=el("div",{class:"tbl-wrap"});
      v.appendChild(panel("Rule Base",{icon:"list-checks",sub:S.fwRules.length+" rules",flush:true,
        right: can("fw")? el("span",{class:"chip acc",text:"EDITABLE"}) : el("span",{class:"chip",text:"READ-ONLY"})
      }, ruleBody));
      function drawRules(){
        clear(ruleBody);
        var tbl=el("table",{class:"tbl"});
        tbl.appendChild(el("thead",{},el("tr",{},["","ID","Source","Dest","Port","Proto","Action","Log","Enabled"].map(function(h){return el("th",{text:h});}))));
        var tb=el("tbody");
        S.fwRules.forEach(function(r){
          var tog=el("button",{class:"toggle"+(r.enabled?" on":""),"aria-label":"toggle "+r.id,onclick:function(){
            if(!can("fw")){ toast("MEDIUM","Permission denied","Only Network/Security Admin can edit rules","lock"); return; }
            r.enabled=!r.enabled; tog.classList.toggle("on",r.enabled); var tr=tog.closest("tr"); if(tr) tr.style.opacity=r.enabled?"":".5"; pushAudit((r.enabled?"Enabled":"Disabled")+" firewall rule",r.id,"OK"); pushTimeline("LOW","Firewall rule "+r.id+" "+(r.enabled?"enabled":"disabled"),"SECURITY"); recomputeHealth(); saveState(); toast("INFO","Rule updated",r.id+" "+(r.enabled?"enabled":"disabled")+" · future traffic re-evaluated","shield");
          }});
          tb.appendChild(el("tr",{style:r.enabled?null:{opacity:".5"}},[
            el("td",{}, el("span",{style:{color:r.action==="ALLOW"?"var(--ok)":r.action==="DROP"?"var(--crit)":"var(--high)"},html:iconHTML(r.action==="ALLOW"?"check-circle":"ban")})),
            el("td",{style:{color:"var(--txt)"},text:r.id}),
            el("td",{title:r.note,text:r.src}), el("td",{text:r.dst}),
            el("td",{text:r.port}), el("td",{style:{color:"var(--txt-3)"},text:r.proto}),
            el("td",{}, el("span",{class:"act-tag act-"+r.action,text:r.action})),
            el("td",{style:{color:r.log?"var(--acc)":"var(--txt-4)"},text:r.log?"YES":"no"}),
            el("td",{}, tog)
          ]));
        });
        tbl.appendChild(tb); ruleBody.appendChild(tbl);
        var c=qs("#fwRuleChip"); if(c) c.textContent=S.fwRules.filter(function(r){return r.enabled;}).length+"/"+S.fwRules.length+" ACTIVE";
      }
      drawRules();

      // stats
      var stat=el("div",{class:"grid cols-3",style:{margin:"14px 0"}});
      v.appendChild(stat);
      function drawStat(){
        clear(stat); var win=S.firewall.slice(0,120);
        var a=win.filter(function(r){return r.action==="ALLOW";}).length,d=win.filter(function(r){return r.action==="DROP";}).length,rj=win.filter(function(r){return r.action==="REJECT";}).length;
        [["ALLOW",a,"var(--ok-rgb)","check-circle"],["DROP",d,"var(--crit-rgb)","ban"],["REJECT",rj,"var(--high-rgb)","x"]].forEach(function(r){
          stat.appendChild(el("div",{class:"metric",style:{"--mc-rgb":r[2]}},[ el("div",{class:"mtop"},[el("span",{class:"mlabel",text:r[0]+" (last 120)"}),el("span",{class:"mic",html:iconHTML(r[3])})]), el("span",{class:"mval mono-num",style:{color:"rgb("+r[2]+")"},text:r[1]}) ]));
        });
      }
      drawStat();

      // live flows
      var seg=el("div",{class:"seg"});
      ["ALL","ALLOW","DROP","REJECT"].forEach(function(f){ seg.appendChild(el("button",{class:S.fwFilter===f?"on":"",onclick:function(){ S.fwFilter=f; qsa("button",seg).forEach(function(b){b.classList.toggle("on",b.textContent===f);}); draw(); },text:f})); });
      var flowPanel=panel("Live Flows",{icon:"activity",flush:true,sub:"click a flow to inspect",right:seg});
      var tw=el("div",{class:"tbl-wrap",style:{maxHeight:"46vh",overflow:"auto"}});
      var tbl=el("table",{class:"tbl"});
      tbl.appendChild(el("thead",{},el("tr",{},["Time","Source","Dest","Port","Proto","Zone→Zone","Rule","Action"].map(function(h){return el("th",{text:h});}))));
      var tbody=el("tbody"); tbl.appendChild(tbody); tw.appendChild(tbl);
      qs(".panel-b",flowPanel).appendChild(tw); v.appendChild(flowPanel);
      function frow(r){
        return el("tr",{style:{cursor:"pointer"},onclick:function(){ openFlowInspector(r); }},[
          el("td",{style:{color:"var(--txt-3)"},text:nowClock(r.t)}),
          el("td",{style:{color:(r.src||"").indexOf("10.")===0?"var(--txt-2)":"var(--high)"},text:r.src}),
          el("td",{style:{color:"var(--txt-2)"},text:r.dst}),
          el("td",{text:r.port}), el("td",{style:{color:"var(--txt-3)"},text:r.proto}),
          el("td",{style:{color:"var(--txt-3)"},text:(r.srcZone||"?")+"→"+(r.dstZone||"?")}),
          el("td",{style:{color:r.ruleId&&r.ruleId!=="—"?"var(--acc)":"var(--txt-4)"},text:r.ruleId||"—"}),
          el("td",{}, el("span",{class:"act-tag act-"+r.action,text:r.action}))
        ]);
      }
      function match(r){ return S.fwFilter==="ALL"||r.action===S.fwFilter; }
      function draw(){ clear(tbody); S.firewall.filter(match).slice(0,120).forEach(function(r){ tbody.appendChild(frow(r)); }); }
      draw();
      bind("firewall", function(r){ if(match(r)){ tbody.insertBefore(frow(r), tbody.firstChild); while(tbody.children.length>120) tbody.lastChild.remove(); } if(tickN%2===0) drawStat(); });
      bind("tick", function(){ if(tickN%4===0) drawStat(); });
    }
  });

  /* ---------------- INCIDENTS (case management) ---------------------- */
  registerView("incidents", {
    title:"Incident Response", sub:"Case management · triage · contain · remediate", icon:"briefcase",
    actions:function(){ return el("div",{class:"flex gap-2 wrap"},[
      el("button",{class:"btn sm ghost",onclick:function(){ exportKind("incidents","json"); }},[el("span",{html:iconHTML("download")}),"Export"]),
      el("button",{class:"btn sm danger",onclick:function(){ launchAttack(pick(["bruteforce","ransomware","sqli"]),{}); }},[el("span",{html:iconHTML("zap")}),"Trigger"])
    ]); },
    build:function(v){
      var flt="ALL";
      var head=el("div",{class:"flex items-center gap-2 wrap",style:{justifyContent:"space-between",marginBottom:"14px"}});
      var seg=el("div",{class:"seg"});
      ["ALL","SECURITY","NETWORK","OPEN"].forEach(function(f){ seg.appendChild(el("button",{class:f==="ALL"?"on":"",onclick:function(){ flt=f; qsa("button",seg).forEach(function(b){b.classList.toggle("on",b.textContent===f);}); draw(); },text:f})); });
      var counts=el("div",{class:"flex gap-2 wrap"});
      head.appendChild(seg); head.appendChild(counts);
      v.appendChild(head);
      var host=el("div",{class:"stack"}); v.appendChild(host);
      function list(){ return S.incidents.filter(function(i){
        if(flt==="ALL") return true;
        if(flt==="SECURITY") return (i.kind||"SECURITY")==="SECURITY";
        if(flt==="NETWORK") return i.kind==="NETWORK";
        if(flt==="OPEN") return i.status!=="RESOLVED"&&i.status!=="MITIGATED"&&i.status!=="CLOSED"&&i.status!=="FALSE POSITIVE";
      }); }
      function drawCounts(){
        clear(counts);
        var open=openIncidentsCount(), net=S.incidents.filter(function(i){return i.kind==="NETWORK";}).length, res=S.incidents.filter(function(i){return i.status==="RESOLVED"||i.status==="MITIGATED";}).length;
        [["OPEN",open,"high"],["NETWORK",net,"low"],["RESOLVED",res,"ok"]].forEach(function(r){ counts.appendChild(el("span",{class:"chip "+r[2],text:r[0]+" · "+r[1]})); });
      }
      function card(inc){
        var wrapC=el("div",{class:"inc"+(inc.sel?" sel":"")});
        var body=el("div",{class:"inc-b"}); body.style.display=inc.sel?"":"none";
        var h=el("div",{class:"inc-h",onclick:function(){ inc.sel=!inc.sel; body.style.display=inc.sel?"":"none"; wrapC.classList.toggle("sel",inc.sel); }},[
          el("span",{class:"led "+(inc.sev==="CRITICAL"?"crit":inc.sev==="HIGH"?"warn":"")}),
          el("span",{class:"kind-tag kind-"+(inc.kind||"SECURITY"),text:(inc.kind||"SECURITY")==="NETWORK"?"NET":"SEC"}),
          el("span",{class:"iid mono",text:inc.id}),
          el("span",{class:"ittl",text:inc.title}),
          el("span",{class:"chip "+sevClass(inc.sev),text:inc.sev}),
          el("span",{class:"st-badge st-"+String(inc.status).replace(/ /g,""),text:inc.status}),
          el("span",{style:{color:"var(--txt-3)"},html:iconHTML(inc.sel?"chevron-down":"chevron-right")})
        ]);
        // meta
        body.appendChild(el("div",{class:"inc-meta"},[
          kv2("Incident ID",inc.id), kv2("Assignee",inc.assignee||"Unassigned"),
          kv2("Severity",inc.sev), kv2("Type",(inc.kind||"SECURITY")),
          kv2("Source",inc.src||"—"), kv2("Target",inc.target||"—"),
          kv2("MITRE",inc.mitre||"—"), kv2("Opened",absTime(inc.opened))
        ]));
        // RCA
        if(inc.rca){
          body.appendChild(el("div",{},[ el("div",{class:"tny mono",style:{color:"var(--txt-3)",margin:"2px 0 8px",letterSpacing:".08em",textTransform:"uppercase"},text:"Root cause analysis"}),
            el("div",{class:"rca"},[
              rcaRow("Symptom",inc.rca.symptom), rcaRow("Evidence",inc.rca.evidence),
              rcaRow("Affected",inc.rca.component), rcaRow("Probable cause",inc.rca.cause),
              rcaRow("Impact",inc.rca.impact), rcaRow("Recommendation",inc.rca.rec)
            ]) ]));
        }
        // actions
        if(can("respond")){
          var acts=el("div",{class:"inc-actions"});
          INC_ACTS.forEach(function(a){ acts.appendChild(el("button",{class:"btn xs "+a.cls,onclick:function(ev){ ev.stopPropagation(); incAct(inc,a); }},[el("span",{html:iconHTML(a.icon)}),a.label])); });
          body.appendChild(el("div",{},[ el("div",{class:"tny mono",style:{color:"var(--txt-3)",margin:"2px 0 7px",letterSpacing:".08em",textTransform:"uppercase"},text:"Response actions"}), acts ]));
        } else {
          body.appendChild(el("div",{class:"rt-banner",style:{margin:"0"}},[el("span",{html:iconHTML("lock")}),el("div",{},[el("b",{text:"Read-only. "}),"Your role cannot run response actions."])]));
        }
        // assignee + notes
        var assignSel=el("select",{class:"inp",style:{maxWidth:"200px"},onchange:function(e){ inc.assignee=e.target.value; incTimeline(inc,"Assigned to "+e.target.value); pushAudit("Reassigned incident",inc.id+" → "+e.target.value,"OK"); saveState(); }},
          ANALYSTS.map(function(a){ return el("option",{value:a,selected:inc.assignee===a?"":null,text:a}); }));
        var noteIn=el("input",{class:"inp",placeholder:"Add analyst note… (Enter)",onkeydown:function(e){ if(e.key==="Enter"&&e.target.value.trim()){ addNote(inc,e.target.value.trim()); e.target.value=""; renderNotes(); } }});
        var notesHost=el("div",{class:"stack",style:{gap:"6px"}});
        function renderNotes(){ clear(notesHost); (inc.notes||[]).forEach(function(n){ notesHost.appendChild(el("div",{style:{fontSize:"12px",padding:"7px 10px",background:"var(--bg-1)",border:"1px solid var(--line)",borderRadius:"8px"}},[ el("span",{class:"mono tny",style:{color:"var(--txt-3)",marginRight:"8px"},text:n.t+" · "+n.by}), n.m ])); }); if(!(inc.notes||[]).length) notesHost.appendChild(el("div",{class:"muted tny",text:"No analyst notes yet."})); }
        renderNotes();
        body.appendChild(el("div",{},[
          el("div",{class:"tny mono",style:{color:"var(--txt-3)",margin:"2px 0 7px",letterSpacing:".08em",textTransform:"uppercase"},text:"Assignee & notes"}),
          el("div",{class:"flex gap-2 wrap",style:{marginBottom:"9px"}},[ assignSel, el("div",{style:{flex:"1",minWidth:"180px"}}, noteIn) ]),
          notesHost
        ]));
        // timeline
        var tl=el("ul",{class:"inc-time"});
        inc.timeline.forEach(function(t){ tl.appendChild(el("li",{},[ el("span",{class:"tt",text:t.t}), t.m ])); });
        body.appendChild(el("div",{},[ el("div",{class:"tny mono",style:{color:"var(--txt-3)",margin:"2px 0 9px",letterSpacing:".08em",textTransform:"uppercase"},text:"Activity timeline"}), tl ]));
        wrapC.appendChild(h); wrapC.appendChild(body);
        return wrapC;
      }
      function draw(){ clear(host); drawCounts(); var l=list(); if(!l.length){ host.appendChild(panel("Incidents",{icon:"briefcase"}, emptyState("check-circle","No incidents match this filter."))); return; } l.forEach(function(inc){ host.appendChild(card(inc)); }); }
      draw();
      bind("incident",draw); bind("incident-update",draw);
    }
  });
  function rcaRow(k,v){ return el("div",{class:"rr"},[ el("span",{class:"k",text:k}), el("span",{text:v}) ]); }
  function addNote(inc,txt){ (inc.notes=inc.notes||[]).unshift({t:nowClock(),by:S.operator,m:txt}); incTimeline(inc,"Note added by "+S.operator); pushAudit("Added note to incident",inc.id,"OK"); saveState(); }

  /* ---------------- SEGMENTATION (VLAN + zones + DMZ) ---------------- */
  registerView("segmentation", {
    title:"Network Segmentation", sub:"VLANs · security zones · inter-VLAN policy", icon:"layers",
    build:function(v){
      // zone cards
      var zg=el("div",{class:"zone-grid"});
      ZONES.forEach(function(z){
        var devs=S.devices.filter(function(d){return d.zone===z.id;});
        zg.appendChild(el("div",{class:"zonecard",style:{borderLeftColor:z.c}},[
          el("h4",{},[ el("span",{style:{width:"9px",height:"9px",borderRadius:"3px",background:z.c,display:"inline-block"}}), z.nm, z.id==="DMZ"?el("span",{class:"chip high",style:{marginLeft:"auto"},text:"DMZ"}):null ]),
          el("div",{class:"zmeta"},[ "Trust level: "+z.trust+"/100", el("br"), devs.length+" asset(s)", el("br"), devs.slice(0,4).map(function(d){return d.nm;}).join(", ")||"—" ])
        ]));
      });
      v.appendChild(panel("Security Zones",{icon:"shield",sub:"Internet → DMZ → internal"}, zg));

      // DMZ boundary illustration
      var dmz=el("div",{style:{padding:"6px 0"}});
      var zonesFlow=["INTERNET","DMZ","SERVER","USER"];
      var flowWrap=el("div",{class:"flex items-center gap-2 wrap",style:{justifyContent:"center",padding:"10px 0"}});
      zonesFlow.forEach(function(zid,i){ var z=zone(zid);
        flowWrap.appendChild(el("div",{style:{padding:"10px 16px",border:"1px solid "+z.c,borderRadius:"10px",background:"rgba("+z.rgb+",.08)",fontFamily:"var(--mono)",fontSize:"12px",color:z.c,fontWeight:"600"},text:z.nm}));
        if(i<zonesFlow.length-1) flowWrap.appendChild(el("span",{style:{color:"var(--txt-3)",fontFamily:"var(--mono)",fontSize:"11px"},text:i===0?"⟶ edge FW ⟶":i===1?"⟶ internal FW ⟶":"⟶"}));
      });
      dmz.appendChild(flowWrap);
      dmz.appendChild(el("div",{class:"muted small",style:{textAlign:"center",marginTop:"4px"},text:"Public services live in the DMZ; two firewall boundaries separate the internet from internal segments."}));
      v.appendChild(panel("Defence Boundary (DMZ)",{icon:"git-branch"}, dmz));

      // VLAN table
      var vt=el("div",{class:"tbl-wrap"});
      var tbl=el("table",{class:"tbl"});
      tbl.appendChild(el("thead",{},el("tr",{},["VLAN","Name","Zone","CIDR","Assets","Description"].map(function(h){return el("th",{text:h});}))));
      var tb=el("tbody");
      VLANS.forEach(function(vl){ var devs=S.devices.filter(function(d){return d.vlan===vl.id;});
        tb.appendChild(el("tr",{},[ el("td",{style:{color:"var(--acc)"},text:"VLAN "+vl.id}), el("td",{style:{fontFamily:"var(--sans)",fontWeight:"500"},text:vl.nm}), el("td",{style:{color:zone(vl.zone).c},text:zone(vl.zone).nm}), el("td",{text:vl.cidr}), el("td",{text:devs.length}), el("td",{style:{fontFamily:"var(--sans)",color:"var(--txt-3)",whiteSpace:"normal"},text:vl.desc}) ])); });
      tbl.appendChild(tb); vt.appendChild(tbl);
      v.appendChild(panel("VLANs",{icon:"network",sub:VLANS.length+" segments",flush:true}, vt));

      // inter-VLAN policy matrix (click a deny to simulate blocked attempt)
      var mx=el("div",{class:"tbl-wrap"});
      var mt=el("table",{class:"vlan-matrix"});
      var hr=el("tr",{},[el("th",{text:"SRC \\ DST"})].concat(VLANS.map(function(vl){return el("th",{text:vl.id});})));
      mt.appendChild(el("thead",{},hr));
      var mb=el("tbody");
      VLANS.forEach(function(src){
        var tr=el("tr",{},[el("th",{text:"VLAN "+src.id})]);
        VLANS.forEach(function(dst){
          if(src.id===dst.id){ tr.appendChild(el("td",{class:"self",text:"—"})); return; }
          var f={srcZone:src.zone,dstZone:dst.zone,port:"any",proto:"any"};
          var res=evaluateFlow(f);
          var allow=res.action==="ALLOW";
          tr.appendChild(el("td",{class:allow?"allow":"deny",style:{cursor:allow?"default":"pointer"},title:allow?"permitted":"blocked — click to test",text:allow?"✓":"✕",onclick:allow?null:function(){ simBlockedVlan(src,dst); }}));
        });
        mb.appendChild(tr);
      });
      mt.appendChild(mb); mx.appendChild(mt);
      v.appendChild(panel("Inter-VLAN Policy Matrix",{icon:"lock",sub:"✓ permitted · ✕ blocked (click to test)",flush:true}, el("div",{style:{padding:"12px"}}, mx)));
    }
  });
  function simBlockedVlan(src,dst){
    var flow={ id:S.seq++, t:simNow(), src:"10.10."+src.id+"."+ri(10,240), dst:"10.10."+dst.id+"."+ri(10,240), srcZone:src.zone, dstZone:dst.zone, srcVlan:src.id, dstVlan:dst.id, port:pick([445,3389,22,443]), proto:"TCP", size:ri(64,600), dir:"E-W" };
    var res=evaluateFlow(flow); flow.action=res.action; flow.ruleId=res.rule;
    S.firewall.unshift(flow); emit("firewall",flow);
    addEvent("MEDIUM","Cross-VLAN traffic blocked","VLAN"+src.id+"→VLAN"+dst.id,"SEC");
    addLog("FW","DROP inter-vlan "+flow.src+" → "+flow.dst+" rule="+flow.ruleId);
    pushTimeline("MEDIUM","Unauthorized VLAN"+src.id+"→VLAN"+dst.id+" attempt BLOCKED by "+flow.ruleId,"SECURITY");
    toast("MEDIUM","Segmentation enforced","VLAN"+src.id+" → VLAN"+dst.id+" blocked by firewall","lock");
    recomputeHealth(); emit("metrics");
  }

  /* ---------------- INFRASTRUCTURE (WAN failover + backups + health) - */
  registerView("infra", {
    title:"Infrastructure & Resilience", sub:"WAN failover · backups · disaster recovery · health", icon:"activity",
    build:function(v){
      v.appendChild(el("div",{style:{marginBottom:"14px"}}, healthCards()));
      bind("tick", function(){ if(tickN%2===0){ var hc=qs(".health",v); if(hc){ var nw=healthCards(); hc.replaceWith(nw); } } });

      // WAN
      var wanBody=el("div");
      var wanPanel=panel("WAN Links & Failover",{icon:"globe",sub:"primary + backup ISP",
        right: can("net")? el("button",{class:"btn sm danger",id:"wanBtn"},"") : el("span",{class:"chip",text:"READ-ONLY"})
      }, wanBody);
      v.appendChild(wanPanel);
      function drawWan(){
        clear(wanBody);
        S.wan.forEach(function(w){
          var st=w.status;
          var col=st==="ONLINE"||st==="ACTIVE"?"var(--ok)":st==="STANDBY"?"var(--med)":"var(--crit)";
          wanBody.appendChild(el("div",{class:"wan-row"},[
            el("div",{class:"wic",style:{color:col,background:"rgba("+(st==="OFFLINE"?"var(--crit-rgb)":"var(--ok-rgb)")+",.12)",border:"1px solid "+col}},iconMaybe(st==="OFFLINE"?"ban":"globe")),
            el("div",{class:"wb"},[ el("b",{text:w.isp}), el("div",{class:"wm",text:w.role+" · "+w.ip+" · "+w.bw+" Mbps · "+w.latency+"ms"+(w.loss?(" · loss "+w.loss+"%"):"")}) ]),
            el("span",{class:"wan-badge wan-"+ (w.role==="ACTIVE"?"ACTIVE":st),text:w.role==="ACTIVE"?"ACTIVE":st})
          ]));
        });
        var btn=qs("#wanBtn");
        if(btn){ var down=S.wan[0].status!=="ONLINE";
          btn.textContent=""; clear(btn);
          btn.appendChild(el("span",{html:iconHTML(down?"refresh":"power")})); btn.appendChild(document.createTextNode(down?"Restore Primary":"Fail Primary WAN"));
          btn.className="btn sm "+(down?"":"danger");
          btn.onclick=function(){ if(!can("net")){ toast("MEDIUM","Permission denied","Network Admin required","lock"); return; } if(down){ wanRestore(); pushAudit("Restored primary WAN","wan1","OK"); } else { pushAudit("Triggered WAN failover","wan1","OK"); wanFailover(); } setTimeout(drawWan,60); };
        }
      }
      function iconMaybe(n){ var s=el("span"); s.innerHTML=iconHTML(n); return s; }
      drawWan();
      bind("wan", drawWan);

      // backups / DR
      var bt=el("div",{class:"tbl-wrap"});
      var tbl=el("table",{class:"tbl"});
      tbl.appendChild(el("thead",{},el("tr",{},["Job","Status","Last Backup","Size","RPO","RTO","Replication"].map(function(h){return el("th",{text:h});}))));
      var tb=el("tbody");
      S.backups.forEach(function(b){ var ok=b.status==="SUCCESS";
        tb.appendChild(el("tr",{},[ el("td",{style:{fontFamily:"var(--sans)",fontWeight:"500"},text:b.nm}), el("td",{},el("span",{class:"act-tag "+(ok?"act-ALLOW":"act-REJECT"),text:b.status})), el("td",{text:b.last}), el("td",{text:b.size}), el("td",{text:b.rpo}), el("td",{text:b.rto}), el("td",{style:{color:b.repl==="HEALTHY"?"var(--ok)":"var(--warn)"},text:b.repl}) ])); });
      tbl.appendChild(tb); bt.appendChild(tbl);
      v.appendChild(panel("Backup & Disaster Recovery",{icon:"hard-drive",sub:"RPO/RTO objectives",flush:true,
        right:el("button",{class:"btn xs ghost",onclick:function(){ var b=pick(S.backups); b.status="SUCCESS"; b.repl="HEALTHY"; b.last=nowClock().slice(0,5); recomputeHealth(); toast("INFO","Backup verified",b.nm+" restore test passed","check-circle"); pushAudit("Ran restore test",b.nm,"OK"); go("infra"); }},[el("span",{html:iconHTML("refresh")}),"Run Restore Test"])
      }, bt));
    }
  });

  /* ---------------- SCENARIO CENTER --------------------------------- */
  registerView("scenarios", {
    title:"Scenario Center", sub:"Guided end-to-end SOC/NOC exercises", icon:"play",
    build:function(v){
      v.appendChild(el("div",{class:"rt-banner"},[ el("span",{html:iconHTML("info")}), el("div",{},[el("b",{text:"Guided scenarios. "}),"Each runs a realistic progression — detection → investigation → response → resolution — driving the live platform. Watch the Overview, Incidents and Timeline react."]) ]));
      var grid=el("div",{class:"grid cols-2"});
      SCENARIOS.forEach(function(sc){
        var steps=el("div",{class:"scn-steps"});
        ["BEGIN","PROGRESS","DETECT","INVESTIGATE","RESPOND","RESOLVE"].forEach(function(st){ steps.appendChild(el("span",{class:"scn-step",dataset:{s:st},text:st})); });
        var card=el("div",{class:"scn"});
        card.appendChild(el("div",{class:"scn-h"},[
          el("div",{class:"sn",style:{color:sc.kind==="NETWORK"?"var(--acc-2)":"var(--crit)",background:"rgba("+(sc.kind==="NETWORK"?"var(--acc-2-rgb)":"var(--crit-rgb)")+",.12)",border:"1px solid rgba("+(sc.kind==="NETWORK"?"var(--acc-2-rgb)":"var(--crit-rgb)")+",.3)"},text:sc.n}),
          el("div",{class:"st2"},[ el("b",{text:sc.nm}), el("span",{text:sc.desc}) ]),
          el("span",{class:"kind-tag kind-"+sc.kind,text:sc.kind==="NETWORK"?"NET":"SEC"}),
          el("button",{class:"btn xs "+(sc.kind==="NETWORK"?"":"danger"),onclick:function(ev){ runScenario(sc, steps, ev.currentTarget); }},[el("span",{html:iconHTML("play")}),"Run"])
        ]));
        card.appendChild(steps);
        grid.appendChild(card);
      });
      v.appendChild(grid);
    }
  });

  /* ---------------- AUDIT + TIMELINE -------------------------------- */
  registerView("audit", {
    title:"Activity & Audit", sub:"Global event timeline + analyst audit log", icon:"file-text",
    actions:function(){ return el("button",{class:"btn sm ghost",onclick:function(){ exportKind("audit","csv"); }},[el("span",{html:iconHTML("download")}),"Export Audit"]); },
    build:function(v){
      var tab="timeline";
      var seg=el("div",{class:"seg",style:{marginBottom:"14px"}});
      [["timeline","Activity Timeline"],["audit","Audit Log"]].forEach(function(t){ seg.appendChild(el("button",{class:tab===t[0]?"on":"",onclick:function(){ tab=t[0]; qsa("button",seg).forEach(function(b){b.classList.toggle("on",b.textContent===t[1]);}); draw(); },text:t[1]})); });
      v.appendChild(seg);
      var body=el("div"); v.appendChild(body);
      function draw(){
        clear(body);
        if(tab==="timeline"){
          var flt="ALL";
          var fseg=el("div",{class:"seg",style:{marginBottom:"12px"}});
          ["ALL","SECURITY","NETWORK","SYSTEM"].forEach(function(f){ fseg.appendChild(el("button",{class:f==="ALL"?"on":"",onclick:function(){ flt=f; qsa("button",fseg).forEach(function(b){b.classList.toggle("on",b.textContent===f);}); fill(); },text:f})); });
          body.appendChild(fseg);
          var p=panel("Correlated Timeline",{icon:"activity",flush:true,sub:"every propagated action"});
          var host=el("div",{style:{maxHeight:"58vh",overflow:"auto"}}); qs(".panel-b",p).appendChild(host); body.appendChild(p);
          function fill(){ clear(host); var l=S.timeline.filter(function(e){return flt==="ALL"||e.cat===flt;}).slice(0,200);
            if(!l.length){ host.appendChild(emptyState("activity","No timeline entries.")); return; }
            l.forEach(function(e){ host.appendChild(el("div",{class:"evt",dataset:{sev:e.sev},style:{gridTemplateColumns:"auto auto 1fr auto"}},[
              el("span",{class:"etime mono",text:nowClock(e.t)}),
              el("span",{class:"kind-tag kind-"+(e.cat==="NETWORK"?"NETWORK":e.cat==="SYSTEM"?"SYSTEM":"SECURITY"),text:e.cat.slice(0,3)}),
              el("span",{class:"emsg",html:esc(e.msg)}),
              el("span",{class:"esrc mono",text:relTime(e.t)})
            ])); });
          }
          fill(); bindLocal("timeline",fill);
        } else {
          var p2=panel("Analyst Audit Log",{icon:"list-checks",flush:true,sub:"immutable-style · who did what"});
          var tw=el("div",{class:"tbl-wrap",style:{maxHeight:"58vh",overflow:"auto"}});
          var tbl=el("table",{class:"tbl"});
          tbl.appendChild(el("thead",{},el("tr",{},["Time","User","Role","Action","Target","Result"].map(function(h){return el("th",{text:h});}))));
          var tb=el("tbody");
          if(!S.audit.length) tb.appendChild(el("tr",{},el("td",{colspan:"6"},emptyState("file-text","No audit entries yet."))));
          S.audit.forEach(function(a){ tb.appendChild(el("tr",{},[ el("td",{style:{color:"var(--txt-3)"},text:nowClock(a.t)}), el("td",{style:{color:"var(--txt)",fontFamily:"var(--sans)"},text:a.user}), el("td",{style:{color:"var(--acc)"},text:a.role}), el("td",{style:{fontFamily:"var(--sans)"},text:a.action}), el("td",{style:{color:"var(--txt-2)"},text:a.target}), el("td",{style:{color:"var(--ok)"},text:a.result}) ])); });
          tbl.appendChild(tb); tw.appendChild(tbl); qs(".panel-b",p2).appendChild(tw); body.appendChild(p2);
        }
      }
      // local bind that auto-clears on view change
      function bindLocal(evt,fn){ bind(evt,fn); }
      draw();
    }
  });

  /* ---------------- REPORTS ----------------------------------------- */
  registerView("reports", {
    title:"Reporting", sub:"Generate a printable security / network report", icon:"file-text",
    build:function(v){
      var types=[["daily","Daily Security Report"],["network","Network Health Report"],["incident","Incident Report"],["firewall","Firewall Report"],["exec","Executive Summary"]];
      var sel="daily";
      var bar=el("div",{class:"flex items-center gap-2 wrap",style:{marginBottom:"16px"}});
      var s=el("select",{class:"inp",style:{maxWidth:"280px"},onchange:function(e){ sel=e.target.value; render(); }}, types.map(function(t){return el("option",{value:t[0],text:t[1]});}));
      bar.appendChild(s);
      bar.appendChild(el("button",{class:"btn sm",onclick:function(){ window.print(); }},[el("span",{html:iconHTML("file-text")}),"Print / PDF"]));
      bar.appendChild(el("button",{class:"btn sm ghost",onclick:function(){ exportReport(sel); }},[el("span",{html:iconHTML("download")}),"Export JSON"]));
      v.appendChild(bar);
      var host=el("div"); v.appendChild(host);
      function render(){ clear(host); host.appendChild(buildReport(sel)); }
      render();
    }
  });

  /* ---------------- SETTINGS ---------------------------------------- */
  registerView("settings", {
    title:"Settings", sub:"Platform · simulation · role · data", icon:"settings",
    build:function(v){
      // ROLE
      v.appendChild(sectionTitle("Identity & Role"));
      var roleSec=el("div",{class:"set-sec"});
      Object.keys(ROLES).forEach(function(rk){ var r=ROLES[rk];
        roleSec.appendChild(el("div",{class:"set-row"},[
          el("div",{class:"sl"},[ el("b",{text:r.nm}), el("span",{text:Object.keys(r.perms).filter(function(p){return r.perms[p];}).join(", ")||"read-only"}) ]),
          el("button",{class:"btn sm "+(S.role===rk?"primary":"ghost"),onclick:function(){ setRole(rk); go("settings"); }}, S.role===rk?"Active":"Switch")
        ]));
      });
      v.appendChild(roleSec);

      // SIMULATION
      v.appendChild(sectionTitle("Simulation"));
      var simSec=el("div",{class:"set-sec"});
      simSec.appendChild(selRow("Simulation speed","How fast the live clock ticks",[["1000","Fast (1s)"],["2000","Normal (2s)"],["4000","Slow (4s)"]],String(S.settings.simSpeedMs),function(val){ S.settings.simSpeedMs=+val; clearInterval(S._tickTimer); S._tickTimer=setInterval(tick,+val); saveState(); toast("INFO","Simulation speed",("updated to "+(+val/1000)+"s"),"clock"); }));
      simSec.appendChild(selRow("Threat frequency","Rate of autonomous attacks",[["low","Low"],["normal","Normal"],["high","High"]],S.settings.threatFreq,function(val){ S.settings.threatFreq=val; saveState(); }));
      simSec.appendChild(toggleRow("Auto incident creation","Automatically open incidents on detection",S.settings.autoIncident,function(on){ S.settings.autoIncident=on; saveState(); }));
      v.appendChild(simSec);

      // NOTIFICATIONS / SOUND / MOTION
      v.appendChild(sectionTitle("Notifications & Accessibility"));
      var nSec=el("div",{class:"set-sec"});
      nSec.appendChild(toggleRow("Sound alerts","Audio cue on new alerts",S.soundOn,function(on){ S.soundOn=on; if(on) beep("LOW"); renderTopbar(); saveState(); }));
      nSec.appendChild(toggleRow("Reduced motion","Minimise animations",reduceMotion,function(on){ reduceMotion=on; S.settings.reducedMotionForce=on; toast("INFO","Reduced motion",on?"Animations minimised":"Animations restored","activity"); saveState(); }));
      v.appendChild(nSec);

      // DATA
      v.appendChild(sectionTitle("Data & Persistence"));
      var dSec=el("div",{class:"set-sec"});
      dSec.appendChild(toggleRow("Persist session","Save settings, incidents, notes & rules in this browser",S.settings.persist,function(on){ S.settings.persist=on; if(on) saveState(); toast("INFO","Persistence "+(on?"on":"off"),on?"State saved to this browser":"Nothing will be saved","hard-drive"); }));
      var exp=el("div",{class:"set-row"},[
        el("div",{class:"sl"},[ el("b",{text:"Export data"}), el("span",{text:"Download current telemetry"}) ]),
        el("div",{class:"flex gap-2 wrap"},[
          el("button",{class:"btn xs",onclick:function(){ exportKind("events","csv"); }},"Events CSV"),
          el("button",{class:"btn xs",onclick:function(){ exportKind("incidents","json"); }},"Incidents"),
          el("button",{class:"btn xs",onclick:function(){ exportKind("firewall","csv"); }},"Firewall"),
          el("button",{class:"btn xs",onclick:function(){ exportKind("devices","json"); }},"Devices")
        ])
      ]);
      dSec.appendChild(exp);
      dSec.appendChild(el("div",{class:"set-row"},[
        el("div",{class:"sl"},[ el("b",{class:"text-crit",text:"Reset demo data"}), el("span",{text:"Clear saved state and reload with a fresh environment"}) ]),
        el("button",{class:"btn sm danger",onclick:function(){ if(confirm("Reset all demo data and reload?")){ pushAudit("Reset demo data","platform","OK"); resetState(); } }},[el("span",{html:iconHTML("trash")}),"Reset"])
      ]));
      v.appendChild(dSec);

      // shortcuts
      v.appendChild(sectionTitle("Keyboard Shortcuts"));
      v.appendChild(shortcutHelp());
    }
  });
  function sectionTitle(t){ return el("h3",{class:"sub-head",style:{marginTop:"6px"},text:t}); }
  function toggleRow(title,desc,on,cb){ var t=el("div",{class:"toggle"+(on?" on":""),onclick:function(){ on=!on; t.classList.toggle("on",on); cb(on); }}); return el("div",{class:"set-row"},[ el("div",{class:"sl"},[el("b",{text:title}),el("span",{text:desc})]), t ]); }
  function selRow(title,desc,opts,val,cb){ return el("div",{class:"set-row"},[ el("div",{class:"sl"},[el("b",{text:title}),el("span",{text:desc})]), el("select",{class:"inp",style:{maxWidth:"180px"},onchange:function(e){cb(e.target.value);}}, opts.map(function(o){return el("option",{value:o[0],selected:o[0]===val?"":null,text:o[1]});})) ]); }
}

/* =====================================================================
   SCENARIOS
   ===================================================================== */
var SCENARIOS=[
  {n:"1",kind:"SECURITY",nm:"Port Scan",desc:"Recon sweep across the DMZ",run:function(){ launchAttack("portscan",{}); }},
  {n:"2",kind:"SECURITY",nm:"Brute Force",desc:"Credential attack on VPN",run:function(){ launchAttack("bruteforce",{devId:"vpn"}); }},
  {n:"3",kind:"SECURITY",nm:"Ransomware",desc:"Mass-encryption on a server",run:function(){ launchAttack("ransomware",{devId:"windows"}); }},
  {n:"4",kind:"NETWORK",nm:"DNS Anomaly",desc:"Resolver failure / DGA lookups",run:function(){ triggerNetIncident("dns"); }},
  {n:"5",kind:"NETWORK",nm:"VPN Failure",desc:"Remote access tunnel down",run:function(){ triggerNetIncident("vpn"); }},
  {n:"6",kind:"NETWORK",nm:"ISP Outage",desc:"Primary WAN down → failover",run:function(){ triggerNetIncident("isp"); }},
  {n:"7",kind:"NETWORK",nm:"Server Overload",desc:"Database saturation",run:function(){ triggerNetIncident("overload"); }},
  {n:"8",kind:"NETWORK",nm:"VLAN Misconfig",desc:"Segmentation leak detected",run:function(){ triggerNetIncident("vlanmiscfg"); }},
  {n:"9",kind:"SECURITY",nm:"Compromised Endpoint",desc:"Malware beacon to C2",run:function(){ launchAttack("malware",{devId:"ws"}); }},
  {n:"10",kind:"SECURITY",nm:"APT Intrusion",desc:"Multi-stage kill-chain",run:function(){ ["portscan","phishing","bruteforce","ransomware"].forEach(function(s,i){ setTimeout(function(){ launchAttack(s,{}); },i*1200); }); }}
];
function runScenario(sc, stepsEl, btn){
  if(btn){ btn.disabled=true; }
  var phases=["BEGIN","PROGRESS","DETECT","INVESTIGATE","RESPOND","RESOLVE"];
  var steps=stepsEl?qsa(".scn-step",stepsEl):[];
  steps.forEach(function(s){ s.className="scn-step"; });
  pushTimeline(sc.kind==="NETWORK"?"HIGH":"CRITICAL","▶ Scenario started: "+sc.nm,sc.kind);
  var i=0;
  function phase(){
    if(i>0&&steps[i-1]) steps[i-1].className="scn-step done";
    if(i>=phases.length){ if(btn) btn.disabled=false; toast(sc.kind==="NETWORK"?"HIGH":"CRITICAL","Scenario complete",sc.nm+" · resolved","check-circle"); pushTimeline("LOW","✓ Scenario resolved: "+sc.nm,sc.kind); return; }
    if(steps[i]) steps[i].className="scn-step active";
    if(phases[i]==="DETECT"){ sc.run(); }
    i++;
    setTimeout(phase, reduceMotion?250:1300);
  }
  phase();
  toast("INFO","Scenario running",sc.nm,"play");
}

/* =====================================================================
   FLOW INSPECTOR
   ===================================================================== */
function openFlowInspector(f){
  var ids = f.ruleId&&f.ruleId!=="—" ? null : null;
  openModal({ icon:"scan-line", iconSev:f.action==="ALLOW"?"INFO":f.action==="DROP"?"CRITICAL":"HIGH",
    title:"Flow "+f.src+" → "+f.dst, sub:absTime(f.t),
    rows:[
      ["Timestamp", absTime(f.t)],
      ["Source", f.src+":"+ri(1024,65535)],
      ["Destination", f.dst+":"+f.port],
      ["Protocol", f.proto],
      ["Direction", f.dir||"—"],
      ["Packet size", (f.size||ri(64,1480))+" bytes"],
      ["Source zone / VLAN", (f.srcZone||"?")+(f.srcVlan?(" · VLAN "+f.srcVlan):"")],
      ["Dest zone / VLAN", (f.dstZone||"?")+(f.dstVlan?(" · VLAN "+f.dstVlan):"")],
      ["Matched firewall rule", f.ruleId||"— (default policy)"],
      ["IDS/IPS", f.action==="ALLOW"?"No match":"correlated"],
      ["Action", f.action],
      ["Logged", f.logged?"YES":"no"]
    ],
    foot: el("div",{class:"flex gap-2 wrap"},[
      f.action==="ALLOW"? el("button",{class:"btn danger sm",onclick:function(){ toast("INFO","Rule staged","A DROP rule for "+f.dst+":"+f.port+" was queued for review","shield"); closeModal(); }},[el("span",{html:iconHTML("ban")}),"Block this flow"]):null,
      el("button",{class:"btn ghost sm",onclick:function(){ go("firewall"); closeModal(); }},"Open Firewall"),
      el("button",{class:"btn ghost sm",onclick:closeModal},"Close")
    ])
  });
}

/* =====================================================================
   REPORTS
   ===================================================================== */
function buildReport(kind){
  var d=simNow();
  var titles={daily:"Daily Security Report",network:"Network Health Report",incident:"Incident Report",firewall:"Firewall Report",exec:"Executive Security Summary"};
  var r=el("div",{class:"report"});
  r.appendChild(el("h2",{text:titles[kind]}));
  r.appendChild(el("div",{class:"rmeta",text:"Generated "+absTime(d)+"  ·  Analyst: "+S.operator+"  ·  Classification: INTERNAL"}));
  // KPIs
  r.appendChild(el("h3",{text:"Key metrics"}));
  var kpi=el("div",{class:"rkpi"});
  [["Security",S.health.sec.v,healthColor(S.health.sec.v)],["Network",S.health.net.v,healthColor(S.health.net.v)],["Infra",S.health.infra.v,healthColor(S.health.infra.v)],["Open Inc.",openIncidentsCount(),"var(--high)"]].forEach(function(k){ kpi.appendChild(el("div",{class:"k"},[ el("b",{style:{color:k[2]},text:k[1]}), el("span",{text:k[0]}) ])); });
  r.appendChild(kpi);
  if(kind==="incident"||kind==="daily"||kind==="exec"){
    r.appendChild(el("h3",{text:"Incidents"}));
    var ul=el("ul",{class:"rlist"});
    var inc=S.incidents.slice(0,8);
    if(!inc.length) ul.appendChild(el("li",{text:"No incidents in the reporting window."}));
    inc.forEach(function(i){ ul.appendChild(el("li",{text:i.id+" · ["+i.sev+"] "+i.title+" — "+i.status+(i.kind==="NETWORK"?" (network)":"")})); });
    r.appendChild(ul);
  }
  if(kind==="daily"||kind==="exec"){
    r.appendChild(el("h3",{text:"Top threats (MITRE)"}));
    var ul2=el("ul",{class:"rlist"});
    var seen=S.mitre.filter(function(m){return m.count>0;}).sort(function(a,b){return b.count-a.count;}).slice(0,6);
    if(!seen.length) ul2.appendChild(el("li",{text:"No adversary techniques observed."}));
    seen.forEach(function(m){ ul2.appendChild(el("li",{text:m.id+" · "+m.nm+" — observed ×"+m.count})); });
    r.appendChild(ul2);
  }
  if(kind==="network"){
    r.appendChild(el("h3",{text:"Network status"}));
    var ul3=el("ul",{class:"rlist"});
    ul3.appendChild(el("li",{text:"Availability: "+S.availability.toFixed(2)+"% · packet loss "+S.packetLoss.toFixed(1)+"% · latency "+Math.round(S.latency)+"ms"}));
    ul3.appendChild(el("li",{text:"WAN1 "+S.wan[0].isp+" — "+S.wan[0].status+" · WAN2 "+S.wan[1].isp+" — "+S.wan[1].status}));
    ul3.appendChild(el("li",{text:S.devicesOnline+"/"+S.devicesTotal+" devices online"}));
    r.appendChild(ul3);
  }
  if(kind==="firewall"){
    r.appendChild(el("h3",{text:"Firewall summary"}));
    var win=S.firewall.slice(0,120);
    var ul4=el("ul",{class:"rlist"});
    ul4.appendChild(el("li",{text:"Active rules: "+S.fwRules.filter(function(x){return x.enabled;}).length+"/"+S.fwRules.length}));
    ul4.appendChild(el("li",{text:"Last 120 flows: "+win.filter(function(x){return x.action==="ALLOW";}).length+" allowed · "+win.filter(function(x){return x.action==="DROP";}).length+" dropped · "+win.filter(function(x){return x.action==="REJECT";}).length+" rejected"}));
    r.appendChild(ul4);
  }
  r.appendChild(el("h3",{text:"Recommendations"}));
  var rec=el("ul",{class:"rlist"});
  var recs=[];
  if(S.health.sec.v<80) recs.push("Prioritise triage of open security incidents to recover the security score.");
  if(S.wan[0].status!=="ONLINE") recs.push("Primary WAN is down — confirm ISP status and validate failover stability.");
  if(S.backups.some(function(b){return b.status!=="SUCCESS";})) recs.push("Investigate the lagging file-server backup and re-run a restore test.");
  if(openIncidentsCount()>2) recs.push("Incident backlog above threshold — consider escalating to Tier-2.");
  if(!recs.length) recs.push("Environment nominal — maintain monitoring and scheduled reviews.");
  recs.forEach(function(x){ rec.appendChild(el("li",{text:x})); });
  r.appendChild(rec);
  return r;
}
function exportReport(kind){
  var payload={ type:kind, generated:simNow().toISOString(), analyst:S.operator, health:S.health, availability:S.availability, incidents:S.incidents.slice(0,20).map(function(i){return {id:i.id,sev:i.sev,status:i.status,title:i.title,kind:i.kind};}) };
  downloadFile("report-"+kind+".json", JSON.stringify(payload,null,2), "application/json");
  pushAudit("Generated report",titlesFor(kind),"OK"); toast("INFO","Report exported","report-"+kind+".json","download");
}
function titlesFor(k){ return {daily:"Daily Security",network:"Network Health",incident:"Incident",firewall:"Firewall",exec:"Executive"}[k]||k; }

/* =====================================================================
   ROLE
   ===================================================================== */
function setRole(rk){ if(!ROLES[rk]) return; S.role=rk; pushAudit("Switched role", ROLES[rk].nm, "OK"); renderTopbar(); saveState(); toast("INFO","Role changed","Now acting as "+ROLES[rk].nm,"user"); }

/* =====================================================================
   NOTIFICATION CENTER
   ===================================================================== */
var _notifPop=null;
function toggleNotifCenter(anchor){
  if(_notifPop){ _notifPop.remove(); _notifPop=null; return; }
  var flt="ALL";
  var pop=el("div",{class:"notif-pop"});
  pop.appendChild(el("div",{class:"notif-h"},[
    el("b",{text:"Notifications"}),
    el("button",{class:"btn xs ghost",onclick:function(){ markAllRead(); render(); renderTopbar(); }},"Mark all read"),
    el("button",{class:"tb-icon",style:{width:"28px",height:"28px"},"aria-label":"close",html:iconHTML("x"),onclick:close})
  ]));
  var seg=el("div",{class:"notif-seg"});
  ["ALL","SECURITY","NETWORK","INCIDENT","SYSTEM"].forEach(function(f){ seg.appendChild(el("button",{class:f==="ALL"?"on":"",onclick:function(){ flt=f; qsa("button",seg).forEach(function(b){b.classList.toggle("on",b.textContent===f);}); render(); },text:f})); });
  pop.appendChild(seg);
  var listHost=el("div",{class:"notif-list"}); pop.appendChild(listHost);
  function render(){
    clear(listHost);
    var l=S.notifications.filter(function(n){return flt==="ALL"||n.cat===flt;}).slice(0,50);
    if(!l.length){ listHost.appendChild(emptyState("bell","No notifications.")); return; }
    l.forEach(function(n){
      listHost.appendChild(el("div",{class:"notif"+(n.read?"":" unread"),onclick:function(){ n.read=true; renderTopbar(); if(n.link){ go(n.link); close(); } else render(); saveState(); }},[
        el("span",{class:"nd"}),
        el("div",{class:"nb"},[
          el("div",{class:"flex items-center gap-2",style:{justifyContent:"space-between"}},[ el("b",{text:n.title}), el("span",{class:"ncat ncat-"+n.cat,text:n.cat}) ]),
          n.msg?el("p",{text:n.msg}):null,
          el("div",{class:"nm"},[ el("span",{text:relTime(n.t)}), n.link?el("span",{class:"text-acc",text:"open →"}):null ])
        ])
      ]));
    });
  }
  function close(){ if(_notifPop){ _notifPop.remove(); _notifPop=null; } document.removeEventListener("click",outside,true); }
  function outside(e){ if(_notifPop && !e.target.closest(".notif-pop") && !e.target.closest("#tbBell")){ close(); } }
  render();
  qs("#topbar").appendChild(pop); _notifPop=pop;
  setTimeout(function(){ document.addEventListener("click",outside,true); },0);
}

/* =====================================================================
   COMMAND PALETTE / GLOBAL SEARCH  (Ctrl+K / Ctrl+/)
   ===================================================================== */
var _cmdk=null;
var CMD_LIST=[
  {t:"Open Overview",ic:"gauge",go:"overview"},
  {t:"Open Threat Map",ic:"radar",go:"threatmap"},
  {t:"Open Network Topology",ic:"network",go:"network"},
  {t:"Open Segmentation (VLAN/Zones)",ic:"layers",go:"segmentation"},
  {t:"Open Infrastructure & Resilience",ic:"activity",go:"infra"},
  {t:"Open Servers",ic:"server",go:"servers"},
  {t:"Open Security Events",ic:"list-checks",go:"events"},
  {t:"Open Incidents",ic:"briefcase",go:"incidents"},
  {t:"Open Log Analyzer",ic:"file-text",go:"logs"},
  {t:"Open Firewall",ic:"shield",go:"firewall"},
  {t:"Open MITRE ATT&CK",ic:"target",go:"mitre"},
  {t:"Open Activity & Audit",ic:"file-text",go:"audit"},
  {t:"Open Scenario Center",ic:"play",go:"scenarios"},
  {t:"Open Reporting",ic:"file-text",go:"reports"},
  {t:"Open Attack Simulator",ic:"zap",go:"simulator"},
  {t:"Open Terminal",ic:"terminal",go:"terminal"},
  {t:"Open Settings",ic:"settings",go:"settings"},
  {t:"Start: Port Scan",ic:"scan-line",act:function(){ launchAttack("portscan",{}); }},
  {t:"Start: Ransomware",ic:"skull",act:function(){ launchAttack("ransomware",{}); }},
  {t:"Simulate ISP outage (failover)",ic:"globe",act:function(){ triggerNetIncident("isp"); }},
  {t:"Generate Executive Report",ic:"file-text",act:function(){ go("reports"); }},
  {t:"Toggle Red Team Mode",ic:"flame",act:function(){ setRedTeam(!S.redTeam); }},
  {t:"Reset demo data",ic:"trash",act:function(){ if(confirm("Reset all demo data and reload?")) resetState(); }}
];
function openCmdK(){
  if(_cmdk) return;
  var bg=el("div",{class:"cmdk-bg",onclick:function(e){ if(e.target===bg) closeCmdK(); }});
  var box=el("div",{class:"cmdk"});
  var input=el("input",{type:"text",placeholder:"Search commands, IPs, hostnames, incidents, MITRE…","aria-label":"command palette"});
  box.appendChild(el("div",{class:"cmdk-in"},[ el("span",{html:iconHTML("search")}), input, el("span",{class:"esc",text:"ESC"}) ]));
  var listHost=el("div",{class:"cmdk-list"}); box.appendChild(listHost);
  bg.appendChild(box); document.body.appendChild(bg); _cmdk=bg;
  var items=[], sel=0;
  function build(q){
    q=(q||"").toLowerCase().trim();
    listHost.innerHTML=""; items=[]; sel=0;
    // command matches
    var cmds=CMD_LIST.filter(function(c){ return !q||c.t.toLowerCase().indexOf(q)>=0; });
    if(cmds.length){ listHost.appendChild(el("div",{class:"cmdk-sec",text:"Commands"}));
      cmds.slice(0,8).forEach(function(c){ addItem(c.ic,c.t,"command",function(){ closeCmdK(); if(c.go) go(c.go); else if(c.act) c.act(); }); }); }
    // entity search
    if(q.length>=1){
      var devs=S.devices.filter(function(d){ return d.nm.toLowerCase().indexOf(q)>=0 || (d.ip||"").indexOf(q)>=0 || (d.mac||"").toLowerCase().indexOf(q)>=0 || (d.zone||"").toLowerCase().indexOf(q)>=0; }).slice(0,5);
      if(devs.length){ listHost.appendChild(el("div",{class:"cmdk-sec",text:"Devices"}));
        devs.forEach(function(d){ addItem(d.type,d.nm,d.ip+" · "+(d.zone||"")+(d.vlan?" · VLAN "+d.vlan:""),function(){ closeCmdK(); go("network"); setTimeout(function(){ openDeviceModal(d); },120); }); }); }
      var incs=S.incidents.filter(function(i){ return i.id.toLowerCase().indexOf(q)>=0 || i.title.toLowerCase().indexOf(q)>=0 || (i.mitre||"").toLowerCase().indexOf(q)>=0; }).slice(0,4);
      if(incs.length){ listHost.appendChild(el("div",{class:"cmdk-sec",text:"Incidents"}));
        incs.forEach(function(i){ addItem("briefcase",i.id+" · "+i.title,i.sev+" · "+i.status,function(){ closeCmdK(); go("incidents"); }); }); }
      var mit=S.mitre.filter(function(m){ return m.id.toLowerCase().indexOf(q)>=0 || m.nm.toLowerCase().indexOf(q)>=0; }).slice(0,4);
      if(mit.length){ listHost.appendChild(el("div",{class:"cmdk-sec",text:"MITRE ATT&CK"}));
        mit.forEach(function(m){ addItem("target",m.id+" · "+m.nm,m.tac,function(){ closeCmdK(); go("mitre"); }); }); }
      var vl=VLANS.filter(function(x){ return ("vlan"+x.id).indexOf(q.replace(/\s/g,""))>=0 || x.nm.toLowerCase().indexOf(q)>=0 || x.cidr.indexOf(q)>=0; }).slice(0,3);
      if(vl.length){ listHost.appendChild(el("div",{class:"cmdk-sec",text:"VLANs"}));
        vl.forEach(function(x){ addItem("layers","VLAN "+x.id+" · "+x.nm,x.cidr,function(){ closeCmdK(); go("segmentation"); }); }); }
    }
    if(!items.length){ listHost.appendChild(el("div",{class:"cmdk-empty",text:'No matches for "'+esc(q)+'"'})); }
    highlight();
  }
  function addItem(ic,title,sub,run){
    var e=el("div",{class:"cmdk-item",onclick:run,onmouseenter:function(){ sel=items.indexOf(e); highlight(); }},[
      el("span",{class:"ci",html:iconHTML(ic)}),
      el("span",{class:"cx"},[ el("b",{text:title}), sub?el("span",{text:sub}):null ]),
      el("span",{class:"ck",text:"↵"})
    ]);
    e._run=run; items.push(e); listHost.appendChild(e);
  }
  function highlight(){ items.forEach(function(e,i){ e.classList.toggle("on",i===sel); }); if(items[sel]) items[sel].scrollIntoView({block:"nearest"}); }
  input.addEventListener("input",function(){ build(input.value); });
  input.addEventListener("keydown",function(e){
    if(e.key==="ArrowDown"){ e.preventDefault(); sel=Math.min(sel+1,items.length-1); highlight(); }
    else if(e.key==="ArrowUp"){ e.preventDefault(); sel=Math.max(sel-1,0); highlight(); }
    else if(e.key==="Enter"){ e.preventDefault(); if(items[sel]) items[sel]._run(); }
    else if(e.key==="Escape"){ closeCmdK(); }
  });
  build("");
  setTimeout(function(){ input.focus(); },30);
}
function closeCmdK(){ if(_cmdk){ _cmdk.remove(); _cmdk=null; } }

/* =====================================================================
   KEYBOARD SHORTCUTS
   ===================================================================== */
function shortcutHelp(){
  var g=el("div",{class:"kbd-grid"});
  [["Command palette / search","Ctrl","K"],["Command palette (alt)","Ctrl","/"],["Global search","Ctrl","K"],["Close modal / drawer","Esc",""],["Refresh current view","R",""],["Clear terminal","Ctrl","L"],["Keyboard shortcuts","?",""],["Toggle sidebar","["," "]].forEach(function(k){
    var keys=el("div",{class:"keys"}); if(k[1]) keys.appendChild(el("kbd",{text:k[1]})); if(k[2]) keys.appendChild(el("kbd",{text:k[2]}));
    g.appendChild(el("div",{class:"kr"},[ el("span",{text:k[0]}), keys ]));
  });
  return g;
}
function showShortcuts(){ openModal({ icon:"info", iconSev:"INFO", title:"Keyboard shortcuts", sub:"work faster", body:shortcutHelp(), foot:el("button",{class:"btn ghost sm",onclick:closeModal},"Close") }); }
function initShortcuts(){
  document.addEventListener("keydown", function(e){
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName||"")) || e.target.isContentEditable;
    if((e.ctrlKey||e.metaKey) && (e.key==="k"||e.key==="K"||e.key==="/")){ e.preventDefault(); if(_cmdk) closeCmdK(); else openCmdK(); return; }
    if(e.key==="Escape"){ closeCmdK(); if(_notifPop){ _notifPop.remove(); _notifPop=null; } return; }
    if(typing) return;
    if(e.key==="?"){ e.preventDefault(); showShortcuts(); }
    else if(e.key==="r"||e.key==="R"){ renderView(S.view); toast("INFO","Refreshed",VIEWS[S.view]?VIEWS[S.view].title:"view","refresh"); }
    else if(e.key==="["){ S.collapsed=!S.collapsed; document.body.classList.toggle("app-collapsed",S.collapsed); }
  });
}
/* =====================================================================
   TERMINAL VIEW
   ===================================================================== */
var termHistory = [];
var termHistIdx = -1;
function registerTerminalView(){
registerView("terminal", {
  title:"Command Terminal", sub:"soc-console v3.1 · type 'help'", icon:"terminal",
  build:function(v){
    var t = el("div",{class:"term",style:{height:"min(70vh,640px)"}});
    t.appendChild(el("div",{class:"term-bar"},[ el("i"),el("i"),el("i"), el("small",{text:"soc@command-center:~ — secure shell"}) ]));
    var out = el("div",{class:"term-body",id:"termOut"});
    var input = el("input",{type:"text","aria-label":"Terminal input",autocomplete:"off",autocapitalize:"off",spellcheck:"false"});
    var inRow = el("div",{class:"term-in"},[ el("span",{class:"p",text:termPrompt()}), input ]);
    t.appendChild(out); t.appendChild(inRow);
    v.appendChild(t);
    window.__termOut = out;
    if (!out._greeted){ out._greeted=true; }
    termGreet(out);
    input.addEventListener("keydown", function(e){
      if (e.key==="Enter"){ var val=input.value; input.value=""; if(val.trim()){ termHistory.unshift(val); termHistIdx=-1; } runTermCmd(val, out); qs(".p",inRow).textContent=termPrompt(); }
      else if (e.key==="ArrowUp"){ e.preventDefault(); if(termHistIdx<termHistory.length-1){ termHistIdx++; input.value=termHistory[termHistIdx]||""; } }
      else if (e.key==="ArrowDown"){ e.preventDefault(); if(termHistIdx>0){ termHistIdx--; input.value=termHistory[termHistIdx]||""; } else { termHistIdx=-1; input.value=""; } }
      else if (e.key==="l"&&e.ctrlKey){ e.preventDefault(); clear(out); }
    });
    setTimeout(function(){ input.focus(); },60);
    v.addEventListener("click", function(e){ if(!e.target.closest("a,button")) input.focus(); });
  }
});
}
function termPrompt(){ return S.rootMode?"root@ccc#":(S.redTeam?"redteam@ccc$":"soc@ccc$"); }
function termLine(out, cls, html){ var l=el("div",{class:"tl "+(cls||"res")}); l.innerHTML=html; out.appendChild(l); out.scrollTop=out.scrollHeight; return l; }
function termGreet(out){
  clear(out);
  termLine(out,"head","╔═ CYBER COMMAND CENTER · SECURE CONSOLE ═╗");
  termLine(out,"res","  soc-console v3.1  ·  session "+Math.random().toString(16).slice(2,10)+"  ·  clearance: OPERATOR");
  termLine(out,"res","  Type <span class='ok'>help</span> for available commands.");
  termLine(out,"res","&nbsp;");
}
var TERM_CMDS = {
  help:function(o){
    termLine(o,"head","Available commands");
    [["help","this message"],["status","system + posture summary"],["network","network device table"],["servers","server resource usage"],["threats","active threats / threat level"],["incidents","open incident queue"],["firewall","recent firewall decisions"],["mitre","observed ATT&CK techniques"],["scan <target>","simulated port scan"],["attack <type>","launch a simulated attack"],["whoami","current identity"],["clear","clear the screen"],["banner","re-print banner"]].forEach(function(c){
      termLine(o,"res","  <span class='ok'>"+c[0].padEnd(16," ").replace(/ /g,"&nbsp;")+"</span> "+c[1]);
    });
    termLine(o,"res","&nbsp;");
    termLine(o,"res","  attack types: <span class='info'>"+Object.keys(ATTACK_TYPES).join(", ")+"</span>");
  },
  status:function(o){
    var l=threatLabel(S.threat);
    termLine(o,"head","SYSTEM STATUS");
    termLine(o,"ok","  SYSTEM      : OPERATIONAL");
    termLine(o,"res","  NETWORK     : "+(S.devicesOnline===S.devicesTotal?"<span class='ok'>STABLE</span>":"<span class='warn'>DEGRADED</span>")+"  ("+S.devicesOnline+"/"+S.devicesTotal+" online)");
    termLine(o,"res","  THREAT LVL  : <span class='"+(l.c==="crit"||l.c==="high"?"err":l.c==="med"?"warn":"ok")+"'>"+Math.round(S.threat)+" "+l.t+"</span>");
    termLine(o,"res","  THREATS     : "+activeAttacks()+" active");
    termLine(o,"res","  INCIDENTS   : "+openIncidentsCount()+" open");
    termLine(o,"res","  SEC SCORE   : <span class='"+(S.score>=80?"ok":S.score>=55?"warn":"err")+"'>"+S.score+"/100</span>");
    termLine(o,"res","  BLOCKED     : "+fmtNum(S.blockedAttacks)+" attacks");
    termLine(o,"res","  AVAILABILITY: "+S.availability.toFixed(2)+"%");
  },
  network:function(o){
    termLine(o,"head","NETWORK DEVICES");
    S.devices.forEach(function(d){ var sl=deviceStatusList(d.st); var c=sl.c==="ok"?"ok":sl.c==="crit"?"err":sl.c==="warn"?"warn":"res";
      termLine(o,"res","  "+d.nm.padEnd(17," ").replace(/ /g,"&nbsp;")+" "+d.ip.padEnd(16," ").replace(/ /g,"&nbsp;")+" <span class='"+c+"'>"+sl.t+"</span>");
    });
  },
  servers:function(o){
    termLine(o,"head","SERVER RESOURCES");
    S.servers.forEach(function(s){ termLine(o,"res","  "+s.nm.padEnd(22," ").replace(/ /g,"&nbsp;")+" CPU "+String(Math.round(s.cpu)).padStart(2)+"%  RAM "+String(Math.round(s.ram)).padStart(2)+"%  DISK "+String(Math.round(s.disk)).padStart(2)+"%  up "+s.up); });
  },
  threats:function(o){
    var l=threatLabel(S.threat);
    termLine(o,"head","THREAT ASSESSMENT");
    termLine(o,"res","  Level: <span class='"+(l.c==="crit"||l.c==="high"?"err":l.c==="med"?"warn":"ok")+"'>"+Math.round(S.threat)+"/100 "+l.t+"</span>");
    var act=S.attacks.filter(function(a){return a.until>Date.now();});
    if (!act.length) termLine(o,"ok","  No active attack vectors.");
    else act.slice(0,8).forEach(function(a){ termLine(o,"err","  ["+a.sev+"] "+a.label+"  "+a.src.n+" → "+a.dst.n); });
  },
  incidents:function(o){
    termLine(o,"head","INCIDENT QUEUE");
    var open=S.incidents.filter(function(i){return i.status!=="MITIGATED"&&i.status!=="CLOSED";});
    if(!open.length){ termLine(o,"ok","  Queue empty."); return; }
    open.slice(0,10).forEach(function(i){ termLine(o,"res","  "+i.id+"  ["+i.sev+"] "+i.title+"  <span class='warn'>"+i.status+"</span>"); });
  },
  firewall:function(o){
    termLine(o,"head","FIREWALL — last 8 decisions");
    S.firewall.slice(0,8).forEach(function(r){ var c=r.action==="ALLOW"?"ok":r.action==="DROP"?"err":"warn"; termLine(o,"res","  "+nowClock(r.t)+"  "+r.src.padEnd(16," ").replace(/ /g,"&nbsp;")+" → "+r.dst.padEnd(15," ").replace(/ /g,"&nbsp;")+":"+String(r.port).padEnd(5," ").replace(/ /g,"&nbsp;")+" <span class='"+c+"'>"+r.action+"</span>"); });
  },
  mitre:function(o){
    termLine(o,"head","OBSERVED ATT&CK TECHNIQUES");
    var seen=S.mitre.filter(function(m){return m.count>0;});
    if(!seen.length){ termLine(o,"res","  None observed yet. Run an attack simulation."); return; }
    seen.forEach(function(m){ termLine(o,"res","  <span class='info'>"+m.id+"</span>  "+m.nm+"  ×"+m.count+(m.hotUntil>Date.now()?" <span class='err'>[ACTIVE]</span>":"")); });
  },
  whoami:function(o){ termLine(o,"res", S.rootMode? "root (uid=0) — elevated" : "operator (uid=1000) · SOC analyst · clearance OPERATOR"); },
  clear:function(o){ clear(o); },
  banner:function(o){ termGreet(o); },
  scan:function(o,args){
    var tgt=args[0]||randIntIP();
    termLine(o,"res","Starting scan against "+tgt+" ...");
    var ports=[22,80,443,3389,8080]; var i=0;
    var iv=setInterval(function(){ if(i>=ports.length){ clearInterval(iv); termLine(o,"ok","Scan complete. "+ports.length+" ports probed."); launchAttack("portscan",{src:tgt}); return; } var open=chance(.5); termLine(o,open?"warn":"res","  "+tgt+":"+ports[i]+"  "+(open?"OPEN":"closed")); i++; },200);
  },
  attack:function(o,args){
    var type=args[0];
    if(!type||!ATTACK_TYPES[type]){ termLine(o,"err","usage: attack <"+Object.keys(ATTACK_TYPES).join("|")+">"); return; }
    termLine(o,"warn","Launching "+ATTACK_TYPES[type].name+" simulation ...");
    launchAttack(type,{}); termLine(o,"ok","Attack injected. See dashboard / incidents.");
  }
};
/* hidden / easter-egg commands */
var TERM_SECRET = {
  sudo:function(o,a){ if(a.join(" ").indexOf("su")===0||a[0]==="-i"||a[0]==="su"){ enableRoot(o); } else termLine(o,"res","soc is not in the sudoers file. This incident will be reported."); },
  root:function(o){ enableRoot(o); },
  redteam:function(o,a){ if(a[0]==="off"){ setRedTeam(false); termLine(o,"res","red team mode disabled."); } else { setRedTeam(true); termLine(o,"err","⚑ RED TEAM MODE ENGAGED — offensive simulation unlocked."); } },
  matrix:function(o){ termLine(o,"ok","Wake up, Neo... the SOC has you. 🐇"); markEgg("matrix"); },
  hack:function(o){ termLine(o,"err","ACCESS DENIED. (nice try — try 'attack' for the sanctioned simulator)"); markEgg("hack"); },
  "cat":function(o,a){ if((a[0]||"").indexOf("shadow")>-1||(a[0]||"").indexOf("passwd")>-1){ termLine(o,"err","cat: "+a[0]+": Permission denied — and audited. 👀"); markEgg("shadow"); } else termLine(o,"res","cat: "+(a[0]||"")+": No such file"); },
  nmap:function(o,a){ TERM_CMDS.scan(o,a); },
  xyzzy:function(o){ termLine(o,"ok","Nothing happens. (but you clearly know your classics)"); markEgg("xyzzy"); },
  "42":function(o){ termLine(o,"info","The Answer to the Ultimate Question of Life, the Universe, and Everything."); markEgg("42"); },
  apt:function(o){ simulateAPT(); termLine(o,"err","APT-∞ 'SHADOWQUILL' signature injected — check the threat map."); },
  ping:function(o,a){ var t=a[0]||"10.0.0.1"; var i=0; var iv=setInterval(function(){ if(i>=4){clearInterval(iv); termLine(o,"ok","--- "+t+" ping statistics --- 4 transmitted, 4 received, 0% loss"); return;} termLine(o,"res","64 bytes from "+t+": icmp_seq="+(i+1)+" ttl=64 time="+(0.4+Math.random()*1.4).toFixed(1)+" ms"); i++; },300); }
};
function runTermCmd(raw, out){
  var line = raw.trim();
  termLine(out,"cmd","<span class='p'>"+termPrompt()+"</span> <span class='c'>"+esc(raw)+"</span>");
  if (!line) return;
  var parts = line.split(/\s+/); var cmd=parts[0].toLowerCase(); var args=parts.slice(1);
  if (TERM_CMDS[cmd]) return TERM_CMDS[cmd](out,args);
  if (TERM_SECRET[cmd]) return TERM_SECRET[cmd](out,args);
  termLine(out,"err","command not found: "+cmd+"  ·  type 'help'");
}

/* =====================================================================
   RED TEAM MODE
   ===================================================================== */
var RT_STAGES = [
  {n:1, nm:"Reconnaissance", tac:"gather target intel", tools:["whois","theHarvester","shodan"], mitre:"T1595",
    act:"OSINT sweep · 3 subdomains, 12 emails, 2 exposed services enumerated"},
  {n:2, nm:"Scanning", tac:"map the attack surface", tools:["nmap -sV","masscan","nikto"], mitre:"T1046",
    act:"Port/service scan · 8 hosts, 41 open ports, 2 outdated services"},
  {n:3, nm:"Initial Access", tac:"establish a foothold", tools:["gophish","metasploit","exploit-db"], mitre:"T1566",
    act:"Spear-phish delivered · 1 credential captured, payload staged"},
  {n:4, nm:"Execution", tac:"run attacker code", tools:["powershell -enc","cobalt strike","psexec"], mitre:"T1059",
    act:"Encoded PowerShell executed · beacon check-in every 60s"},
  {n:5, nm:"Persistence", tac:"survive reboots", tools:["schtasks","registry run","new svc"], mitre:"T1547",
    act:"Scheduled task + registry autorun installed on DC01"},
  {n:6, nm:"Privilege Escalation", tac:"gain admin", tools:["mimikatz","juicy potato","GPO abuse"], mitre:"T1548",
    act:"Local admin obtained · token impersonation successful"},
  {n:7, nm:"Defense Evasion", tac:"stay hidden", tools:["clear logs","AMSI bypass","timestomp"], mitre:"T1562",
    act:"EDR tampering + event-log clearing attempted (detected by blue team)"},
  {n:8, nm:"Credential Access", tac:"harvest secrets", tools:["mimikatz","LSASS dump","kerberoast"], mitre:"T1003",
    act:"LSASS dumped · 6 NTLM hashes + 2 Kerberos tickets extracted"}
];
function setRedTeam(on){
  S.redTeam = on;
  document.documentElement.setAttribute("data-theme", on?"red":(S.rootMode?"blue":"blue"));
  document.body.classList.toggle("redteam", on);
  renderSidebar(); renderTopbar();
  if (on){ toast("CRITICAL","RED TEAM MODE","Offensive simulation unlocked — for education only","flame"); go("redteam"); }
  else { if (S.view==="redteam") go("overview"); }
}
registerView("redteam", {
  title:"Red Team Operations", sub:"Simulated offensive kill-chain · educational", icon:"flame",
  actions:function(){ return el("button",{class:"btn sm ghost",onclick:function(){ setRedTeam(false); }},[el("span",{html:iconHTML("eye-off")}),"Exit Red Team"]); },
  build:function(v){
    v.appendChild(el("div",{class:"rt-banner"},[
      el("span",{html:iconHTML("alert-triangle")}),
      el("div",{},[ el("b",{text:"Educational simulation. "}), "These are labelled adversary TTPs mapped to MITRE ATT&CK. No real tooling runs — each stage only generates synthetic telemetry the blue-team side then detects." ])
    ]));
    var kc = el("div",{class:"kc"});
    RT_STAGES.forEach(function(st){
      var body = el("div",{class:"kc-b",style:{display:"none"}});
      body.appendChild(el("p",{html:"<b>Objective:</b> "+st.tac+"  ·  <b>MITRE:</b> <span class='mono text-crit'>"+st.mitre+"</span>"}));
      var tools = el("div",{class:"kc-tools"}); st.tools.forEach(function(t){ tools.appendChild(el("span",{class:"chip",text:t})); });
      body.appendChild(tools);
      var logHost = el("div",{class:"stack",style:{gap:"5px"}});
      body.appendChild(logHost);
      body.appendChild(el("button",{class:"btn xs danger",onclick:function(){ runRT(st, logHost); }},[el("span",{html:iconHTML("play")}),"Execute stage"]));
      var stage = el("div",{class:"kc-stage"});
      stage.appendChild(el("div",{class:"kc-h",onclick:function(){ var open=body.style.display==="none"; body.style.display=open?"":"none"; }},[
        el("span",{class:"kcn",text:st.n}),
        el("div",{class:"kct"},[ el("b",{text:st.nm}), el("span",{text:st.tac+" · "+st.mitre}) ]),
        el("span",{style:{color:"var(--txt-3)"},html:iconHTML("chevron-down")})
      ]));
      stage.appendChild(body); kc.appendChild(stage);
    });
    v.appendChild(kc);
    v.appendChild(el("div",{style:{marginTop:"14px"}},
      el("button",{class:"btn danger",onclick:function(){ runFullChain(kc); }},[el("span",{html:iconHTML("skull")}),"Run full kill-chain"]) ));

    function runRT(st, logHost){
      hitMitre(st.mitre);
      addLog("SEC","redteam["+st.n+"] "+st.act);
      addEvent(st.n>=5?"HIGH":"MEDIUM","Red-team: "+st.nm,st.mitre,"SEC");
      var row = el("div",{class:"logline",dataset:{k:"SEC"},style:{border:"0"}},[ el("span",{class:"lt",text:nowClock()}), el("span",{class:"lk",style:{color:"var(--crit)"},text:"OPS"}), el("span",{class:"lm",text:st.act}) ]);
      logHost.insertBefore(row, logHost.firstChild);
      S.threat = clamp(S.threat + (st.n>=6?9:5), 0, 100);
      toast(st.n>=6?"HIGH":"MEDIUM","Stage "+st.n+" executed",st.nm+" · "+st.mitre,"flame");
      beep(st.n>=6?"HIGH":"MEDIUM"); emit("metrics"); emit("score");
    }
    function runFullChain(kc){
      var stages = qsa(".kc-stage", kc);
      RT_STAGES.forEach(function(st,i){
        setTimeout(function(){
          hitMitre(st.mitre); addLog("SEC","redteam["+st.n+"] "+st.act);
          addEvent(st.n>=5?"HIGH":"MEDIUM","Red-team: "+st.nm,st.mitre,"SEC");
          S.threat=clamp(S.threat+4,0,100); emit("metrics"); emit("score");
          var h=qs(".kc-h",stages[i]); if(h){ h.style.background="rgba(var(--crit-rgb),.1)"; setTimeout(function(){h.style.background="";},700); }
        }, i*700);
      });
      setTimeout(function(){ createIncident({title:"Red-team full kill-chain completed",sev:"CRITICAL",src:"internal-redteam",target:"DC01 / domain",mitre:"T1003",status:"INVESTIGATING",devId:"windows"}); toast("CRITICAL","Kill-chain complete","8 stages · domain compromise simulated","skull"); }, RT_STAGES.length*700+200);
    }
  }
});

/* =====================================================================
   EASTER EGGS
   ===================================================================== */
function markEgg(k){ if(!S.eggFound[k]){ S.eggFound[k]=true; } }
function enableRoot(o){
  if (!S.rootMode){
    S.rootMode=true; document.documentElement.classList.add("root-mode");
    renderSidebar(); renderTopbar();
    if(o){ termLine(o,"ok","████ ROOT ACCESS GRANTED ████"); termLine(o,"res","uid=0(root) gid=0(root) — you now have the keys to the kingdom."); }
    toast("INFO","root@ccc","Elevated shell unlocked — theme shifted","key");
    markEgg("root");
  } else if(o){ termLine(o,"res","already root."); }
}
function simulateAPT(){
  addEvent("CRITICAL","APT signature match: SHADOWQUILL","nation-state TTP cluster","SEC");
  var city = GEO.cities.find(function(c){return c.n==="Moscow";});
  addMapAttack("CRITICAL", city, "APT-∞ SHADOWQUILL");
  hitMitre("T1071"); hitMitre("T1003");
  S.threat=clamp(S.threat+30,0,100);
  createIncident({title:"Suspected APT — SHADOWQUILL cluster",sev:"CRITICAL",src:randIP(),target:"Domain / multiple",mitre:"T1071",status:"ESCALATED",devId:"windows"});
  toast("CRITICAL","⚠ APT DETECTED","SHADOWQUILL nation-state signature","alert-octagon");
  beep("CRITICAL"); emit("metrics"); emit("score");
}
/* Konami code -> classified screen */
var konami = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
var konamiPos = 0;
function initEggs(){
  document.addEventListener("keydown", function(e){
    var k = e.key;
    if (k===konami[konamiPos] || (k&&k.toLowerCase)&&k.toLowerCase()===konami[konamiPos]){
      konamiPos++;
      if (konamiPos===konami.length){ konamiPos=0; showClassified(); }
    } else { konamiPos = (k===konami[0])?1:0; }
  });
}
function showClassified(){
  markEgg("konami");
  var cl = qs("#classified"); var scan=qs("#scanline");
  clear(cl);
  var art =
"   ██████╗██╗      █████╗ ███████╗███████╗██╗███████╗██╗███████╗██████╗ \n"+
"  ██╔════╝██║     ██╔══██╗██╔════╝██╔════╝██║██╔════╝██║██╔════╝██╔══██╗\n"+
"  ██║     ██║     ███████║███████╗███████╗██║█████╗  ██║█████╗  ██║  ██║\n"+
"  ██║     ██║     ██╔══██║╚════██║╚════██║██║██╔══╝  ██║██╔══╝  ██║  ██║\n"+
"  ╚██████╗███████╗██║  ██║███████║███████║██║██║     ██║███████╗██████╔╝\n"+
"   ╚═════╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝╚═╝     ╚═╝╚══════╝╚═════╝ ";
  cl.appendChild(el("div",{class:"cl-tag",text:"TOP SECRET // NOFORN // SOC-EYES-ONLY"}));
  cl.appendChild(el("pre",{text:art}));
  cl.appendChild(el("div",{class:"cl-hint",style:{color:"var(--ok)",fontSize:"12px",lineHeight:"1.8"},html:
    "OPERATION: <b>NIGHTINGALE</b> &nbsp;·&nbsp; STATUS: <b>ACTIVE</b><br>"+
    "You found the Konami sequence. There are "+Object.keys({konami:1,root:1,matrix:1,shadow:1,xyzzy:1,'42':1,hack:1}).length+" more secrets in the console.<br>"+
    "Hint: become <b>root</b>, and ask the terminal about <b>apt</b>."}));
  cl.appendChild(el("div",{class:"cl-hint",text:"[ click anywhere to dismiss ]"}));
  cl.classList.add("show"); scan.classList.add("show"); cl.onclick=function(){ cl.classList.remove("show"); scan.classList.remove("show"); };
  addEvent("CRITICAL","Classified terminal unlocked","OPERATION NIGHTINGALE","SEC");
}
/* logo triple/5x click egg */
var logoClicks=0, logoTimer=null;
function logoClick(){
  logoClicks++; clearTimeout(logoTimer); logoTimer=setTimeout(function(){logoClicks=0;},1200);
  if (logoClicks>=5){ logoClicks=0; toast("INFO","🛰  Classified channel","Konami ↑↑↓↓←→←→ B A · then try the terminal","radar"); markEgg("logo"); }
}

/* =====================================================================
   SIDEBAR + TOPBAR RENDER
   ===================================================================== */
var NAV = [
  {sec:"Monitor"},
  {id:"overview", nm:"Overview", icon:"gauge"},
  {id:"threatmap", nm:"Threat Map", icon:"radar"},
  {id:"network", nm:"Network", icon:"network"},
  {id:"segmentation", nm:"Segmentation", icon:"layers"},
  {id:"infra", nm:"Infrastructure", icon:"activity"},
  {id:"servers", nm:"Servers", icon:"server"},
  {sec:"Detect & Respond"},
  {id:"events", nm:"Security Events", icon:"list-checks", badge:"events"},
  {id:"incidents", nm:"Incidents", icon:"briefcase", badge:"inc"},
  {id:"logs", nm:"Log Analyzer", icon:"file-text"},
  {id:"firewall", nm:"Firewall", icon:"shield"},
  {id:"mitre", nm:"MITRE ATT&CK", icon:"target"},
  {id:"audit", nm:"Activity & Audit", icon:"list-checks"},
  {sec:"Operate"},
  {id:"scenarios", nm:"Scenario Center", icon:"play"},
  {id:"simulator", nm:"Attack Simulator", icon:"zap"},
  {id:"terminal", nm:"Terminal", icon:"terminal"},
  {sec:"Platform"},
  {id:"reports", nm:"Reporting", icon:"file-text"},
  {id:"settings", nm:"Settings", icon:"settings"}
];
function renderSidebar(){
  var sb = qs("#sidebar"); clear(sb);
  sb.appendChild(el("div",{class:"sb-brand"},[
    el("button",{class:"sb-mark",onclick:logoClick,"aria-label":"logo",html:iconHTML("shield-check")}),
    el("div",{class:"nm"},[ el("b",{text:"CYBER"}), el("span",{text:"Command Center"}) ])
  ]));
  var nav = el("nav",{class:"sb-nav"});
  NAV.forEach(function(item){
    if (item.sec){ nav.appendChild(el("div",{class:"sb-sec",text:item.sec})); return; }
    var badge = null;
    if (item.badge==="inc"){ var n=openIncidentsCount(); if(n>0) badge=el("span",{class:"n",text:n}); }
    var a = el("button",{class:"nav-item"+(S.view===item.id?" active":""),dataset:{view:item.id},onclick:function(){ go(item.id); }},[
      el("span",{html:iconHTML(item.icon)}),
      el("span",{class:"lbl",text:item.nm}),
      badge
    ]);
    nav.appendChild(a);
  });
  // red team nav (only when unlocked)
  if (S.redTeam){
    nav.appendChild(el("div",{class:"sb-sec",text:"Red Team"}));
    nav.appendChild(el("button",{class:"nav-item rt"+(S.view==="redteam"?" active":""),dataset:{view:"redteam"},onclick:function(){ go("redteam"); }},[
      el("span",{html:iconHTML("flame")}), el("span",{class:"lbl",text:"Offensive Ops"})
    ]));
  }
  sb.appendChild(nav);
  sb.appendChild(el("div",{class:"sb-foot"},[
    el("div",{class:"sb-uplink"},[ el("span",{class:"led"}), el("span",{text:S.rootMode?"root shell · secure":"uplink · encrypted"}) ])
  ]));
}
var topRefs = {};
function renderTopbar(){
  var tb = qs("#topbar"); clear(tb);
  tb.appendChild(el("button",{class:"burger","aria-label":"menu",html:iconHTML("menu"),onclick:function(){ S.navOpen=!S.navOpen; document.body.classList.toggle("app-navopen",S.navOpen); }}));
  tb.appendChild(el("div",{class:"tb-title"},[ el("b",{text:"CYBER COMMAND CENTER"}), el("span",{text:S.rootMode?"root console · uid=0":(S.redTeam?"red team engaged":"security operations")}) ]));
  var statOp = el("div",{class:"tb-stat tb-hide-md"},[ el("span",{class:"led"}), el("span",{class:"k",text:"System"}), el("span",{class:"v ok",text:"OPERATIONAL"}) ]);
  var statNet = el("div",{class:"tb-stat tb-hide-md"},[ el("span",{class:"k",text:"Network"}), el("span",{class:"v",id:"tbNet"}) ]);
  var statSec = el("div",{class:"tb-stat"},[ el("span",{class:"k",text:"Threat"}), el("span",{class:"v",id:"tbThreat"}) ]);
  tb.appendChild(statOp); tb.appendChild(statNet); tb.appendChild(statSec);
  // global search / command palette
  var search = el("button",{class:"tb-search","aria-label":"Search (Ctrl+K)",onclick:function(){ if(typeof openCmdK==="function") openCmdK(); }},[
    el("span",{html:iconHTML("search")}),
    el("span",{class:"lbl",text:"Search…"}),
    el("span",{class:"kbd",text:"⌘K"})
  ]);
  tb.appendChild(search);
  tb.appendChild(el("span",{class:"tb-spacer"}));
  var clock = el("div",{class:"tb-clock",id:"tbClock"},[ el("span",{id:"tbTime",text:nowClock()}), el("small",{text:"LOCAL · "+Intl.DateTimeFormat().resolvedOptions().timeZone.split("/").pop()}) ]);
  tb.appendChild(clock);
  // sound toggle
  var sound = el("button",{class:"tb-icon"+(S.soundOn?" on":""),id:"tbSound","aria-label":"Toggle sound alerts",title:"Sound alerts",html:iconHTML(S.soundOn?"volume":"volume-x"),onclick:function(){ S.soundOn=!S.soundOn; sound.classList.toggle("on",S.soundOn); sound.innerHTML=iconHTML(S.soundOn?"volume":"volume-x"); if(S.soundOn) beep("LOW"); toast("INFO","Sound alerts "+(S.soundOn?"on":"off"),S.soundOn?"Audio cues enabled for alerts":"Muted","bell"); }});
  tb.appendChild(sound);
  // notification center
  var bell = el("button",{class:"tb-icon",id:"tbBell","aria-label":"Notifications",html:iconHTML("bell"),onclick:function(){ if(typeof toggleNotifCenter==="function") toggleNotifCenter(bell); }});
  var badge = el("span",{class:"badge",id:"tbBadge"});
  bell.appendChild(badge); tb.appendChild(bell);
  // role chip
  var rc = (ROLES&&ROLES[S.role])?ROLES[S.role]:null;
  if (rc){ tb.appendChild(el("button",{class:"role-chip tb-hide-sm","aria-label":"Role",title:"Active role",onclick:function(){ go("settings"); }},[ el("span",{class:"rd"}), el("span",{class:"rt",text:rc.nm}) ])); }
  // red-team quick toggle (hidden affordance: shows lock)
  var rt = el("button",{class:"tb-icon tb-hide-sm"+(S.redTeam?" on":""),"aria-label":"Red team mode",title:"Red Team Mode",html:iconHTML(S.redTeam?"flame":"eye-off"),onclick:function(){ setRedTeam(!S.redTeam); }});
  if (S.redTeam) rt.style.color="var(--crit)";
  tb.appendChild(rt);
  // user
  tb.appendChild(el("button",{class:"tb-user",onclick:function(){ openProfile(); }},[
    el("span",{class:"tb-avatar",text:"BM"}),
    el("span",{class:"who tb-hide-sm"},[ el("b",{text:"B. Misimi"}), el("span",{text:S.rootMode?"root":"SOC Analyst"}) ])
  ]));
  updateTopbar();
}
function updateTopbar(){
  var l=threatLabel(S.threat);
  var t=qs("#tbThreat"); if(t){ t.textContent=l.t; t.className="v "+(l.c==="crit"||l.c==="high"?"crit":l.c==="med"?"warn":"ok"); }
  var n=qs("#tbNet"); if(n){ var ok=S.devicesOnline===S.devicesTotal; n.textContent=ok?"STABLE":"DEGRADED"; n.className="v "+(ok?"ok":"warn"); }
  var b=qs("#tbBadge"); if(b){ var c=(typeof unreadNotif==="function")?unreadNotif():0; if(c>0){ b.textContent=c>9?"9+":c; b.style.display=""; } else b.style.display="none"; }
}
function openProfile(){
  openModal({ icon:"user", iconSev:"INFO", title:"Bardhyl Misimi", sub:S.rootMode?"root · uid=0":"SOC Analyst · Tier-2",
    rows:[["Operator","Bardhyl Misimi"],["Role",S.rootMode?"root (elevated)":"SOC Analyst · Tier-2"],["Clearance",S.rootMode?"ROOT":"OPERATOR"],["Shift","Blue Team · Day"],["Session","authenticated · MFA ✓"],["Sound alerts",S.soundOn?"ON":"OFF"]],
    foot: el("div",{class:"flex gap-2 wrap"},[
      el("button",{class:"btn sm",onclick:function(){ go("terminal"); closeModal(); }},[el("span",{html:iconHTML("terminal")}),"Open Terminal"]),
      el("button",{class:"btn ghost sm",onclick:closeModal},"Close")
    ])
  });
}

/* =====================================================================
   BOOT + INIT
   ===================================================================== */
var BOOT_LINES = [
  ["init secure kernel · CCC-OS 3.1", "ok"],
  ["mounting encrypted volumes", "ok"],
  ["loading threat intel feeds [MISP · AlienVault · abuse.ch]", "ok"],
  ["establishing SIEM correlation pipeline", "ok"],
  ["calibrating firewall · 1,204 rules synced", "ok"],
  ["enrolling 14 network assets", "ok"],
  ["arming EDR on 86 endpoints", "ok"],
  ["negotiating VPN tunnels · 38 peers", "ok"],
  ["MITRE ATT&CK matrix loaded · 20 techniques", "ok"],
  ["anomaly baseline established", "w"],
  ["SOC console ready — welcome, operator", "ok"]
];
function runBoot(done){
  var log=qs("#bootLog"), bar=qs("#bootBar");
  var i=0;
  function step(){
    if (i<BOOT_LINES.length){
      var b=BOOT_LINES[i];
      var line=el("div",{},[ el("i",{text:"›"}), " ", document.createTextNode(b[0]+" "), el(b[1]==="w"?"span":"b",{class:b[1]==="w"?"w":"",text:b[1]==="w"?"[warn]":"[ ok ]"}) ]);
      log.appendChild(line); if(log.children.length>7) log.removeChild(log.firstChild);
      bar.style.width=Math.round((i+1)/BOOT_LINES.length*100)+"%";
      i++;
      setTimeout(step, reduceMotion?60:rnd(120,260));
    } else { setTimeout(done, reduceMotion?100:400); }
  }
  step();
}

function startClock(){
  setInterval(function(){ var t=qs("#tbTime"); if(t) t.textContent=nowClock(); }, 1000);
}

function init(){
  platformInit();
  seedInit();
  var restored = loadState();
  seedPlatform();
  recomputeHealth();
  if (S.redTeam) document.documentElement.setAttribute("data-theme","red");
  registerTerminalView();
  if (typeof registerPlatformViews==="function") registerPlatformViews();
  renderSidebar();
  renderTopbar();
  startClock();
  initEggs();
  if (typeof initShortcuts==="function") initShortcuts();
  renderView("overview");
  if (restored) setTimeout(function(){ toast("INFO","Session restored","Your incidents, notes, rules & settings were loaded","refresh"); }, 900);
  // global live wiring (independent of active view)
  on("metrics", updateTopbar);
  on("tick", updateTopbar);
  on("incident", function(){ renderSidebarBadge(); });
  on("incident-update", function(){ renderSidebarBadge(); });
  on("device", function(){ updateTopbar(); });
  on("mapattack", function(){ updateTopbar(); });
  // live wiring for notifications/health badges
  on("notif", function(){ updateTopbar(); });
  on("timeline", function(){ /* consumed by timeline view */ });
  // main tick (interval from settings)
  S._tickTimer = setInterval(tick, (S.settings&&S.settings.simSpeedMs)||2000);
  // resize handling for collapse
  window.addEventListener("resize", function(){ if(window.innerWidth>860 && S.navOpen){ S.navOpen=false; document.body.classList.remove("app-navopen"); } });
  S.booted=true;
  // announce
  setTimeout(function(){ toast("INFO","SOC online","All systems operational · monitoring active","shield-check"); }, 600);
}
function renderSidebarBadge(){
  var item = qs('.nav-item[data-view="incidents"]');
  if (!item) return;
  var old=qs(".n",item); if(old) old.remove();
  var n=openIncidentsCount();
  if (n>0) item.appendChild(el("span",{class:"n",text:n}));
}

/* GO */
function boot(){
  var app=qs("#app");
  runBoot(function(){
    qs("#boot").classList.add("done");
    app.setAttribute("aria-hidden","false");
    init();
  });
}
if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
else boot();

})();
