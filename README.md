# xandercall.me — About Me

An interactive "about me" page built around a skill tree. Every unlocked node is a
real trait; clicking one pops out a card showing the resume evidence behind it —
which job, team, or class it actually comes from — instead of just a self-rated claim.

## Structure
```
index.html        ← Public site (hero, skill tree, experience timeline, contact)
editor.html        ← Private tool: toggle which nodes are unlocked, export state.json
state.json          ← Which nodes are unlocked + your name/title
css/style.css        ← All page styling
js/tree.js            ← Node definitions (id, label, category, tier, description, shadow trait)
js/render.js            ← Canvas drawing engine for the tree
js/evidence.js            ← Resume-grounded evidence per node (the pop-out chart content)
js/main.js                  ← Page wiring: tree interaction, evidence modal, experience timeline
assets/resume.pdf              ← Downloadable résumé
CNAME                            ← xandercall.me
```

## Editing your skills
1. Open `editor.html` locally (`open editor.html`) — toggle nodes on/off, click **Download state.json**, replace the file at the repo root, push.
2. To back a newly-unlocked node with real evidence, add an entry to the `EVIDENCE` object in `js/evidence.js`:
   ```js
   node_id: { level: 1-5, summary: '...', items: [{ exp: 'expKey', detail: '...' }] }
   ```
   `expKey` must match a key in the `EXPERIENCES` object at the top of the same file (add a new one there if the source isn't listed yet).
3. A node without an `EVIDENCE` entry still opens on click — it just shows "not yet backed by a resume line" instead of the evidence list. That's intentional: it keeps the site honest rather than padding out unfinished traits.

## Customizing skills
Edit `js/tree.js` — each node follows this pattern:
```js
S('id', 'Label', 'category', tier, 'arm', offset, 'description', 'shadow trait', ['required_id'])
```
Categories: core, perception, contemplation, systems, creation, expression, drive, hard_craft, hard_tech, fusion

## Deploying
This is a GitHub Pages user site (`Why-Not-X.github.io`) with a custom domain (`CNAME` → xandercall.me).
Push to `main` and GitHub Pages redeploys automatically.
