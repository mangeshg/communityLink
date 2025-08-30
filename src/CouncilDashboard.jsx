
import React from "react";
import { useNavigate } from "react-router-dom";

const participationData = [
  {
    area: "Central Park",
    votes: 120,
    ideas: 8,
    campaigns: 2,
    culture: "Multicultural",
    age: "All",
    sex: "All"
  },
  {
    area: "Northside",
    votes: 80,
    ideas: 3,
    campaigns: 1,
    culture: "Youth",
    age: "18-25",
    sex: "Mixed"
  },
  {
    area: "East End",
    votes: 45,
    ideas: 1,
    campaigns: 0,
    culture: "Seniors",
    age: "60+",
    sex: "Female"
  }
];

// Mock per-project and per-idea datasets with demographic breakdowns
const mockProjects = [
  {
    id: 'proj-1',
    title: 'Central Park Upgrade',
    demographics: {
      age: {
        '18-25': { support: 18, neutral: 8, oppose: 4 },
        '26-40': { support: 30, neutral: 12, oppose: 8 },
        '41-60': { support: 18, neutral: 8, oppose: 4 },
        '60+':   { support: 6, neutral: 3, oppose: 1 }
      },
      sex: { Male: { support: 35, neutral: 15, oppose: 10 }, Female: { support: 37, neutral: 13, oppose: 10 } },
      ethnicity: { Multicultural: { support: 50, neutral: 20, oppose: 10 }, Other: { support: 22, neutral: 8, oppose: 4 } }
    }
  },
  {
    id: 'proj-2',
    title: 'New Library Construction',
    demographics: {
      age: {
        '18-25': { support: 4, neutral: 4, oppose: 2 },
        '26-40': { support: 24, neutral: 10, oppose: 6 },
        '41-60': { support: 18, neutral: 8, oppose: 4 },
        '60+':   { support: 12, neutral: 6, oppose: 2 }
      },
      sex: { Male: { support: 22, neutral: 13, oppose: 10 }, Female: { support: 28, neutral: 13, oppose: 10 } },
      ethnicity: { Multicultural: { support: 30, neutral: 10, oppose: 10 }, Other: { support: 20, neutral: 16, oppose: 10 } }
    }
  }
];

const mockIdeas = [
  {
    id: 'idea-1',
    title: 'Community Garden',
    demographics: {
      age: { '18-25': { support: 6, neutral: 4, oppose: 2 }, '26-40': { support: 12, neutral: 6, oppose: 2 }, '41-60': { support: 6, neutral: 3, oppose: 1 }, '60+': { support: 4, neutral: 3, oppose: 1 } },
      sex: { Male: { support: 12, neutral: 6, oppose: 7 }, Female: { support: 13, neutral: 7, oppose: 5 } },
      ethnicity: { Multicultural: { support: 20, neutral: 8, oppose: 2 }, Other: { support: 6, neutral: 4, oppose: 2 } }
    }
  },
  {
    id: 'idea-2',
    title: 'Road Safety Initiative',
    demographics: {
      age: { '18-25': { support: 3, neutral: 3, oppose: 2 }, '26-40': { support: 18, neutral: 8, oppose: 4 }, '41-60': { support: 12, neutral: 6, oppose: 2 }, '60+': { support: 6, neutral: 4, oppose: 2 } },
      sex: { Male: { support: 18, neutral: 10, oppose: 7 }, Female: { support: 17, neutral: 9, oppose: 6 } },
      ethnicity: { Multicultural: { support: 25, neutral: 10, oppose: 5 }, Other: { support: 10, neutral: 6, oppose: 3 } }
    }
  }
];

function getActionPlan(row) {
  if (row.culture === "Multicultural") {
    return "Launch a multicultural festival and sports day to engage all age groups.";
  }
  if (row.culture === "Youth") {
    return "Create coding bootcamps and music events for youth participation.";
  }
  if (row.culture === "Seniors" && row.sex === "Female") {
    return "Organize wellness workshops and art classes for senior women.";
  }
  return "Increase outreach and awareness campaigns tailored to local demographics.";
}

export default function CouncilDashboard() {
  // Debug log to help confirm component is mounted
  if (typeof window !== 'undefined') console.log('CouncilDashboard mounted');
  const navigate = useNavigate();
  function handleSignOut() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('communityLink_signedIn');
    }
    navigate('/');
  }
  return (
    <div className="min-h-screen w-full bg-neutral-50 flex flex-col items-center p-4 md:p-6">
      <header className="w-full max-w-6xl flex items-center justify-between mb-6 px-4 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold">Council Area Participation Overview</h1>
        <div>
          <button onClick={handleSignOut} className="rounded-lg border border-neutral-300 px-3 py-1 hover:bg-neutral-50">Sign out</button>
        </div>
      </header>

      {/* Participation Tiles */}
      <div className="w-full max-w-6xl px-4 md:px-0 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ParticipationTile
          title="Council Project Participation"
          mode="project"
        />

        <ParticipationTile
          title="Community Ideas Participation"
          mode="idea"
        />
      </div>

      {/* removed separate Action Plans - now shown inside project tile */}
    </div>
  );
}

function ParticipationTile({ title, mode = 'project' }) {
  const [breakdown, setBreakdown] = React.useState('age');
  const items = mode === 'project' ? mockProjects : mockIdeas;
  const [selectedId, setSelectedId] = React.useState(items[0]?.id || null);
  const current = items.find((i) => i.id === selectedId) || items[0] || { demographics: {} };

  function sumDemographicTotals(demo) {
    if (!demo) return 0;
    // prefer age, then sex, then ethnicity (any present breakdown will give a total)
    const fields = ['age', 'sex', 'ethnicity'];
    for (const f of fields) {
      const obj = demo[f];
      if (obj && typeof obj === 'object') {
        return Object.values(obj).reduce((s, v) => {
          if (typeof v === 'number') return s + v; // backward-compat numeric bucket
          return s + (v.support || 0) + (v.neutral || 0) + (v.oppose || 0);
        }, 0);
      }
    }
    return 0;
  }

  const totalVotes = sumDemographicTotals(current.demographics);

  function deriveProjectRowFromDemographics(demo) {
    // Build a small row object compatible with getActionPlan
    const row = { culture: 'Multicultural', age: 'All', sex: 'All' };
    if (!demo) return row;

    // Determine dominant age bucket
    if (demo.age && typeof demo.age === 'object') {
      const ageEntries = Object.entries(demo.age).map(([k, v]) => [k, (typeof v === 'number' ? v : (v.support || 0) + (v.neutral || 0) + (v.oppose || 0))]);
      ageEntries.sort((a, b) => b[1] - a[1]);
      if (ageEntries.length) row.age = ageEntries[0][0];
    }

    // Determine dominant sex bucket
    if (demo.sex && typeof demo.sex === 'object') {
      const sexEntries = Object.entries(demo.sex).map(([k, v]) => [k, (typeof v === 'number' ? v : (v.support || 0) + (v.neutral || 0) + (v.oppose || 0))]);
      sexEntries.sort((a, b) => b[1] - a[1]);
      if (sexEntries.length) row.sex = sexEntries[0][0];
    }

    // Determine culture: prefer ethnicity majority if present, else fallback to age heuristic
    if (demo.ethnicity && typeof demo.ethnicity === 'object') {
      const ethEntries = Object.entries(demo.ethnicity).map(([k, v]) => [k, (typeof v === 'number' ? v : (v.support || 0) + (v.neutral || 0) + (v.oppose || 0))]);
      ethEntries.sort((a, b) => b[1] - a[1]);
      if (ethEntries.length) {
        const topKey = ethEntries[0][0];
        if (topKey.toLowerCase().includes('multicultural')) row.culture = 'Multicultural';
        else if (topKey.toLowerCase().includes('youth')) row.culture = 'Youth';
        else if (topKey.toLowerCase().includes('senior')) row.culture = 'Seniors';
        else row.culture = 'Multicultural';
      }
    } else {
      try {
        if (typeof row.age === 'string') {
          if (row.age.includes('18') || row.age.includes('26') || row.age.includes('40')) row.culture = 'Youth';
          else if (row.age.includes('60')) row.culture = 'Seniors';
          else row.culture = 'Multicultural';
        }
      } catch (e) {}
    }

    return row;
  }

  // Recompute action plan when selected changes
  const projectActionPlan = React.useMemo(() => {
    if (mode !== 'project') return null;
    return getActionPlan(deriveProjectRowFromDemographics(current.demographics));
  }, [selectedId, mode, current?.demographics ? JSON.stringify(current.demographics) : null]);

  function breakdownEntries(field) {
    if (!current.demographics) return [];
    if (field === 'age') return Object.entries(current.demographics.age || {});
    if (field === 'sex') return Object.entries(current.demographics.sex || {});
    if (field === 'ethnicity') return Object.entries(current.demographics.ethnicity || {});
    return [];
  }

  const raw = breakdownEntries(breakdown);
  // raw entries are [label, {support, neutral, oppose}]
  const breakdownData = raw.sort((a, b) => (b[1].support + b[1].neutral + b[1].oppose) - (a[1].support + a[1].neutral + a[1].oppose));
  const maxVal = breakdownData.length ? Math.max(...breakdownData.map(([, v]) => v.support + v.neutral + v.oppose)) : 1;

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="text-sm text-neutral-600">Selected: <span className="font-bold text-neutral-900">{current.title}</span></div>
          <div className="text-sm text-neutral-600">Total votes: <span className="font-bold text-neutral-900">{totalVotes}</span></div>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className="rounded-md border px-2 py-1 text-sm">
            {items.map((it) => (
              <option key={it.id} value={it.id}>{it.title}</option>
            ))}
          </select>
          <label className="text-xs text-neutral-600 mr-2">Breakdown</label>
          <select value={breakdown} onChange={(e) => setBreakdown(e.target.value)} className="rounded-md border px-2 py-1 text-sm">
            <option value="age">Age</option>
            <option value="sex">Sex</option>
            <option value="ethnicity">Ethnic Background</option>
          </select>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {breakdownData.map(([label, val]) => {
          const total = val.support + val.neutral + val.oppose;
          return (
            <div key={label} className="flex items-center gap-3">
              <div className="w-36 text-sm text-neutral-700">{label}</div>
              <div className="flex-1 bg-neutral-100 rounded-full h-4 overflow-hidden flex">
                <div className="h-4 bg-green-500" style={{ width: `${(val.support / maxVal) * 100}%` }} />
                <div className="h-4 bg-yellow-400" style={{ width: `${(val.neutral / maxVal) * 100}%` }} />
                <div className="h-4 bg-red-500" style={{ width: `${(val.oppose / maxVal) * 100}%` }} />
              </div>
              <div className="w-20 text-right text-sm font-semibold">{total}</div>
            </div>
          );
        })}
        {breakdownData.length === 0 && <div className="text-sm text-neutral-500">No data</div>}
      </div>
      {/* Project-specific action plan when viewing projects */}
      {mode === 'project' && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
          <div className="text-sm text-neutral-600">Action Plan (based on selected project demographics):</div>
          <div className="mt-2 text-sm font-medium text-blue-800">
            {projectActionPlan}
          </div>
        </div>
      )}
    </div>
  );
}
