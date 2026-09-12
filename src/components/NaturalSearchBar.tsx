import React, { useState } from "react";
import { Search, Sparkles, X, ArrowRight, Loader2 } from "lucide-react";
import { RecommendationFilter } from "../types";

interface Props {
  onParsedIntent: (filters: Partial<RecommendationFilter>) => void;
}

export const NaturalSearchBar: React.FC<Props> = ({ onParsedIntent }) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/parse-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.parsed) {
          const p = data.parsed;
          onParsedIntent({
            intent: p.intent || null,
            activity: p.activity || null,
            group: p.group || "friends",
            budgetTier: p.budgetTier || null,
            location: p.location || "Anywhere in Accra",
            dayOfWeek: p.dayOfWeek || "any",
          });
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Falling back to local regex intent parser", err);
    }

    // Local heuristic parser
    const q = query.toLowerCase();
    const parsed: Partial<RecommendationFilter> = {};

    if (q.includes("relax") || q.includes("spa") || q.includes("quiet")) {
      parsed.intent = "relax";
    } else if (q.includes("date") || q.includes("romantic") || q.includes("girlfriend") || q.includes("boyfriend")) {
      parsed.intent = "date";
      parsed.group = "partner";
    } else if (q.includes("adventure") || q.includes("hike") || q.includes("quad")) {
      parsed.intent = "adventure";
    } else if (q.includes("fun") || q.includes("game") || q.includes("bowling")) {
      parsed.intent = "fun";
    }

    if (q.includes("50") || q.includes("cheap") || q.includes("free")) {
      parsed.budgetTier = "under_50";
    } else if (q.includes("100")) {
      parsed.budgetTier = "50_100";
    } else if (q.includes("200")) {
      parsed.budgetTier = "100_200";
    }

    if (q.includes("osu")) parsed.location = "Osu";
    else if (q.includes("labone")) parsed.location = "Labone";
    else if (q.includes("east legon")) parsed.location = "East Legon";
    else if (q.includes("airport")) parsed.location = "Airport Residential";
    else if (q.includes("kokrobite")) parsed.location = "Kokrobite";
    else if (q.includes("aburi")) parsed.location = "Aburi Hills";

    onParsedIntent(parsed);
    setIsLoading(false);
  };

  const samplePrompts = [
    "Things to do this Saturday under GH₵100",
    "Intimate date night in Labone with drinks",
    "Chill Sunday pool reset for solo recharge",
    "Active outdoor adventure in Aburi",
  ];

  return (
    <div className="w-full space-y-2">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <div className="absolute left-3.5 text-emerald-600">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Ask naturally, e.g. "Things to do in Accra this Saturday under GH₵100"...'
          className="w-full bg-white border border-slate-300/80 shadow-xs hover:border-emerald-400 rounded-2xl pl-10 pr-24 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-emerald-600 transition"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-emerald-300"
        >
          <span>Ask</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </form>

      {/* Suggested prompts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px] text-slate-500">
        <span className="shrink-0 font-medium text-slate-400">Try:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setQuery(p);
            }}
            className="shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-full transition"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};
