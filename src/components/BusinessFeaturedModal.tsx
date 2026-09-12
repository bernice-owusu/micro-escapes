import React, { useState } from "react";
import { X, Sparkles, Building2, Check, ShieldCheck, ArrowRight, MessageCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { FeaturedRequest } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRequest: (req: FeaturedRequest) => void;
}

export const BusinessFeaturedModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmitRequest,
}) => {
  if (!isOpen) return null;

  const [businessName, setBusinessName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("0559184383");
  const [experienceName, setExperienceName] = useState("");
  const [campaignDates, setCampaignDates] = useState("Next Weekend");
  const [targetAudience, setTargetAudience] = useState("Couples & Young Professionals");
  const [preferredPlacement, setPreferredPlacement] = useState<FeaturedRequest["preferredPlacement"]>("Hero Banner");
  const [budgetGhc, setBudgetGhc] = useState<number>(1000);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: FeaturedRequest = {
      id: `feat-${Date.now()}`,
      businessName,
      contactPerson,
      email,
      phone,
      experienceName,
      campaignDates,
      targetAudience,
      preferredPlacement,
      budgetGhc,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    onSubmitRequest(newReq);
    setIsSubmitted(true);

    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[calc(100dvh-1rem)] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-950 text-base leading-tight">
                Request to Be Featured
              </h2>
              <p className="text-[11px] text-slate-500">
                Partner with Micro Escapes to reach thousands of Accra leisure seekers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 flex-1">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Two-Sided Venue Marketplace:
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Featured venues receive priority placement on the Gamified Escape Finder, Top Weekend Highlights, and push recommendations to active explorers.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Sandbox Beach Club"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Nana Kwesi"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marketing@venue.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp / Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Experience / Outing Name
                </label>
                <input
                  type="text"
                  required
                  value={experienceName}
                  onChange={(e) => setExperienceName(e.target.value)}
                  placeholder="e.g. Sunset Wine & Seafood Deck, Bowling Squad Special"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Placement
                </label>
                <select
                  value={preferredPlacement}
                  onChange={(e) => setPreferredPlacement(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-emerald-600"
                >
                  <option value="Hero Banner">🌟 Hero Banner (Top of App)</option>
                  <option value="Top of Category">🎯 Top of Category Recommendation</option>
                  <option value="Weekend Highlight">🔥 Weekend Mode Spotlight</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Campaign Budget (GH₵)
                  </label>
                  <input
                    type="number"
                    value={budgetGhc}
                    onChange={(e) => setBudgetGhc(Number(e.target.value))}
                    step={100}
                    min={200}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition text-xs sm:text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Featured Request</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-950">
                  Request Submitted Successfully!
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Our curator team will review <span className="font-bold text-slate-900">{experienceName}</span> for verified featured placement. You can also chat directly on WhatsApp.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={`https://wa.me/233559184383?text=${encodeURIComponent(
                    `Hello! I just submitted a featured placement request on Micro Escapes for: ${businessName} (${experienceName}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Follow Up on WhatsApp (0559184383)</span>
                </a>
                <button
                  onClick={onClose}
                  className="bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-slate-800 transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
