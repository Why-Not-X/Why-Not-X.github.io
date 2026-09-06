// ── Resume-grounded evidence for the skill tree ──────────────────────────────
// Every entry here is traceable to an actual line on the resume. Where the
// evidence is thin, the level says so instead of padding it out.

const EXPERIENCES = {
  edu:      { org: 'CU Boulder — Leeds School of Business', role: 'B.S. Business Administration, Business Analytics emphasis · Business + CS Integration Program', dates: 'Aug 2024 – Present' },
  avis:     { org: 'Avis', role: 'Vehicle Service Agent', dates: 'Jul 2025 – Feb 2026' },
  zen:      { org: 'Zen Property Management', role: 'Assistant Property Manager', dates: 'May 2025 – Present' },
  target:   { org: 'Target', role: 'General Merchandise / Fulfillment / Closing / Food & Beverage Expert', dates: 'Jul 2023 – Jul 2024' },
  robotics: { org: 'George Washington HS Robotics', role: 'Build · Business · Administrative Teams, Retention Lead', dates: 'Sep 2022 – May 2024' },
  lais:     { org: 'LAIS — Leeds Association for Information Science', role: 'VP of Outreach', dates: 'Dec 2025 – Aug 2026' },
  deca:     { org: 'DECA', role: 'Business competition participant', dates: '2022 & 2024' },
  capstone: { org: 'LAIS Development Program', role: 'Capstone — information science presentation', dates: '2025' },
  skills:   { org: 'Resume — Skills section', role: 'Self-listed competencies', dates: '' },
};

// level: 1 (emerging) – 5 (core strength). Kept honest to the evidence, not maxed out.
const LEVEL_LABEL = { 1: 'Emerging', 2: 'Developing', 3: 'Practiced', 4: 'Strong', 5: 'Core strength' };

const EVIDENCE = {
  core: { level: 4, summary: "Deliberately built a dual-track path — business strategy fused with technical fluency — and backed it with multiple years of consistent leadership roles across different organizations.",
    items: [
      { exp: 'edu', detail: "Chose the Business + Computer Science integration program at Leeds rather than a single-track degree." },
      { exp: 'robotics', detail: "Held leadership across three different sub-teams (build, business, admin) during a two-year run instead of staying in one lane." },
    ]},
  perception: { level: 3, summary: "Reads fast-changing, high-pressure environments and picks up operational signals quickly.",
    items: [
      { exp: 'avis', detail: "Operated in a high-pace service environment, refining processes and spotting what's slowing things down." },
      { exp: 'target', detail: "Managed and navigated different customer orders across Fulfillment, Closing, and Food & Beverage roles." },
    ]},
  systems: { level: 4, summary: "Formal systems training paired with real coordination across interdependent moving parts.",
    items: [
      { exp: 'edu', detail: "Business Analytics emphasis inside a Business + CS integration program — trained to model both the technical and organizational sides of a system." },
      { exp: 'zen', detail: "Handles a wide mix of property-management work — client financials, prospective-tenant service, on-site communications, listing promotion — as one adaptable role, not isolated tasks." },
      { exp: 'robotics', detail: "Split time across build, business, and admin sub-teams on the same robot program, seeing how the pieces fit together." },
    ]},
  creation: { level: 3, summary: "Hands-on maker background plus a contributor role in new initiatives like competitive business plans.",
    items: [
      { exp: 'robotics', detail: "Onboarded onto the build sub-team — machining and executing individual mechanisms on the robot (milling, lathing, CNC)." },
      { exp: 'deca', detail: "Built and pitched original business concepts in competition." },
    ]},
  expression: { level: 4, summary: "Outreach and audience-facing roles across school, community, and university clubs.",
    items: [
      { exp: 'lais', detail: "VP of Outreach — coordinated onboarding for new guest speakers and organized event logistics, efforts that helped double attendee turnout." },
      { exp: 'robotics', detail: "Administrative Team — helped coordinate and execute outreach events to grow STEM education in the community." },
      { exp: 'capstone', detail: "Capstone presentation for the LAIS Development Program was highly regarded." },
    ]},
  drive: { level: 5, summary: "Two overlapping jobs, a full course load, and an honors-level GPA, sustained for the better part of a year — the resume's own language describes exactly this.",
    items: [
      { exp: 'avis', detail: "“Practiced in high-paced environments... consistency in repetition.” — the role's own description." },
      { exp: 'zen', detail: "Ran concurrently with Avis (through Feb 2026) on top of a full course load, and kept going solo after." },
      { exp: 'edu', detail: "Maintained a 3.57 cumulative GPA and Leeds Honors Program standing (Dean's List, Fall 2024 & Spring 2025) throughout." },
    ]},
  contemplation: { level: 3, summary: "Academic depth and a capstone presentation that earned notice — evidence of sustained, structured thinking, not just fast output.",
    items: [
      { exp: 'edu', detail: "Leeds Honors Program; Dean's List two consecutive terms." },
      { exp: 'capstone', detail: "Presentation received high regard from the LAIS Development Program." },
    ]},
  deep_focus: { level: 3, summary: "Precision craft work and sustained academic performance under a heavy concurrent workload both demand this.",
    items: [
      { exp: 'robotics', detail: "Machining individual mechanisms for a competition robot — work that punishes a lost attention span." },
      { exp: 'edu', detail: "3.57 GPA sustained while working two jobs, not during a single light semester." },
    ]},
  pattern: { level: 3, summary: "Data-focused coursework, plus a track record of noticing operational inefficiencies worth fixing.",
    items: [
      { exp: 'edu', detail: "Business Analytics and Business Data Management coursework; SQL, Tableau, and Alteryx listed as working tools." },
      { exp: 'avis', detail: "Refined service processes by “optimizing strategies for the given output,” not just following a script." },
    ]},
  rootcause: { level: 3, summary: "Operational optimization and financial analysis are named parts of the job, not inferred from soft-skill language.",
    items: [
      { exp: 'zen', detail: "Helps analyze client financials as a named part of the property-management role." },
      { exp: 'avis', detail: "Managed efficiency and operational optimization, not just task completion." },
    ]},
  abstraction: { level: 3, summary: "Deliberately sits at the intersection of two different abstraction levels — business strategy and technical systems — by design of the degree program.",
    items: [
      { exp: 'edu', detail: "Business + Computer Science integration program — trained to move between strategic and technical framing of the same problem." },
    ]},
  ideation: { level: 3, summary: "Contributed to two different idea-generation contexts: competitive business strategy and team marketing.",
    items: [
      { exp: 'deca', detail: "Participated in DECA business competitions in 2022 and 2024 — pitching and defending original concepts." },
      { exp: 'robotics', detail: "Business Team — contributed to team marketing and fundraising ideas." },
    ]},
  taste: { level: 2, summary: "The thinnest entry on this tree — mostly inferred from craft and design-adjacent work rather than an explicit portfolio. Still forming.",
    items: [
      { exp: 'robotics', detail: "Machining and mechanism work rewards a feel for what's clean vs. sloppy, functionally." },
      { exp: 'zen', detail: "Handled photography for listing posts — the closest thing on the resume to a visual/design task." },
    ]},
  writing: { level: 3, summary: "Documentation-adjacent and audience-facing writing across a property-management role and competition prep.",
    items: [
      { exp: 'zen', detail: "Facilitates on-site tenant communications and helps manage listing exposure, in writing and in person." },
      { exp: 'deca', detail: "DECA competitions require written business plans and pitch materials." },
    ]},
  presence: { level: 4, summary: "Nearly every role on the resume is face-to-face with a customer, tenant, or teammate — not backend work.",
    items: [
      { exp: 'zen', detail: "Provides direct customer service to prospective tenants and facilitates on-site communications." },
      { exp: 'target', detail: "Prioritized guest experience through direct service, not just inventory upkeep." },
      { exp: 'avis', detail: "Customer-facing vehicle service role in a high-pace environment." },
    ]},
  resilience: { level: 4, summary: "Two full school years on the same robotics team through wins and losses, plus a sustained double-job-and-school stretch without a gap.",
    items: [
      { exp: 'robotics', detail: "Two school years on one team (2022–2024) — a 1st-place Regionals finish and a Worlds qualification, not a one-season run." },
      { exp: 'avis', detail: "“Consistency in repetition” under repeated pressure — the resume's own phrase for staying steady." },
    ]},
  vision: { level: 3, summary: "Chose a non-standard, dual-track degree early and has stayed on it — a specific, stated direction rather than an undeclared major drifting.",
    items: [
      { exp: 'edu', detail: "Declared the Business + CS integration program with a Business Analytics emphasis from day one (Aug 2024)." },
    ]},
  stillness: { level: 2, summary: "The least directly evidenced trait here — closest support is sustained, unhurried craft work and academic consistency, not an explicit contemplative practice.",
    items: [
      { exp: 'robotics', detail: "Machining work (milling, lathing) that can't be rushed without ruining the part." },
    ]},
  inquiry: { level: 3, summary: "Analyzing client financials is a named duty on the property-management role, backed by data-focused coursework.",
    items: [
      { exp: 'zen', detail: "Helps analyze client financials and provides customer service to prospective tenants — both named duties." },
      { exp: 'edu', detail: "AP Quantitative Reasoning and Business Data Management coursework." },
    ]},
  code: { level: 3, summary: "Formal CS coursework plus a listed language stack — early-stage but real, not just a self-reported interest.",
    items: [
      { exp: 'edu', detail: "Computer Systems coursework inside the Business + CS integration program." },
      { exp: 'skills', detail: "Lists C, Java, Python, and C++ as working languages." },
    ]},
  design_thinking: { level: 3, summary: "Named explicitly in the skills section, and practiced hands-on through robot mechanism design.",
    items: [
      { exp: 'skills', detail: "Design Thinking listed directly as a skill." },
      { exp: 'robotics', detail: "Specialized in individual mechanism design on the build sub-team." },
    ]},
};
