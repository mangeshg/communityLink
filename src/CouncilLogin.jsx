import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CouncilLogin() {
  const [councilId, setCouncilId] = useState("");
  const [councilPassword, setCouncilPassword] = useState("");
  const [councilError, setCouncilError] = useState("");
  const navigate = useNavigate();

  function handleCouncilLogin(e) {
    e.preventDefault();
    if (!councilId.trim() || !councilPassword.trim()) {
      setCouncilError("Please enter both Login ID and Password");
      return;
    }
    // Replace with real auth logic
    navigate("/council-dashboard");
    setCouncilId("");
    setCouncilPassword("");
    setCouncilError("");
  }

  function startMyGovIdFlow() {
    // placeholder for myGovID flow - replace with real handler if available
    // for now navigate to dashboard for demo
    navigate("/council-dashboard");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-neutral-50">
      {/* top-right back */}
      <button
        className="absolute top-6 right-6 bg-transparent text-slate-700 border border-transparent hover:bg-slate-100 px-3 py-1.5 rounded-md text-sm z-10"
        onClick={() => navigate('/')}
      >
        Back to Community
      </button>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left promo / brand (hidden on small screens) */}
        <div className="hidden md:flex flex-col justify-center rounded-2xl p-8 bg-gradient-to-br from-sky-50 to-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-semibold">OC</div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">OneCouncil</h2>
              <p className="text-sm text-slate-600">Secure administration for council teams.</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">Manage projects, respond to community feedback, and publish decisions—all from a governed portal.</p>
          <div className="mt-6 text-sm text-neutral-500">Tip: use your organisational myGovID for single-sign-on.</div>
        </div>

        {/* Right: login card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Council sign in</h3>

          

          <form onSubmit={handleCouncilLogin} className="space-y-4">
            <div>
              <label htmlFor="councilId" className="block text-sm font-medium text-neutral-700">Login ID</label>
              <input
                id="councilId"
                type="text"
                value={councilId}
                onChange={e => setCouncilId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="councilPassword" className="block text-sm font-medium text-neutral-700">Password</label>
              <input
                id="councilPassword"
                type="password"
                value={councilPassword}
                onChange={e => setCouncilPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              />
            </div>

            {councilError && <div className="text-red-500 text-sm text-center">{councilError}</div>}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-sky-600 text-white py-3 font-semibold hover:brightness-105 focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => { setCouncilId(''); setCouncilPassword(''); setCouncilError(''); }}
                className="rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                Clear
              </button>
            </div>

            <div className="flex justify-between text-sm text-neutral-500">
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">Forgot password?</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/council-dashboard'); }} className="hover:underline">Demo</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
