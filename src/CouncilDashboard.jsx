
import React from "react";
import { useNavigate } from "react-router-dom";

// Lightweight local Card components so we don't rely on external UI libs
function Card({ children, className = "" }) {
  return (
    <section className={`bg-white rounded-2xl border border-neutral-200 p-4 md:p-5 shadow ${className}`}>
      {children}
    </section>
  );
}
function CardTitle({ children }) {
  return <h3 className="text-base md:text-lg font-semibold text-neutral-900">{children}</h3>;
}

// Small info tooltip component (hover or focus to show)
function InfoTooltip({ text }) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative inline-block">
      <button
        aria-label="More info"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="ml-2 w-6 h-6 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-700 focus:outline-none"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11.5 8.5h1v1h-1v-1zM11 11.5h2v5h-2v-5z" fill="currentColor" />
        </svg>
      </button>
      {show && (
        <div role="status" className="absolute z-20 left-8 top-0 w-64 bg-neutral-900 text-white text-xs p-2 rounded shadow-md">
          {text}
        </div>
      )}
    </div>
  );
}

export default function CouncilDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = React.useState("participation");
  const [hover, setHover] = React.useState(null); // {x,y,month,v}

  function handleSignOut() {
    if (typeof window !== "undefined") localStorage.removeItem("communityLink_signedIn");
    navigate("/");
  }

  // load local mock data
  const participation = React.useMemo(() => {
    try {
      // static import-like read
      // eslint-disable-next-line no-undef
      // The file exists at src/mockData/participation.json
      // Use require to avoid async fetch in this simple setup
      // eslint-disable-next-line global-require
      return require("./mockData/participation.json");
    } catch (e) {
      return [
        { month: "Jan", v: 45 },
        { month: "Feb", v: 52 },
        { month: "Mar", v: 60 },
        { month: "Apr", v: 55 },
        { month: "May", v: 68 },
      ];
    }
  }, []);

  // council name (from onboarding selection) with safe window check
  const councilName = typeof window !== "undefined" ? (localStorage.getItem("communityLink_council") || "Your Council") : "Your Council";

  // Mock feedback data per project for the Feedback tab
  const feedbackProjects = React.useMemo(() => {
    return [
      {
        id: 'coffee-with-cop',
        title: 'Coffee with a Cop',
        // Mixed feedback: balanced positive/neutral with some negative
        sentiments: { positive: 40, neutral: 40, negative: 20 },
      },
      {
        id: 'community-patrol-feedback',
        title: 'Community Patrol Trial',
        // Very negative community sentiment
        sentiments: { positive: 10, neutral: 15, negative: 75 },
      },
      {
        id: 'cultural-fest',
        title: 'Cultural Diversity Event',
        sentiments: { positive: 72, neutral: 18, negative: 10 },
      },
      {
        id: 'waste-reduction',
        title: 'Waste Reduction Initiative',
        sentiments: { positive: 39, neutral: 41, negative: 20 },
      },
    ];
  }, []);

  // Action plan projects (derived or explicit) with suggested agentic steps
  const actionProjects = React.useMemo(() => {
    return [
      {
        id: 'coffee-with-cop',
        title: 'Coffee with Cop — Minority Inclusion Campaign',
        description: 'Run a targeted outreach campaign to invite minority communities to a "Coffee with Cop" initiative to build trust and open dialogue.',
        sentiments: { positive: 52, neutral: 30, negative: 18 },
        status: 'Planned',
        suggestedSteps: [
          { id: 'c1', who: 'AI Agent', desc: 'Draft event notification copy and tailored variants for specific community audiences', eta: '2 days' },
          { id: 'c2', who: 'Communications', desc: 'Publish event on council website and social channels; include accessibility info', eta: '3 days' },
          { id: 'c3', who: 'AI Agent', desc: 'Schedule and post to local community Facebook groups, Twitter/X, and Instagram with geo/interest targeting', eta: '3 days' },
          { id: 'c4', who: 'Marketing', desc: 'Run boosted ad campaigns at community events and pages frequented by minority groups', eta: '1 week' },
          { id: 'c5', who: 'Community Outreach', desc: 'Contact minority community organisations and offer supported transport/translation where needed', eta: '2 weeks' },
          { id: 'c6', who: 'AI Agent', desc: 'Monitor RSVPs and sentiment; surface issues and recommend follow-up actions', eta: 'Ongoing' },
        ],
      },
      {
        id: 'cultural-festival',
        title: 'Cultural Festival',
        description: 'A two-day celebration showcasing local arts, food and performance to boost local engagement.',
        sentiments: { positive: 72, neutral: 18, negative: 10 },
        status: 'Planned',
        suggestedSteps: [
          { id: 'c1', who: 'Arts Coord', desc: 'Confirm dates and permits', eta: '1 week' },
          { id: 'c2', who: 'Marketing', desc: 'Create poster and community outreach plan', eta: '2 weeks' },
          { id: 'c3', who: 'Volunteers', desc: 'Recruit volunteers and stewards', eta: '3 weeks' },
        ],
      },
      {
        id: 'community-patrol',
        title: 'Community Patrol Trial',
        description: 'Pilot a community patrol program to improve local presence, reporting and resident confidence.',
        sentiments: { positive: 34, neutral: 40, negative: 26 },
        status: 'Needs Approval',
        suggestedSteps: [
          { id: 'p1', who: 'Community Safety', desc: 'Design pilot patrol schedule and priority areas', eta: '2 weeks' },
          { id: 'p2', who: 'Council', desc: 'Approve pilot scope and resources', eta: '4 weeks' },
          { id: 'p3', who: 'Communications', desc: 'Prepare community brief and reporting channels', eta: '1 week' },
        ],
      },
    ];
  }, []);

  // Sentiment pill (RAG) helper
  function SentimentPill({ sentiments }) {
    const { positive = 0, neutral = 0, negative = 0 } = sentiments || {};
    const total = Math.max(positive + neutral + negative, 1);
    const positivePct = Math.round((positive / total) * 100);
    const score = positivePct; // 0-100
    let bg = 'bg-amber-300 text-amber-900';
    let label = `Mixed (${positivePct}%)`;
    if (score >= 60) {
      bg = 'bg-emerald-200 text-emerald-800';
      label = `Positive (${positivePct}%)`;
    } else if (score < 40) {
      bg = 'bg-red-200 text-red-800';
      label = `Negative (${positivePct}%)`;
    }
    return (
      <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${bg}`}>
        <span className="w-2 h-2 rounded-full" style={{ background: score >= 60 ? '#16a34a' : score < 40 ? '#dc2626' : '#f59e0b' }} />
        <span>{label}</span>
      </div>
    );
  }

  // Save an action execution entry to localStorage (audit trail)
  function recordActionExecution(entry) {
    if (typeof window === 'undefined') return;
    try {
      const key = 'communityLink_actionAudit';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.unshift(entry);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (e) {
      // ignore storage errors
    }
  }

  // Project card component for the Action Plan
  function ProjectCard({ proj }) {
    const [open, setOpen] = React.useState(false);
    const [executing, setExecuting] = React.useState(false);

    async function handleExecute() {
      setExecuting(true);
      const entry = {
        id: `${proj.id}-${Date.now()}`,
        projectId: proj.id,
        title: proj.title,
        timestamp: new Date().toISOString(),
        plan: proj.suggestedSteps,
        status: 'executed',
      };
      // fake slight delay to mimic async task
      await new Promise((r) => setTimeout(r, 600));
      recordActionExecution(entry);
      setExecuting(false);
      // simple UI feedback
      setOpen(false);
      alert(`Action executed and recorded for "${proj.title}"`);
    }

    return (
      <Card className="flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h4 className="font-semibold text-neutral-900">{proj.title}</h4>
              <SentimentPill sentiments={proj.sentiments} />
            </div>
            <div className="text-sm text-neutral-600 mt-2">{proj.description}</div>
            <div className="text-xs text-neutral-500 mt-2">Status: <span className="font-medium">{proj.status}</span></div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button onClick={() => setOpen((s) => !s)} className="rounded-md border px-3 py-1 text-sm">{open ? 'Hide Plan' : 'Preview Plan'}</button>
            <button onClick={handleExecute} disabled={executing} className="rounded-md bg-blue-600 text-white px-3 py-1 text-sm disabled:opacity-60">
              {executing ? 'Executing…' : 'Execute Plan'}
            </button>
          </div>
        </div>

        {open && (
          <div className="mt-3 border-t pt-3">
            <div className="text-sm font-medium mb-2">Agentic AI Action Plan</div>
            <ol className="list-decimal list-inside text-sm space-y-2">
              {proj.suggestedSteps.map((s) => (
                <li key={s.id} className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{s.desc}</div>
                    <div className="text-xs text-neutral-500">Owner: {s.who} • ETA: {s.eta}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Card>
    );
  }

  // Read recent executions for a small audit preview
  const recentExecutions = React.useMemo(() => {
    if (typeof window === 'undefined') return [];
    try {
      const key = 'communityLink_actionAudit';
      const all = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(all) ? all.slice(0, 5) : [];
    } catch (e) {
      return [];
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-neutral-50 p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Council Admin Dashboard</h1>
          <div className="text-sm text-neutral-600">Overview of community engagement and actions</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-lg md:text-xl font-semibold text-neutral-800">{councilName}</div>
          <button onClick={handleSignOut} className="rounded-lg border border-neutral-300 px-3 py-1 hover:bg-neutral-50">Sign out</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center">
              <CardTitle>Engagement Snapshot</CardTitle>
              <InfoTooltip text="Data source: anonymised participation events (surveys, petitions, service requests). Calculation: unique engaged residents / total residents * 100." />
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold">62%</div>
              <div className="text-sm text-neutral-500">+12% from last year</div>
              <div className="text-sm text-neutral-500 italic mt-2">Percentage of residents actively engaging in council initiatives</div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center">
              <CardTitle>Belonging & Trust Score</CardTitle>
              <InfoTooltip text="Data source: periodic community sentiment surveys. Calculation: composite index from pride, fairness, and confidence responses (0-100)." />
            </div>
            <div className="mt-3">
              <div className="text-3xl font-bold">78 / 100</div>
              <div className="text-sm text-neutral-500">Stable vs last quarter</div>
              <div className="text-sm text-neutral-500 italic mt-2">Measure of pride, fairness, and confidence in governance</div>
            </div>
          </Card>
          
        </div>

        <div>
          <div className="flex gap-2 mb-4">
            <button
              className={`rounded-md px-3 py-1 ${tab === "participation" ? "bg-blue-600 text-white" : "border"}`}
              onClick={() => setTab("participation")}
            >
              Participation
            </button>
            <button
              className={`rounded-md px-3 py-1 ${tab === "feedback" ? "bg-blue-600 text-white" : "border"}`}
              onClick={() => setTab("feedback")}
            >
              Feedback & Dialogue
            </button>
            <button
              className={`rounded-md px-3 py-1 ${tab === "action" ? "bg-blue-600 text-white" : "border"}`}
              onClick={() => setTab("action")}
            >
              Action Plan
            </button>
          </div>

          {tab === "participation" && (
            <Card>
              <CardTitle>Community Participation Over Time</CardTitle>
              <div className="mt-3">
                {/* Line chart: X axis = Participation Index (0-100), Y axis = Month (categorical) */}
                {(() => {
                  const maxV = Math.max(...participation.map((p) => p.v), 100);
                  // Swap axes: months -> X axis, participation index -> Y axis
                  const svgHeight = Math.max(240, 320); // fixed-ish height for vertical index
                  const svgWidth = Math.max(520, Math.min(1000, participation.length * 84));
                  const padding = { left: 60, right: 40, top: 24, bottom: 48 };
                  const usableWidth = svgWidth - padding.left - padding.right;
                  const usableHeight = svgHeight - padding.top - padding.bottom;
                  const xStep = participation.length > 1 ? usableWidth / (participation.length - 1) : usableWidth;
                  const points = participation.map((p, i) => {
                    const x = padding.left + i * xStep;
                    // map value v (0..maxV) to Y (top = high value)
                    const y = padding.top + (1 - p.v / maxV) * usableHeight;
                    return { x, y, month: p.month, v: p.v };
                  });

                  const polyPoints = points.map((pt) => `${pt.x},${pt.y}`).join(" ");

                  return (
                    <div className="overflow-x-auto">
                      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height={svgHeight} className="rounded-md bg-white">
                        <defs>
                          <linearGradient id="gradStroke" x1="0%" x2="100%">
                            <stop offset="0%" stopColor="#06B6D4" />
                            <stop offset="100%" stopColor="#2563EB" />
                          </linearGradient>
                        </defs>
                        {/* Y axis ticks and labels (0..100) on left with horizontal grid lines */}
                        <g className="text-sm text-neutral-500">
                          {[0, 25, 50, 75, 100].map((tick) => {
                            const ty = padding.top + (1 - tick / maxV) * usableHeight;
                            return (
                              <g key={tick}>
                                <line x1={padding.left - 8} y1={ty} x2={svgWidth - padding.right} y2={ty} stroke="#F1F5F9" />
                                <text x={padding.left - 12} y={ty + 4} textAnchor="end" fill="#475569" fontSize="11">{tick}</text>
                              </g>
                            );
                          })}
                          <text x={12} y={padding.top - 6} textAnchor="start" fill="#94A3B8" fontSize="11">Participation Index</text>
                        </g>

                        {/* vertical month grid lines and month labels along X axis */}
                        <g>
                          {points.map((pt, i) => (
                            <g key={pt.month}>
                              <line x1={pt.x} y1={padding.top} x2={pt.x} y2={svgHeight - padding.bottom + 4} stroke="#FBFCFE" />
                              <text x={pt.x} y={svgHeight - padding.bottom + 20} textAnchor="middle" fill="#334155" fontSize="12">{pt.month}</text>
                            </g>
                          ))}
                        </g>

                        {/* polyline path with gradient stroke */}
                        <polyline points={polyPoints} fill="none" stroke="url(#gradStroke)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

                        {/* point markers and values with hover behaviour */}
                        <g>
                          {points.map((pt) => (
                            <g
                              key={`pt-${pt.month}`}
                              onMouseEnter={() => setHover(pt)}
                              onMouseLeave={() => setHover(null)}
                              onFocus={() => setHover(pt)}
                              onBlur={() => setHover(null)}
                              tabIndex={0}
                              role="button"
                            >
                              <circle cx={pt.x} cy={pt.y} r={6} fill="#fff" stroke="#06B6D4" strokeWidth={2.5} />
                              <circle cx={pt.x} cy={pt.y} r={3.2} fill="#2563EB" />
                              <text x={pt.x + 10} y={pt.y + 4} fill="#0F172A" fontSize="11">{pt.v}</text>
                            </g>
                          ))}
                        </g>

                        {/* tooltip overlay (render last so it sits above markers) */}
                        {hover && (
                          <g>
                            <rect x={hover.x + 12} y={hover.y - 20} width={92} height={36} rx={6} fill="#0F172A" opacity={0.95} />
                            <text x={hover.x + 20} y={hover.y - 2} fill="#fff" fontSize="12">{hover.month}</text>
                            <text x={hover.x + 20} y={hover.y + 12} fill="#fff" fontSize="11">Index: {hover.v}</text>
                          </g>
                        )}
                      </svg>
                    </div>
                  );
                })()}
              </div>
            </Card>
          )}

          {tab === "feedback" && (
            <div className="grid gap-3">
              <Card>
                <CardTitle>Community Feedback Hub</CardTitle>
                <div className="mt-2 text-sm text-neutral-600">Overview of sentiment across recent community projects</div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {feedbackProjects.map((proj) => {
                  const { positive, neutral, negative } = proj.sentiments;
                  const total = positive + neutral + negative || 1;
                  const overall = positive >= negative ? (positive >= 60 ? 'Positive' : 'Mixed') : 'Negative';
                  return (
                    <Card key={proj.id} className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{proj.title}</div>
                          <div className="text-xs text-neutral-500">{overall} • {total} responses</div>
                        </div>
                        <div className="text-sm font-semibold text-neutral-700">{overall}</div>
                      </div>

                      <div className="mt-3">
                        <div className="w-full h-4 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-4 bg-emerald-400" style={{ width: `${(positive / total) * 100}%` }} />
                          <div className="h-4 bg-yellow-300" style={{ width: `${(neutral / total) * 100}%`, marginLeft: `-${(neutral / total) * 100}%` }} />
                          <div className="h-4 bg-red-400" style={{ width: `${(negative / total) * 100}%`, marginLeft: `-${(negative / total) * 100}%` }} />
                        </div>

                        <div className="flex items-center gap-3 mt-2 text-xs text-neutral-600">
                          <div className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full" /> {positive}%</div>
                          <div className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-300 rounded-full" /> {neutral}%</div>
                          <div className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full" /> {negative}%</div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "action" && (
            <div className="grid gap-3">
              <Card>
                <CardTitle>Community Action Plan</CardTitle>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {actionProjects.map((p) => (
                    <ProjectCard key={p.id} proj={p} />
                  ))}
                </div>
              </Card>

              <Card>
                <CardTitle>Recent Executions</CardTitle>
                <div className="mt-3 text-sm text-neutral-600">
                  {recentExecutions.length === 0 ? (
                    <div>No recent executions recorded.</div>
                  ) : (
                    <ul className="list-disc ml-4">
                      {recentExecutions.map((e) => (
                        <li key={e.id} className="text-xs">
                          <div className="font-medium">{e.title}</div>
                          <div className="text-neutral-500">{new Date(e.timestamp).toLocaleString()}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Card>
            </div>
          )}

          
        </div>
      </main>
    </div>
  );
}
