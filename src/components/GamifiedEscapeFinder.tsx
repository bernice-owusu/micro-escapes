import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Users,
  MapPin,
  Calendar,
  Clock,
  Compass,
  Check,
  RotateCcw,
  Search,
  ArrowRight,
  Flame,
  Award,
  Star,
  Shuffle,
  ShieldCheck,
} from "lucide-react";
import {
  IntentType,
  GroupType,
  BudgetTier,
  NeighborhoodType,
  RecommendationFilter,
  Experience,
} from "../types";
import { calculateRecommendations, RecommendationResult } from "../utils/recommendationEngine";

interface Props {
  experiences: Experience[];
  initialFilters: RecommendationFilter;
  onSelectExperience: (experience: Experience) => void;
  onOpenSurpriseMe: () => void;
  onOpenWheel: () => void;
  onOpenBuildMyDay: (matchedExperiences?: Experience[]) => void;
  onBookExperience: (experience: Experience, partySize: number) => void;
}

const FEELINGS: { id: IntentType; label: string; emoji: string; subtitle: string }[] = [
  { id: "relax", label: "I need to relax", emoji: "😌", subtitle: "Melt stress away with pools, spas, or scenic breeze" },
  { id: "fun", label: "I want to have fun", emoji: "🎉", subtitle: "High energy, laughter, games, and excitement" },
  { id: "date", label: "I want a date", emoji: "❤️", subtitle: "Romantic lighting, memorable intimacy, and sunset views" },
  { id: "explore", label: "I want to explore", emoji: "🌿", subtitle: "Hidden Accra history, art courtyards, and botanical trails" },
  { id: "adventure", label: "I need an adventure", emoji: "⚡", subtitle: "Canopy walks, quad biking, surf lessons, or go-karts" },
  { id: "eat", label: "I just want good food", emoji: "🍽️", subtitle: "Authentic Ghanaian courtyards, juicy grills, and craft cocktails" },
  { id: "create", label: "I want to try something new", emoji: "🎨", subtitle: "Pottery masterclasses, paint & sip, crafts, and culture" },
];

const DYNAMIC_ACTIVITIES: Record<IntentType, string[]> = {
  fun: ["Bowling", "Gaming & Arcades", "Go-Karting", "Board Games", "Escape Room", "Movies & Rooftop", "Swimming Pool"],
  relax: ["Spa & Massage", "Quiet Pool Lounge", "Beach Ocean Breeze", "Garden Sanctuary", "Sunset Walk", "Reading Cafe"],
  date: ["Sunset Beach & Wine", "Intimate Courtyard Dinner", "Pottery for Two", "Rooftop Jazz & Cocktails", "Art Gallery Walk"],
  explore: ["Jamestown Heritage Walk", "Art Galleries & Crafts", "Legon Botanical Gardens", "Aburi Hills Lookout", "Vintage Thrift Markets"],
  adventure: ["Canopy Walk", "Quad Biking Safari", "Atlantic Surf Lessons", "Go-Kart Racing", "Horseback Trail Riding"],
  eat: ["Grilled Tilapia & Kelewele", "Artisan Brunch & Coffee", "African Courtyard Dining", "Street Grills Fiesta", "Craft Cocktails"],
  create: ["Pottery Wheel Masterclass", "Paint and Sip", "Canvas Art Social", "Bead Making", "Baking Workshop"],
  party: ["Secret Speakeasies", "Live DJ Sunset Sets", "Highlife Courtyard", "Cocktail Lounges"],
};

const GROUP_OPTIONS: { id: GroupType; label: string; icon: string; defaultSize: number }[] = [
  { id: "solo", label: "Just me", icon: "👤", defaultSize: 1 },
  { id: "partner", label: "Me + 1", icon: "❤️", defaultSize: 2 },
  { id: "friends", label: "Friends", icon: "👯", defaultSize: 4 },
  { id: "family", label: "Family", icon: "👨‍👩‍👧", defaultSize: 4 },
  { id: "colleagues", label: "Team / colleagues", icon: "🏢", defaultSize: 6 },
];

const BUDGET_OPTIONS: { id: BudgetTier; label: string; range: string; desc: string }[] = [
  { id: "under_50", label: "Under GH₵50", range: "< GH₵50", desc: "Super budget & free city gems" },
  { id: "50_100", label: "GH₵50–100", range: "GH₵50–100", desc: "Casual outings, bites, & drinks" },
  { id: "100_200", label: "GH₵100–200", range: "GH₵100–200", desc: "Most popular weekend sweet spot" },
  { id: "200_500", label: "GH₵200–500", range: "GH₵200–500", desc: "Special dates, day passes, & sports" },
  { id: "500_plus", label: "GH₵500+", range: "GH₵500+", desc: "Premium luxury escapes" },
];

const DISTANCE_OPTIONS: { id: RecommendationFilter["distanceLimit"]; label: string; icon: string; desc: string }[] = [
  { id: "close", label: "Very close", icon: "📍", desc: "Within your immediate area (< 3 km)" },
  { id: "5km", label: "Up to 5 km", icon: "🚗", desc: "Quick 10–15 min Bolt ride" },
  { id: "10km", label: "Up to 10 km", icon: "🚗", desc: "Across neighboring districts" },
  { id: "anywhere", label: "Anywhere in Accra", icon: "🌍", desc: "Include beach coast & Aburi hills" },
];

const WHEN_DAYS = ["Today", "Tomorrow", "Saturday", "Sunday", "Choose date"] as const;
const WHEN_TIMES = [
  { id: "morning", label: "Morning", time: "9:00 AM – 12:30 PM", icon: "☀️" },
  { id: "afternoon", label: "Afternoon", time: "1:00 PM – 5:00 PM", icon: "🌤️" },
  { id: "evening", label: "Evening", time: "5:30 PM – Late", icon: "🌙" },
] as const;

export const GamifiedEscapeFinder: React.FC<Props> = ({
  experiences,
  initialFilters,
  onSelectExperience,
  onOpenSurpriseMe,
  onOpenWheel,
  onOpenBuildMyDay,
  onBookExperience,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedFeeling, setSelectedFeeling] = useState<IntentType>("relax");
  const [selectedActivity, setSelectedActivity] = useState<string>("Spa & Massage");
  const [customActivityInput, setCustomActivityInput] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<GroupType>("solo");
  const [partySize, setPartySize] = useState<number>(1);
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier>("100_200");
  const [selectedDistance, setSelectedDistance] = useState<RecommendationFilter["distanceLimit"]>("anywhere");
  const [selectedDay, setSelectedDay] = useState<string>("Saturday");
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<"morning" | "afternoon" | "evening">("afternoon");

  // Calculated matches for Screen 7 ("✨ We found your escape")
  const [matchedResults, setMatchedResults] = useState<RecommendationResult[]>([]);
  const autoAdvanceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  const triggerAutoAdvance = (nextStep: number, beforeAction?: () => void) => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    if (beforeAction) beforeAction();
    autoAdvanceTimerRef.current = setTimeout(() => {
      setCurrentStep(nextStep);
    }, 180);
  };

  const handleSelectFeeling = (feelId: IntentType) => {
    setSelectedFeeling(feelId);
    const acts = DYNAMIC_ACTIVITIES[feelId] || [];
    if (acts.length > 0) setSelectedActivity(acts[0]);
    triggerAutoAdvance(2);
  };

  const handleSelectActivity = (act: string) => {
    setSelectedActivity(act);
    setCustomActivityInput("");
    triggerAutoAdvance(3);
  };

  const handleSelectGroup = (groupId: GroupType, defaultSize: number) => {
    setSelectedGroup(groupId);
    setPartySize(defaultSize);
    triggerAutoAdvance(4);
  };

  const handleSelectPartySize = (size: number) => {
    setPartySize(size);
    triggerAutoAdvance(4);
  };

  const handleSelectBudget = (tierId: BudgetTier) => {
    setSelectedBudget(tierId);
    triggerAutoAdvance(5);
  };

  const handleSelectDistance = (distId: RecommendationFilter["distanceLimit"]) => {
    setSelectedDistance(distId);
    triggerAutoAdvance(6);
  };

  const handleTriggerFinalEscape = (overrideDay?: string, overrideTime?: "morning" | "afternoon" | "evening") => {
    const dayVal = overrideDay || selectedDay;
    const timeVal = overrideTime || selectedTimeOfDay;
    if (overrideDay) setSelectedDay(overrideDay);
    if (overrideTime) setSelectedTimeOfDay(overrideTime);

    const activeActivity = customActivityInput.trim() || selectedActivity;
    const filterObj: RecommendationFilter = {
      intent: selectedFeeling,
      activity: activeActivity,
      group: selectedGroup,
      budgetTier: selectedBudget,
      customMaxBudget: null,
      location: "Anywhere in Accra",
      distance: selectedDistance || "anywhere",
      distanceLimit: selectedDistance || "anywhere",
      dayOfWeek: dayVal.toLowerCase().includes("sat") ? "saturday" : dayVal.toLowerCase().includes("sun") ? "sunday" : "any",
      timeOfDay: timeVal,
      duration: "2–3 hours",
    };

    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    autoAdvanceTimerRef.current = setTimeout(() => {
      const calculated = calculateRecommendations(experiences, filterObj);
      setMatchedResults(calculated);
      setCurrentStep(7); // Magic moment
    }, 220);
  };

  useEffect(() => {
    if (initialFilters?.activity) {
      setSelectedActivity(initialFilters.activity);
      if (initialFilters.intent) setSelectedFeeling(initialFilters.intent);
    }
  }, [initialFilters]);

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedFeeling("relax");
    setSelectedActivity("Spa & Massage");
    setCustomActivityInput("");
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Top Stepper Bar */}
      <div className="bg-slate-50 border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            {/* Interactive Game Step Indicator */}
            <div className="flex items-center gap-1.5 mt-1">
              {[1, 2, 3, 4, 5, 6].map((s) => {
                const isPassed = currentStep >= s;
                const isCurrent = currentStep === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setCurrentStep(s)}
                    className={`h-3 rounded-full transition-all cursor-pointer ${
                      isCurrent
                        ? "w-6 bg-emerald-600 ring-2 ring-emerald-300"
                        : isPassed
                        ? "w-3 bg-emerald-400 hover:bg-emerald-500"
                        : "w-2 bg-slate-300"
                    }`}
                    title={`Jump to step ${s}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {currentStep > 1 && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2.5 py-2 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            Start over
          </button>
        )}
      </div>

      {/* Main Interactive Stage */}
      <div className="p-4 sm:p-8">
        {/* ================= SCREEN 1: How are you feeling? ================= */}
        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1.5">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Escape from stressful routine
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                How are you feeling?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Select your emotional intent. We will dynamically adapt activities to match your energy.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEELINGS.map((feel) => {
                const isSelected = selectedFeeling === feel.id;
                return (
                  <button
                    key={feel.id}
                    onClick={() => handleSelectFeeling(feel.id)}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer group active:scale-[0.99] ${
                      isSelected
                        ? "bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600 shadow-sm"
                        : "bg-white hover:bg-emerald-50/40 hover:border-emerald-200 border-slate-200"
                    }`}
                  >
                    <span className="text-3xl shrink-0 mt-0.5 transition-transform group-hover:scale-110">
                      {feel.emoji}
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between">
                        <span>{feel.label}</span>
                        {isSelected ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-snug">
                        {feel.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="text-center pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold">
                <span>⚡</span> Tap your mood to jump straight to the next challenge
              </span>
            </div>
          </div>
        )}

        {/* ================= SCREEN 2: What do you want to do? ================= */}
        {currentStep === 2 && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1.5">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Challenge 2 • Tailored to "{FEELINGS.find((f) => f.id === selectedFeeling)?.label}"
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                What do you want to do?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Tap your activity to lock it in and advance straight to squad selection.
              </p>
            </div>

            {/* Custom Input */}
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={customActivityInput}
                  onChange={(e) => setCustomActivityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customActivityInput.trim()) {
                      handleSelectActivity(customActivityInput.trim());
                    }
                  }}
                  placeholder="Or type custom, e.g. 'arcade bowling' or 'sunset cocktails' (press Enter)..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-emerald-600 font-medium"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              {customActivityInput.trim() && (
                <button
                  type="button"
                  onClick={() => handleSelectActivity(customActivityInput.trim())}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-2xl shadow-xs transition cursor-pointer flex items-center justify-center shrink-0"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dynamic Activity Options */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Curated for your mood:</span>
                <span className="text-[11px] text-emerald-600 font-semibold">1 tap to pick</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(DYNAMIC_ACTIVITIES[selectedFeeling] || []).map((act) => {
                  const isSelected = selectedActivity === act && !customActivityInput;
                  return (
                    <button
                      key={act}
                      onClick={() => handleSelectActivity(act)}
                      className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer group active:scale-[0.98] ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs ring-2 ring-emerald-500"
                          : "bg-slate-50 hover:bg-emerald-50/70 hover:border-emerald-300 text-slate-800 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{act}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 transition" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-3 py-2 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold">
                <span>⚡</span> Tap any activity or press Enter to advance
              </span>
            </div>
          </div>
        )}

        {/* ================= SCREEN 3: Who's coming? ================= */}
        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1.5">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Challenge 3 • Group dynamics & pricing
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Who's coming with you?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Tap your crew type or party count to jump directly to budget setting.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {GROUP_OPTIONS.map((grp) => {
                const isSelected = selectedGroup === grp.id;
                return (
                  <button
                    key={grp.id}
                    onClick={() => handleSelectGroup(grp.id, grp.defaultSize)}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer group active:scale-[0.98] ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600 shadow-xs"
                        : "bg-white hover:bg-emerald-50/50 hover:border-emerald-300 border-slate-200"
                    }`}
                  >
                    <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">{grp.icon}</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                      {grp.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                      ~{grp.defaultSize} {grp.defaultSize === 1 ? "person" : "people"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* How many people are coming? */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Or select exact party count:
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Tap any number to set party size and advance
                  </div>
                </div>
                <div className="text-base font-black text-emerald-700 font-mono">
                  {partySize} {partySize === 1 ? "Person" : "People"}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, "8+"].map((num) => {
                  const val = typeof num === "string" ? 8 : num;
                  const isCur = partySize === val;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleSelectPartySize(val)}
                      className={`w-11 h-11 rounded-xl font-bold text-xs transition cursor-pointer active:scale-95 ${
                        isCur
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300"
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-3 py-2 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold">
                <span>⚡</span> Tap your squad or party size to advance
              </span>
            </div>
          </div>
        )}

        {/* ================= SCREEN 4: What's your budget? ================= */}
        {currentStep === 4 && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1.5">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Challenge 4 • Transparent True Outing Cost
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                What's your budget vibe?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Tap your price tier to calculate entry, snacks, activity, and Bolt rides.
              </p>
            </div>

            <div className="space-y-2.5">
              {BUDGET_OPTIONS.map((tier) => {
                const isSelected = selectedBudget === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => handleSelectBudget(tier.id)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer group active:scale-[0.99] ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600 shadow-xs"
                        : "bg-white hover:bg-emerald-50/50 hover:border-emerald-300 border-slate-200"
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                        <span>{tier.label}</span>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition" />
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {tier.desc}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold font-mono bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 group-hover:border-emerald-400 transition">
                        {tier.range}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentStep(3)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-3 py-2 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold">
                <span>⚡</span> Tap your budget vibe to advance
              </span>
            </div>
          </div>
        )}

        {/* ================= SCREEN 5: How far do you want to escape? ================= */}
        {currentStep === 5 && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1.5">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Challenge 5 • Proximity & Traffic Radius
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                How far do you want to escape?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Tap your travel tolerance to jump straight to the timing launch.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DISTANCE_OPTIONS.map((dist) => {
                const isSelected = selectedDistance === dist.id;
                return (
                  <button
                    key={dist.id}
                    onClick={() => handleSelectDistance(dist.id)}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer group active:scale-[0.98] ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600 shadow-xs"
                        : "bg-white hover:bg-emerald-50/50 hover:border-emerald-300 border-slate-200"
                    }`}
                  >
                    <span className="text-2xl mt-0.5 group-hover:scale-110 transition-transform">{dist.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-sm text-slate-900 flex items-center justify-between">
                        <span>{dist.label}</span>
                        {isSelected ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition" />
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {dist.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentStep(4)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-3 py-2 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-semibold">
                <span>⚡</span> Tap your radius to advance
              </span>
            </div>
          </div>
        )}

        {/* ================= SCREEN 6: When? (Final Game Tap) ================= */}
        {currentStep === 6 && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1.5">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Final Step 6 • Launch Your Escape
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                When are you going?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Tap any timing slot to reveal your personalized Accra recommendations instantly!
              </p>
            </div>

            {/* Quick 1-Tap Express Outings */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                <span>⚡ 1-Tap Express Matches:</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                  Instant Results
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    id: "tonight",
                    label: "Tonight's Vibe",
                    timeLabel: "Evening • 6 PM onwards",
                    icon: "🌙",
                    day: "Friday",
                    time: "evening" as const,
                    desc: "Sunset cocktails, live sets, or cozy dining",
                  },
                  {
                    id: "sat_afternoon",
                    label: "Saturday Afternoon",
                    timeLabel: "Afternoon • 12 PM – 5 PM",
                    icon: "☀️",
                    day: "Saturday",
                    time: "afternoon" as const,
                    desc: "Beach clubs, pottery, arcade, or daytime pools",
                  },
                  {
                    id: "sat_night",
                    label: "Saturday Night Out",
                    timeLabel: "Evening • 7 PM – Midnight",
                    icon: "🎉",
                    day: "Saturday",
                    time: "evening" as const,
                    desc: "Snap Cinemas, bowling, rooftops, & night markets",
                  },
                  {
                    id: "sun_chill",
                    label: "Sunday Reset & Brunch",
                    timeLabel: "Morning/Noon • 10 AM – 3 PM",
                    icon: "🥐",
                    day: "Sunday",
                    time: "morning" as const,
                    desc: "Peaceful gardens, art galleries, and acoustic brunch",
                  },
                  {
                    id: "sun_sunset",
                    label: "Sunday Sunset Chill",
                    timeLabel: "Sunset • 4 PM – 8 PM",
                    icon: "🌊",
                    day: "Sunday",
                    time: "evening" as const,
                    desc: "Laboma beach breeze, jazz, and coastal dining",
                  },
                ].map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => handleTriggerFinalEscape(slot.day, slot.time)}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-emerald-50/90 hover:border-emerald-400 text-left transition-all cursor-pointer group shadow-2xs active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                        <span className="text-xl group-hover:scale-110 transition-transform">
                          {slot.icon}
                        </span>
                        <span>{slot.label}</span>
                      </div>
                      <Sparkles className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition" />
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-700 mt-1">
                      {slot.timeLabel}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {slot.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Or Custom Day & Time of Day */}
            <div className="pt-3 border-t border-slate-200/80 space-y-3">
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Or Pick Day & Time:
              </div>

              {/* Day Selector */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {WHEN_DAYS.map((day) => {
                  const isSelected = selectedDay === day;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {/* Time of Day options - tapping directly triggers match */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {WHEN_TIMES.map((tod) => {
                  const isSelected = selectedTimeOfDay === tod.id;
                  return (
                    <button
                      key={tod.id}
                      type="button"
                      onClick={() => handleTriggerFinalEscape(selectedDay, tod.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer group active:scale-[0.98] ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600 shadow-xs"
                          : "bg-white hover:bg-emerald-50/60 hover:border-emerald-300 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg group-hover:scale-110 transition-transform">
                            {tod.icon}
                          </span>
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {tod.label}
                          </span>
                        </div>
                        <Sparkles className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition" />
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {tod.time}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3">
              <button
                onClick={() => setCurrentStep(5)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-3 py-2 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Tap any time slot to reveal your matches!
              </span>
            </div>
          </div>
        )}

        {/* ================= SCREEN 7: THE MAGIC MOMENT ("✨ We found your escape.") ================= */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Celebration Header */}
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-2xs">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Personalized Accra Match
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                ✨ We found your escape.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Tailored for <span className="font-bold text-slate-900">{partySize} {partySize > 1 ? "people" : "person"}</span> looking to{" "}
                <span className="font-bold text-emerald-700">{FEELINGS.find((f) => f.id === selectedFeeling)?.label.toLowerCase()}</span> on{" "}
                <span className="font-bold text-slate-900">{selectedDay} {selectedTimeOfDay}</span>.
              </p>

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Adjust Answers
                </button>
                <button
                  onClick={() => onOpenBuildMyDay(matchedResults.map((r) => r.experience))}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  Convert to Full Day Plan
                </button>
              </div>
            </div>

            {/* Top Curated Escape Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-2">
              {matchedResults.slice(0, 3).map((result, idx) => {
                const exp = result.experience;
                const isTopPick = idx === 0;
                const matchBadgeTitle =
                  idx === 0
                    ? "🥇 Best Match"
                    : idx === 1
                    ? "💰 Best Value"
                    : "⭐ Best Experience";

                return (
                  <div
                    key={exp.id}
                    className={`rounded-3xl border transition-all flex flex-col overflow-hidden ${
                      isTopPick
                        ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg bg-white"
                        : "border-slate-200/90 hover:border-slate-300 bg-white shadow-xs"
                    }`}
                  >
                    {/* Visual Card Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      <img
                        src={exp.photos[0]}
                        alt={exp.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="bg-slate-900/90 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 shadow-sm">
                          {matchBadgeTitle}
                        </span>
                        <span className="bg-emerald-500 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
                          {Math.min(99, Math.max(78, result.matchScore))}% Match
                        </span>
                      </div>

                      {/* Bottom Image Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                          {exp.area} • {exp.duration}
                        </div>
                        <h3 className="font-extrabold text-lg leading-tight line-clamp-1">
                          {exp.name}
                        </h3>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                      {/* Price & Sequence Flow */}
                      <div>
                        <div className="flex items-center justify-between flex-wrap gap-x-3 gap-y-1 pb-3 border-b border-slate-100 text-xs">
                          <div>
                            <span className="text-slate-500 font-medium">Estimated Outing:</span>{" "}
                            <span className="font-black text-slate-900 text-sm font-mono">
                              GH₵{exp.trueCost.totalPerPerson}
                            </span>
                            <span className="text-[11px] text-slate-500"> / person</span>
                          </div>
                          {partySize > 1 && (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              Total: GH₵{exp.trueCost.totalPerPerson * partySize}
                            </span>
                          )}
                        </div>

                        {/* Sequence Flow (PRD Section 4: Relax -> Spa -> Coffee -> Sunset) */}
                        {result.contextCombo && (
                          <div className="mt-3 bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs space-y-1">
                            <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                              <Compass className="w-3 h-3 text-emerald-600" />
                              Sequence Flow:
                            </div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5 flex-wrap">
                              {result.contextCombo.steps.map((step, sIdx) => (
                                <React.Fragment key={sIdx}>
                                  <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[11px]">
                                    {step}
                                  </span>
                                  {sIdx < result.contextCombo!.steps.length - 1 && (
                                    <span className="text-slate-400 font-bold">→</span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Match Reasons */}
                        <div className="mt-3 space-y-1 text-xs">
                          <div className="text-[11px] font-bold text-slate-500">
                            Why we picked it:
                          </div>
                          <ul className="space-y-1 text-[11px] text-slate-600">
                            {result.matchReasons.slice(0, 2).map((reason, rIdx) => (
                              <li key={rIdx} className="flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => onBookExperience(exp, partySize)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
                        >
                          <span>Book & Plan Escape</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectExperience(exp)}
                          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 rounded-xl transition"
                        >
                          Explore Full Venue Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>

      {/* PLATFORMS Card */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                PLATFORMS
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 bg-sky-950/80 border border-sky-800/60 px-3 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                Available on telegrambot
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl" role="img" aria-label="Speech bubble">💬</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Telegram Bot
              </h3>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Search & book directly in Telegram. No app download needed. Works seamlessly across iPhone, Android, and Desktop.
            </p>

            <div className="inline-flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm">
              <span className="text-slate-400 font-medium">Bot Handle:</span>
              <a
                href="https://t.me/micro_escapebot"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-bold text-sky-400 hover:text-sky-300 transition"
              >
                @micro_escapebot
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
            <a
              href="https://t.me/micro_escapebot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-sky-500/25 transition active:scale-95"
            >
              <span>Open @micro_escapebot</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
