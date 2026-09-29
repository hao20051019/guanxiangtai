/* 观象台 · 共享核心：卦数数据 + 排盘算法 + 存储工具（多页面共用） */

/* global window, document, localStorage */



  var TRI = [
    {n:1,name:"乾",sym:"☰",elem:"金",nature:"天",attr:"健",lines:[1,1,1],dir:"西北",num:1},
    {n:2,name:"兑",sym:"☱",elem:"金",nature:"泽",attr:"悦",lines:[1,1,0],dir:"西",num:2},
    {n:3,name:"离",sym:"☲",elem:"火",nature:"火",attr:"丽",lines:[1,0,1],dir:"南",num:3},
    {n:4,name:"震",sym:"☳",elem:"木",nature:"雷",attr:"动",lines:[1,0,0],dir:"东",num:4},
    {n:5,name:"巽",sym:"☴",elem:"木",nature:"风",attr:"入",lines:[0,1,1],dir:"东南",num:5},
    {n:6,name:"坎",sym:"☵",elem:"水",nature:"水",attr:"陷",lines:[0,1,0],dir:"北",num:6},
    {n:7,name:"艮",sym:"☶",elem:"土",nature:"山",attr:"止",lines:[0,0,1],dir:"东北",num:7},
    {n:8,name:"坤",sym:"☷",elem:"土",nature:"地",attr:"顺",lines:[0,0,0],dir:"西南",num:8}
  ];

  var HEX = [
    ["乾为天","天泽履","天火同人","天雷无妄","天风姤","天水讼","天山遁","天地否"],
    ["泽天夬","兑为泽","泽火革","泽雷随","泽风大过","泽水困","泽山咸","泽地萃"],
    ["火天大有","火泽睽","离为火","火雷噬嗑","火风鼎","火水未济","火山旅","火地晋"],
    ["雷天大壮","雷泽归妹","雷火丰","震为雷","雷风恒","雷水解","雷山小过","雷地豫"],
    ["风天小畜","风泽中孚","风火家人","风雷益","巽为风","风水涣","风山渐","风地观"],
    ["水天需","水泽节","水火既济","水雷屯","水风井","坎为水","水山蹇","水地比"],
    ["山天大畜","山泽损","山火贲","山雷颐","山风蛊","山水蒙","艮为山","山地剥"],
    ["地天泰","地泽临","地火明夷","地雷复","地风升","地水师","地山谦","坤为地"]
  ];

  var KW = [
    [ 1,10,13,25,44, 6,33,12],
    [43,58,49,17,28,47,31,45],
    [14,38,30,21,50,64,56,35],
    [34,54,55,51,32,40,62,16],
    [ 9,61,37,42,57,59,53,20],
    [ 5,60,63, 3,48,29,39, 8],
    [26,41,22,27,18, 4,52,23],
    [11,19,36,24,46, 7,15, 2]
  ];

  var SHENG = {木:"火",火:"土",土:"金",金:"水",水:"木"};

  var KE    = {木:"土",土:"水",水:"火",火:"金",金:"木"};

  var CYCLE = {木:"春生之气，主生长与推进",火:"夏长之气，主显明与急切",土:"四时之气，主承载与稳定",金:"秋收之气，主决断与收敛",水:"冬藏之气，主潜伏与智谋"};

  var POSITION = [
    {k:"初爻", t:"事之始。宜审其端倪，此时动手，先定方向再论成败。"},
    {k:"二爻", t:"内卦之中，事在己身。守正则安，进退多由自己决定。"},
    {k:"三爻", t:"内外之交，变动之机。进退须慎，此处最容易反复。"},
    {k:"四爻", t:"外卦之始，出而应事。宜宽以待人，勿以己意强加于人。"},
    {k:"五爻", t:"卦之主位。德位相称则事易成，取舍在此一决。"},
    {k:"上爻", t:"事之终。物极则变，宜知止，善收尾即是好结果。"}
  ];

  var VERDICT = {
    "比和":  {head:"体用比和，事体顺遂。",  text:"体用五行相同，气机相协，谋事多顺，阻力较小。宜乘势而行，不必过度筹划。"},
    "用生体":{head:"用生体，得助而进。",   text:"所问之事反过来扶助自身，多有外力相助、贵人相济之象。求谋有进益，宜主动承接。"},
    "体克用":{head:"体克用，可得而迟。",   text:"自身之力可以制事，事在可成之列，但需付出实际工夫，进展偏缓。宜稳扎稳打，不宜求速。"},
    "用克体":{head:"用克体，宜守不宜进。", text:"事情反过来牵制自身，多见阻滞与耗损。此时宜守成、宜复盘、宜推迟决断，避免在此刻加码。"},
    "体生用":{head:"体生用，气泄于外。",   text:"自身之力外泄于事，容易付出多而所得少。宜节制投入，先理清边界，再论推进。"}
  };

  var TIMING = {1:"一",2:"二",3:"三",4:"四",5:"五",6:"六",7:"七",8:"八"};

  function hexGlyph(ui, li){ return String.fromCharCode(0x4DC0 + KW[ui][li] - 1); }

  var SHENG = {木:"火",火:"土",土:"金",金:"水",水:"木"};
  var KE    = {木:"土",土:"水",水:"火",火:"金",金:"木"};
  var CYCLE = {木:"春生之气，主生长与推进",火:"夏长之气，主显明与急切",土:"四时之气，主承载与稳定",金:"秋收之气，主决断与收敛",水:"冬藏之气，主潜伏与智谋"};

  var POSITION = [
    {k:"初爻", t:"事之始。宜审其端倪，此时动手，先定方向再论成败。"},
    {k:"二爻", t:"内卦之中，事在己身。守正则安，进退多由自己决定。"},
    {k:"三爻", t:"内外之交，变动之机。进退须慎，此处最容易反复。"},
    {k:"四爻", t:"外卦之始，出而应事。宜宽以待人，勿以己意强加于人。"},
    {k:"五爻", t:"卦之主位。德位相称则事易成，取舍在此一决。"},
    {k:"上爻", t:"事之终。物极则变，宜知止，善收尾即是好结果。"}
  ];

  /* =========================================================
     二、排盘计算
     ========================================================= */
  function mod8(n){ var r = n % 8; return r === 0 ? 8 : r; }
  function mod6(n){ var r = n % 6; return r === 0 ? 6 : r; }
  function triByNum(n){ return TRI[n - 1]; }
  function triIndexByLines(l){
    for (var i = 0; i < TRI.length; i++){
      if (TRI[i].lines[0] === l[0] && TRI[i].lines[1] === l[1] && TRI[i].lines[2] === l[2]) return i;
    }
    return 0;
  }

  function mod8(n){ var r = n % 8; return r === 0 ? 8 : r; }
  function mod6(n){ var r = n % 6; return r === 0 ? 6 : r; }
  function triByNum(n){ return TRI[n - 1]; }
  function triIndexByLines(l){
    for (var i = 0; i < TRI.length; i++){
      if (TRI[i].lines[0] === l[0] && TRI[i].lines[1] === l[1] && TRI[i].lines[2] === l[2]) return i;
    }
    return 0;
  }

  function mod6(n){ var r = n % 6; return r === 0 ? 6 : r; }
  function triByNum(n){ return TRI[n - 1]; }
  function triIndexByLines(l){
    for (var i = 0; i < TRI.length; i++){
      if (TRI[i].lines[0] === l[0] && TRI[i].lines[1] === l[1] && TRI[i].lines[2] === l[2]) return i;
    }
    return 0;
  }

  function triByNum(n){ return TRI[n - 1]; }
  function triIndexByLines(l){
    for (var i = 0; i < TRI.length; i++){
      if (TRI[i].lines[0] === l[0] && TRI[i].lines[1] === l[1] && TRI[i].lines[2] === l[2]) return i;
    }
    return 0;
  }

  function triIndexByLines(l){
    for (var i = 0; i < TRI.length; i++){
      if (TRI[i].lines[0] === l[0] && TRI[i].lines[1] === l[1] && TRI[i].lines[2] === l[2]) return i;
    }
    return 0;
  }

  function relation(tiEl, yongEl){
    if (tiEl === yongEl) return "比和";
    if (SHENG[yongEl] === tiEl) return "用生体";
    if (SHENG[tiEl] === yongEl) return "体生用";
    if (KE[yongEl] === tiEl) return "用克体";
    return "体克用";
  }

  function cast(n1, n2, n3){
    return castByNums(mod8(n1), mod8(n2), mod6(n1 + n2 + n3), {n1:n1, n2:n2, n3:n3, method:"numbers"});
  }

  function castByNums(upperNum, lowerNum, move, meta){
    meta = meta || {};
    var upper = triByNum(upperNum), lower = triByNum(lowerNum);
    var lines = lower.lines.concat(upper.lines);          // 自初爻至上爻
    var huL = triByNum(triIndexByLines(lines.slice(1,4)) + 1);
    var huU = triByNum(triIndexByLines(lines.slice(2,5)) + 1);
    var biLines = lines.slice();
    biLines[move-1] = biLines[move-1] === 1 ? 0 : 1;
    var biL = triByNum(triIndexByLines(biLines.slice(0,3)) + 1);
    var biU = triByNum(triIndexByLines(biLines.slice(3,6)) + 1);

    var moveInUpper = move > 3;
    var ti  = moveInUpper ? lower : upper;   // 不动者为体
    var yong = moveInUpper ? upper : lower;  // 动者为用
    var rel = relation(ti.elem, yong.elem);

    var ui = triIndexByLines(upper.lines), li = triIndexByLines(lower.lines);
    var hui = triIndexByLines(huU.lines), hli = triIndexByLines(huL.lines);
    var bui = triIndexByLines(biU.lines), bli = triIndexByLines(biL.lines);

    return {
      n1:meta.n1, n2:meta.n2, n3:meta.n3, method:meta.method || "numbers", meta:meta,
      upperNum:upperNum, lowerNum:lowerNum, move:move,
      upper:upper, lower:lower,
      lines:lines, biLines:biLines,
      benName: HEX[ui][li],
      huName:  HEX[hui][hli],
      biName:  HEX[bui][bli],
      benGlyph: hexGlyph(ui, li),
      huGlyph:  hexGlyph(hui, hli),
      biGlyph:  hexGlyph(bui, bli),
      huUpper:huU, huLower:huL,
      biUpper:biU, biLower:biL,
      ti:ti, yong:yong, rel:rel,
      pos:POSITION[move-1],
      time:new Date()
    };
  }

  function stepsHTML(c){
    var v = VERDICT[c.rel];
    var steps = [
      ["取数定卦",
       c.method === "time"
         ? "年支"+c.meta.yz+"数"+c.meta.ny+" + 农历"+c.meta.mLabel+"数"+c.meta.nm+" + 农历"+c.meta.dLabel+"数"+c.meta.nd+" = "+c.meta.s1+" ÷ 8 余"+c.upperNum+"，得上卦 "+c.upper.sym+" "+c.upper.name+"；再加"+c.meta.hz+"时数"+c.meta.nh+" = "+c.meta.s2+" ÷ 8 余"+c.lowerNum+"，得下卦 "+c.lower.sym+" "+c.lower.name+"。"
         : "第一数 "+c.n1+" ÷ 8 余"+c.upperNum+"，得上卦 "+c.upper.sym+" "+c.upper.name+"；第二数 "+c.n2+" ÷ 8 余"+c.lowerNum+"，得下卦 "+c.lower.sym+" "+c.lower.name+"。",
       "上"+c.upper.name+"下"+c.lower.name+"，合为本卦 "+c.benName+"（"+c.benGlyph+"）"],
      ["定动爻",
       c.method === "time"
         ? "年月日时总数 "+c.meta.s2+" ÷ 6 余"+c.move+"，动爻落在"+c.pos.k+"。"
         : "三数之和 "+(c.n1+c.n2+c.n3)+" ÷ 6 余"+c.move+"，动爻落在"+c.pos.k+"。",
       c.pos.t],
      ["观本卦",
       "本卦 "+c.benName+"：上卦 "+c.upper.nature+"·"+c.upper.elem+"，下卦 "+c.lower.nature+"·"+c.lower.elem+"。",
       "先看上下两卦的五行生克与卦名所指，再论吉凶，不先套断语"],
      ["取互卦",
       "取二、三、四爻为下互，三、四、五爻为上互，得互卦 "+c.huName+"（"+c.huGlyph+"）。",
       "上"+c.huUpper.name+"下"+c.huLower.name+"，代表事情展开的中间过程与节奏"],
      ["求变卦",
       "第"+c.move+"爻阴阳互换，得变卦 "+c.biName+"（"+c.biGlyph+"）。",
       "上"+c.biUpper.name+"下"+c.biLower.name+"，代表演变之后的趋势，非结局判决"],
      ["分体用",
       "动爻在"+(c.move<=3 ? "下卦" : "上卦")+"，动者为用、静者为体：用卦 "+c.yong.name+"（"+c.yong.elem+"），体卦 "+c.ti.name+"（"+c.ti.elem+"）。",
       "体用"+c.rel+" —— "+v.head],
      ["落判断",
       v.text,
       "断卦次序：体用生克 → 动爻位置 → 互卦过程 → 变卦趋势 → 卦名卦象 → 具体所问"]
    ];
    return steps.map(function(s, i){
      return '<div class="step"><div class="no">'+("0"+(i+1))+'</div><div><h4>'+s[0]+'</h4><p>'+s[1]+'</p><p class="sub">'+s[2]+'</p></div></div>';
    }).join("");
  }

  function formatTime(d){
    function p(x){ return x < 10 ? "0" + x : "" + x; }
    return d.getFullYear() + "-" + p(d.getMonth()+1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
  }

  function escapeHTML(s){
    return String(s).replace(/[&<>"']/g, function(ch){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch];
    });
  }

  function pad3(n){ n = String(n); while (n.length < 3) n = "0" + n; return n; }

  function escapeHTML(s){
    return String(s).replace(/[&<>"']/g, function(ch){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch];
    });
  }
/* ================= 存储与页面间传递 ================= */
var STORE = "guanxiangtai.records.v1";
var SEED = [
  {id:"042", q:"这项合作要不要继续", type:"决策", time:"2026.02.12 21:08", n1:2, n2:6, n3:4, status:"已完成", method:"numbers"},
  {id:"041", q:"换一个城市工作", type:"事业", time:"2026.02.10 09:26", n1:9, n2:3, n3:1, status:"待回看", method:"numbers"},
  {id:"040", q:"最近这段关系的走向", type:"关系", time:"2026.02.08 22:14", n1:4, n2:4, n3:9, status:"已完成", method:"numbers"},
  {id:"039", q:"下月出行是否顺路", type:"出行", time:"2026.02.05 18:02", n1:1, n2:7, n3:5, status:"已完成", method:"numbers"}
];
function loadRecords(){
  try {
    var raw = localStorage.getItem(STORE);
    if (!raw){ localStorage.setItem(STORE, JSON.stringify(SEED)); return SEED.slice(); }
    return JSON.parse(raw);
  } catch(e){ return SEED.slice(); }
}
function persist(list){
  try { localStorage.setItem(STORE, JSON.stringify(list)); return true; } catch(e){ return false; }
}
function saveLastCast(payload){
  try { localStorage.setItem("guanxiangtai.lastCast", JSON.stringify(payload)); return true; } catch(e){ return false; }
}
function loadLastCast(){
  try {
    var raw = localStorage.getItem("guanxiangtai.lastCast");
    return raw ? JSON.parse(raw) : null;
  } catch(e){ return null; }
}
function payloadFromCast(c, qtype, qtext, stamp){
  return {
    upperNum: c.upperNum, lowerNum: c.lowerNum, move: c.move,
    method: c.method || "numbers", meta: c.meta || null,
    n1: c.n1, n2: c.n2, n3: c.n3,
    qtype: qtype || "其他", qtext: qtext || "",
    time: stamp || (c.time && c.time.getTime ? c.time.toISOString() : new Date().toISOString())
  };
}
function castFromPayload(p){
  var meta = p.meta || {method: p.method || "numbers"};
  var c = castByNums(p.upperNum, p.lowerNum, p.move, meta);
  if (p.time) c.time = parseTime(p.time);
  return c;
}
function stampNow(){
  var d = new Date();
  function p(x){ return x < 10 ? "0" + x : "" + x; }
  return d.getFullYear() + "." + p(d.getMonth() + 1) + "." + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
}

/* ================= 页面工具 ================= */
function reduced(){
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function toast(msg){
  var el = document.getElementById("toast");
  if (!el){
    el = document.createElement("div");
    el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status");
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("on");
  clearTimeout(el._t);
  el._t = setTimeout(function(){ el.classList.remove("on"); }, 2600);
}
if (typeof document !== "undefined") document.addEventListener("DOMContentLoaded", function(){
  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("nav");
  if (menuBtn && nav) menuBtn.addEventListener("click", function(){ nav.classList.toggle("open"); });
  var hdr = document.getElementById("hdr");
  if (hdr){
    var onScroll = function(){ hdr.classList.toggle("stuck", window.scrollY > 8 || hdr.hasAttribute("data-always")); };
    window.addEventListener("scroll", onScroll, {passive:true});
    onScroll();
  }
});


/* ================= 卦画渲染（初爻居下） ================= */
  function hexBarsHTML(lines, movingIdx){
    var out = "";
    for (var i = lines.length - 1; i >= 0; i--){       // 自上爻起排，初爻居下
      var v = lines[i];
      var cls = "r" + (i === movingIdx-1 ? " moving" : "");
      var bars = v === 1 ? '<i class="y"></i>' : '<i class="m"></i><i class="m"></i>';
      out += '<div class="'+cls+'"><div class="bars">'+bars+'</div><div class="mk"></div>'+
             '<div class="tag">'+POSITION[i].k+(i===movingIdx-1?' · 动':'')+'</div></div>';
    }
    return out;
  }


/* ================= 便捷别名与健壮日期 ================= */
function esc(s){ return escapeHTML(s == null ? "" : s); }
function parseTime(t){
  if (!t) return new Date();
  if (t instanceof Date) return t;
  var s = String(t).replace(/\./g, "-");
  var d = new Date(s);
  return isNaN(d.getTime()) ? new Date() : d;
}
