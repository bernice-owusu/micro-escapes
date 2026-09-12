import React, { useState } from "react";
import { Coins, ChevronDown, ChevronUp, Car, Utensils, Ticket, Sparkles } from "lucide-react";
import { TrueCostBreakdown } from "../types";

interface Props {
  trueCost: TrueCostBreakdown;
  partySize?: number;
  compact?: boolean;
}

export const TrueCostBadge: React.FC<Props> = ({
  trueCost,
  partySize = 1,
  compact = false,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const multiplier = Math.max(1, partySize);
  const totalDisplay = trueCost.totalPerPerson * multiplier;

  if (compact) {
    return (
      <div className="relative inline-block">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(!showDropdown);
          }}
          className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-full text-xs font-semibold transition"
          title="Click to see True Outing Cost breakdown"
        >
          <Coins className="w-3.5 h-3.5 text-emerald-600" />
          <span>Est. Outing: ~GH₵{trueCost.totalPerPerson}</span>
          {showDropdown ? (
            <ChevronUp className="w-3 h-3 opacity-60" />
          ) : (
            <ChevronDown className="w-3 h-3 opacity-60" />
          )}
        </button>

        {showDropdown && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute z-30 bottom-full mb-1.5 left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-3 text-xs text-slate-700 animate-in fade-in zoom-in-95"
          >
            <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                True Outing Cost Breakdown
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Per person</span>
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Ticket className="w-3 h-3 text-slate-400" /> Entry fee:
                </span>
                <span className="font-medium text-slate-900">
                  {trueCost.entryFee > 0 ? `GH₵${trueCost.entryFee}` : "Free"}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-slate-400" /> Activity / gear:
                </span>
                <span className="font-medium text-slate-900">
                  {trueCost.activityCost > 0 ? `GH₵${trueCost.activityCost}` : "Included"}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Utensils className="w-3 h-3 text-slate-400" /> Food & drinks est.:
                </span>
                <span className="font-medium text-slate-900">GH₵{trueCost.foodAndDrinks}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Car className="w-3 h-3 text-slate-400" /> Est. Bolt/Uber transport:
                </span>
                <span className="font-medium text-slate-900">GH₵{trueCost.transportEstimate}</span>
              </div>
              <div className="border-t border-slate-100 pt-1.5 flex justify-between items-center font-bold text-emerald-700 text-[13px]">
                <span>Total Outing Estimate:</span>
                <span>GH₵{trueCost.totalPerPerson}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-emerald-50/60 border border-emerald-100/90 rounded-xl p-3.5 text-xs text-slate-700">
      <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
        <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
          <Coins className="w-4 h-4 text-emerald-600" />
          True Outing Cost Estimate
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
          {partySize > 1 ? `${partySize} people` : "Per person"}
        </span>
      </div>

      <div className="mt-2.5 space-y-1.5 text-slate-600">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <Ticket className="w-3.5 h-3.5 text-slate-400" /> Entry admission:
          </span>
          <span className="font-semibold text-slate-800">
            {trueCost.entryFee > 0 ? `GH₵${trueCost.entryFee * multiplier}` : "Free"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-slate-400" /> Core activity / rentals:
          </span>
          <span className="font-semibold text-slate-800">
            {trueCost.activityCost > 0 ? `GH₵${trueCost.activityCost * multiplier}` : "Included"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-slate-400" /> Food & beverages:
          </span>
          <span className="font-semibold text-slate-800">GH₵{trueCost.foodAndDrinks * multiplier}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-slate-400" /> Est. Bolt / Uber ride:
          </span>
          <span className="font-semibold text-slate-800">GH₵{trueCost.transportEstimate * multiplier}</span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-emerald-200/70 flex justify-between items-center">
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wide font-medium">
            Realistic Total Budget
          </div>
          <div className="text-base font-extrabold text-emerald-800">
            ~GH₵{totalDisplay}
          </div>
        </div>
        <div className="text-right text-[11px] text-slate-500">
          {partySize > 1 ? `(~GH₵${trueCost.totalPerPerson}/person)` : "Everything included"}
        </div>
      </div>
    </div>
  );
};
