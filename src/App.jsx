import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import CouncilLogin from "./CouncilLogin.jsx";

/**
 * CommunityLink demo app
 * - Mobile + desktop responsive
 * - No real auth: clicking the myGovID button or submitting email shows the dashboard
 * - TailwindCSS for styling
 */
export default function App() {
  const [email, setEmail] = useState("");
  const [signedIn, setSignedIn] = useState(false);

  function startMyGovIdFlow() {
    setSignedIn(true);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return alert("Please enter your email");
    setSignedIn(true);
  }

  return (
    <div className="min-h-screen w-full bg-neutral-50">
      <Routes>
        <Route
          path="/"
          element={signedIn ? (
            <Dashboard onSignOut={() => setSignedIn(false)} />
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
      </Routes>
    </div>
  );
}

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
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 select-none">
          <CommunityLinkMark className="h-10 w-10" />
          <span className="text-2xl font-semibold tracking-tight text-neutral-800">CommunityLink</span>
        </div>

        {/* Title */}
        <h1 className="mt-8 text-center text-3xl font-bold tracking-tight text-neutral-900">Sign in</h1>

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
  return (
    <div className="max-w-6xl mx-auto px-4 py-5 md:py-8">
      {/* Header */}
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CommunityLinkMark className="h-7 w-7" />
          <h1 className="text-lg md:text-xl font-semibold tracking-tight text-neutral-800">CommunityLink</h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-neutral-600">
          <span className="hidden sm:inline">Welcome, Verified via myGovID</span>
          <MyGovIdBadge className="h-6 w-6 shrink-0" />
          <button onClick={onSignOut} className="ml-1 rounded-lg border border-neutral-300 px-2 py-1 hover:bg-neutral-50">Sign out</button>
        </div>
      </header>

      {/* Content Grid */}
      <main className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {/* Local Events */}
        <Card>
          <CardTitle>Local Events</CardTitle>
          <ul className="mt-3 space-y-3">
            <EventItem title="Community BBQ" date="Sat, 14 Sep" />
            <EventItem title="Cultural Festival" date="Sun, 22 Sep" />
            <EventItem title="Youth Coding Workshop" date="Wed, 25 Sep" />
          </ul>
        </Card>

        {/* Community Project Ideas */}
        <Card>
          <CardTitle>Community Project Ideas</CardTitle>
          <div className="mt-3 space-y-5">
            <Proposal title="Central Park Upgrade ($2M)" />
            <Proposal title="Community Garden ($50K)" />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="rounded-lg bg-blue-600 text-white text-sm px-4 py-2 hover:brightness-110 active:translate-y-[1px]"
              onClick={() => alert('Submit New Idea functionality not implemented yet!')}
            >
              + Submit My Idea
            </button>
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

function EventItem({ title, date }) {
  return (
    <li className="flex items-center justify-between">
      <div className="text-neutral-900">{title}</div>
      <div className="text-neutral-500 text-sm">{date}</div>
    </li>
  );
}

function Proposal({ title }) {
  return (
    <div>
      <div className="text-neutral-900 font-medium">{title}</div>
      <div className="mt-2 flex items-center gap-2">
        <button className="rounded-lg bg-blue-600 text-white text-sm px-3 py-1.5 hover:brightness-110 active:translate-y-[1px]">Support</button>
        <button className="rounded-lg border border-neutral-300 text-neutral-700 text-sm px-3 py-1.5 hover:bg-neutral-50">Neutral</button>
        <button className="rounded-lg border border-neutral-300 text-neutral-700 text-sm px-3 py-1.5 hover:bg-neutral-50">Oppose</button>
      </div>
    </div>
  );
}

function ServiceRow({ label, action }) {
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
