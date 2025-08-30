import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const preferencesList = [
  {
    category: "Belonging",
    focus: "identity, pride, community ties",
    options: [
      "🏞️ Cultural & Heritage Events (e.g., multicultural festivals, history walks)",
      "🎉 Community Celebrations (e.g., Australia Day, Lunar New Year, NAIDOC Week)",
      "🏠 Neighbourhood Gatherings (e.g., street BBQs, park meetups)",
      "🎭 Arts & Storytelling (e.g., local theatre, oral history nights)"
    ]
  },
  {
    category: "Worth",
    focus: "wellbeing, life satisfaction, feeling valued",
    options: [
      "🧘 Health & Wellbeing (e.g., yoga in the park, mental health workshops)",
      "🌱 Skill-Building (e.g., coding bootcamps, language classes, craft workshops)",
      "🎓 Education & Learning (e.g., public lectures, library talks)",
      "💼 Career & Volunteering Fairs (e.g., job expos, volunteer networking)"
    ]
  },
  {
    category: "Social Justice & Equity",
    focus: "fairness, equality, advocacy",
    options: [
      "🤝 Diversity & Inclusion Forums (e.g., disability inclusion training, LGBTQ+ rights talks)",
      "⚖️ Advocacy Workshops (e.g., housing rights, legal aid sessions)",
      "🌍 Equity & Sustainability Events (e.g., affordable housing forums, climate justice rallies)",
      "🏫 Support Services Info Sessions (e.g., Centrelink help, migrant services)"
    ]
  },
  {
    category: "Political Participation",
    focus: "civic engagement, democracy, involvement",
    options: [
      "🗳️ Council Consultations (e.g., town halls, public hearings, planning forums)",
      "📝 Petition/Advocacy Training (how to influence policy)",
      "🌐 Civic Hackathons (digital democracy events, policy innovation labs)",
      "📣 Community Leadership Programs (youth council, leadership training)"
    ]
  },
  {
    category: "Acceptance of Diversity",
    focus: "multiculturalism, tolerance, anti-discrimination",
    options: [
      "🍲 Multicultural Food Festivals (e.g., Taste of Nations, Harmony Day)",
      "🕌 Faith & Intercultural Dialogues (mosque/church/synagogue open days)",
      "👫 Refugee & Migrant Welcome Events (welcome dinners, settlement fairs)",
      "🎶 World Music & Dance Events (celebrations of cultural diversity)"
    ]
  }
];

export default function Onboarding() {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  function togglePreference(pref) {
    setSelected(selected =>
      selected.includes(pref)
        ? selected.filter(p => p !== pref)
        : [...selected, pref]
    );
  }

  function handleSave() {
    // Save preferences to localStorage or backend as needed
    localStorage.setItem("communityLink_preferences", JSON.stringify(selected));
    navigate("/"); // Go to dashboard (App.jsx)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-4 text-neutral-900 text-center">Select Your Community Preferences</h1>
        <form className="space-y-6">
          {preferencesList.map(cat => (
            <div key={cat.category}>
              <div className="font-semibold text-lg text-neutral-800 mb-1">{cat.category}</div>
              <div className="text-sm text-neutral-500 mb-2">Focus: {cat.focus}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                {cat.options.map(opt => (
                  <label key={opt} className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition ${selected.includes(opt) ? 'bg-blue-50 border-blue-600' : 'bg-white border-neutral-300 hover:bg-blue-50'}`}>
                    <input
                      type="checkbox"
                      checked={selected.includes(opt)}
                      onChange={() => togglePreference(opt)}
                      className="accent-blue-600"
                    />
                    <span className="text-base text-neutral-900">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </form>
        <button
          className="mt-6 w-full rounded-lg bg-blue-600 text-white text-base px-4 py-2 font-medium hover:brightness-110 active:translate-y-[1px]"
          onClick={handleSave}
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
