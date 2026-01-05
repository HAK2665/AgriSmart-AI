
import React, { useState, useRef, useEffect } from 'react';
import { searchAgriculturalKnowledge } from '../geminiService';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to results when they appear
  useEffect(() => {
    if (answer || loading) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [answer, loading]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setAnswer(null);
    setSources([]);
    setError(null);

    try {
      const result = await searchAgriculturalKnowledge(query);
      
      const validSources = result.sources.filter((chunk: any) => chunk.web && chunk.web.uri);

      if (!result.text && validSources.length === 0) {
        setError("I couldn't find a definitive answer in the database. Please try a more specific question about a crop, pest, or farming technique.");
      } else {
        setAnswer(result.text);
        setSources(validSources);
      }
    } catch (err: any) {
      console.error("Search Page API Error:", err);
      if (err.message?.includes('429')) {
        setError("The Expert System is currently experiencing high traffic. We automatically retried but failed. Please try again in 30 seconds.");
      } else if (err.message?.includes('safety')) {
        setError("The query was filtered for safety reasons. Please try rephrasing your agricultural question.");
      } else if (err.message?.includes('API Key')) {
        setError("System configuration error: API Key is invalid or missing.");
      } else {
        setError("An unexpected error occurred while consulting the expert database. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    { text: "Current market price for Wheat", icon: "fa-chart-line" },
    { text: "Organic pesticides for Cotton Bollworm", icon: "fa-leaf" },
    { text: "Best drip irrigation system for Tomato", icon: "fa-water" },
    { text: "Government subsidies for tractors 2025", icon: "fa-tractor" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-32">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
          <i className="fas fa-globe-americas text-[10px]"></i> Live Web Search
        </div>
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">Expert Farming Advisor</h2>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
          Ask questions to search the entire web for the latest agricultural data, prices, and scientific research.
        </p>
      </header>

      {/* Search Input Area */}
      <div className="static top-20 z-20">
        <div className="bg-white p-2 rounded-3xl shadow-2xl border border-slate-200 flex flex-col md:flex-row gap-2 transition-all focus-within:ring-4 focus-within:ring-green-500/10">
          <div className="flex-1 flex items-center px-6">
            <i className="fas fa-magnifying-glass text-green-500 mr-4"></i>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. 'How to control Fall Armyworm in Maize?'"
              className="w-full py-4 text-slate-700 bg-transparent outline-none font-medium text-lg placeholder:text-slate-300"
            />
          </div>
          <button 
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {loading ? (
              <i className="fas fa-spinner-third animate-spin"></i>
            ) : (
              <i className="fas fa-search"></i>
            )}
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-5 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-4 animate-slide-up shadow-sm">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <i className="fas fa-triangle-exclamation"></i>
          </div>
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="space-y-6">
        {loading ? (
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 space-y-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded-full w-48 animate-pulse"></div>
                <div className="h-3 bg-slate-100 rounded-full w-32 animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-50 rounded-full w-full animate-pulse"></div>
              <div className="h-4 bg-slate-50 rounded-full w-5/6 animate-pulse"></div>
              <div className="h-4 bg-slate-50 rounded-full w-4/6 animate-pulse"></div>
            </div>
          </div>
        ) : answer ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-slide-up">
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6 text-green-600">
                <i className="fas fa-robot text-2xl"></i>
                <span className="font-bold tracking-wider text-sm uppercase">Expert Findings</span>
              </div>
              <div className="prose prose-green max-w-none text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
                {answer}
              </div>

              {sources.length > 0 && (
                <div className="mt-12 pt-10 border-t border-slate-100">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    <span className="w-10 h-[1px] bg-slate-200"></span> 
                    Referenced Sources
                    <span className="w-10 h-[1px] bg-slate-200"></span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sources.map((res, i) => res.web && (
                      <a 
                        key={i} 
                        href={res.web.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group p-5 bg-slate-50 hover:bg-white border border-transparent hover:border-green-300 hover:shadow-xl rounded-3xl transition-all flex items-start gap-4"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-green-500 transition-colors shrink-0">
                          <i className="fas fa-external-link-alt text-xs"></i>
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-bold text-slate-700 group-hover:text-green-700 transition-colors block truncate">
                            {res.web.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium truncate block mt-1 uppercase tracking-wider">
                            {new URL(res.web.uri).hostname}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Generated by Gemini AI with Google Search Grounding
              </p>
            </div>
          </div>
        ) : !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((suggest, i) => (
              <button 
                key={i} 
                onClick={() => {
                  setQuery(suggest.text);
                  // Immediate trigger workaround for state update
                  setTimeout(() => {
                    const btn = document.querySelector('button[disabled=false] > i.fa-search')?.parentElement;
                    if(btn) btn.click();
                  }, 100);
                }}
                className="text-left p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-green-400 hover:shadow-xl transition-all group flex items-center gap-5"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-green-50 flex items-center justify-center text-slate-400 group-hover:text-green-600 transition-all shadow-inner">
                  <i className={`fas ${suggest.icon} text-xl`}></i>
                </div>
                <div className="flex-1">
                  <span className="text-slate-800 font-bold block group-hover:text-green-800 transition-colors">{suggest.text}</span>
                  <span className="text-xs text-slate-400 font-medium">Tap to search</span>
                </div>
                <i className="fas fa-arrow-right-long text-slate-200 group-hover:text-green-500 transition-all translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100"></i>
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default SearchPage;
