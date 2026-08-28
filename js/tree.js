// ── Categories ──────────────────────────────────────────────────────────────
const CATS = {
  core:          { color: '#c8a84b', label: 'Core' },
  perception:    { color: '#9b8de0', label: 'Perception' },
  contemplation: { color: '#7baee8', label: 'Contemplation' },
  systems:       { color: '#3daa7f', label: 'Systems' },
  creation:      { color: '#d4763a', label: 'Creation' },
  expression:    { color: '#c45080', label: 'Expression' },
  drive:         { color: '#c49a1a', label: 'Drive' },
  hard_craft:    { color: '#6ab04c', label: 'Craft' },
  hard_tech:     { color: '#4a9fd4', label: 'Technology' },
  fusion:        { color: '#b87fd4', label: 'Fusion' },
};

// ── Arm angles (radians, 0 = east, clockwise) ────────────────────────────────
// 8 arms evenly spaced + carefully separated so labels never collide
const ARMS = {
  perception:    -Math.PI * 0.88,   // upper-left
  contemplation: -Math.PI * 0.57,   // upper
  systems:       -Math.PI * 0.22,   // upper-right
  creation:       Math.PI * 0.12,   // right
  expression:     Math.PI * 0.44,   // lower-right
  drive:          Math.PI * 0.76,   // lower
  hard_craft:     Math.PI * 1.06,   // lower-left
  hard_tech:     -Math.PI * 1.22,   // left
};

// Radial distance per tier
const TIER_R = [0, 88, 160, 232, 304, 378, 445];

// Node radius per tier
const NODE_R = { 0: 26, 1: 17, 2: 14, 3: 13, 4: 12, 5: 14, 6: 15 };

// Angular spread between siblings on same tier/arm (radians)
const SPREAD = 0.185;

function S(id, label, cat, tier, arm, offset, desc, shadow, requires) {
  return { id, label, cat, tier, arm, offset, desc, shadow, requires };
}

// ── Node definitions ─────────────────────────────────────────────────────────
const NODES = [
  S('core','Self','core',0,null,0,
    'The origin point. Identity, values, and self-awareness — everything else radiates from here.',
    'Undefined self — swept along by others\' expectations, never choosing your own direction.',
    []),

  // PERCEPTION
  S('perception','Perception','perception',1,'perception',0,
    'How you take in the world. Raw signal processing — noticing what others miss before you can name why.',
    'Overwhelm or tunnel vision. Too much signal with no filter, or filters so strong nothing gets through.',
    ['core']),
  S('pattern','Pattern recognition','perception',2,'perception',-1,
    'Seeing structure in noise before others do. Transfers across domains — code, people, markets, art.',
    'Apophenia — finding patterns that aren\'t there. Confident conclusions drawn from coincidence.',
    ['perception']),
  S('deep_focus','Deep focus','perception',2,'perception',0,
    'Sustained attention depth. Going further into a problem than distraction allows.',
    'Hyperfocus trap — disappears into the wrong problem for days while urgent things burn.',
    ['perception']),
  S('social_read','Social reading','perception',2,'perception',1,
    'Reading people — emotional undercurrents, what isn\'t said, group dynamics, trust signals.',
    'Projection — reads others through your own lens. Confident assessments, frequently wrong.',
    ['perception']),
  S('aesthetic','Aesthetic sense','perception',3,'perception',-1,
    'Noticing what\'s beautiful, broken, or off before you can articulate why. The gut before the brain.',
    'Taste without execution — high standards become a reason not to ship anything.',
    ['pattern','deep_focus']),
  S('empathy','Empathy','perception',3,'perception',1,
    'Accurate modeling of another person\'s experience. Not just feeling with them — understanding them.',
    'Empathy fatigue — absorbs others\' states until you lose your own center.',
    ['social_read']),
  S('intuition','Intuition','perception',4,'perception',0,
    'Fast, accurate pattern-matching below conscious thought. Experience compressed into instinct.',
    'Gut as identity — treats intuition as sacred, stops questioning it. Stops learning.',
    ['aesthetic','empathy']),

  // CONTEMPLATION
  S('contemplation','Contemplation','contemplation',1,'contemplation',0,
    'The capacity to think deeply and sit with difficult questions. The root of all original thought.',
    'Navel-gazing — introspection without output. Spends years inside ideas that never meet reality.',
    ['core']),
  S('stillness','Stillness','contemplation',2,'contemplation',-1,
    'Sitting with silence, discomfort, and unresolved tension without escaping to distraction. Most real thinking happens here.',
    'Rumination — stillness without direction becomes a loop, not a descent. The same thought circling endlessly.',
    ['contemplation']),
  S('inquiry','Deep inquiry','contemplation',2,'contemplation',0,
    'The skill of asking better questions. Not "what is the answer" but "what is the right question."',
    'Overthinking the question — the question keeps changing so an answer never arrives.',
    ['contemplation']),
  S('ambiguity','Sitting with ambiguity','contemplation',2,'contemplation',1,
    'Tolerating not-knowing without collapsing into premature certainty. Holding contradictory things as possibly true simultaneously.',
    'Permanent suspension — uses ambiguity as an excuse to never commit to a position.',
    ['contemplation']),
  S('first_principles','First principles','contemplation',3,'contemplation',-1,
    'Stripping a problem to bedrock. Refusing inherited assumptions. Building up from what is actually, provably true.',
    'Reinvents the wheel — dismantles everything, including things that were working fine.',
    ['stillness','inquiry']),
  S('steelmanning','Steelmanning','contemplation',3,'contemplation',1,
    'Constructing the strongest possible version of an opposing view before engaging with it.',
    'Steelman as avoidance — builds the other side\'s case so well you never take your own position.',
    ['inquiry','ambiguity']),
  S('dialectical','Dialectical thinking','contemplation',4,'contemplation',-1,
    'Holding thesis and antithesis in tension until a synthesis emerges that contains and transcends both.',
    'Synthesis addiction — seeks the elegant reconciliation even when one side is simply wrong.',
    ['first_principles','steelmanning']),
  S('epistemic','Epistemic humility','contemplation',4,'contemplation',1,
    'Knowing the shape and limits of what you know. Calibrated confidence — certain where you can be, honest where you can\'t.',
    'Epistemic cowardice — uses humility to avoid positions entirely. "Who can say?" as a personality.',
    ['steelmanning','ambiguity']),
  S('original_thought','Original thought','contemplation',5,'contemplation',0,
    'Producing an idea that didn\'t exist before — not synthesis or recombination, but genuine novelty. Requires everything below it.',
    'Novelty for its own sake — original but disconnected from reality or usefulness.',
    ['dialectical','epistemic']),

  // SYSTEMS
  S('systems','Systems thinking','systems',1,'systems',0,
    'Modeling complexity. Seeing cause chains, feedback loops, emergent behaviour, and second-order effects.',
    'Analysis paralysis — models everything, commits to nothing. Perfect maps, no movement.',
    ['core']),
  S('rootcause','Root cause analysis','systems',2,'systems',-1,
    'Finding what\'s actually broken, not the symptom. First-principles debugging in any domain.',
    'Premature depth — spends hours finding the root cause of a 10-minute problem.',
    ['systems']),
  S('abstraction','Abstraction','systems',2,'systems',0,
    'Zooming in and out fluidly. Generalising a specific solution; applying a principle specifically.',
    'Ivory tower — abstracts so far up that the real problem disappears.',
    ['systems']),
  S('prediction','Consequence mapping','systems',2,'systems',1,
    'Tracing second and third-order effects. Seeing where a decision lands 3 moves out.',
    'Paralysis by futures — so consumed by scenarios that present action freezes.',
    ['systems']),
  S('mental_models','Mental models','systems',3,'systems',-1,
    'A library of lenses — inversion, Occam\'s razor, Pareto, feedback loops — applied fluidly.',
    'Model-as-hammer — every problem is forced to fit the preferred model.',
    ['rootcause','abstraction']),
  S('debugging_sys','Debugging mindset','systems',3,'systems',1,
    'Methodical elimination. Isolating variables, falsifying hypotheses, trusting process over intuition.',
    'Overfitting to symptoms — keeps fixing the same surface issue without going deeper.',
    ['rootcause','prediction']),
  S('architecture_think','Architecture','systems',4,'systems',0,
    'Designing how parts fit. Systems that hold under scale, edge cases, and people over time.',
    'Astronaut architecture — solves for problems that won\'t exist for 5 years.',
    ['mental_models','debugging_sys']),

  // CREATION
  S('creation','Creation','creation',1,'creation',0,
    'How you generate new things. The raw engine of output — quantity always precedes quality.',
    'Chronic starter. High ideation, low finishing. Graveyard of 100 unstarted projects.',
    ['core']),
  S('ideation','Ideation','creation',2,'creation',-1,
    'Volume and range of novel ideas. The raw upstream of all creative work.',
    'Idea hoarding — generates endlessly but never selects or executes.',
    ['creation']),
  S('taste','Taste','creation',2,'creation',0,
    'Knowing good from bad before you can explain why. Calibrated aesthetic and quality sense.',
    'Perfectionism paralysis — taste outpaces execution. Nothing ships because nothing is good enough.',
    ['creation']),
  S('iteration','Iteration speed','creation',2,'creation',1,
    'The rate at which you learn from making. Fast loops compress years of learning into months.',
    'Sloppy cycling — iterates so fast that lessons don\'t stick between loops.',
    ['creation']),
  S('synthesis_c','Synthesis','creation',3,'creation',-1,
    'Combining unlike things into something new. The highest form of ideation — connections no one sees.',
    'Forced novelty — synthesises for weirdness, not value. Combinations without purpose.',
    ['ideation','taste']),
  S('prototyping','Rapid prototyping','creation',3,'creation',1,
    'Making ideas tangible fast. The minimum thing that tests the real question.',
    'Prototype addiction — keeps building new prototypes instead of finishing any of them.',
    ['ideation','iteration']),
  S('ship','Ship discipline','creation',4,'creation',0,
    'Closing loops. The gap between 90% and done — consistency applied to the last hard mile.',
    'Compulsive shipping — ships before ready. Speed over standard. Reputation suffers.',
    ['synthesis_c','prototyping']),

  // EXPRESSION
  S('expression','Expression','expression',1,'expression',0,
    'How you transmit understanding across the gap between minds.',
    'Performance without substance — polish masks emptiness. Detected eventually; trust collapses.',
    ['core']),
  S('writing','Writing clarity','expression',2,'expression',-1,
    'Making complex things legible on the page. The discipline of one thought per sentence.',
    'Over-editing — clarity loop becomes a delay loop. Drafts never leave the folder.',
    ['expression']),
  S('presence','Presence','expression',2,'expression',0,
    'Quality of attention you bring to an interaction. People feel genuinely seen and heard.',
    'Performance of presence — appearing engaged while elsewhere. People feel it immediately.',
    ['expression']),
  S('persuasion','Persuasion','expression',2,'expression',1,
    'Moving people toward a position through logic, emotion, and timing — not manipulation.',
    'Coercion reflex — pushes when pulled would work. Wins arguments, loses relationships.',
    ['expression']),
  S('teaching','Teaching','expression',3,'expression',-1,
    'Making your understanding someone else\'s understanding. Requires fully owning what you know.',
    'Expert blindspot — explains from your own model, not the learner\'s starting point.',
    ['writing','presence']),
  S('storytelling','Storytelling','expression',3,'expression',1,
    'Sequencing ideas so people feel something. The trojan horse of persuasion and memory.',
    'Narrative over truth — story compels but distorts. Audiences moved but misinformed.',
    ['persuasion','writing']),
  S('public_speaking','Public speaking','expression',4,'expression',0,
    'Commanding a room — live, recorded, or virtual. Translating deep knowledge into shared experience.',
    'Stage persona — performance detaches from the real person. Charismatic but hollow.',
    ['teaching','storytelling']),

  // DRIVE
  S('drive','Drive','drive',1,'drive',0,
    'How you sustain and direct energy. The fuel that makes every other skill reachable.',
    'Burnout or misdirected hustle — motion without meaning. Fast in the wrong direction.',
    ['core']),
  S('resilience','Resilience','drive',2,'drive',-1,
    'Bounce-back rate after failure. Time from knocked-down to back-up, and what you extract.',
    'Chronic recovery mode — resilient but never advances. Manages setbacks, never prevents them.',
    ['drive']),
  S('vision','Vision','drive',2,'drive',0,
    'Knowing what you\'re building toward. The internal north star that makes daily choices coherent.',
    'Destination fixation — so locked on the endpoint that pivoting feels like failure.',
    ['drive']),
  S('consistency','Consistency','drive',2,'drive',1,
    'Showing up at capacity regardless of mood, circumstance, or external reward signal.',
    'Rigid routine — consistency without adaptation. Disciplined in the wrong direction.',
    ['drive']),
  S('risk_tolerance','Risk tolerance','drive',3,'drive',-1,
    'Calibrated willingness to act under uncertainty. Neither reckless nor paralysed.',
    'Risk theater — takes visible risks to signal boldness, not because they\'re wise.',
    ['resilience','vision']),
  S('prioritization','Prioritization','drive',3,'drive',1,
    'Ruthless triage. Knowing what deserves energy and what deserves none.',
    'Priority theater — reorganises to-do lists instead of doing the hard thing.',
    ['vision','consistency']),
  S('momentum','Momentum','drive',4,'drive',0,
    'Compounding energy — each win funds the next. The flywheel of a productive life.',
    'Burnout cycle — overdraws the flywheel repeatedly. Each recovery takes longer.',
    ['risk_tolerance','prioritization']),

  // CRAFT
  S('hard_craft','Creative craft','hard_craft',1,'hard_craft',0,
    'Making things that are both functional and beautiful.',
    'Craft without purpose — beautiful things that solve no real problem for no real person.',
    ['core']),
  S('design_thinking','Design thinking','hard_craft',2,'hard_craft',-1,
    'Human-centered problem solving. Asking what the user actually needs before building anything.',
    'Design by committee — so focused on research that bold choices never get made.',
    ['hard_craft']),
  S('visual_design','Visual design','hard_craft',2,'hard_craft',1,
    'Typography, layout, color, hierarchy — communicating meaning through visual form.',
    'Style over substance — aesthetic choices made for novelty, not for the user.',
    ['hard_craft']),
  S('ux','UX thinking','hard_craft',3,'hard_craft',-1,
    'Mapping user journeys, reducing friction, designing for clarity and confidence.',
    'Feature accumulation — adds options to satisfy stakeholders, adds confusion for users.',
    ['design_thinking','visual_design']),
  S('technical_writing','Technical writing','hard_craft',3,'hard_craft',1,
    'Documentation, specs, READMEs — making systems understandable to others over time.',
    'Docs theater — exhaustive documentation for things about to change.',
    ['design_thinking']),
  S('product_sense','Product sense','hard_craft',4,'hard_craft',0,
    'Knowing what to build, for whom, and why — the synthesis of user, business, and craft.',
    'Roadmap theater — builds features to appear productive, not because they matter.',
    ['ux','technical_writing']),

  // TECHNOLOGY
  S('hard_tech','Technology','hard_tech',1,'hard_tech',0,
    'The technical domain. Building with code, data, and systems.',
    'Tool obsession — always learning the next tool instead of building with the current one.',
    ['core']),
  S('code','Programming','hard_tech',2,'hard_tech',-1,
    'Writing software that works — clean, maintainable, and reliable under edge cases and time.',
    'Over-engineering — elegant solutions to problems that don\'t exist yet.',
    ['hard_tech']),
  S('data','Data literacy','hard_tech',2,'hard_tech',1,
    'Reading, questioning, and communicating with data. Knowing what a number actually means.',
    'Stats theater — wields metrics to confirm pre-existing belief, not interrogate it.',
    ['hard_tech']),
  S('systems_design','Systems design','hard_tech',3,'hard_tech',-1,
    'Architecting software at scale — databases, APIs, queues, services, failure modes.',
    'Resume-driven design — picks technologies to list on a CV, not because they fit.',
    ['code','data']),
  S('debugging_hard','Debugging','hard_tech',3,'hard_tech',1,
    'Systematic fault isolation in real codebases. Methodical, patient, evidence-driven.',
    'Random trial — changes things hoping something works. Learns nothing from success.',
    ['code']),
  S('devops','Build and deploy','hard_tech',4,'hard_tech',0,
    'CI/CD, environments, containers, monitoring — closing the loop from code to production.',
    'Tooling maze — spends more time on infrastructure than on what it\'s meant to serve.',
    ['systems_design','debugging_hard']),

  // FUSION
  S('philosopher','Philosopher','fusion',6,'contemplation',0,
    'Contemplation + Expression: Turning deep thought into ideas that change how others see the world.',
    'Hermit thinking — profound internal world with no transmission layer. Insights die with you.',
    ['original_thought','public_speaking']),
  S('diagnostician','Diagnostician','fusion',6,'systems',0,
    'Perception + Systems: Seeing what\'s actually wrong — in code, orgs, people, or markets.',
    'Chronic critic — diagnoses everything, fixes nothing. Great at finding problems, allergic to owning them.',
    ['intuition','architecture_think']),
  S('builder','Builder','fusion',6,'creation',0,
    'Creation + Technology: Translating ideas directly into working things. The full stack of making.',
    'Lone wolf builder — builds everything alone, never leverages others.',
    ['ship','devops','product_sense']),
  S('narrator','Narrator','fusion',6,'expression',0,
    'Creation + Expression: Synthesising ideas into stories that move people to act and remember.',
    'Spin — narrative detaches from truth. Charismatic but eventually exposed.',
    ['storytelling','synthesis_c']),
  S('prolific','Prolific','fusion',6,'drive',0,
    'Creation + Drive: High output, high quality, sustained over years.',
    'Quantity trap — high volume, low signal. Output becomes noise.',
    ['momentum','ship']),
  S('explainer','Explainer','fusion',6,'systems',-0.7,
    'Systems + Expression + Original thought: Making complex things simple without losing accuracy.',
    'False clarity — simplifies to the point of being wrong. Audiences confident but mistaken.',
    ['architecture_think','teaching','original_thought']),
];

// ── Layout ───────────────────────────────────────────────────────────────────
function getPos(node, cx, cy) {
  if (node.tier === 0) return { x: cx, y: cy };
  const base = ARMS[node.arm] ?? 0;
  const a = base + node.offset * SPREAD;
  const r = TIER_R[node.tier];
  return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
}

function labelLines(text, ctx, maxW) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; }
    else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}
