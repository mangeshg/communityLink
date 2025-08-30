import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-neutral-200 mt-8" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="font-semibold text-white">City of Melbourne</div>
          <div className="text-sm text-neutral-400 mt-2">Council services, events and community engagement.</div>
        </div>

        <div>
          <h4 className="font-semibold text-neutral-100 mb-2">About</h4>
          <ul className="text-sm space-y-2">
            <li><a href="#" className="text-neutral-300 hover:text-white">About the council</a></li>
            <li><a href="#" className="text-neutral-300 hover:text-white">Services</a></li>
            <li><a href="#" className="text-neutral-300 hover:text-white">News</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-neutral-100 mb-2">Contact</h4>
          <div className="text-sm text-neutral-300">Phone: (03) 0123 4567</div>
          <div className="text-sm text-neutral-300 mt-1">Email: <a href="mailto:contact@council.vic.gov.au" className="underline">contact@council.vic.gov.au</a></div>
        </div>
      </div>

      <div className="border-t border-neutral-800 mt-4 py-3 text-xs text-neutral-400">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div>© City of Melbourne</div>
          <div>
            <a href="#" className="underline text-neutral-300">Accessibility</a>
            <span className="mx-2">•</span>
            <a href="#" className="underline text-neutral-300">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
