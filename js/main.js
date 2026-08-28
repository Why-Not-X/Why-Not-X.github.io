// ── Skill tree wiring ─────────────────────────────────────────────────────
let unlocked = new Set(['core']);
let hovered  = null;
let STATE    = {};

const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d');
let W, H;

function resize() {
  const wrap = document.getElementById('canvas-wrap');
  W = wrap.clientWidth; H = wrap.clientHeight;
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = W * dpr; canvas.height = H * dpr;
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(dpr, dpr);
  redraw();
}
window.addEventListener('resize', resize);

function redraw() { drawTree(canvas, ctx, W, H, unlocked, openNodeId, hovered, false); }

function nodeAt(mx, my) {
  const CX = W / 2, CY = H / 2;
  for (let i = NODES.length - 1; i >= 0; i--) {
    const n = NODES[i];
    if (!unlocked.has(n.id)) continue;
    const p = getPos(n, CX, CY);
    const r = (NODE_R[n.tier] ?? 12) + 8;
    if ((mx - p.x) ** 2 + (my - p.y) ** 2 <= r * r) return n;
  }
  return null;
}

function mp(e) { const r = canvas.getBoundingClientRect(); return { mx: e.clientX - r.left, my: e.clientY - r.top }; }

canvas.addEventListener('mousemove', e => {
  const { mx, my } = mp(e);
  const n = nodeAt(mx, my);
  const nid = n ? n.id : null;
  if (nid !== hovered) {
    hovered = nid; canvas.style.cursor = n ? 'pointer' : 'default';
    redraw();
  }
});
canvas.addEventListener('mouseleave', () => { hovered = null; redraw(); });
canvas.addEventListener('click', e => {
  const { mx, my } = mp(e);
  const n = nodeAt(mx, my);
  if (n) openModal(n);
});

function updateStats() {
  const u = unlocked.size, t = NODES.length;
  document.getElementById('pts-u').textContent = u;
  document.getElementById('pts-t').textContent = t;
  document.getElementById('p-bar').style.width = (u / t * 100).toFixed(1) + '%';
  const groups = [
    ['Perception', 'perception'], ['Contemplation', 'contemplation'],
    ['Systems', 'systems'], ['Creation', 'creation'], ['Expression', 'expression'],
    ['Drive', 'drive'], ['Craft', 'hard_craft'], ['Technology', 'hard_tech'], ['Fusion', 'fusion'],
  ];
  document.getElementById('cat-stats').innerHTML = groups.map(([lbl, cat]) => {
    const ids = NODES.filter(n => n.cat === cat).map(n => n.id);
    const c = ids.filter(id => unlocked.has(id)).length, tot = ids.length;
    const col = CATS[cat].color;
    return `<div class="cat-row">
      <div class="cat-dot" style="background:${col}"></div>
      <div class="cat-name">${lbl}</div>
      <div class="cat-bw"><div class="cat-bf" style="width:${tot ? Math.round(c / tot * 100) : 0}%;background:${col}"></div></div>
      <div class="cat-ct" style="color:${c ? col : '#2a2d3e'}">${c}/${tot}</div>
    </div>`;
  }).join('');
}

// ── Evidence pop-out modal ────────────────────────────────────────────────
let openNodeId = null;
const backdrop = document.getElementById('modal-backdrop');
const modal    = document.getElementById('modal');

function openModal(node) {
  openNodeId = node.id;
  redraw();
  const cat = CATS[node.cat];
  const reqs = node.requires.map(id => NODES.find(n => n.id === id)?.label).filter(Boolean);
  const ev = EVIDENCE[node.id];

  let gaugeHtml = '';
  let evidenceHtml = '';
  if (ev) {
    const dots = [1, 2, 3, 4, 5].map(i =>
      `<div class="m-dot ${i <= ev.level ? 'on' : ''}" style="--dot-color:${cat.color}"></div>`
    ).join('');
    gaugeHtml = `
      <div class="m-gauge-wrap">
        <div class="m-gauge-row">
          <div class="m-gauge-lbl">Equipped level</div>
          <div class="m-gauge-val" style="color:${cat.color}">${LEVEL_LABEL[ev.level]}</div>
        </div>
        <div class="m-gauge-dots">${dots}</div>
        <div class="m-gauge-summary">${ev.summary}</div>
      </div>`;
    evidenceHtml = `
      <div class="m-evidence">
        <div class="sec-lbl">Where this shows up</div>
        ${ev.items.map(it => {
          const src = EXPERIENCES[it.exp];
          return `<div class="m-evidence-item">
            <div class="m-ev-src"><b>${src.org}</b>${src.role ? ' — ' + src.role : ''}${src.dates ? ' · ' + src.dates : ''}</div>
            <div class="m-ev-detail">${it.detail}</div>
          </div>`;
        }).join('')}
      </div>`;
  } else {
    evidenceHtml = `<div class="m-no-evidence">Not yet backed by a resume line — this one's aspirational for now.</div>`;
  }

  modal.innerHTML = `
    <button class="m-close" aria-label="Close">&times;</button>
    <span class="m-badge" style="background:${cat.color}1a;color:${cat.color}">${cat.label}</span>
    <div class="m-name">${node.label}</div>
    <div class="m-desc">${node.desc}</div>
    ${gaugeHtml}
    ${evidenceHtml}
    ${reqs.length ? `<div class="m-req">Builds on: ${reqs.join(', ')}</div>` : ''}
    <div class="m-shadow">
      <div class="m-shadow-lbl">Shadow trait</div>
      <div class="m-shadow-txt">${node.shadow}</div>
    </div>`;

  modal.querySelector('.m-close').addEventListener('click', closeModal);
  backdrop.classList.add('open');
}

function closeModal() {
  backdrop.classList.remove('open');
  openNodeId = null;
  redraw();
}
backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

async function loadState() {
  try {
    const r = await fetch('state.json?t=' + Date.now());
    STATE = await r.json();
    unlocked = new Set(STATE.unlocked || ['core']);
    document.getElementById('p-name').textContent  = STATE.name  || 'Skill Tree';
    document.getElementById('p-title').textContent = STATE.title || '';
    document.getElementById('foot').textContent    = 'Updated ' + (STATE.updated || '');
  } catch (e) {
    unlocked = new Set(['core']);
  }
  updateStats(); resize();
}

loadState();

// ── Experience timeline ───────────────────────────────────────────────────
const TIMELINE = [
  { dates: 'Aug 2024 – Present', org: 'CU Boulder — Leeds School of Business', role: 'B.S. Business Administration, Business Analytics emphasis',
    bullets: [
      'Business + Computer Science integration program',
      'Cumulative GPA 3.7 · Leeds Honors Program · Dean\'s List, Fall 2024 & Spring 2025',
      'Coursework: Statistical Analysis in Business, Computer Science 2, Accounting I, AP Quantitative Reasoning',
    ]},
  { dates: 'Dec 2025 – Present', org: 'LAIS — Leeds Association for Information Science', role: 'VP of Outreach',
    bullets: ['Coordinates with event speakers', 'Maintains relationships with club sponsors'] },
  { dates: 'Jul 2025 – Present', org: 'Avis', role: 'Vehicle Service Agent',
    bullets: ['Managed efficiency and operational optimization in a high-pace environment', 'Refined service processes for consistency under repetition'] },
  { dates: 'May 2025 – Present', org: 'Zen Property Management', role: 'Assistant Property Manager',
    bullets: ['Investigates tenant requests and coordinates contractor calls', 'Conducts site visits and property walkthroughs', 'Analyzes client finances'] },
  { dates: 'Jul 2023 – Jul 2024', org: 'Target', role: 'General Merchandise / Fulfillment / Closing / Food & Beverage Expert',
    bullets: ['Managed customer orders across departments', 'Executed closing routines consistently', 'Kept inventory organized and up to date'] },
  { dates: 'Sep 2021 – May 2024', org: 'George Washington HS Robotics', role: 'Build · Business · Administrative Teams, Retention Lead',
    bullets: ['Build Team: machined individual mechanisms (milling, lathing, CNC)', 'Business Team: contributed to marketing and fundraising', 'Administrative Team: coordinated STEM outreach events', '1st place Regionals, qualified for Worlds (2024) · Impact Award (2024)'] },
];

document.getElementById('timeline').innerHTML = TIMELINE.map(t => `
  <div class="tl-item">
    <div class="tl-dates">${t.dates}</div>
    <div>
      <div class="tl-org">${t.org}</div>
      <div class="tl-role">${t.role}</div>
      <ul class="tl-bullets">${t.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
    </div>
  </div>
`).join('');
