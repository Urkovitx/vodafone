(function(){
  const D = window.IOT_DATA;
  const $  = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const fmt = n => n.toLocaleString('ca-ES', { maximumFractionDigits: 0 });
  const fmtEur = n => fmt(n) + ' €';

  // ============ TABS ============
  $$('#tabs .tab').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('#tabs .tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      $$('.panel').forEach(p => p.classList.toggle('active', p.dataset.panel === tab));
    });
  });

  // ============ THEME ============
  const themeBtn = $('#theme-btn');
  const setTheme = (t) => {
    document.body.classList.toggle('theme-light', t === 'light');
    document.body.classList.toggle('theme-dark',  t !== 'light');
    $('#tk-dark').classList.toggle('on', t !== 'light');
    $('#tk-light').classList.toggle('on', t === 'light');
  };
  themeBtn.addEventListener('click', () => {
    setTheme(document.body.classList.contains('theme-light') ? 'dark' : 'light');
  });
  $('#tk-dark').onclick  = () => setTheme('dark');
  $('#tk-light').onclick = () => setTheme('light');

  // ============ TWEAKS PANEL ============
  $('#tweaks-toggle').onclick = () => $('#tweaks-panel').classList.toggle('open');
  $('#tk-compact').onclick = () => {
    $('#tk-compact').classList.add('on'); $('#tk-comfort').classList.remove('on');
    document.body.style.fontSize = '13px';
  };
  $('#tk-comfort').onclick = () => {
    $('#tk-comfort').classList.add('on'); $('#tk-compact').classList.remove('on');
    document.body.style.fontSize = '14px';
  };

  // ============ CLOCK ============
  const tickClock = () => {
    const d = new Date();
    $('#clock').textContent = d.toLocaleString('ca-ES', { hour:'2-digit', minute:'2-digit', day:'2-digit', month:'short' });
  };
  tickClock(); setInterval(tickClock, 30000);

  // ============ FILTERS ============
  const state = { gas:'__all', client:'__all', risk:'__all', q:'' };

  // build gas chips
  const filterbar = $('#filterbar');
  const gasLabel = filterbar.querySelector('.filter-label');
  const allGasChip = filterbar.querySelector('[data-filter="gas"][data-val="__all"]');
  Object.keys(D.inventory_by_gas).forEach(g => {
    const c = document.createElement('span');
    c.className = 'chip';
    c.dataset.filter = 'gas'; c.dataset.val = g;
    c.innerHTML = `<span class="swatch" style="background:${D.gas_colors[g]}"></span>${g}`;
    allGasChip.parentNode.insertBefore(c, allGasChip.nextSibling);
  });

  // build client select
  const sel = $('#client-select');
  Object.keys(D.inventory_by_client).forEach(c => {
    const o = document.createElement('option'); o.value=c; o.textContent=c;
    sel.appendChild(o);
  });
  sel.onchange = () => { state.client = sel.value; renderFleet(); };

  filterbar.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip || !chip.dataset.filter) return;
    const f = chip.dataset.filter;
    if (f === 'gas' || f === 'risk') {
      $$(`.chip[data-filter="${f}"]`).forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state[f] = chip.dataset.val;
      renderFleet();
    }
  });

  $('#search').addEventListener('input', e => { state.q = e.target.value.toLowerCase(); renderFleet(); });

  // ============ SVG HELPERS ============
  const NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs={}) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function clear(svg){ while(svg.firstChild) svg.removeChild(svg.firstChild); }
  function cssVar(name){ return getComputedStyle(document.body).getPropertyValue(name).trim(); }

  // ============ SPARKLINES ============
  function drawSpark(svgId, vals, color){
    const svg = $('#' + svgId); clear(svg);
    const w = 80, h = 28;
    const min = Math.min(...vals), max = Math.max(...vals);
    const pts = vals.map((v,i) => `${(i/(vals.length-1))*w},${h - ((v-min)/((max-min)||1))*(h-4) - 2}`).join(' ');
    svg.appendChild(el('polyline', { points: pts, fill:'none', stroke: color || cssVar('--accent'), 'stroke-width':1.5, 'stroke-linejoin':'round' }));
    // last point dot
    const last = pts.split(' ').pop().split(',');
    svg.appendChild(el('circle', { cx:last[0], cy:last[1], r:2, fill: color || cssVar('--accent') }));
  }

  // ============ FLEET TIME-SERIES (overview) ============
  function drawFleetTS() {
    const svg = $('#fleet-ts'); clear(svg);
    const W = 800, H = 240, padL=40, padR=12, padT=12, padB=24;
    const data = window.genFleetSeries();
    const xs = i => padL + (i/(data.length-1)) * (W - padL - padR);
    const allLo = Math.min(...data.map(d=>d.lo));
    const allHi = Math.max(...data.map(d=>d.hi));
    const ys = v => padT + (1 - (v - allLo)/(allHi - allLo)) * (H - padT - padB);

    // grid
    for (let i=0;i<=4;i++){
      const y = padT + (i/4)*(H-padT-padB);
      svg.appendChild(el('line',{x1:padL,x2:W-padR,y1:y,y2:y,stroke:cssVar('--grid-line'),'stroke-width':1}));
      const v = allHi - (i/4)*(allHi-allLo);
      const t = el('text',{x:padL-6,y:y+3,'text-anchor':'end','font-size':10,fill:cssVar('--ink-faint'),'font-family':'JetBrains Mono'}); t.textContent = v.toFixed(0); svg.appendChild(t);
    }

    // band p10-p90
    const bandPath = data.map((d,i) => `${i?'L':'M'}${xs(i)},${ys(d.hi)}`).join(' ')
      + ' ' + data.slice().reverse().map((d,i) => `L${xs(data.length-1-i)},${ys(d.lo)}`).join(' ') + ' Z';
    svg.appendChild(el('path',{d:bandPath, fill:cssVar('--accent-soft'), stroke:'none'}));

    // median line
    const medPath = data.map((d,i) => `${i?'L':'M'}${xs(i)},${ys(d.med)}`).join(' ');
    svg.appendChild(el('path',{d:medPath, fill:'none', stroke:cssVar('--accent'),'stroke-width':1.5}));

    // anomalies
    data.forEach((d,i) => { if (d.anom) {
      svg.appendChild(el('line',{x1:xs(i),x2:xs(i),y1:padT,y2:H-padB,stroke:cssVar('--bad'),'stroke-width':1,'stroke-dasharray':'2,3'}));
      svg.appendChild(el('circle',{cx:xs(i),cy:ys(d.med),r:3,fill:cssVar('--bad')}));
    }});

    // x-axis day labels
    for (let d=0; d<14; d+=2) {
      const x = padL + (d*24/(data.length-1)) * (W-padL-padR);
      const t = el('text',{x:x,y:H-6,'text-anchor':'middle','font-size':10,fill:cssVar('--ink-faint'),'font-family':'JetBrains Mono'});
      t.textContent = `D${d+1}`; svg.appendChild(t);
    }
  }

  // ============ DONUT ============
  function drawDonut() {
    const svg = $('#donut'); clear(svg);
    const cx=100, cy=100, r=78, w=22;
    const total = D.savings_breakdown.reduce((s,d)=>s+d.value,0);
    let acc = -Math.PI/2;
    D.savings_breakdown.forEach(d => {
      const ang = (d.value/total)*Math.PI*2;
      const x1=cx+r*Math.cos(acc), y1=cy+r*Math.sin(acc);
      const x2=cx+r*Math.cos(acc+ang), y2=cy+r*Math.sin(acc+ang);
      const xi1=cx+(r-w)*Math.cos(acc), yi1=cy+(r-w)*Math.sin(acc);
      const xi2=cx+(r-w)*Math.cos(acc+ang), yi2=cy+(r-w)*Math.sin(acc+ang);
      const lg = ang>Math.PI?1:0;
      const path = `M${x1},${y1} A${r},${r} 0 ${lg} 1 ${x2},${y2} L${xi2},${yi2} A${r-w},${r-w} 0 ${lg} 0 ${xi1},${yi1} Z`;
      svg.appendChild(el('path',{d:path, fill:d.color, stroke:cssVar('--surface'), 'stroke-width':2}));
      acc += ang;
    });
    const t1 = el('text',{x:cx,y:cy-4,'text-anchor':'middle','font-size':10,fill:cssVar('--ink-faint'),'font-family':'Inter'});
    t1.textContent = 'Total estalvi'; svg.appendChild(t1);
    const t2 = el('text',{x:cx,y:cy+18,'text-anchor':'middle','font-size':22,'font-weight':'600',fill:cssVar('--ink'),'font-family':'JetBrains Mono'});
    t2.textContent = (total/1000).toFixed(1) + 'K€'; svg.appendChild(t2);

    // legend
    const lg = $('#donut-legend');
    lg.innerHTML = '';
    D.savings_breakdown.forEach(d => {
      const pct = ((d.value/total)*100).toFixed(0);
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;font-size:12px;gap:8px';
      row.innerHTML = `<span style="display:flex;align-items:center;gap:8px"><span style="width:8px;height:8px;border-radius:2px;background:${d.color}"></span>${d.label}</span>
        <span style="color:var(--ink-dim)" class="mono">${fmtEur(d.value)} <span style="color:var(--ink-faint);font-size:11px">${pct}%</span></span>`;
      lg.appendChild(row);
    });
  }

  // ============ HORIZONTAL BARS ============
  function drawHBars(svgId, data, getColor) {
    const svg = $('#' + svgId); clear(svg);
    const W = 400, H = svg.viewBox.baseVal.height, padL=110, padR=30, padT=6, padB=10;
    const innerH = H - padT - padB, innerW = W - padL - padR;
    const max = Math.max(...data.map(d=>d.value));
    const rowH = innerH / data.length;
    data.forEach((d,i) => {
      const y = padT + i*rowH;
      const w = (d.value/max)*innerW;
      const lab = el('text',{x:padL-8,y:y+rowH/2+3,'text-anchor':'end','font-size':11,fill:cssVar('--ink-dim'),'font-family':'Inter'}); lab.textContent=d.label; svg.appendChild(lab);
      svg.appendChild(el('rect',{x:padL,y:y+3,width:w,height:rowH-6,fill:getColor(d), rx:2}));
      const val = el('text',{x:padL+w+6,y:y+rowH/2+3,'font-size':11,'font-weight':'600',fill:cssVar('--ink'),'font-family':'JetBrains Mono'}); val.textContent=d.value; svg.appendChild(val);
    });
  }

  // ============ FLEET TABLE ============
  let selectedDevice = null;
  function renderFleet() {
    const tb = $('#fleet-tbody'); tb.innerHTML = '';
    let rows = D.devices.slice();
    if (state.gas !== '__all')    rows = rows.filter(r => r.gas === state.gas);
    if (state.client !== '__all') rows = rows.filter(r => r.client === state.client);
    if (state.risk !== '__all')   rows = rows.filter(r => r.cat === state.risk);
    if (state.q) rows = rows.filter(r => (r.id+r.gas+r.client).toLowerCase().includes(state.q));
    rows.sort((a,b) => b.risk - a.risk);

    $('#fleet-count').textContent = rows.length;

    rows.forEach(r => {
      const tr = document.createElement('tr');
      if (selectedDevice && r.id === selectedDevice.id) tr.classList.add('selected');
      const trendCls = r.trend === 'down' ? 'down' : (r.trend === 'up' ? 'up' : 'flat');
      const trendIcon = r.trend === 'down' ? '↘' : (r.trend === 'up' ? '↗' : '→');
      const pillCls = r.cat === 'high' ? 'bad' : r.cat === 'med' ? 'warn' : 'good';
      const pillTxt = r.cat === 'high' ? 'Alt' : r.cat === 'med' ? 'Mitjà' : 'Baix';
      tr.innerHTML = `
        <td><span class="device-id">${r.id}</span></td>
        <td><span class="dotpill"><span class="d" style="background:${D.gas_colors[r.gas]}"></span>${r.gas}</span></td>
        <td>${r.client}</td>
        <td class="num mono">${r.pres.toFixed(1)}</td>
        <td><span class="trend ${trendCls}">${trendIcon} ${r.trendVal}</span></td>
        <td class="num mono">${r.risk.toFixed(1)}</td>
        <td><span class="pill ${pillCls}">${pillTxt}</span></td>
      `;
      tr.addEventListener('click', () => { selectedDevice = r; renderFleet(); renderDetail(r); });
      tb.appendChild(tr);
    });

    if (!selectedDevice && rows.length) { selectedDevice = rows[0]; renderDetail(rows[0]); }
  }

  // ============ DETAIL ============
  function renderDetail(r) {
    $('#d-id').textContent = r.id;
    $('#d-gas').textContent = r.gas;
    $('#d-client').textContent = r.client;
    $('#d-last').textContent = 'fa 3 min';
    $('#d-pres').textContent = r.pres.toFixed(1);
    $('#d-temp').textContent = r.temp.toFixed(1);
    $('#d-risk').textContent = r.risk.toFixed(1);

    const pPct = Math.min(100, r.pres / 200 * 100);
    $('#d-pres-bar').style.width = pPct + '%';
    $('#d-pres-bar').style.background = pPct > 90 ? cssVar('--bad') : pPct > 60 ? cssVar('--warn') : cssVar('--info');

    const tPct = Math.min(100, (r.temp - 10) / 20 * 100);
    $('#d-temp-bar').style.width = tPct + '%';
    $('#d-temp-bar').style.background = tPct > 80 ? cssVar('--bad') : cssVar('--good');

    const rPct = Math.min(100, r.risk / 16 * 100);
    $('#d-risk-bar').style.width = rPct + '%';
    $('#d-risk-bar').style.background = r.cat === 'high' ? cssVar('--bad') : r.cat === 'med' ? cssVar('--warn') : cssVar('--good');

    drawDetailTS(r);
  }

  function drawDetailTS(r) {
    const svg = $('#detail-ts'); clear(svg);
    const W=800, H=220, padL=40, padR=42, padT=10, padB=24;
    const data = window.genSeries(r);
    const xs = i => padL + (i/(data.length-1))*(W-padL-padR);
    const ps = data.map(d=>d.p), ts = data.map(d=>d.t);
    const pMin=Math.min(...ps), pMax=Math.max(...ps);
    const tMin=Math.min(...ts), tMax=Math.max(...ts);
    const yp = v => padT + (1 - (v-pMin)/((pMax-pMin)||1))*(H-padT-padB);
    const yt = v => padT + (1 - (v-tMin)/((tMax-tMin)||1))*(H-padT-padB);

    // grid
    for (let i=0;i<=4;i++){
      const y = padT + (i/4)*(H-padT-padB);
      svg.appendChild(el('line',{x1:padL,x2:W-padR,y1:y,y2:y,stroke:cssVar('--grid-line'),'stroke-width':1}));
      const v = pMax - (i/4)*(pMax-pMin);
      const t = el('text',{x:padL-6,y:y+3,'text-anchor':'end','font-size':10,fill:cssVar('--ink-faint'),'font-family':'JetBrains Mono'}); t.textContent = v.toFixed(0); svg.appendChild(t);
    }

    // anomalies bg
    data.forEach((d,i) => { if (d.anom) {
      svg.appendChild(el('line',{x1:xs(i),x2:xs(i),y1:padT,y2:H-padB,stroke:cssVar('--bad'),'stroke-width':1,'stroke-dasharray':'2,3', opacity:.6}));
    }});

    // temperature line (info)
    const tPath = data.map((d,i)=>`${i?'L':'M'}${xs(i)},${yt(d.t)}`).join(' ');
    svg.appendChild(el('path',{d:tPath, fill:'none', stroke:cssVar('--info'),'stroke-width':1, opacity:.5}));

    // pressure line (accent)
    const pPath = data.map((d,i)=>`${i?'L':'M'}${xs(i)},${yp(d.p)}`).join(' ');
    svg.appendChild(el('path',{d:pPath, fill:'none', stroke:cssVar('--accent'),'stroke-width':1.5}));

    // anomaly points
    data.forEach((d,i) => { if (d.anom) {
      svg.appendChild(el('circle',{cx:xs(i),cy:yp(d.p),r:3.5,fill:cssVar('--bad'),stroke:cssVar('--surface'),'stroke-width':1.5}));
    }});

    // right axis labels (temp)
    for (let i=0;i<=4;i++){
      const y = padT + (i/4)*(H-padT-padB);
      const v = tMax - (i/4)*(tMax-tMin);
      const t = el('text',{x:W-padR+6,y:y+3,'text-anchor':'start','font-size':10,fill:cssVar('--info'),'font-family':'JetBrains Mono'}); t.textContent = v.toFixed(0)+'°'; svg.appendChild(t);
    }
    // x-axis day labels
    for (let d=0; d<14; d+=2) {
      const x = padL + (d*24/(data.length-1))*(W-padL-padR);
      const t = el('text',{x:x,y:H-6,'text-anchor':'middle','font-size':10,fill:cssVar('--ink-faint'),'font-family':'JetBrains Mono'});
      t.textContent = `D${d+1}`; svg.appendChild(t);
    }
  }

  // ============ ALERTS ============
  function renderAlerts() {
    const wrap = $('#alerts-list'); wrap.innerHTML = '';
    D.alerts.forEach(a => {
      const row = document.createElement('div');
      row.className = `alert-row ${a.level}`;
      row.innerHTML = `
        <div class="alert-bar"></div>
        <div>
          <div class="alert-title">${a.title} · <span class="device-id" style="font-weight:500;color:var(--ink-dim)">${a.id}</span></div>
          <div class="alert-meta">${a.meta}</div>
          <div style="margin-top:6px;display:flex;gap:6px;align-items:center">
            ${a.tech ? `<span class="pill info">→ ${a.tech}</span><span style="font-size:11px;color:var(--ink-faint)">${a.eta}</span>` : `<span class="pill muted">Pendent d'assignar</span>`}
          </div>
        </div>
        <div class="alert-time">${a.time}</div>
      `;
      row.onclick = () => {
        // jump to fleet & select this device
        selectedDevice = D.devices.find(d => d.id === a.id) || selectedDevice;
        $$('#tabs .tab').forEach(b => b.classList.toggle('active', b.dataset.tab === 'fleet'));
        $$('.panel').forEach(p => p.classList.toggle('active', p.dataset.panel === 'fleet'));
        renderFleet();
        if (selectedDevice) renderDetail(selectedDevice);
      };
      wrap.appendChild(row);
    });
  }

  function renderTechLoad() {
    const wrap = $('#tech-load'); wrap.innerHTML = '';
    D.technicians.forEach(t => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--border)';
      const color = t.load > 75 ? cssVar('--bad') : t.load > 55 ? cssVar('--warn') : cssVar('--good');
      row.innerHTML = `
        <span style="font-weight:600;font-size:13px;min-width:80px">${t.name}</span>
        <div style="flex:1;height:6px;background:var(--surface-2);border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${t.load}%;background:${color};border-radius:3px"></div>
        </div>
        <span class="mono" style="font-size:12px;font-weight:600;min-width:36px;text-align:right">${t.load}%</span>
      `;
      wrap.appendChild(row);
    });
  }

  function drawRiskDist() {
    const svg = $('#risk-dist'); clear(svg);
    const W=400, H=60;
    const data = [
      { v:98, c:cssVar('--good') },
      { v:5,  c:cssVar('--warn') },
      { v:2,  c:cssVar('--bad') }
    ];
    const total = data.reduce((s,d)=>s+d.v,0);
    let x = 0;
    data.forEach(d => {
      const w = (d.v/total)*W;
      svg.appendChild(el('rect',{x:x,y:14,width:Math.max(0,w-2),height:32,fill:d.c, rx:3}));
      if (w > 30) {
        const t = el('text',{x:x+w/2,y:35,'text-anchor':'middle','font-size':12,'font-weight':'600',fill:'#fff','font-family':'JetBrains Mono'});
        t.textContent = d.v; svg.appendChild(t);
      }
      x += w;
    });
  }

  // ============ ROI ============
  const roiInputs = ['botelles','fuga','paradas','cparada','log','cost'];
  function calcROI() {
    const v = id => +$('#r-'+id).value;
    const n = v('botelles'), cf = v('fuga'), pa = v('paradas'),
          cp = v('cparada'), log = v('log'), cu = v('cost');
    $('#rv-botelles').textContent = n;
    $('#rv-fuga').textContent     = fmtEur(cf);
    $('#rv-paradas').textContent  = pa;
    $('#rv-cparada').textContent  = fmtEur(cp);
    $('#rv-log').textContent      = fmtEur(log);
    $('#rv-cost').textContent     = fmtEur(cu);

    const aFugas   = n * 0.07 * cf;
    const aParadas = pa * cp * 0.85;
    const aLog     = n * log;
    const aAct     = n * 0.012 * 600;
    const cost     = n * cu;
    const inflow   = aFugas + aParadas + aLog + aAct;
    const net      = inflow - cost;
    const pb       = net > 0 ? (cost / inflow) * 12 : 99;
    const roi      = cost > 0 ? ((inflow - cost) / cost) * 100 : 0;

    $('#o-fugas').textContent   = fmtEur(aFugas);
    $('#o-paradas').textContent = fmtEur(aParadas);
    $('#o-log').textContent     = fmtEur(aLog);
    $('#o-act').textContent     = fmtEur(aAct);
    $('#o-cost').textContent    = '−' + fmtEur(cost);
    $('#o-net').textContent     = fmtEur(net);
    $('#o-pb').textContent      = pb < 99 ? pb.toFixed(1) + ' m' : '—';
    $('#o-roi').textContent     = (roi >= 0 ? '+' : '') + roi.toFixed(0) + '%';

    drawROIBars(net);
  }

  function drawROIBars(yearNet) {
    const svg = $('#roi-bars'); clear(svg);
    const W=400, H=160, padL=40, padR=10, padT=10, padB=28;
    const years = [yearNet, yearNet*2.1, yearNet*3.3];
    const labels= ['Any 1','Any 2','Any 3'];
    const max = Math.max(...years, 1);
    const bw = (W-padL-padR)/years.length - 24;
    years.forEach((y,i) => {
      const x = padL + i*((W-padL-padR)/years.length) + 12;
      const h = (Math.max(0,y)/max)*(H-padT-padB);
      const yy = H-padB - h;
      svg.appendChild(el('rect',{x:x,y:yy,width:bw,height:h,fill:cssVar('--accent'), rx:3}));
      const lab = el('text',{x:x+bw/2,y:H-10,'text-anchor':'middle','font-size':11,fill:cssVar('--ink-dim'),'font-family':'Inter'}); lab.textContent=labels[i]; svg.appendChild(lab);
      const val = el('text',{x:x+bw/2,y:yy-6,'text-anchor':'middle','font-size':11,'font-weight':'600',fill:cssVar('--ink'),'font-family':'JetBrains Mono'}); val.textContent=fmtEur(Math.round(y/1000)*1000); svg.appendChild(val);
    });
    // baseline
    svg.appendChild(el('line',{x1:padL,x2:W-padR,y1:H-padB,y2:H-padB,stroke:cssVar('--border'),'stroke-width':1}));
  }

  roiInputs.forEach(id => $('#r-'+id).addEventListener('input', calcROI));

  // ============ INIT ============
  function initOverview() {
    drawSpark('spark-1', [98,99,99,99.4,99.2,99.4,99.4,99.4]);
    drawSpark('spark-2', [12000,14500,16800,18200,19500,21000,22300,23296], cssVar('--good'));
    drawFleetTS();
    drawDonut();
    const gasData = Object.entries(D.inventory_by_gas).sort((a,b)=>b[1]-a[1]).map(([k,v])=>({label:k,value:v}));
    drawHBars('bars-gas', gasData, d => D.gas_colors[d.label]);
    const cliData = Object.entries(D.inventory_by_client).sort((a,b)=>b[1]-a[1]).map(([k,v])=>({label:k,value:v}));
    drawHBars('bars-client', cliData, () => cssVar('--accent'));
  }

  initOverview();
  renderFleet();
  renderAlerts();
  renderTechLoad();
  drawRiskDist();
  calcROI();

  // redraw on theme change (so colors pick up)
  const observer = new MutationObserver(() => {
    initOverview();
    if (selectedDevice) renderDetail(selectedDevice);
    drawRiskDist();
    calcROI();
  });
  observer.observe(document.body, { attributes:true, attributeFilter:['class'] });

})();
