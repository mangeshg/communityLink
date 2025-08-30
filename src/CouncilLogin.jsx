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

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-neutral-50">
      <div className="w-full max-w-sm bg-white shadow-sm rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Council Login</h2>
        <form onSubmit={handleCouncilLogin} className="space-y-4">
          <div>
            <label htmlFor="councilId" className="block text-sm font-medium text-neutral-700">Login ID</label>
            <input
              id="councilId"
              type="text"
              value={councilId}
              onChange={e => setCouncilId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-base focus:border-blue-500 focus:outline-none"
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
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-base focus:border-blue-500 focus:outline-none"
            />
          </div>
          {councilError && <div className="text-red-500 text-sm text-center">{councilError}</div>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Login</button>
        </form>
      </div>
    </div>
  );
}
