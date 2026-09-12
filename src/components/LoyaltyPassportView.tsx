import React, { useState } from "react";
import {
  Award,
  Sparkles,
  Trophy,
  CheckCircle2,
  Lock,
  Share2,
  Gift,
  ArrowRight,
  Flame,
  Star,
  Users,
  MapPin,
  Calendar,
} from "lucide-react";
import confetti from "canvas-confetti";
import { PassportStamp, WeeklyChallenge } from "../types";
import { calculateLoyaltyTier } from "../data/loyaltyData";

interface Props {
  points: number;
  stamps: PassportStamp[];
  challenges: WeeklyChallenge[];
  onClaimChallenge: (challengeId: string, points: number) => void;
  onSelectStampCategory: (category: string) => void;
}

export const LoyaltyPassportView: React.FC<Props> = ({
  points,
  stamps,
  challenges,
  onClaimChallenge,
  onSelectStampCategory,
}) => {
  const [activeTab, setActiveTab] = useState<"passport" | "challenges" | "rewards">("passport");
  const [selectedStamp, setSelectedStamp] = useState<PassportStamp | null>(null);

  const tierInfo = calculateLoyaltyTier(points);
  const unlockedCount = stamps.filter((s) => s.isUnlocked).length;
  const progressPercent = Math.round((unlockedCount / stamps.length) * 100);

  const handleSharePassport = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Accra Escape Passport",
        text: `I've unlocked ${unlockedCount}/${stamps.length} micro escape stamps across Accra with ${points} points! Explore with me on Micro Escapes.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      window.open(
        `https://wa.me/233559184383?text=${encodeURIComponent(
          `Check out my Accra Escape Passport! I have unlocked ${unlockedCount} stamps and earned ${points} Escape Points on Micro Escapes Accra.`
        )}`,
        "_blank"
      );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-300">
      {/* Loyalty Header Banner - Compact & sleek */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-md border border-slate-800">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-300 border border-white/10">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Micro Escapes Passport</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              My Escape Passport
            </h1>
            <p className="text-xs text-slate-300 max-w-md">
              Earn points for escaping routine, collect digital Accra stamps, and unlock weekend perks.
            </p>
          </div>

          {/* Points Stat Box - Compact */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 flex items-center gap-3 shrink-0 shadow-inner">
            <div className="w-9 h-9 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center text-lg font-black shrink-0">
              🏆
            </div>
            <div>
              <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                Points Balance
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono leading-none">
                {points.toLocaleString()}{" "}
                <span className="text-[10px] font-normal text-slate-300">PTS</span>
              </div>
              <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">
                Tier: {tierInfo.tier}
              </div>
            </div>
          </div>
        </div>

        {/* Tier Progress Bar - Compact */}
        <div className="mt-3.5 pt-3 border-t border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-white">
                Tier: <span className="text-emerald-400">{tierInfo.tier}</span>
              </span>
              {tierInfo.nextTier && (
                <span className="text-slate-400 text-[10px]">
                  → Next: <span className="text-white font-semibold">{tierInfo.nextTier}</span> ({tierInfo.pointsToNext} pts away)
                </span>
              )}
            </div>
            <span className="font-mono text-emerald-300 font-bold text-xs">
              {tierInfo.progressPercent}%
            </span>
          </div>

          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${tierInfo.progressPercent}%` }}
            />
          </div>

          {/* Perks Row */}
          <div className="flex items-center gap-1.5 pt-0.5 flex-wrap text-[10px] text-slate-300">
            <span className="font-bold text-emerald-400">Perks:</span>
            {tierInfo.perks.map((p, idx) => (
              <span key={idx} className="bg-white/5 border border-white/10 px-1.5 py-0.2 rounded">
                ✓ {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs - Compact */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1.5 text-xs font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("passport")}
          className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === "passport"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>🇬🇭 Stamps</span>
          <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {unlockedCount}/{stamps.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("challenges")}
          className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === "challenges"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>🎯 Challenges</span>
        </button>

        <button
          onClick={() => setActiveTab("rewards")}
          className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === "rewards"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>🎁 Perks</span>
        </button>
      </div>

      {/* ================= TAB 1: ESCAPE PASSPORT (PRD Section 19) ================= */}
      {activeTab === "passport" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div>
              <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                Digital Stamp Book
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-950">
                Collect Stamps Across Greater Accra
              </h3>
              <p className="text-xs text-slate-500">
                Each completed escape adds a stamped badge to your passport.
              </p>
            </div>
            <button
              onClick={handleSharePassport}
              className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-2 rounded-lg transition shrink-0 cursor-pointer self-start sm:self-auto"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share Passport
            </button>
          </div>

          {/* Stamps Grid - Compact & refined */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {stamps.map((stamp) => {
              return (
                <div
                  key={stamp.id}
                  onClick={() => setSelectedStamp(stamp)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center relative ${
                    stamp.isUnlocked
                      ? "bg-amber-50/40 border-amber-300 hover:border-amber-400 shadow-2xs hover:scale-[1.01]"
                      : "bg-slate-50/70 border-slate-200 opacity-60 hover:opacity-80"
                  }`}
                >
                  {/* Top Status Icon */}
                  <div className="absolute top-2 right-2">
                    {stamp.isUnlocked ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Lock className="w-3 h-3 text-slate-400" />
                    )}
                  </div>

                  {/* Stamp Graphic - Smaller & tighter */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 border-2 border-dashed ${
                      stamp.isUnlocked
                        ? "border-amber-500 bg-amber-100/80 shadow-xs"
                        : "border-slate-300 bg-slate-100 text-slate-400 grayscale"
                    }`}
                  >
                    {stamp.icon}
                  </div>

                  <div className="font-bold text-xs text-slate-900 line-clamp-1">
                    {stamp.activityName}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                    {stamp.category}
                  </div>

                  {stamp.isUnlocked ? (
                    <div className="mt-1.5 text-[9px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.2 rounded-full border border-amber-200">
                      Stamped ✓
                    </div>
                  ) : (
                    <div className="mt-1.5 text-[9px] text-slate-500">
                      Locked
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Stamp Detail Inspection Modal */}
          {selectedStamp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
              <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 border border-slate-200 shadow-xl text-center">
                <div className="w-20 h-20 rounded-full border-4 border-amber-500 bg-amber-50 flex items-center justify-center text-4xl mx-auto shadow-sm">
                  {selectedStamp.icon}
                </div>
                <div>
                  <h4 className="font-black text-lg text-slate-950">
                    {selectedStamp.activityName}
                  </h4>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Category: {selectedStamp.category}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 text-left space-y-1">
                  <div>
                    <span className="font-bold text-slate-900">Status:</span>{" "}
                    {selectedStamp.isUnlocked ? (
                      <span className="text-emerald-700 font-bold">Unlocked ({selectedStamp.unlockedDate})</span>
                    ) : (
                      <span className="text-slate-500">Not yet unlocked</span>
                    )}
                  </div>
                  {selectedStamp.venueName && (
                    <div>
                      <span className="font-bold text-slate-900">Unlocked At:</span>{" "}
                      {selectedStamp.venueName}
                    </div>
                  )}
                  {selectedStamp.stampNote && (
                    <p className="text-slate-600 pt-1 italic">
                      "{selectedStamp.stampNote}"
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setSelectedStamp(null)}
                  className="w-full bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl transition hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: WEEKLY CHALLENGES (PRD Section 18) ================= */}
      {activeTab === "challenges" && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-amber-900 text-xs">
            <Flame className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Weekly Quests Refresh Every Monday:</span> Complete challenges to boost your Escape Points balance and climb loyalty tiers faster!
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {challenges.map((ch) => (
              <div
                key={ch.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-2xs hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{ch.icon}</span>
                    <span className="bg-amber-100 text-amber-900 font-mono font-extrabold text-xs px-2.5 py-1 rounded-lg border border-amber-200">
                      +{ch.points} PTS
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {ch.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {ch.description}
                  </p>
                </div>

                <div>
                  {ch.isCompleted ? (
                    <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs py-2 rounded-xl text-center flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Completed ✓ (+{ch.points} pts awarded)</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        onClaimChallenge(ch.id, ch.points);
                        try {
                          confetti({ particleCount: 70, spread: 60 });
                        } catch (e) {}
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Simulate Completion & Claim</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: MEMBER REWARDS (PRD Section 17) ================= */}
      {activeTab === "rewards" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {[
              {
                title: "GH₵30 Off Next Escape",
                cost: 500,
                desc: "Instant discount on any partner booking in Osu or East Legon.",
                icon: "🎟️",
              },
              {
                title: "Free House Cocktail",
                cost: 800,
                desc: "Complimentary signature drink at Sandbox Beach Club.",
                icon: "🍹",
              },
              {
                title: "VIP Bowling Lane Priority",
                cost: 1200,
                desc: "Jump the weekend waiting line at Bliss Family Entertainment.",
                icon: "🎳",
              },
            ].map((reward, idx) => {
              const canAfford = points >= reward.cost;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-2xs"
                >
                  <div>
                    <span className="text-3xl block mb-2">{reward.icon}</span>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      {reward.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {reward.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-amber-700">
                      {reward.cost} PTS
                    </span>
                    <button
                      disabled={!canAfford}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                        canAfford
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {canAfford ? "Redeem Perk" : "Locked"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
