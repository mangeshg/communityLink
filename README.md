
# CommunityLink

CommunityLink is a lightweight demo platform built with React + Vite + Tailwind that explores a OneCouncil, multi-tenant approach to strengthening local community engagement. It was developed as an evidence-informed submission for the GovHack challenge focused on strengthening social cohesion.

This README explains the project goals, how the app works for both residents and council admins, the technical design, and how the solution maps back to the problem statement (see `src/ProblemStatment.txt`).

## Contents (high level)
- Problem statement summary
- Product idea & goals (OneCouncil, multi-tenant)
- Community engagement approach (authentic, still anonymous & aggregated)
- Technical solution (architecture, data flows, privacy)
- User journeys (People / Residents and Council Admins)
- How the solution addresses the problem statement
- Getting started (dev & run)
- Key files and mock data
- Next steps and suggested improvements

---

## 1) Problem statement (brief)

See the full problem statement in `src/ProblemStatment.txt`.

Summary: Australias social cohesion has been declining. The challenge asks for practical, data-driven ideas local councils can roll out (within ~6-12 months) to strengthen belonging, participation and trust, create respectful debate, and increase civic engagement across diverse communities.

This project focuses on enabling councils to discover and act on community sentiment, provide safe channels for ideas and feedback, and measure cohesion-related indicators over time.

## 2) Overall idea

CommunityLink demonstrates a OneCouncil concept: a common platform that can be used by many councils (multi-tenant in behaviour, single experience for users). Key design points:

- OneCouncil (single UX): Residents use the same experience regardless of council, but select/are linked to their council during onboarding (or via a myGov-like link).
- Multi-tenant intent: the app stores a selected council in localStorage and surfaces council-specific views (dashboard header, projects, events). It is intentionally lightweight so it can be adapted for each council.
- Dual-user model: Residents (people) and Council Admins (OneCouncil dashboard) — both supported by the same codebase.

## 3) Community engagement approach

Principles used in the design:

- Encourage ideation: residents can submit ideas (Submit Idea flow) and receive an AI-assisted summary for quick framing.
- Authentic but private: feedback and participation are represented as aggregated, anonymised indicators (sentiment bars, participation indexes) to protect identity while still surfacing actionable community signals.
- Lower friction participation: lightweight votes (Support / Neutral / Oppose), short comments, events, and service requests increase engagement without heavy onboarding.
- Respectful dialogue: the UI encourages polite, contextualised comments and uses aggregated sentiment to avoid amplifying polarising individual posts.

Privacy note: The app demonstrates anonymisation by design — only aggregated counts and indexes are shown. A production implementation must harden aggregation thresholds, k-anonymity, and data retention rules.

## 4) Technical solution

Stack
- Frontend: React (JSX) + Vite (dev server & build)
- Styling: TailwindCSS
- No backend in this demo: the app uses localStorage and static mock data located in `src/mockData/`.

Architecture & data flows

- Onboarding & tenancy: Users select or are linked to a council during onboarding (`OnboardingFlow`) and that choice is saved as `communityLink_council` in localStorage. This drives the council context shown throughout the app (header, project lists, events).
- Auth (demo): myGovID-linking is simulated. In a production system this would be replaced by a secure authentication+identity proofing integration and role-based access control for council admins.
- Participation & feedback: The dashboard shows a participation index (custom SVG line chart using `src/mockData/participation.json`) and feedback tiles with aggregated sentiment per-project (mocked in `CouncilDashboard.jsx`). These visualisations are computed client-side from mock data in this demo.

Key implementation notes

- Dependency-free charts: To keep the demo lean and avoid adding chart libraries, the participation time series is implemented as an accessible SVG polyline with interactive markers and tooltips (see `src/CouncilDashboard.jsx`).
- Local components: Small reusable Card and InfoTooltip components are implemented locally to avoid dependency on external design systems.
- Mock AI: The Submit Idea flow simulates an AI summariser (mock response) to demonstrate how council staff and residents could be helped to frame proposals quickly.

Privacy and data governance (demo -> production)

- Demo approach: the project intentionally shows only aggregated sentiment and indexes. No PII is persisted beyond a simulated localStorage value.
- Production requirements: ensure data minimalisation, encryption-at-rest/in-flight, aggregation thresholds, differential privacy or k-anonymity, and legal compliance (privacy laws, records management).

## 5) User journeys (features by user)

Resident (People)
- Sign in (mock myGovID or email entry) and the ability to select a council during onboarding.
- Update preferences to surface relevant events.
- Browse local events and register interest.
- Submit a council idea via the Submit Idea flow (AI summariser mock assists with a short summary).
- Vote on proposals (Support / Neutral / Oppose) and optionally comment. Votes are counted and shown as totals.
- Use simple service interactions (waste collection request, parking permit, rates payment flows) provided as inline demo flows.

Council Admin
- Council dashboard (CouncilDashboard.jsx) shows an Engagement Snapshot, Belonging & Trust score, recent community actions, participation over time (interactive chart), and a Feedback Hub summarising sentiment across projects.
- Ability to read aggregated signals (participation index, sentiment) to prioritise engagement activities.
- The demo shows how a council could track trends and surface action items (e.g., community events, targeted consultations).

## 6) How this solution maps to the Problem Statement

The project addresses the GovHack brief in these ways:

- Strengthen community connections: Enables low-friction events, local ideas, and participation that bring people together around shared, local activities.
- Build trust in government: The OneCouncil concept, transparent aggregated signals, and easy-to-find service flows lower the barrier to interacting with local government.
- Support respectful debate: Aggregated sentiment and lightweight voting reduce the prominence of polarising comments, encouraging constructive dialogue.
- Practical roll-out: The demo is intentionally minimal — a council could pilot the platform with local datasets and existing engagement channels within 6-12 months.

## 7) Getting started (developer)

Prerequisites
- Node.js (LTS recommended) and npm

Install & run (communityLink folder)

```bash
# from project root
cd communityLink
npm install
npm run dev
# open the URL Vite prints (usually http://localhost:5173)
```

Build for production

```bash
cd communityLink
npm run build
npm run preview
```

Notes: If you see hard-coded example strings in `dist/` files, those are build artifacts and will update when you run a fresh build.

## 8) Key files

- `src/App.jsx` — application routes, SignIn, Onboarding wrapper, and main flows.
- `src/CouncilDashboard.jsx` — Council admin dashboard: cards, participation SVG chart, feedback tiles, InfoTooltip.
- `src/Onboarding.jsx` — onboarding flows (council selection, myGov linking, preferences).
- `src/CouncilLogin.jsx` — council sign-in stub / admin entry.
- `src/mockData/participation.json` — 12-month mock participation index used by the chart.
- `src/ProblemStatment.txt` — full problem statement and challenge brief (source for the project goals).
- `tailwind.config.js` / `postcss.config.js` — Tailwind configuration used by the demo.

## 9) Mock data and behavior

- Mock AI summariser: `SubmitIdeaBot` in `App.jsx` returns a simulated JSON summary to show how a council could convert ideas into well-formed proposals.
- Sentiment & participation: Mocked in `CouncilDashboard.jsx` and `src/mockData/participation.json`. These would be replaced by real council datasets in production.

## 10) Next steps & suggested improvements (production roadmap)

Short-term (safe, low-risk)
- Add a lightweight backend (serverless functions) to persist anonymised aggregated metrics and ideas.
- Harden onboarding with a real identity connection (myGov or other OIDC) while preserving anonymous feedback channels.
- Add tests for critical flows (unit tests for chart math and integration tests for onboarding flows).

Mid-term
- Implement proper multi-tenant separation with per-council data stores and RBAC for council admins.
- Add privacy-preserving aggregation (k-anonymity, differential privacy) to all reports.
- Provide CSV export and policy dashboards for measuring cohesion over time.

Long-term
- Integrate government datasets (per challenge brief) to provide evidence-backed targeting (e.g., demographics, service coverage).
- Advanced analytics: cohort analysis, segmentation, and measurement of impact on trust and belonging.

## 11) License

This repository is a demo / hackathon project. Check repository metadata for any licensing notes. Consider adding an explicit open-source license if you plan to publish or share widely.

---

If you want, I can also:
- Add a brief `README.md` at the repo root (`/Users/mangesh/GovHack2025/README.md`) summarising all subprojects, or
- Run the dev server and provide a visual verification report of the Council dashboard and SVG chart.
