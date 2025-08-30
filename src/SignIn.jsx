import React from "react";
import { useNavigate } from "react-router-dom";

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

export default function SignIn({ email, setEmail, onSubmit, startMyGovIdFlow }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-neutral-50">
      {/* Council Login Button - top right */}
      <button
        className="absolute top-6 right-6 bg-transparent text-slate-700 border border-transparent hover:bg-slate-100 px-3 py-1.5 rounded-md text-sm z-10"
        onClick={() => navigate('/council-login')}
      >
        Council Login
      </button>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left promo / brand */}
        <div className="hidden md:flex flex-col justify-center rounded-2xl p-8 bg-gradient-to-br from-sky-50 to-white">
          <div className="flex items-center gap-4 mb-6">
            <MyGovIdBadge className="h-12 w-12" />
            <div>
              <h2 className="text-2xl font-bold text-slate-900">CommunityLink</h2>
              <p className="text-sm text-slate-600">Connect, contribute and shape local services.</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">Submit ideas, vote on local projects, and stay informed about community events — all in one place.</p>
        </div>

        {/* Right: login card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Sign in to CommunityLink</h3>

          <button
            type="button"
            onClick={startMyGovIdFlow}
            className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base font-semibold text-slate-900 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-sky-400"
            aria-label="Sign in with myGovID"
          >
            <MyGovIdBadge className="h-7 w-7" />
            <span>Sign in with myGovID</span>
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-neutral-100" />
            <div className="px-3 text-sm text-neutral-400">or sign in with email</div>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            />

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-sky-600 text-white py-3 font-semibold hover:brightness-105 focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={() => { setEmail(''); }}
                className="rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                Clear
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">Connecting communities for a stronger future</p>
        </div>
      </div>
    </div>
  );
}
