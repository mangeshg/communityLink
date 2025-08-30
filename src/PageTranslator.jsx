import React, { useState, useEffect } from "react";

// Small page translator helper. It doesn't translate text in-app but provides
// a quick way to open Google Translate for the current page and remembers the
// user's preferred language in localStorage.
export default function PageTranslator() {
  const languages = [
    { code: "en", name: "English", native: "English" },
    { code: "zh-CN", name: "Chinese (Simplified)", native: "中文（简体）" },
    { code: "ar", name: "Arabic", native: "العربية" },
    { code: "vi", name: "Vietnamese", native: "Tiếng Việt" },
    { code: "el", name: "Greek", native: "Ελληνικά" },
    { code: "it", name: "Italian", native: "Italiano" },
    { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
    { code: "hi", name: "Hindi", native: "हिन्दी" },
    { code: "es", name: "Spanish", native: "Español" },
    { code: "tr", name: "Turkish", native: "Türkçe" }
  ];

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('communityLink_lang') || 'en';
    return 'en';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = selected;
    if (typeof window !== 'undefined') localStorage.setItem('communityLink_lang', selected);
  }, [selected]);

  function handleTranslateTarget(code) {
    setSelected(code);
    if (code === 'en') {
      // no external translator required
      setOpen(false);
      return;
    }
    // open Google Translate for this URL with the target language
    if (typeof window !== 'undefined') {
      const url = `https://translate.google.com/translate?sl=auto&tl=${encodeURIComponent(code)}&u=${encodeURIComponent(window.location.href)}`;
      window.open(url, '_blank');
      setOpen(false);
    }
  }

  return (
    <div className="z-50">
      {/* Floating translator button (bottom-right) */}
      <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6">
        <div className="relative">
          <button
            aria-expanded={open}
            onClick={() => setOpen(s => !s)}
            className="flex items-center gap-2 bg-white border border-neutral-200 rounded-full px-3 py-2 shadow-md hover:shadow-lg focus:outline-none"
            title="Translate page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m6 16h-6m3 0v-2M5 21l4-16" />
            </svg>
            <span className="text-sm text-neutral-700">{languages.find(l => l.code === selected)?.name || 'Language'}</span>
          </button>

          {open && (
            <div className="mt-2 w-52 bg-white border border-neutral-200 rounded-lg shadow-lg overflow-hidden">
              <div className="p-2 text-xs text-neutral-500 border-b border-neutral-100">Choose language</div>
              <div className="max-h-56 overflow-auto">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleTranslateTarget(lang.code)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center justify-between ${selected === lang.code ? 'bg-blue-50' : ''}`}
                  >
                    <span>
                      <span className="font-medium text-neutral-800">{lang.name}</span>
                      <div className="text-xs text-neutral-500">{lang.native}</div>
                    </span>
                    {selected === lang.code && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-neutral-100 bg-neutral-50 text-xs text-neutral-600">
                Tip: selecting a non-English language will open Google Translate for this page in a new tab.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
