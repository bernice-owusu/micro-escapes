import React, { useState } from "react";
import {
  Sparkles,
  Search,
  MapPin,
  Clock,
  Calendar,
  Users,
  Coins,
  ChevronRight,
  Compass,
  Shuffle,
  CalendarDays,
  Check,
  Flame,
} from "lucide-react";
import {
  IntentType,
  GroupType,
  BudgetTier,
  NeighborhoodType,
  DurationType,
  RecommendationFilter,
} from "../types";

interface Props {
  initialFilters: RecommendationFilter;
  onApplyFilters: (filters: RecommendationFilter) => void;
  onOpenSurpriseMe: () => void;
  onOpenBuildMyDay: () => void;
  totalVenuesCount: number;
}

const INTENT_OPTIONS: { id: IntentType; label: string; emoji: string; desc: string }[] = [
  { id: "relax", label: "Relax", emoji: "😌", desc: "Spas, quiet pools, scenic breeze" },
  { id: "fun", label: "Have Fun", emoji: "🎳", desc: "Bowling, board games, arcades" },
  { id: "date", label: "Date", emoji: "❤️", desc: "Intimate vibes, sunset, romantic food" },
  { id: "explore", label: "Explore", emoji: "🌿", desc: "Heritage walks, hidden corners" },
  { id: "eat", label: "Eat", emoji: "🍽️", desc: "Authentic courtyards & food spots" },
  { id: "create", label: "Create", emoji: "🎨", desc: "Pottery, paint & sip, crafts" },
  { id: "adventure", label: "Adventure", emoji: "🏃", desc: "Canopy walks, quad biking, surfing" },
  { id: "party", label: "Party", emoji: "🎵", desc: "Secret speakeasies & live DJ sets" },
];

const POPULAR_ACTIVITIES = [
  "Bowling",
  "Paint and Sip",
  "Pottery",
  "Spa & Massage",
  "Canopy Walk",
  "Quad Biking",
  "Swimming Pool",
  "Sunset Beach",
  "Board Games",
  "Standup Comedy",
  "African Dining",
  "Surf Lessons",
];

const GROUP_OPTIONS: { id: GroupType; label: string; icon: string }[] = [
  { id: "solo", label: "Solo Escape", icon: "👤" },
  { id: "partner", label: "Date / Partner", icon: "👩‍❤️‍👨" },
  { id: "friends", label: "Friend Crew", icon: "👥" },
  { id: "family", label: "Family", icon: "👨‍👩‍👧" },
  { id: "colleagues", label: "Colleagues", icon: "💼" },
];

const BUDGET_TIERS: { id: BudgetTier; label: string; desc: string }[] = [
  { id: "under_50", label: "Under GH₵50", desc: "Super budget & free gems" },
  { id: "50_100", label: "GH₵50–100", desc: "Casual outings & bites" },
  { id: "100_200", label: "GH₵100–200", desc: "Most popular weekend sweet spot" },
  { id: "200_500", label: "GH₵200–500", desc: "Special dates & adventures" },
  { id: "500_plus", label: "GH₵500+", desc: "Premium luxury escapes" },
];

const NEIGHBORHOODS: NeighborhoodType[] = [
  "Anywhere in Accra",
  "Osu",
  "East Legon",
  "Labone",
  "Airport Residential",
  "Cantonments",
  "Spintex",
  "Jamestown",
  "Kokrobite",
  "Legon / Madina",
  "Dzorwulu",
  "Aburi Hills",
];

export const RecommendationWizard: React.FC<Props> = ({
  initialFilters,
  onApplyFilters,
  onOpenSurpriseMe,
  onOpenBuildMyDay,
  totalVenuesCount,
}) => {
  const [filters, setFilters] = useState<RecommendationFilter>(initialFilters);
  const [customSearchActivity, setCustomSearchActivity] = useState(
    initialFilters.activity || ""
  );
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleIntentSelect = (intent: IntentType) => {
    const updated = {
      ...filters,
      intent: filters.intent === intent ? null : intent,
    };
    setFilters(updated);
  };

  const handleActivitySelect = (act: string) => {
    const nextAct = filters.activity?.toLowerCase() === act.toLowerCase() ? null : act;
    const updated = { ...filters, activity: nextAct };
    setFilters(updated);
    setCustomSearchActivity(nextAct || "");
  };

  const handleGroupSelect = (group: GroupType) => {
    setFilters({ ...filters, group });
  };

  const handleBudgetSelect = (tier: BudgetTier) => {
    setFilters({ ...filters, budgetTier: tier });
  };

  const handleLocationSelect = (loc: NeighborhoodType) => {
    setFilters({ ...filters, location: loc });
  };

  const handleTimeSelect = (day: RecommendationFilter["dayOfWeek"], time: RecommendationFilter["timeOfDay"]) => {
    setFilters({ ...filters, dayOfWeek: day, timeOfDay: time });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onApplyFilters({
      ...filters,
      activity: customSearchActivity.trim() || null,
    });
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-7 space-y-6">
      {/* Header Statement */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200/70 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Accra Recommendation Engine
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
          What do you feel like doing?
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Tell us what you're in the mood for. We'll figure out where you should go.
        </p>
      </div>

      {/* Step 1: Quick Intent Grid (PRD Section 6) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          1. Pick your mood or intention:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {INTENT_OPTIONS.map((opt) => {
            const isSelected = filters.intent === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleIntentSelect(opt.id)}
                className={`p-3 rounded-2xl border text-left transition-all relative ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]"
                    : "bg-slate-50/80 hover:bg-slate-100/90 text-slate-800 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl">{opt.emoji}</span>
                  {isSelected && <Check className="w-4 h-4 text-emerald-200" />}
                </div>
                <div className={`font-bold text-sm ${isSelected ? "text-white" : "text-slate-900"}`}>
                  {opt.label}
                </div>
                <div
                  className={`text-[11px] leading-tight line-clamp-1 ${
                    isSelected ? "text-emerald-100" : "text-slate-500"
                  }`}
                >
                  {opt.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Specific Activity Search / Quick Pills (PRD Section 6) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            2. Looking for something specific? (Optional)
          </label>
          {filters.activity && (
            <button
              onClick={() => {
                setFilters({ ...filters, activity: null });
                setCustomSearchActivity("");
              }}
              className="text-xs text-emerald-700 hover:underline"
            >
              Clear activity
            </button>
          )}
        </div>

        {/* Input Bar */}
        <div className="relative mb-2.5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={customSearchActivity}
            onChange={(e) => {
              setCustomSearchActivity(e.target.value);
              setFilters({ ...filters, activity: e.target.value || null });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder='Type specific activity (e.g. "bowling", "paint and sip", "pottery", "spa", "hiking")...'
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-emerald-600 transition"
          />
        </div>

        {/* Quick Activity Taxonomy Pills */}
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_ACTIVITIES.map((act) => {
            const isSelected =
              filters.activity?.toLowerCase() === act.toLowerCase() ||
              customSearchActivity.toLowerCase() === act.toLowerCase();
            return (
              <button
                key={act}
                type="button"
                onClick={() => handleActivitySelect(act)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition ${
                  isSelected
                    ? "bg-slate-900 text-white font-semibold shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {act}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Who are you with? & Budget Tier in 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1 border-t border-slate-100">
        {/* Who are you with? */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            3. Who are you with?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {GROUP_OPTIONS.map((g) => {
              const isSelected = filters.group === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleGroupSelect(g.id)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl border text-xs font-medium transition ${
                    isSelected
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold"
                      : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-base">{g.icon}</span>
                  <span className="truncate">{g.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            4. Outing budget per person:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {BUDGET_TIERS.map((b) => {
              const isSelected = filters.budgetTier === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleBudgetSelect(b.id)}
                  className={`p-2 rounded-xl border text-left text-xs transition ${
                    isSelected
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold"
                      : "bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="font-semibold">{b.label}</div>
                  <div className="text-[10px] text-slate-500 truncate">{b.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step 5 & 6: Location & Timing (Collapsible or Clean Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-100">
        {/* Neighborhood Area */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            5. Area in Accra:
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleLocationSelect(e.target.value as NeighborhoodType)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-emerald-600"
          >
            {NEIGHBORHOODS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* When */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            6. When:
          </label>
          <select
            value={filters.dayOfWeek}
            onChange={(e) =>
              setFilters({
                ...filters,
                dayOfWeek: e.target.value as RecommendationFilter["dayOfWeek"],
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-emerald-600"
          >
            <option value="any">Anytime / This Weekend</option>
            <option value="saturday">Saturday</option>
            <option value="sunday">Sunday</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            Time Commitment:
          </label>
          <select
            value={filters.duration}
            onChange={(e) =>
              setFilters({
                ...filters,
                duration: e.target.value as DurationType | "any",
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-emerald-600"
          >
            <option value="any">Any duration</option>
            <option value="1 hour">Quick 1 Hour</option>
            <option value="2–3 hours">2–3 Hours</option>
            <option value="Half day">Half Day</option>
            <option value="Full day">Full Day Outing</option>
          </select>
        </div>
      </div>

      {/* Main Action Bar & Signature Shortcuts */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Signature Shortcuts */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onOpenSurpriseMe}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/90 px-3.5 py-2.5 rounded-xl text-xs font-bold transition"
            title="Roll a spontaneous micro escape when you just want to get out"
          >
            <Shuffle className="w-4 h-4 text-amber-600" />
            Surprise Me
          </button>

          <button
            type="button"
            onClick={onOpenBuildMyDay}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200/90 px-3.5 py-2.5 rounded-xl text-xs font-bold transition"
            title="Generate a full day plan with timeline in Accra"
          >
            <CalendarDays className="w-4 h-4 text-purple-600" />
            Build My Day
          </button>
        </div>

        {/* Primary Recommendation Engine CTA */}
        <button
          type="button"
          onClick={() => handleSubmit()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3 rounded-xl text-sm shadow-md hover:shadow-lg transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Find My Best Escapes
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
