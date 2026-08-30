// ── Shared canvas renderer ────────────────────────────────────────────────────
// Called by both index.html (viewer) and editor.html
// Expects: canvas, NODES, CATS, ARMS, TIER_R, NODE_R, getPos, labelLines
//
// Category colors (CATS) carry meaning per branch and stay fixed across themes.
// Everything else — rings, spines, locked-node fills, off-labels — is theme-aware.

const CANVAS_THEME = {
  dark: {
    tierRing: '#ffffff05',
    armOn: '#ffffff0c',
    armOff: '#ffffff04',
    armLabelOff: '#2a2d3e',
    edgeOff: '#1d2035',
    nodeFillUnlockable: '#101320',
    nodeFillLocked: '#0b0d13',
    nodeBorderLocked: '#1e2130',
    labelOff: '#252838',
  },
  light: {
    tierRing: '#00000008',
    armOn: '#00000014',
    armOff: '#00000007',
    armLabelOff: '#c9cdb6',
    edgeOff: '#eceee2',
    nodeFillUnlockable: '#f3f5e8',
    nodeFillLocked: '#ffffff',
    nodeBorderLocked: '#e6e9d8',
    labelOff: '#c3c7b0',
  },
};

function drawTree(canvas, ctx, W, H, unlocked, selected, hovered, editorMode, theme) {
  const T = CANVAS_THEME[theme] || CANVAS_THEME.dark;
  const CX = W / 2, CY = H / 2;
  ctx.clearRect(0, 0, W, H);

  // ── Tier rings ──
  for (let t = 1; t <= 6; t++) {
    ctx.beginPath();
    ctx.arc(CX, CY, TIER_R[t], 0, Math.PI * 2);
    ctx.strokeStyle = T.tierRing;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // ── Arm spines ──
  Object.entries(ARMS).forEach(([arm, angle]) => {
    const armNodes = NODES.filter(n => n.arm === arm);
    if (!armNodes.length) return;
    const maxT = Math.max(...armNodes.map(n => n.tier));
    const anyOn = armNodes.some(n => unlocked.has(n.id));
    const endR = TIER_R[maxT] + 30;
    ctx.beginPath();
    ctx.moveTo(CX + Math.cos(angle) * 30, CY + Math.sin(angle) * 30);
    ctx.lineTo(CX + Math.cos(angle) * endR, CY + Math.sin(angle) * endR);
    ctx.strokeStyle = anyOn ? T.armOn : T.armOff;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 8]);
    ctx.stroke();
    ctx.setLineDash([]);
  });

  // ── Arm labels (outermost ring) ──
  Object.entries(ARMS).forEach(([arm, angle]) => {
    const armNodes = NODES.filter(n => n.arm === arm && n.tier === 1);
    if (!armNodes.length) return;
    const root = armNodes[0];
    const cat  = CATS[root.cat];
    const endR = TIER_R[6] + 18;
    const lx = CX + Math.cos(angle) * endR;
    const ly = CY + Math.sin(angle) * endR;
    ctx.font = '500 9px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = unlocked.has(root.id) ? cat.color + 'aa' : T.armLabelOff;
    ctx.fillText(cat.label.toUpperCase(), lx, ly);
  });

  // ── Edges ──
  NODES.forEach(node => {
    const p2  = getPos(node, CX, CY);
    const cat = CATS[node.cat];
    const selNode = selected === node.id;
    const hovNode = hovered  === node.id;

    node.requires.forEach(reqId => {
      const req = NODES.find(n => n.id === reqId);
      if (!req) return;
      const p1 = getPos(req, CX, CY);
      const bothOn  = unlocked.has(node.id) && unlocked.has(reqId);
      const highlight = selNode || selected === reqId || hovNode || hovered === reqId;
      const canUn = !unlocked.has(node.id) && node.requires.every(r => unlocked.has(r));

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);

      if (bothOn) {
        ctx.strokeStyle = highlight ? cat.color + 'ee' : cat.color + '50';
        ctx.lineWidth   = highlight ? 2.5 : 1.5;
        ctx.setLineDash([]);
      } else if (editorMode && canUn && unlocked.has(reqId)) {
        ctx.strokeStyle = cat.color + '44';
        ctx.lineWidth   = 1;
        ctx.setLineDash([3, 5]);
      } else {
        ctx.strokeStyle = T.edgeOff;
        ctx.lineWidth   = 1;
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    });
  });

  // ── Nodes ──
  NODES.forEach(node => {
    const p   = getPos(node, CX, CY);
    const cat = CATS[node.cat];
    const r   = NODE_R[node.tier] ?? 12;
    const on  = unlocked.has(node.id);
    const canUn = editorMode && !on && node.requires.every(rid => unlocked.has(rid));
    const sel = selected === node.id;
    const hov = hovered  === node.id;

    // Pulse glow for unlocked
    if (on) {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r + 10);
      grad.addColorStop(0, cat.color + '18');
      grad.addColorStop(1, cat.color + '00');
      ctx.beginPath();
      ctx.arc(p.x, p.y, r + 10, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Selection ring
    if (sel || (hov && on)) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r + 5, 0, Math.PI * 2);
      ctx.strokeStyle = cat.color + (sel ? '66' : '33');
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Unlockable hint ring (editor only)
    if (canUn && !on) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r + 3, 0, Math.PI * 2);
      ctx.strokeStyle = cat.color + '44';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Node fill
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    if (on) {
      ctx.fillStyle = cat.color + '20';
    } else if (canUn) {
      ctx.fillStyle = T.nodeFillUnlockable;
    } else {
      ctx.fillStyle = T.nodeFillLocked;
    }
    ctx.fill();

    // Node border
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = on   ? cat.color + (sel ? 'ff' : 'cc')
                    : canUn ? cat.color + '55'
                    : T.nodeBorderLocked;
    ctx.lineWidth = on ? (sel ? 2.5 : 1.8) : 1;
    ctx.stroke();

    // Core decoration
    if (node.tier === 0) {
      for (let i = 0; i < 8; i++) {
        const a  = (i / 8) * Math.PI * 2;
        const x1 = p.x + Math.cos(a) * (r - 7);
        const y1 = p.y + Math.sin(a) * (r - 7);
        const x2 = p.x + Math.cos(a) * (r - 2);
        const y2 = p.y + Math.sin(a) * (r - 2);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        ctx.strokeStyle = cat.color + (on ? 'cc' : '44');
        ctx.lineWidth = 1.5; ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = cat.color + (on ? 'aa' : '33'); ctx.fill();
    }

    // Contemplation diamond
    if (node.cat === 'contemplation' && node.tier > 0) {
      const dr = r * 0.42;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - dr); ctx.lineTo(p.x + dr, p.y);
      ctx.lineTo(p.x, p.y + dr); ctx.lineTo(p.x - dr, p.y);
      ctx.closePath();
      ctx.strokeStyle = cat.color + (on ? '77' : '25');
      ctx.lineWidth = 1; ctx.stroke();
    }

    // Fusion ring
    if (node.cat === 'fusion' && node.tier > 0) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 0.42, 0, Math.PI * 2);
      ctx.strokeStyle = cat.color + (on ? '77' : '25');
      ctx.lineWidth = 1; ctx.stroke();
    }

    // Label — drawn below node, wrapped to fit
    if (node.tier > 0) {
      const fs = node.tier <= 1 ? 10 : 9;
      ctx.font = `${on ? 500 : 400} ${fs}px "Segoe UI", system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = on   ? cat.color
                    : canUn ? cat.color + '66'
                    : T.labelOff;
      const maxW = r * 3.4;
      const lines = labelLines(node.label, ctx, maxW);
      const lh    = fs + 2;
      const yBase = p.y + r + fs + 3;
      lines.forEach((ln, i) => ctx.fillText(ln, p.x, yBase + i * lh));
    }
  });
}
