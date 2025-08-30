
import React from "react";

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
      age: { '18-25': 30, '26-40': 50, '41-60': 30, '60+': 10 },
      sex: { Male: 60, Female: 60 },
      ethnicity: { Multicultural: 80, Other: 40 }
    }
  },
  {
    id: 'proj-2',
    title: 'New Library Construction',
    demographics: {
      age: { '18-25': 10, '26-40': 40, '41-60': 30, '60+': 20 },
      sex: { Male: 45, Female: 55 },
      ethnicity: { Multicultural: 50, Other: 50 }
    }
  }
];

const mockIdeas = [
  {
    id: 'idea-1',
    title: 'Community Garden',
    demographics: {
      age: { '18-25': 12, '26-40': 20, '41-60': 10, '60+': 8 },
      sex: { Male: 25, Female: 25 },
      ethnicity: { Multicultural: 30, Other: 20 }
    }
  },
  {
    id: 'idea-2',
    title: 'Road Safety Initiative',
    demographics: {
      age: { '18-25': 8, '26-40': 30, '41-60': 20, '60+': 12 },
      sex: { Male: 35, Female: 35 },
      ethnicity: { Multicultural: 40, Other: 30 }
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
  return (
    <div className="min-h-screen w-full bg-neutral-50 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Council Area Participation Overview</h1>

          {/* Participation Tiles */}
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ParticipationTile
              title="Council Project Participation"
              mode="project"
            />

            <ParticipationTile
              title="Community Ideas Participation"
              mode="idea"
            />
          </div>

      {/* Action Plans */}
      <div className="w-full max-w-3xl bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Council Action Plans</h2>
        <ul className="space-y-4">
          {participationData.map((row) => (
            <li key={row.area} className="border-l-4 border-blue-600 pl-4">
              <span className="font-semibold text-blue-700">{row.area}:</span> {getActionPlan(row)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ParticipationTile({ title, mode = 'project' }) {
  const [breakdown, setBreakdown] = React.useState('age');
  const items = mode === 'project' ? mockProjects : mockIdeas;
  const [selectedId, setSelectedId] = React.useState(items[0]?.id || null);
  const current = items.find((i) => i.id === selectedId) || items[0] || { demographics: {} };

  const totalVotes = Object.values(current.demographics?.age || {}).reduce((s, v) => s + v, 0);

  function breakdownEntries(field) {
    if (!current.demographics) return [];
    if (field === 'age') return Object.entries(current.demographics.age || {});
    if (field === 'sex') return Object.entries(current.demographics.sex || {});
    if (field === 'ethnicity') return Object.entries(current.demographics.ethnicity || {});
    return [];
  }

  const raw = breakdownEntries(breakdown);
  const breakdownData = raw.sort((a, b) => b[1] - a[1]);
  const maxVal = breakdownData.length ? Math.max(...breakdownData.map(([, v]) => v)) : 1;

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
        {breakdownData.map(([label, value]) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-36 text-sm text-neutral-700">{label}</div>
            <div className="flex-1 bg-neutral-100 rounded-full h-4 overflow-hidden">
              <div className="h-4 bg-blue-600" style={{ width: `${(value / maxVal) * 100}%` }} />
            </div>
            <div className="w-12 text-right text-sm font-semibold">{value}</div>
          </div>
        ))}
        {breakdownData.length === 0 && <div className="text-sm text-neutral-500">No data</div>}
      </div>
    </div>
  );
}
