# CommunityLink

## Problem Statement

**Bridging Social Divides: Strengthening Social Connections in Australia**

How can we bring people together from diverse backgrounds to communicate respectfully, even when they hold opposing views?

Social cohesion is the “glue” that binds society together. Cohesive societies are healthier, more resilient, and experience greater prosperity. While Australians have historically come together in times of crisis, recent reports (Scanlon Institute 2023, 2024) show a decline in cohesion — with the Scanlon-Monash Index dropping to its lowest score since 2007.

Key dimensions of cohesion include:

* **Belonging** – pride and connection to Australian life and culture
* **Worth** – emotional and material well-being across society
* **Inclusion & Justice** – fairness in society and trust in government
* **Participation** – active engagement in political and civic life
* **Acceptance & Rejection** – attitudes to diversity and experiences of discrimination

This project addresses the **GovHack challenge**: to design initiatives that strengthen community connection, trust in government, and respectful debate. Deliverables should:

* Present a practical idea that can be piloted locally within 6–12 months
* Include a mock-up and evidence-based analysis, using at least one government dataset
* Demonstrate how impact could be measured (trust, belonging, engagement, acceptance, cultural understanding)

---

## Solution Overview

**CommunityLink** is a lightweight demo platform built with React, Vite, and TailwindCSS. It demonstrates a **OneCouncil, multi-tenant approach** to local community engagement.

The solution enables councils to:

* Discover and act on community sentiment
* Provide safe, anonymous channels for ideas and feedback
* Support respectful dialogue without amplifying polarisation
* Track participation and belonging indicators over time

### Key Features

* **OneCouncil, Multi-Tenant:** Single user experience, council selection during onboarding
* **Dual User Model:** Residents and Council Admins with tailored dashboards
* **Aggregated, Anonymous Engagement:** Protects privacy while surfacing actionable insights
* **Respectful Dialogue:** Sentiment aggregation reduces prominence of divisive content
* **AI Summariser (Demo):** Shows how AI can assist in framing proposals

---

## Technical Design

### Demo Stack

* **Frontend:** React (JSX), Vite
* **Styling:** TailwindCSS
* **Data:** LocalStorage + static mock data (`src/mockData/`)

### Production Stack (Recommended)

* **Frontend:** React served via CDN
* **API:** REST/GraphQL (serverless or containers)
* **Auth:** OIDC / myGovID (strong identity proofing)
* **Database:** Managed Postgres or NoSQL with tenant separation
* **Cache/Session:** Redis
* **Storage:** S3-compatible for attachments
* **Analytics:** Time-series DB or OLAP store

### Architecture & Privacy

* Tenancy stored per user → scoped council context
* Auth (demo): simulated myGovID; production → OIDC provider
* Participation & sentiment → aggregated charts (demo in SVG, client-side)
* Privacy: no PII stored; demo uses static data. Production must enforce encryption, access control, aggregation thresholds, k-anonymity/differential privacy, and compliance with records laws.

### Security

* TLS everywhere, least-privilege IAM, centralised monitoring & alerting
* Secure defaults and dependency monitoring

---

## User Journeys

**Residents**

* Sign in and select council
* Set preferences, browse events, register interest
* Submit ideas (AI summary assist)
* Vote/comment on proposals (Support / Neutral / Oppose)
* Access simple council service flows (waste, parking, rates)

**Council Admins**

* Dashboard with belonging/trust scores and engagement snapshots
* Participation chart + sentiment hub
* View aggregated, anonymised signals to prioritise engagement

---

## Example Data & APIs

TODO

---

## Benefits

* Strengthens belonging and connection
* Builds trust in government through transparency
* Encourages constructive dialogue over polarisation
* Practical for roll-out in 6–12 months

---

## Getting Started

**Prerequisites:** Node.js (LTS), npm

Run locally:

```bash
cd communityLink
npm install
npm run dev
# open http://localhost:5173
```

Build for production:

```bash
npm run build
npm run preview
```

---

## Key Files

* `src/App.jsx` → main app routes & flows
* `src/CouncilDashboard.jsx` → admin dashboard, charts, sentiment tiles
* `src/Onboarding.jsx` → council selection & onboarding
* `src/CouncilLogin.jsx` → admin login stub
* `src/mockData/participation.json` → mock participation data
* `src/ProblemStatment.txt` → full challenge brief
* `tailwind.config.js`, `postcss.config.js` → styling configs

---

## Roadmap

**Short-term:**

* Add lightweight backend (serverless) for anonymised metrics
* Real identity integration (myGov/OIDC)
* Add automated tests

**Mid-term:**

* Tenant data separation & RBAC for admins
* Privacy-preserving aggregation (k-anonymity, differential privacy)
* CSV export and policy dashboards

**Long-term:**

* Integrate government datasets (per challenge brief)
* Advanced analytics: segmentation, cohort analysis, impact measurement

---

## License

Govhack demo project. See repo metadata for license notes. Add an explicit license if publishing openly.

