import React, { useState } from "react";
import CouncilLogin from "./CouncilLogin.jsx";
import CouncilDashboard from "./CouncilDashboard.jsx";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";

/**
 * CommunityLink demo app
 * - Mobile + desktop responsive
 * - No real auth: clicking the myGovID button or submitting email shows the dashboard
 * - TailwindCSS for styling
 */
export default function App() {
  const [email, setEmail] = useState("");
  const [signedIn, setSignedIn] = useState(() => {
    // Check localStorage for login state
    if (typeof window !== "undefined") {
      return localStorage.getItem("communityLink_signedIn") === "true";
    }
    return false;
  });
  const [onboarded, setOnboarded] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("communityLink_onboarded") === "true";
    }
    return false;
  });

  function startMyGovIdFlow() {
    setSignedIn(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("communityLink_signedIn", "true");
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return alert("Please enter your email");
    setSignedIn(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("communityLink_signedIn", "true");
    }
  }

  // Listen for onboarding completion
  React.useEffect(() => {
    function handleOnboarded() {
      setOnboarded(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("communityLink_onboarded", "true");
      }
    }
    window.handleOnboarded = handleOnboarded;
    return () => { delete window.handleOnboarded; };
  }, []);

  return (
    <div className="min-h-screen w-full bg-neutral-50">
      <Routes>
        <Route
          path="/"
          element={signedIn ? (
            onboarded ? <Dashboard onSignOut={() => setSignedIn(false)} /> : <OnboardingWrapper />
          ) : (
            <SignIn
              email={email}
              setEmail={setEmail}
              onSubmit={onSubmit}
              startMyGovIdFlow={startMyGovIdFlow}
            />
          )}
        />
  <Route path="/council-login" element={<CouncilLogin />} />
  <Route path="/council-dashboard" element={<CouncilDashboard />} />
  <Route path="/preferences" element={<Onboarding />} />
  <Route path="/onboarding" element={<OnboardingFlow />} />
  <Route path="/submit-idea" element={<SubmitIdeaBot />} />
  {/* Fallback: redirect unknown routes to root */}
  <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function OnboardingWrapper() {
  // Wrap Onboarding and intercept save
  return <OnboardingWithSave />;
}

import Onboarding from "./Onboarding.jsx";
function OnboardingWithSave() {
  // Intercept save to set onboarded state
  return <OnboardingWithCallback onSave={() => window.handleOnboarded()} />;
}

function OnboardingWithCallback({ onSave }) {
  // ...existing code from Onboarding.jsx...
  // Copy-paste the Onboarding component, but call onSave() instead of navigate on save
  const [selected, setSelected] = useState([]);

  function togglePreference(pref) {
    setSelected(selected =>
      selected.includes(pref)
        ? selected.filter(p => p !== pref)
        : [...selected, pref]
    );
  }

  function handleSave() {
    localStorage.setItem("communityLink_preferences", JSON.stringify(selected));
    if (onSave) onSave();
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

/* --------------------------- SIGN-IN VIEW --------------------------- */
function SignIn({ email, setEmail, onSubmit, startMyGovIdFlow }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative">
      {/* Council Login Button - top right */}
      <button
        className="absolute top-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition font-semibold z-10"
        onClick={() => navigate('/council-login')}
      >
        Council Login
      </button>
      <div className="w-full max-w-sm bg-white shadow-sm rounded-2xl p-6 md:p-8">
        {/* myGovID button */}
        <button
          type="button"
          onClick={startMyGovIdFlow}
          className="mt-6 w-full inline-flex items-center justify-center gap-3 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base font-medium text-neutral-800 hover:border-neutral-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-800/20 active:scale-[.99]"
          aria-label="Sign in with myGovID"
        >
          <MyGovIdBadge className="h-7 w-7" />
          <span>Sign in with myGovID</span>
        </button>

        {/* OR separator */}
        <div className="mt-4 text-center text-neutral-500">or</div>

        {/* Email field */}
        <form onSubmit={onSubmit} className="mt-3">
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 shadow-xs focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-800/20"
          />
          {/* Hidden submit so Enter works */}
          <button type="submit" className="sr-only">Continue</button>
        </form>

        {/* Tagline */}
        <p className="mt-8 text-center text-sm leading-5 text-neutral-500">
          Connecting communities for a
          <br /> stronger future
        </p>
      </div>
    </div>
  );
}

/* -------------------------- DASHBOARD VIEW -------------------------- */
function Dashboard({ onSignOut }) {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [councilName, setCouncilName] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('communityLink_council') || '';
    return '';
  });

  React.useEffect(() => {
    function handleStorage(e) {
      if (e.key === 'communityLink_council') setCouncilName(e.newValue || '');
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Event details (mock data)
  const eventDetails = {
    "Community BBQ": {
      title: "Community BBQ",
      date: "Sat, 14 Sep",
      time: "12:00pm - 3:00pm",
      location: "Central Park Pavilion",
      description: "Join us for a free BBQ with live music, games for kids, and a chance to meet your neighbors! Vegetarian options available.",
      organizer: "Local Council",
      contact: "events@communitylink.org"
    },
    "Cultural Festival": {
      title: "Cultural Festival",
      date: "Sun, 22 Sep",
      time: "10:00am - 5:00pm",
      location: "Main Street Plaza",
      description: "Celebrate our diverse community with food stalls, performances, art displays, and workshops from around the world.",
      organizer: "Multicultural Committee",
      contact: "culture@communitylink.org"
    },
    "Youth Coding Workshop": {
      title: "Youth Coding Workshop",
      date: "Wed, 25 Sep",
      time: "4:00pm - 6:00pm",
      location: "Library Tech Lab",
      description: "A hands-on coding workshop for ages 10-18. Learn the basics of web development and build your first website!",
      organizer: "Tech4Youth",
      contact: "coding@communitylink.org"
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 md:py-8">
      {/* Header */}
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CommunityLinkMark className="h-7 w-7" />
          <div>
            <h1 className="text-lg md:text-xl font-semibold tracking-tight text-neutral-800">CommunityLink</h1>
            {councilName ? (
              <div className="text-sm text-neutral-500">{councilName}</div>
            ) : (
              <div className="text-sm text-neutral-400">No council selected</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-neutral-600">
          <span className="hidden sm:inline">Welcome, Verified via myGovID</span>
          <MyGovIdBadge className="h-6 w-6 shrink-0" />
          <div className="flex items-center gap-2">
            <PreferencesButton />
            <button onClick={onSignOut} className="ml-1 rounded-lg border border-neutral-300 px-2 py-1 hover:bg-neutral-50">Sign out</button>
          </div>
        </div>
      </header>

      {/* Content Grid */}
      <main className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {/* Local Events */}
        <Card>
          <CardTitle>Local Events</CardTitle>
          <div className="mb-2">
            <span className="relative group inline-block">
              <span className="text-xs text-neutral-500 cursor-help underline decoration-dotted">Events shown are based on your selected preferences</span>
              <span className="absolute left-0 mt-1 w-64 bg-neutral-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                These events are personalized for you. Update your preferences in your profile to see more relevant events.
              </span>
            </span>
          </div>
          {!selectedEvent ? (
            <ul className="mt-3 space-y-3">
              <EventItem title="Community BBQ" date="Sat, 14 Sep" onClick={() => setSelectedEvent("Community BBQ")} />
              <EventItem title="Cultural Festival" date="Sun, 22 Sep" onClick={() => setSelectedEvent("Cultural Festival")} />
              <EventItem title="Youth Coding Workshop" date="Wed, 25 Sep" onClick={() => setSelectedEvent("Youth Coding Workshop")} />
            </ul>
          ) : (
            <EventDetails event={eventDetails[selectedEvent]} onBack={() => setSelectedEvent(null)} />
          )}
        </Card>

        {/* Community Project Ideas */}
        <Card>
          <CardTitle>Community Innovation Hub</CardTitle>
          <div className="mt-3 space-y-5">
            <Proposal title="Central Park Upgrade ($2M)" />
            <Proposal title="Community Garden ($50K)" />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="rounded-lg bg-blue-600 text-white text-sm px-4 py-2 hover:brightness-110 active:translate-y-[1px]"
              onClick={() => navigate("/submit-idea")}
            >
              + Submit My Idea
            </button>
          </div>
        </Card>

        {/* Council Projects */}
        <Card>
          <CardTitle>Your Voice in Council Projects</CardTitle>
          <div className="mt-3 space-y-5">
            <Proposal title="New Library Construction ($5M)" showAuthor={false} />
            <Proposal title="Road Safety Initiative ($500K)" showAuthor={false} />
          </div>
        </Card>

        {/* Services Offered */}
        <Card>
          <CardTitle>Services Offered</CardTitle>
          <div className="mt-3 divide-y divide-neutral-200">
            <ServiceRow label="Waste Collection" action="Request" />
            <ServiceRow label="Parking Permit" action="Apply" />
            <ServiceRow label="Rates Payment" action="Pay Now" />
          </div>
        </Card>

        {/* Your Actions */}
        <Card>
          <CardTitle>Your Actions</CardTitle>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700">
            <li className="flex items-start gap-2"><span>✓</span><span>Voted on Centralpark Upgrade</span></li>
            <li className="flex items-start gap-2"><span>✓</span><span>Registered for Cultural Festival</span></li>
            <li className="flex items-start gap-2 opacity-80"><span>•</span><span>Apply for Parking Permit</span></li>
          </ul>
        </Card>
      </main>
    </div>
  );
}

/* -------------------------- SUBMIT IDEA BOT -------------------------- */
function SubmitIdeaBot() {
  const [idea, setIdea] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState([]);
  const [completed, setCompleted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    // MOCK Gemini API response for demo purposes
    setTimeout(() => {
      const mockReply = `{
        "title": "Upgrade Central Park",
        "summary_160_chars": "Upgrade the central park with new playground equipment, lighting, and seating for families and children.",
        "benefits": "• Safer play area • Improved lighting • More seating • Community engagement",
        "estimated_scope": "medium",
        "area": "Central Park",
        "tags": ["park", "upgrade", "community", "children"],
        "open_questions": ["What is the estimated budget?", "Which age groups will the playground target?"]
      }`;
      setSummary(mockReply);
      setHistory([...history, { role: "assistant", content: mockReply }]);
      setStep(step + 1);
      setLoading(false);
    }, 800);
  }

  function handleClarify() {
    setIdea("");
    setStep(step + 1);
  }

  function handleComplete() {
    setCompleted(true);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm p-6 md:p-8">
  <h1 className="text-2xl font-bold mb-4 text-neutral-900 text-center">Submit Your Idea</h1>
        {!summary && !completed && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-neutral-700">Describe your council project idea:</label>
            <textarea
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 shadow-xs focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-800/20"
              rows={4}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="E.g. Upgrade the central park with new playground equipment, lighting, and seating."
              required
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 text-white text-base px-4 py-2 font-medium hover:brightness-110 active:translate-y-[1px]"
              disabled={loading}
            >
              {loading ? "Generating summary..." : step === 0 ? "Generate Summary With AI" : "Refine Summary"}
            </button>
          </form>
        )}
        {summary && !completed && (
          <div className="mt-6">
            <div className="text-sm text-neutral-700 mb-2">AI-generated summary:</div>
            <div className="bg-neutral-100 rounded-lg p-3 text-neutral-900 mb-2 whitespace-pre-wrap text-left">
              {(() => {
                try {
                  const obj = JSON.parse(summary);
                  return (
                    <>
                      <div><span className="font-semibold">Title:</span> {obj.title}</div>
                      <div className="mt-2"><span className="font-semibold">Summary:</span> {obj.summary_160_chars}</div>
                      <div className="mt-2"><span className="font-semibold">Benefits:</span> {obj.benefits}</div>
                      <div className="mt-2"><span className="font-semibold">Estimated Scope:</span> {obj.estimated_scope}</div>
                      <div className="mt-2"><span className="font-semibold">Area:</span> {obj.area}</div>
                      <div className="mt-2"><span className="font-semibold">Tags:</span> {obj.tags?.join(", ")}</div>
                      <div className="mt-2"><span className="font-semibold">Open Questions:</span>
                        <ul className="list-disc ml-5">
                          {obj.open_questions?.map((q, i) => <li key={i}>{q}</li>)}
                        </ul>
                      </div>
                    </>
                  );
                } catch {
                  return summary;
                }
              })()}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                className="rounded-lg border border-neutral-300 text-neutral-700 text-sm px-3 py-1.5 hover:bg-neutral-50"
                onClick={handleClarify}
              >
                Clarify / Edit Idea
              </button>
              <button
                className="rounded-lg bg-green-600 text-white text-sm px-3 py-1.5 hover:brightness-110"
                onClick={handleComplete}
              >
                Complete Submission
              </button>
            </div>
          </div>
        )}
        {completed && (
          <div className="mt-6 text-center">
            <div className="text-green-700 font-bold mb-2">Your idea has been submitted!</div>
            <div className="bg-neutral-100 rounded-lg p-3 text-neutral-900 mb-2">Thank you for your submission. Your idea will be reviewed and made available for community voting soon.</div>
            <div className="flex flex-col items-center gap-3 mt-4">
              <button
                className="rounded-lg bg-blue-600 text-white text-sm px-4 py-2"
                onClick={() => { setIdea(""); setSummary(""); setCompleted(false); setStep(0); setHistory([]); }}
              >
                Submit Another Idea
              </button>
              <button
                className="rounded-lg bg-neutral-800 text-white text-sm px-4 py-2"
                onClick={() => {
                  setCompleted(false);
                  setSummary("");
                  setIdea("");
                  setStep(0);
                  setHistory([]);
                  // Set signedIn to true so dashboard is shown
                  if (typeof window !== "undefined") {
                    window.history.replaceState({}, '', '/');
                  }
                  if (typeof window !== "undefined" && window.location.pathname === '/') {
                    // If using state, you may need to trigger signedIn in parent
                    // For now, reload to show dashboard
                    window.location.reload();
                  }
                }}
              >
                Back to Main Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Pieces ------------------------------ */
function Card({ children }) {
  return (
    <section className="bg-white rounded-2xl border border-neutral-200 p-4 md:p-5 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
      {children}
    </section>
  );
}

function CardTitle({ children }) {
  return <h2 className="text-base md:text-lg font-semibold text-neutral-900">{children}</h2>;
}

function EventItem({ title, date, onClick }) {
  return (
    <li className="flex items-center justify-between cursor-pointer hover:bg-blue-50 rounded-xl px-2 py-2 transition" onClick={onClick}>
      <div className="text-neutral-900 font-medium text-lg">{title}</div>
      <div className="text-neutral-500 text-base">{date}</div>
    </li>
  );
}

function EventDetails({ event, onBack }) {
  return (
    <div className="p-2 animate-fade-in">
      <button className="mb-3 text-blue-600 hover:underline text-sm" onClick={onBack}>&larr; Back to Events</button>
      <div className="text-2xl font-bold text-neutral-900 mb-2">{event.title}</div>
      <div className="mb-1 text-neutral-700"><span className="font-semibold">Date:</span> {event.date}</div>
      <div className="mb-1 text-neutral-700"><span className="font-semibold">Time:</span> {event.time}</div>
      <div className="mb-1 text-neutral-700"><span className="font-semibold">Location:</span> {event.location}</div>
      <div className="mb-3 text-neutral-800"><span className="font-semibold">Description:</span> {event.description}</div>
      <div className="mb-1 text-neutral-700"><span className="font-semibold">Organizer:</span> {event.organizer}</div>
      <div className="mb-1 text-neutral-700"><span className="font-semibold">Contact:</span> <a href={`mailto:${event.contact}`} className="text-blue-600 hover:underline">{event.contact}</a></div>
    </div>
  );
}

function Proposal({ title, showAuthor = true }) {
  const [selected, setSelected] = useState(null);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // Vote counters
  const [supportCount, setSupportCount] = useState(0);
  const [neutralCount, setNeutralCount] = useState(0);
  const [opposeCount, setOpposeCount] = useState(0);

  function handleSelect(option) {
    setSelected(option);
    setShowComment(true);
  }

  function handleDone() {
    setSubmitted(true);
    // Increment vote counter
    if (selected === 'Support') setSupportCount(c => c + 1);
    if (selected === 'Neutral') setNeutralCount(c => c + 1);
    if (selected === 'Oppose') setOpposeCount(c => c + 1);
    setTimeout(() => {
      setShowComment(false);
      setComment("");
      setSelected(null);
      setSubmitted(false);
    }, 1200); // Hide after 1.2s
  }

  const totalVotes = supportCount + neutralCount + opposeCount;

  // determine a default author name when none provided
  const authors = ['Alex Johnson', 'Priya Singh', 'Jordan Lee', 'Samira Patel', 'Diego Ramirez'];
  const authorName = authors[title.length % authors.length];

  return (
    <div className="mb-6">
      <div className="mb-1 flex items-baseline justify-between">
        <div className="text-neutral-900 font-medium">{title}</div>
        {showAuthor && (
          <div className="text-sm italic text-neutral-500">Idea submitted by {authorName}</div>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold border transition-all duration-150 ${selected === 'Support' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-neutral-800 border-neutral-300 hover:bg-blue-50'}`}
          onClick={() => handleSelect('Support')}
        >
          Support
        </button>
        <button
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold border transition-all duration-150 ${selected === 'Neutral' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-neutral-800 border-neutral-300 hover:bg-blue-50'}`}
          onClick={() => handleSelect('Neutral')}
        >
          Neutral
        </button>
        <button
          className={`rounded-lg px-3 py-1.5 text-sm font-semibold border transition-all duration-150 ${selected === 'Oppose' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-neutral-800 border-neutral-300 hover:bg-blue-50'}`}
          onClick={() => handleSelect('Oppose')}
        >
          Oppose
        </button>
      </div>
      {/* Only show total votes */}
      <div className="mt-2 text-xs text-neutral-600">
        <span>Total Votes: <span className="font-bold text-neutral-900">{totalVotes}</span></span>
      </div>
      {showComment && !submitted && (
        <div className="animate-fade-in mt-3">
          <textarea
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-base text-neutral-900 placeholder:text-neutral-400 shadow-xs focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all duration-200"
            rows={2}
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Optional: Add a comment..."
          />
          <button
            className="mt-2 rounded-lg bg-blue-600 text-white text-sm px-4 py-1.5 font-medium hover:brightness-110 active:translate-y-[1px]"
            onClick={handleDone}
          >
            Done
          </button>
        </div>
      )}
      {submitted && (
        <div className="mt-3 text-green-700 text-sm font-semibold animate-fade-in">Thank you for your feedback!</div>
      )}
    </div>
  );
}

function ServiceRow({ label, action }) {
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState('');
  const [requested, setRequested] = useState(false);

  // Special inline flow for Waste Collection
  if (label === 'Waste Collection') {
    if (requested) {
      return (
        <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
          <div className="text-neutral-900">{label}</div>
          <div className="text-sm text-green-700 font-semibold">Waste collection Requested</div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-3">
        <div className="text-neutral-900">{label}</div>
        <div className="flex items-center gap-2">
          {!showDate ? (
            <button
              onClick={() => setShowDate(true)}
              className="rounded-lg border border-neutral-300 text-neutral-700 text-xs md:text-sm px-3 py-1.5 hover:bg-neutral-50"
            >
              {action}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-md border px-2 py-1 text-sm"
              />
              <button
                onClick={() => {
                  if (!date) return; // ignore empty
                  setRequested(true);
                }}
                className="rounded-lg bg-blue-600 text-white text-xs md:text-sm px-3 py-1.5"
              >
                Submit
              </button>
              <button
                onClick={() => { setShowDate(false); setDate(''); }}
                className="rounded-lg border border-neutral-300 text-neutral-700 text-xs md:text-sm px-3 py-1.5 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Inline flow for Parking Permit
  if (label === 'Parking Permit') {
    const [showForm, setShowForm] = useState(false);
    const [duration, setDuration] = useState('1'); // years
    const [applied, setApplied] = useState(false);

    const feePerYear = 120; // example fee
    const totalFee = feePerYear * Number(duration || 1);

    if (applied) {
      return (
        <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
          <div className="text-neutral-900">{label}</div>
          <div className="text-sm text-green-700 font-semibold">Parking permit applied — Charges are applied against your card.</div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-3">
        <div className="text-neutral-900">{label}</div>
        <div className="flex items-center gap-2">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg border border-neutral-300 text-neutral-700 text-xs md:text-sm px-3 py-1.5 hover:bg-neutral-50"
            >
              {action}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <label className="text-sm">Interval:</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className="rounded-md border px-2 py-1 text-sm">
                <option value="1">1 year</option>
                <option value="2">2 years</option>
              </select>
              <div className="text-sm text-neutral-700">Fee: <span className="font-semibold">${totalFee}</span></div>
              <button
                onClick={() => setApplied(true)}
                className="rounded-lg bg-blue-600 text-white text-xs md:text-sm px-3 py-1.5"
              >
                Submit
              </button>
              <button
                onClick={() => { setShowForm(false); setDuration('1'); }}
                className="rounded-lg border border-neutral-300 text-neutral-700 text-xs md:text-sm px-3 py-1.5 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Inline flow for Rates Payment
  if (label === 'Rates Payment') {
    const [paid, setPaid] = useState(null);
    const [showAmount, setShowAmount] = useState(false);
    const [amount, setAmount] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    React.useEffect(() => {
      // Randomly decide paid status once on mount
      const isPaid = Math.random() < 0.5;
      setPaid(isPaid);
    }, []);

    if (paid === null) {
      // still deciding
      return (
        <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
          <div className="text-neutral-900">{label}</div>
          <div className="text-sm text-neutral-500">Checking status...</div>
        </div>
      );
    }

    if (paid) {
      return (
        <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
          <div className="text-neutral-900">{label}</div>
          <div className="text-sm text-green-700 font-semibold">Paid</div>
        </div>
      );
    }

    // Not paid flow
    if (submitted) {
      return (
        <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
          <div className="text-neutral-900">{label}</div>
          <div className="text-sm text-green-700 font-semibold">Rates Paid , Charged are applied to your card</div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-3">
        <div className="text-neutral-900">{label}</div>
        <div className="flex items-center gap-2">
          {!showAmount ? (
            <>
              <div className="text-sm text-red-600">Not Paid</div>
              <button
                onClick={() => {
                  // generate an outstanding amount and show it
                  const amt = (Math.floor(Math.random() * 4500) + 100) / 1; // between 100 and 4599
                  setAmount(amt.toFixed(2));
                  setShowAmount(true);
                }}
                className="rounded-lg border border-neutral-300 text-neutral-700 text-xs md:text-sm px-3 py-1.5 hover:bg-neutral-50"
              >
                {action}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="text-sm text-neutral-700">Outstanding: <span className="font-semibold">${amount}</span></div>
              <button
                onClick={() => { setSubmitted(true); setPaid(true); }}
                className="rounded-lg bg-blue-600 text-white text-xs md:text-sm px-3 py-1.5"
              >
                Submit
              </button>
              <button
                onClick={() => { setShowAmount(false); setAmount(null); }}
                className="rounded-lg border border-neutral-300 text-neutral-700 text-xs md:text-sm px-3 py-1.5 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
      <div className="text-neutral-900">{label}</div>
      <button className="rounded-lg border border-neutral-300 text-neutral-700 text-xs md:text-sm px-3 py-1.5 hover:bg-neutral-50">{action}</button>
    </div>
  );
}

/* ------------------------------ Icons ------------------------------ */
function CommunityLinkMark({ className = "" }) {
  // Interconnected-circles mark reminiscent of the sign-in page
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke="#0EA47A" strokeWidth="4" strokeLinecap="round">
        <circle cx="20" cy="20" r="8" fill="#10B981" stroke="#0EA47A" />
        <circle cx="44" cy="20" r="8" fill="#34D399" stroke="#0EA47A" />
        <circle cx="20" cy="44" r="8" fill="#34D399" stroke="#0EA47A" />
        <circle cx="44" cy="44" r="8" fill="#10B981" stroke="#0EA47A" />
        <path d="M28 20h8M20 28v8M44 28v8M28 44h8" />
      </g>
    </svg>
  );
}

function MyGovIdBadge({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="56" height="56" rx="10" fill="#0A8F5B" />
      <g fill="white">
        <text x="14" y="26" fontFamily="Inter, system-ui, Arial" fontSize="14" fontWeight="700">my</text>
        <text x="14" y="42" fontFamily="Inter, system-ui, Arial" fontSize="12" fontWeight="700">Gov</text>
        <text x="42" y="42" fontFamily="Inter, system-ui, Arial" fontSize="12" fontWeight="700">ID</text>
      </g>
    </svg>
  );
}

function PreferencesButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/preferences')}
      className="rounded-lg border border-neutral-300 px-2 py-1 hover:bg-neutral-50 text-sm"
    >
      Preferences
    </button>
  );
}

// Simplified list of Victorian councils (common names). Add or edit as needed.
const victoriaCouncils = [
  'Alpine Shire', 'Ararat Rural City', 'Ballarat City', 'Banyule City', 'Bass Coast Shire', 'Baw Baw Shire',
  'Benalla Rural City', 'Boroondara City', 'Brimbank City', 'Buloke Shire', 'Campaspe Shire', 'Cardinia Shire',
  'Casey City', 'Central Goldfields Shire', 'Colac Otway Shire', 'Corangamite Shire', 'Darebin City',
  'East Gippsland Shire', 'Gannawarra Shire', 'Glen Eira City', 'Glenelg Shire', 'Golden Plains Shire',
  'Greater Bendigo City', 'Greater Dandenong City', 'Greater Geelong City', 'Greater Shepparton City',
  'Hepburn Shire', 'Hindmarsh Shire', 'Hobsons Bay City', 'Horsham Rural City', 'Hume City', 'Indigo Shire',
  'Kingston City', 'Knox City', 'Latrobe City', 'Loddon Shire', 'Macedon Ranges Shire', 'Manningham City',
  'Mansfield Shire', 'Maribyrnong City', 'Maroondah City', 'Melbourne City', 'Melton City', 'Mildura Rural City',
  'Mitchell Shire', 'Moira Shire', 'Monash City', 'Moonee Valley City', 'Moorabool Shire', 'Merri-bek City',
  'Mornington Peninsula Shire', 'Mount Alexander Shire', 'Moyne Shire', 'Murrindindi Shire', 'Nillumbik Shire',
  'Northern Grampians Shire', 'Port Phillip City', 'Pyrenees Shire', 'South Gippsland Shire',
  'Southern Grampians Shire', 'Stonnington City', 'Strathbogie Shire', 'Surf Coast Shire', 'Swan Hill Rural City',
  'Towong Shire', 'Wangaratta Rural City', 'Warrnambool City', 'Wellington Shire', 'West Wimmera Shire',
  'Whitehorse City', 'Whittlesea City', 'Wodonga City', 'Wyndham City', 'Yarra City', 'Yarra Ranges Shire',
  'Yarriambiack Shire'
];

function SearchableCouncilSelect({ value, onChange, councils = victoriaCouncils }) {
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return councils.slice(0, 12);
    return councils.filter(c => c.toLowerCase().includes(q)).slice(0, 12);
  }, [query, councils]);

  React.useEffect(() => {
    // keep query in sync with selected value
    setQuery(value || '');
  }, [value]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        placeholder="Search councils in Victoria..."
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        className="w-full rounded-md border px-3 py-2"
        aria-label="Search councils"
      />
      {open && (
        <div className="absolute z-20 left-0 right-0 mt-1 bg-white border rounded-md shadow max-h-56 overflow-auto">
          {filtered.length === 0 ? (
            <div className="p-3 text-sm text-neutral-500">No councils found</div>
          ) : (
            filtered.map((c) => (
              <div
                key={c}
                role="button"
                onClick={() => { onChange(c); setOpen(false); }}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
              >
                {c}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function OnboardingFlow() {
  const navigate = useNavigate();
  const [linked, setLinked] = useState(false);
  const [council, setCouncil] = useState('Central Park Council');

  function handleLinkMyGov() {
    // Mock linking flow
    setLinked(true);
    setTimeout(() => {
      // pretend to fetch data and store link
      localStorage.setItem('communityLink_myGovLinked', 'true');
    }, 300);
  }

  function handleComplete() {
    // Save council and proceed to preferences
    localStorage.setItem('communityLink_council', council);
    navigate('/preferences');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-1 text-neutral-900 text-center">OneCouncil</h1>
        <div className="text-sm text-neutral-600 mb-4 text-center">Link your myGov account and select your council</div>


        <div className="space-y-4">
          <div>
            <div className="font-semibold">Select your Council</div>
            <div className="text-sm text-neutral-600">Choose the council or local area you belong to.</div>
            <div className="mt-2">
              <SearchableCouncilSelect value={council} onChange={(c) => setCouncil(c)} />
            </div>
          </div>

          <div>
            <div className="font-semibold">Link with myGov</div>
            <div className="text-sm text-neutral-600">Linking with myGov helps verify your identity so you can access council services.</div>
            <div className="mt-3">
              {!linked ? (
                <button className="rounded-lg bg-blue-600 text-white px-4 py-2" onClick={handleLinkMyGov}>Link myGov</button>
              ) : (
                <div className="text-sm text-green-700">myGov linked ✓</div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button className="rounded-lg bg-blue-600 text-white px-4 py-2" onClick={handleComplete}>Continue to Preferences</button>
          </div>
        </div>
      </div>
    </div>
  );
}
