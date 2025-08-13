SYSTEM / ROLE
You are a senior full-stack architect and technical writer. Produce a research-backed plan and scaffold for a modern portfolio website for “Zishan Jawed,” then output a complete file tree, key code stubs, JSON content samples, a Cursor runbook, and a Cloudflare deploy guide with exact commands AND the exact Cursor prompts to run during each phase.

CRITICAL: RESEARCH & ADAPTATION MODE
- Do deep research in official docs / reputable sources before deciding. If any chosen tech is unfit or there’s a clearly better option (performance, DX, Cloudflare support, accessibility, SEO), propose the alternative, explain trade-offs briefly, and ADOPT it in the final plan.
- Default solution (use only if still best after research):
  • Next.js (App Router, TypeScript) adapted for Cloudflare Pages/Workers via @cloudflare/next-on-pages  
  • Tailwind CSS + shadcn/ui (allow selectively adding a few free Aceternity UI components for flair)  
  • Motion for React (Framer Motion) for animations; must honor prefers-reduced-motion + manual “Low Motion” toggle  
  • React Three Fiber + drei for tasteful 3D hero/accents with device-adaptive fallbacks  
  • All site content in /data/*.json with Zod validation; components/pages read JSON (no content hardcoded)  
  • SEO via Next.js Metadata API + JSON-LD; dynamic OG images at the edge  
  • Analytics: Cloudflare Web Analytics; Contact: Cloudflare Pages Function/Worker + Turnstile (token verified server-side)  
  • Client-side fuzzy search over a prebuilt JSON index; “/” focuses search  
  • Fonts: Inter (UI) + JetBrains Mono (code)  
  • Performance budget: LCP < 2.5s, CLS < 0.1, initial JS < 200 KB; ship a CI check

SAFE OUTPUT WINDOW PROTOCOL (IMPORTANT)
- If your response approaches the model’s output limit, STOP at a clear section boundary. Append a line:  
  “--- SAFE PAUSE: More sections remain. Reply ‘continue’ to get the next chunk.”  
- On the next message, resume exactly where you left off. Repeat as needed until all deliverables are provided.

BMAD INTEGRATION (MANDATORY)
- Use BMAD-Method’s agentic workflow to generate planning artifacts and development stories/tasks (Analyst/PM/Architect planning → Scrum-Master converts into hyper-detailed story files for Dev/QA).  
- Include BMAD’s **codebase flattener** step to create a single XML of the repo for LLM context.  
- Add a `/tools/bmad/` folder with: flattener config, a “team file” or instructions to spawn the planning/dev agents, and BMAD task prompts.  
- Where feasible, auto-generate initial tasks/stories from the plan (so the Dev agent can start immediately).

INPUTS
1) MASTER PROFILE (single source of truth for content; parse roles, metrics, links, skills):
""
Zishan Jawed — Holistic Master Profile (Private)
Single source of truth. We will copy from here to create resumes and platform profiles (LinkedIn, Wellfound, Naukri, Upwork, X/Twitter). Keep everything accurate, quantified, and current.

0) Admin & Privacy
Profile owner: Zishan Jawed


Version: v1.0 (start date: 2025‑08‑12 IST)


Last updated: 2025‑08‑12 (finalized v1.0)


Visibility rule: This file may contain private data. Public copies must remove phone, personal email, address, IDs, and sensitive client details.


Change log:


2025‑08‑12: Skeleton created.



1) Contact & Identity (Private)
Full name: Zishan Jawed


Preferred name (display): Zishan Jawed


Pronunciation: Zee-shaan Jaa-ved (edit if needed)


Location: India (Remote, IST / UTC+5:30)


Phone: +91 93183 39749


Primary email: dev.zishan@gmail.com


Alt email(s): [fill]


Website/Portfolio (primary): https://zishan.loopcraftlab.com


Website/Portfolio (alt): https://loopcraftlab.com/


GitHub: https://github.com/zishanjawed


LinkedIn: https://linkedin.com/in/zishan-jawed


Wellfound: [fill]


Naukri: [fill]


Upwork: [fill]


X/Twitter: https://twitter.com/DevZishan


Note: Keep platform URLs here. We’ll auto-sync handles across copies.

2) Headline Library (Platform‑Optimized)
Short, keyword-rich lines. We will keep one master theme and tweak per platform.
Master theme: Backend‑heavy Full‑Stack • Fintech & Payments • Cost‑Savvy Systems • GenAI (selectively)


LinkedIn headline (≤220 chars): Senior Backend & Full‑Stack Engineer (Python/JS) • Fintech/Payments • Built Airgate (₦5B+/mo) • Cost −30% • 99.9% uptime • Team Lead


Naukri headline (~250 chars): Senior Backend/Full‑Stack Engineer | Python, FastAPI, .NET, React | Fintech/Payments | Scaled Airgate to ₦5B+/mo | 99.9% uptime | Cut cloud cost 30% | Team mentoring


Upwork title (≤70 chars): Senior Backend Engineer (Python/.NET) | Fintech & APIs


Wellfound tagline: Backend‑heavy full‑stack • Fintech/Payments • Python/JS • Team Lead


X/Twitter bio (≤160 chars): Backend‑heavy full‑stack • Fintech/Payments • Python/JS • Built Airgate (₦5B+/mo) • Cost −30% • 99.9% uptime



3) Value Proposition & Summaries
One‑liner (≤20 words): Backend‑heavy full‑stack engineer in fintech/payments. I build fast, secure systems that scale and save cost.


Elevator pitch (≈75 words): I design and ship backend‑heavy systems in fintech and SaaS. My work runs at scale (₦5B+ monthly), stays online (99.9% uptime), and reduces spend (−30%). I lead small teams, review code, and set up CI/CD and infra on AWS/GCP. I build clear APIs (REST/GraphQL), real‑time services, and data flows that power dashboards and finance ops. I keep things simple, secure, and fast.


Long summary (≈200–250 words): I am a senior backend‑heavy full‑stack engineer focused on fintech/payments. I work mainly with Python (FastAPI, Flask, Django), C#/.NET, and JavaScript/TypeScript with React/Next.js. I design microservices and event‑driven systems, build clear APIs, and automate CI/CD on AWS/GCP. I care a lot about uptime, cost, and clean code. At Airgate, I helped scale transactions to ₦5B+ per month with sub‑second latency and 99.9% uptime, while cutting cloud cost by 30%. I also built real‑time fraud and analytics tools, and mentored a 10‑engineer team. Before that, I worked on banking data APIs and ML‑backed risk models (improved accuracy by 18%) and set up observability and faster releases (−70% time). I like simple, solid designs that are easy to run and extend. I’m remote‑friendly, hands‑on, and comfortable owning projects end‑to‑end—from problem to production.


Alt (Fintech/Payments‑first): Fintech engineer and team lead. I build payment systems, gateways, webhooks, settlement flows, and recon tools. Focus on security, cost, and uptime.


Alt (GenAI‑highlighted): Engineer applying GenAI to developer and finance workflows (RAG, agents, embeddings). I ship safe, small wins first, then scale.



4) Skills Matrix (Pin versions / last used)
Only list tools you can interview on today.
| Category | Skill/Tool | Version/Spec | Level (Expert/Advanced/Working) | Years | Last Used |
 |
5) Signature Achievements (Quantified)
Scaled payment platform to ₦5B+ transactions/month with sub‑second latency and 99.9% uptime.


Cut cloud spend ~30% using Terraform, GitHub Actions, and right‑sizing on AWS/GCP.


Reduced fraud/chargebacks by 22% with real‑time analytics and rules.


Improved risk‑scoring accuracy by 18% by embedding ML models into APIs.


Release time −70% after CI/CD and observability upgrades.


Led and mentored a 10‑engineer cross‑functional team.


Deployed hospital system to 20+ hospitals serving 10k+ users.


Automated content/data flows saving 10+ hours/week.



6) Experience (STAR‑style Impact Bullets)
CallPhone Ltd.
Role: Team Lead / Senior Backend Engineer • Location: Remote (Nigeria/India)
 Dates: 03/2023 – Present
 Tech: Python (FastAPI/Flask), .NET Core/C#, SQL Server, PostgreSQL, Redis, Kafka, Next.js/TypeScript, AWS, GCP, Terraform, GitHub Actions
 One‑sentence impact: Scaled and secured a payment aggregator while cutting cost and improving uptime.
Key achievements:
S/T: Payment platform needed scale and strong uptime.
 A: Architected event‑driven microservices; exposed REST/GraphQL; built dashboards.
 R: ₦5B+ monthly volume, sub‑second latency, 99.9% uptime.


S/T: Infra cost was high.
 A: Automated CI/CD, infra as code, right‑sizing.
 R: −30% cloud spend with no downtime.


S/T: Fraud risk and visibility were limited.
 A: Built real‑time fraud/analytics tools using historical patterns.
 R: 22% fewer chargebacks; faster finance insights.


S/T: Team needed standards and mentoring.
 A: Led 10‑engineer team; reviews; roadmap.
 R: Faster delivery; better code quality.



Fishtail
Role: Full Stack Software Engineer • Location: Remote (US)
 Dates: 04/2022 – 03/2023
 Tech: Python (Django), Ruby on Rails, GraphQL, AWS, GCP
 One‑sentence impact: Built banking data APIs and ML‑backed risk systems.
Key achievements:
S/T: Needed credit risk features.
 A: Integrated Plaid; embedded forecasting models.
 R: +18% risk‑score accuracy.


S/T: Slow releases and low visibility.
 A: Set up CI/CD and observability on AWS/GCP.
 R: −70% release time; easier debugging.



Kalkine Solutions Pvt. Ltd
Role: Software Developer • Location: Hybrid (Noida, IN)
 Dates: 11/2021 – 05/2022
 Tech: Python, PHP (legacy), Automation, MySQL
 Key achievements: Migrated PHP monolith to Python and saved 10+ hours/week; won Spotlight Award.

VixSpace
Role: Software Engineer • Location: Hybrid (Hyderabad, IN)
 Dates: 04/2019 – 10/2021
 Tech: REST APIs, IoT, AWS/GCP, SQL
 Key achievements: Shipped hospital system adopted by 20+ hospitals serving 10k+ users.

7) Projects & Freelance Work (Portfolio‑ready)
Project/Client: ELEC SBE (Electrical installations & maintenance, Île‑de‑France)
 When: 07/2024 – 03/2025 • Type: Freelance (≈20 h/week)
 Problem: Run the full business flow—from B2B/D2C orders to processing, invoicing, and payments—on one system with role‑based access for account managers, admins, and operations staff.
 Scope & role: Senior Full‑Stack Developer; owned backend, key frontend, automations, and delivery.
 RBAC roles: Admin, Account Manager, Sales Manager, Warehouse Manager, Finance Manager, Stock Manager, Delivery Partner, General Staff.
 Tech: ASP.NET (.NET), React, MySQL Server, Python (automations)
 Outcome: Centralized operations; cut ~100 manual hours/week to ~1–2 hours (≈98–99% reduction). Better cross‑team collaboration; smart inventory/resource management; finance + ERP‑style modules; cleaner reporting; semi‑automated workflows. Key results: O2C reduced from up to ~60 days → 8–10 days; DSO ~90–120 days → <30 days; invoice issuance 3–4 days → instant (automated); payment collection success (7/14/30 days): 25% / 50% / 50%; stockout rate 15% → 3%; pick accuracy 90% → 97%.
 Validated metrics (ELEC SBE):
Order‑to‑Cash (O2C) cycle time: from up to ~60 days → 8–10 days.


Days Sales Outstanding (DSO): from ~90–120 days → <30 days.


Invoice issuance after job completion: 3–4 days → instant (automated).


Payment collection success within 7/14/30 days: 25% / 50% / 50% (as provided).


Inventory stockout rate: 15% → 3%.


Pick accuracy: 90% → 97%.
 Links: Website: https://www.elecsbe.com • LinkedIn: https://www.linkedin.com/company/elec-sbe/



Client: Microsoft (via Turing.com) — Private codename: “Novel Code” (keep private; use only in Master Profile)
 When: 07/2025 – Ongoing • Type: Freelance (≈20 h/week) • Role: LLM Trainer (RLHF) — Code‑generation model
 Problem: Improve a next‑gen code LLM’s quality, safety, and reliability for advanced coding tasks (web dev, CLI, DSA, networking, automation, scheduling).
 Scope & role: Evaluate model responses; write critiques (issues + fixes); author ideal/gold responses; annotate using an issue taxonomy (correctness, security, hallucination, performance, formatting, style, deps/versions); enforce requirements templates and prompt patterns.
 Tech & methods: Python; unittest for functional checks; advanced prompting; model evaluation workflows.
 Automation: Authored a setup script that auto‑creates working & test environments per task type to speed reviewer work.
 Quality & throughput: 100+ items/hour (ranking/critique/ideal end‑to‑end) — among 300+ trainers (top throughput); quality score 4.4/5, highest among 300+ trainers; ideal response acceptance rating 4.4/5.
 Impact: Contributed to internal improvements in code‑LLM metrics (e.g., pass@k, test‑pass rate); helped refine guidelines and mentored peers.
 Public phrasing (for resumes/profiles): “Microsoft (via Turing.com) — LLM Trainer (RLHF) for a code‑generation model; evaluated outputs, wrote gold solutions, enforced safety/quality criteria; 100+ items/hour throughput; top‑rated quality (4.4/5).”

Project: Airgate Payment Aggregator (CallPhone)
 When: 2023 – Present
 Tech: Python microservices, Next.js/TypeScript, Terraform, AWS/GCP
 Outcome: ₦5B+ monthly, 99.9% uptime, −30% cloud spend, −22% chargebacks.
Project: Fishtail Banking APIs
 When: 2022 – 2023
 Tech: Django/Rails, GraphQL, Plaid, AWS/GCP
 Outcome: +18% risk‑score accuracy; faster releases (−70% time).
Project: Marketplace Burgdorf
 When: 2021 – 2022
 Outcome: Served 10k+ users with 99.9% uptime.

8) Education
Diploma, Computer Science & Engineering
 Institution: Jamia Millia Islamia University
 Year: 2016 – 2019 (hide year in public copies if desired)



9) Certifications & Badges
FinTech: Foundations, Payments, and Regulations — University of Pennsylvania — Status: Completed (no expiry listed) — Credential: https://www.coursera.org/account/accomplishments/verify/VL8390JC0IZY


JavaScript — The Complete Guide (Beginner + Advanced, 2022) — Status: Completed



10) Publications, Talks, Media
[fill]



11) Open‑Source Contributions
[fill]



12) Availability & Preferences
Target roles: Senior/Lead Backend, Backend‑heavy Full‑Stack


Employment: Full‑time + Freelance/Contract (Yes)


Work model: Remote (global)


Time zone: IST (UTC+5:30)


Notice period: [fill]


Compensation bands: [private]


Relocation/visa: [fill]



13) Keywords & SEO Bank (Platform‑Specific)
Fintech/Payments: PCI‑DSS, 3‑DS, tokenization, webhooks (HMAC), idempotency, chargebacks, settlements, payouts, reconciliation, ledger, dispute workflows, risk rules, CBN regulations, open banking (Nigeria)


Backend/Infra: FastAPI, Flask, Django, Ruby on Rails, .NET, REST, GraphQL, WebSockets, Celery, Kafka, Redis, PostgreSQL, MySQL, SQL Server, caching, rate limiting


Cloud/DevOps: AWS, GCP, IONOS Cloud (EU/DE regions), Terraform, Docker, Kubernetes, CI/CD (GitHub Actions), observability, OpenTelemetry, autoscaling, cost optimization, serverless


GenAI: RAG, embeddings, vector DB, agents, prompt engineering, evaluation, pass@k, unittest harnesses, safety filters


Interests (optional for public copies): Smart contracts, blockchain APIs, Web3 security (exploratory)



14) Featured Links & Media Library
Portfolio (primary): https://zishan.loopcraftlab.com


Portfolio (alt): https://loopcraftlab.com/


Resume (PDF): [attach]


LinkedIn PDF: [attach]


Employer/Project sites: https://airgate.ng/ • https://www.callphoneng.com • https://fishtail.ai • https://kalkine.co.in/ • https://vixspace.com/ • https://ichkaufinburgdorf.de/


Case studies: [links/files]


Diagrams: [links/files]


Demos: [links]


Talks/videos: [links]



15) Platform Mapping Checklist
LinkedIn → Headline (2), About (3 long), Experience (6), Featured (14), Skills (4)


Naukri → Headline & summary (2–3), Skills (4), Keywords (13)


Upwork → Title & Overview (2–3), Portfolio (7 & 14), Specialized profiles (optional)


Wellfound → Bio (3 short), Role interests (12), Links (14)


X/Twitter → 160‑char bio (2), Pinned post (14)



16) Notes & To‑Dos
Pin library versions for key tools (only stable, mutually compatible).


Add 2–3 case‑study PDFs to Featured.


Add OSS/PR links.


Add recommendations/refs to LinkedIn.


Add salary bands (private) and notice period.




""


2) CURRENT PREFERENCES (may be overridden by research with justification)
- Next.js + TypeScript on Cloudflare (Pages/Workers)
- Tailwind + shadcn/ui; optionally add a few free Aceternity UI components
- Motion for React; reduced-motion + “Low Motion” toggle
- React Three Fiber + drei with device-adaptive fallbacks (LOD/instancing, on-demand rendering, disable on low-power)
- All content in /data JSON, validated by Zod; pages/components read JSON
- SEO Metadata API + JSON-LD; dynamic OG images at the edge
- Cloudflare Web Analytics; Turnstile-protected contact form with server-side token verification
- Client-side fuzzy search; “/” to focus
- Inter + JetBrains Mono
- No secrets in code; use env vars/placeholders
- Performance budget + CI to enforce

DELIVERABLES — OUTPUT EXACTLY IN THIS ORDER
## ARCHITECTURE SUMMARY
- Summarize framework/runtime choice (Cloudflare adapter or alternative), routing & rendering, data pipeline (JSON → Zod → typed loaders → components), animation & 3D strategy (reduced-motion path + device-adaptive fallbacks), accessibility, performance budgets, and WHY (cite research briefly). If you replace any tool, justify and proceed with the improved stack.

## FILE TREE
- Provide an exact path tree including:
  /app (App Router routes): /(site)/page.tsx (Home), /about, /experience, /projects, /writing (placeholder), /contact
  /app/api/contact/route.ts (or /functions/contact.ts for Pages Functions)
  /app/opengraph-image.tsx (or equivalent edge OG handler)
  /components (hero, nav, cards, metrics badges, search, theme toggle, 3D components)
  /lib (typed JSON loaders, search index builder, device/motion detection)
  /schemas (Zod schemas; export inferred TS types)
  /data (site.json, person.json, experience.json, projects.json, skills.json, writing.json)
  /public (assets, icons)
  /styles (globals.css, tailwind config)
  /tools/bmad (flattener config, agent/team file, BMAD tasks)
  /tools/ci (Lighthouse/Playwright/LHCI script + budgets)
  project configs: wrangler config, pages config if needed, package.json scripts, tsconfig, next config, eslint (including eslint-plugin-next-on-pages if applicable)

## KEY FILE STUBS
- Short, compilable snippets (TypeScript) for:
  • Zod schemas for all JSON files; export Types via z.infer  
  • Typed JSON loaders that parse & validate data, with friendly error messages  
  • Home hero with Motion variants; “Low Motion” toggle persisted; optional R3F scene + “Disable 3D” switch; auto-downgrade on low-power  
  • Projects grid reading projects.json; open Drawer/Sheet with details (no standalone case-study pages for now)  
  • Search component + prebuilt JSON index; “/” shortcut to focus  
  • Contact endpoint: Turnstile siteverify call, append to /data/messages.json, and send email/webhook (document recommended adapter)

## INITIAL JSON DATA
- Populate from MASTER PROFILE:
  • CallPhone/Airgate: NGN 5B+ monthly, 99.9% uptime, ~30% cost reduction, −22% chargebacks  
  • Fishtail: +18% risk accuracy, −70% release time  
  • Kalkine: Spotlight Award, +10 hrs/week saved  
  • VixSpace: 20+ hospitals, 10k+ users, O2O e-commerce product  
  • Microsoft via Turing (RLHF): 100+ items/hour, 4.4/5 quality (top among 300+)  
  • ELEC SBE (project): O2C 60d → 8–10d; DSO 90–120d → <30d; invoicing instant; stockouts 15% → 3%; pick accuracy 90% → 97%; manual ~100h/week → 1–2h  
- Provide minimal yet realistic samples in each JSON file.

## SEO & SOCIAL
- Implement Next.js Metadata API, sitemap.xml, robots.txt, and RSS (if writing enabled).  
- JSON-LD: Person on Home/About, Project on project cards, Article reserved for writing.  
- Edge OG images: preferred = Cloudflare Pages Plugin for @vercel/og; also include a fallback Worker-based OG route if the plugin is unsuitable. Provide working code/config for the chosen path.

## ACCESSIBILITY & PERFORMANCE
- Color-contrast-safe palette, focus rings, keyboard nav, skip links, aria-labels.  
- Reduced-motion variants and an always-visible “Low Motion” toggle.  
- 3D performance: on-demand rendering, LOD/instancing, auto-disable on low-power/mobile, static SVG fallback.  
- Add Lighthouse (or LHCI) with budgets and instructions to run locally and in CI. Show how to fail CI on regression.

## DEPLOY STEPS (CLOUDFLARE + DOMAIN) — WITH COMMANDS & PROMPTS
- Cursor setup: how to install, enable repo-context, and paste/run prompts.  
- BMAD setup: commands to install/update (`npx bmad-method install`), how to run the **codebase flattener** (`npx bmad-method flatten`), and how to invoke BMAD planning agents to auto-create tasks/stories for the Dev agent.  
- Project bootstrap on Cloudflare:
  • Create or adapt a Next.js app for Pages/Workers (use @cloudflare/next-on-pages or an alternative you justify)  
  • Add wrangler config and any Next-on-Pages lint plugin; show build/preview/deploy scripts  
  • Mark `export const runtime = "edge"` where required; note Node-compat flags if applicable  
- Install and configure Tailwind, shadcn/ui, and (optionally) a few free Aceternity UI components  
- Install Motion for React; add a minimal animated example  
- Install React Three Fiber + drei; add a tiny hero scene; show how to disable on mobile  
- Add Cloudflare Web Analytics snippet  
- Add Turnstile (client widget + server siteverify), write to JSON log + email/webhook  
- Dynamic OG images: add the Pages Plugin (preferred) or Worker fallback; include config and sample route  
- Map domain to `zishan.loopcraftlab.com`; enable preview deployments for PRs  
- Provide **exact commands** (npm/yarn/pnpm), minimal config files, and copy-paste snippets for every step.

## CURSOR & BMAD RUNBOOK (COPY-PASTE PROMPTS)
- Provide 8–12 ready-to-run Cursor prompts, e.g.:
  1) “Add a new project to projects.json and regenerate the search index; update the Projects grid and OG metadata automatically.”  
  2) “Reduce all page-transition durations by 20% and update reduced-motion variants accordingly.”  
  3) “Disable all 3D on mobile and if prefers-reduced-motion = true; replace hero with a static SVG fallback.”  
  4) “Introduce a new field to person.json, update Zod schemas, types, loaders, and UI bindings.”  
  5) “Create a second OG template for /projects and wire routing to pick the correct card.”  
  6) “Code-split heavy components and verify JS budget with Lighthouse CI.”  
  7) “Harden the contact form: stricter Turnstile checks, rate limiting, and better error messages.”  
  8) “Run BMAD flattener and generate a new XML for the updated repo; attach it to the next Cursor run.”  
- Include a one-command BMAD “flatten” step and guidance to feed the XML back to Cursor as context for large refactors.

STYLE & QUALITY BAR
- Snippets must be concise and compilable; prefer server components except where interactivity is required (animations, 3D, search).  
- Everything must compile on Cloudflare; call out unsupported features and provide alternatives.  
- Use tasteful, accessible animations; keep 3D lightweight and degradable.

FINAL CHECK
- Validate all JSON via Zod and show error surfaces.  
- Confirm Turnstile token is verified server-side (siteverify) and logging works.  
- Confirm OG images render and pass link preview tests.  
- Confirm Lighthouse budgets pass on a throttled mobile profile.  
- If you replaced any default tool, include a short comparison table and the reason for switching.

REMINDER: If the response window fills, use the SAFE OUTPUT WINDOW PROTOCOL to pause and continue in the next message.
