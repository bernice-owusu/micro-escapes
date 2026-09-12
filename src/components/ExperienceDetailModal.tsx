import React, { useState } from "react";
import {
  X,
  MapPin,
  Clock,
  Calendar,
  Star,
  Heart,
  Share2,
  CheckCircle2,
  Phone,
  MessageCircle,
  ExternalLink,
  Users,
  Compass,
  Sparkles,
  Plus,
  Send,
  Navigation,
  ShieldCheck,
} from "lucide-react";
import { Experience, Review, UGCTip } from "../types";
import { TrueCostBadge } from "./TrueCostBadge";

interface Props {
  experience: Experience | null;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (exp: Experience) => void;
  onShare?: (exp: Experience) => void;
  onAddTip?: (expId: string, tip: Omit<UGCTip, "id" | "date">) => void;
  onBookNow?: (exp: Experience, partySize: number) => void;
}

export const ExperienceDetailModal: React.FC<Props> = ({
  experience,
  onClose,
  isSaved = false,
  onToggleSave,
  onShare,
  onAddTip,
  onBookNow,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [partySize, setPartySize] = useState(1);
  const [activeTab, setActiveTab] = useState<"overview" | "costs" | "reviews" | "tips">("overview");

  // State for user adding a UGC tip
  const [showTipForm, setShowTipForm] = useState(false);
  const [tipAuthor, setTipAuthor] = useState("");
  const [tipText, setTipText] = useState("");
  const [tipBestTime, setTipBestTime] = useState("");
  const [tipAmount, setTipAmount] = useState<number | "">("");

  if (!experience) return null;

  const handleTipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipText.trim() || !onAddTip) return;

    onAddTip(experience.id, {
      userName: tipAuthor.trim() || "Accra Explorer",
      tipText: tipText.trim(),
      bestTimeToVisit: tipBestTime.trim() || "Weekend afternoon",
      actualAmountSpent: Number(tipAmount) || experience.trueCost.totalPerPerson,
    });

    setTipAuthor("");
    setTipText("");
    setTipBestTime("");
    setTipAmount("");
    setShowTipForm(false);
  };

  const BOOKING_PHONE_RAW = "0559184383";
  const BOOKING_WHATSAPP_INTL = "233559184383";
  const BOOKING_PHONE_DISPLAY = "055 918 4383";

  const getWhatsAppBookingUrl = () => {
    // Official booking number requested: 0559184383 (WhatsApp intl: 233559184383)
    const phone = BOOKING_WHATSAPP_INTL;
    const text = encodeURIComponent(
      `Hello! I would like to book *${experience.name}* (${experience.area}) found on Micro Escapes.\n\n` +
      `• Party Size: ${partySize} ${partySize > 1 ? "people" : "person"}\n` +
      `• Estimated Outing Cost: ~GH₵${experience.trueCost.totalPerPerson * partySize}\n` +
      `• Activity: ${experience.activities.slice(0, 3).join(", ")}\n\n` +
      `Please confirm availability and how to proceed!`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  const getGoogleMapsDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      `${experience.name}, ${experience.address}, Accra, Ghana`
    )}`;
  };

  return (
    <div
      id="experience-detail-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-2 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition focus-visible:outline-2 focus-visible:outline-emerald-300"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Photo Carousel */}
        <div className="relative aspect-[16/9] sm:aspect-[2/1] bg-slate-900">
          <img
            src={experience.photos[activePhotoIdx] || experience.photos[0]}
            alt={experience.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

          {/* Photo thumbnails if more than 1 */}
          {experience.photos.length > 1 && (
            <div className="absolute bottom-3 right-4 flex gap-1.5 z-10">
              {experience.photos.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhotoIdx(i)}
                  className={`w-10 h-7 rounded-md overflow-hidden border-2 transition ${
                    activePhotoIdx === i ? "border-emerald-400 scale-105" : "border-white/50 opacity-70"
                  }`}
                >
                  <img src={p} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Overlay Title & Area */}
          <div className="absolute bottom-4 left-4 right-16 text-white pointer-events-none">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-600 font-bold text-xs px-2.5 py-0.5 rounded-full shadow-xs">
                {experience.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-200">
                <MapPin className="w-3.5 h-3.5" />
                {experience.area}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              {experience.name}
            </h2>
          </div>
        </div>

        {/* Action Bar (Save, Share, Directions, WhatsApp) */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-3 flex items-center justify-between gap-2 flex-wrap text-xs">
          {/* Trust & Data Quality (PRD Section 31) */}
          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Verified {experience.lastVerifiedDaysAgo} days ago • {experience.priceLastUpdated}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(experience)}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-full font-semibold transition ${
                  isSaved
                    ? "bg-rose-50 text-rose-600 border border-rose-200"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
                {isSaved ? "Saved" : "Save"}
              </button>
            )}

            {onShare && (
              <button
                onClick={() => onShare(experience)}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
            )}

            <a
              href={getGoogleMapsDirectionsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 font-semibold shadow-xs transition"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              Directions
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-4 text-xs font-semibold text-slate-600 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-3 border-b-2 transition shrink-0 whitespace-nowrap ${
              activeTab === "overview"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            Overview & Activities
          </button>
          <button
            onClick={() => setActiveTab("costs")}
            className={`py-3 px-3 border-b-2 transition shrink-0 whitespace-nowrap ${
              activeTab === "costs"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            True Outing Cost
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-3 px-3 border-b-2 transition shrink-0 whitespace-nowrap ${
              activeTab === "reviews"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            Reviews ({experience.reviews.length})
          </button>
          <button
            onClick={() => setActiveTab("tips")}
            className={`py-3 px-3 border-b-2 transition shrink-0 whitespace-nowrap ${
              activeTab === "tips"
                ? "border-emerald-600 text-emerald-700 font-bold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            Community Tips ({experience.ugcTips.length})
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="p-5 max-h-[55dvh] overflow-y-auto space-y-5">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">
                  About this escape
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {experience.description}
                </p>
              </div>

              {/* "What Can I Do There?" (PRD Section 17) */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-emerald-600" />
                  What can you actually do there?
                </h4>
                <div className="flex flex-wrap gap-2">
                  {experience.activities.map((act, i) => (
                    <span
                      key={i}
                      className="bg-white border border-slate-200 text-slate-800 text-xs px-3 py-1 rounded-lg font-medium shadow-2xs"
                    >
                      ✓ {act}
                    </span>
                  ))}
                </div>
              </div>

              {/* Context Combo if generated */}
              {experience.contextCombo && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950">
                  <div className="font-bold text-emerald-900 text-sm mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Recommended Outing Sequence: {experience.contextCombo.title}
                  </div>
                  <div className="space-y-1 my-2">
                    {experience.contextCombo.steps.map((step, idx) => (
                      <div key={idx} className="font-medium text-emerald-900">
                        {step}
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-emerald-700 italic">
                    &ldquo;{experience.contextCombo.whyItFits}&rdquo;
                  </div>
                </div>
              )}

              {/* Logistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px] mb-0.5">Duration</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {experience.duration}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px] mb-0.5">Hours</span>
                  <span className="font-semibold text-slate-800 line-clamp-1" title={experience.openingHours}>
                    {experience.openingHours}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[11px] mb-0.5">Great for</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {experience.goodFor.join(", ")}
                  </span>
                </div>
              </div>

              {/* Address & Booking Contact */}
              <div className="space-y-2 pt-1">
                <div className="text-xs text-slate-600 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{experience.address}</span>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">WhatsApp Booking Line</div>
                      <div className="text-slate-600 font-medium">
                        <span className="font-mono text-emerald-800 font-bold">{BOOKING_PHONE_DISPLAY}</span> ({BOOKING_PHONE_RAW}) • Fast inquiries & reservations
                      </div>
                    </div>
                  </div>
                  <a
                    href={getWhatsAppBookingUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl shrink-0 shadow-xs transition"
                  >
                    Chat / Book
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === "costs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Interactive Cost Calculator</h4>
                  <p className="text-xs text-slate-500">Calculate total expenses including food and transport</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                  <span className="text-xs text-slate-600 font-medium pl-2">People:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 4, 6].map((num) => (
                      <button
                        key={num}
                        onClick={() => setPartySize(num)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                          partySize === num
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-white text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <TrueCostBadge trueCost={experience.trueCost} partySize={partySize} />

              <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-3 text-xs text-amber-900 leading-relaxed">
                <strong>💡 Accra Local Tip:</strong> Unlike standard price lists that only show admission tickets, Micro Escapes factors in average food/drink spend and Bolt/Uber rides across Accra so you won't be caught by surprise.
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              {/* Overall Ratings Card */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <div className="text-3xl font-extrabold text-slate-900 flex items-center justify-center sm:justify-start gap-1">
                    <span>{experience.rating.toFixed(1)}</span>
                    <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Based on {experience.reviewCount} Accra escape reviews
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 w-full sm:w-auto">
                  <div className="flex items-center justify-between gap-3">
                    <span>Value for money:</span>
                    <span className="font-bold text-slate-900">4.8 / 5.0</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Atmosphere:</span>
                    <span className="font-bold text-slate-900">4.9 / 5.0</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Weekend Recommendation:</span>
                    <span className="font-bold text-emerald-700">98% Yes</span>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-3">
                {experience.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{rev.userName}</span>
                      <span className="text-slate-400 text-[11px]">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(rev.rating)
                                ? "fill-amber-500"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        Crowd: {rev.crowdLevel}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
                    {rev.amountSpentPerPerson && (
                      <div className="text-[11px] text-emerald-700 font-medium">
                        Spent ~GH₵{rev.amountSpentPerPerson} per person
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "tips" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Real Tips from People Who Visited</h4>
                  <p className="text-xs text-slate-500">Crowd levels, best times, and insider advice</p>
                </div>
                <button
                  onClick={() => setShowTipForm(!showTipForm)}
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Tip
                </button>
              </div>

              {/* Add Tip Form */}
              {showTipForm && (
                <form
                  onSubmit={handleTipSubmit}
                  className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl text-xs space-y-3 animate-in fade-in"
                >
                  <div className="font-bold text-slate-900 text-sm">
                    Share your experience tip
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={tipAuthor}
                        onChange={(e) => setTipAuthor(e.target.value)}
                        placeholder="e.g. Kwesi A."
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Best Time to Visit
                      </label>
                      <input
                        type="text"
                        value={tipBestTime}
                        onChange={(e) => setTipBestTime(e.target.value)}
                        placeholder="e.g. Saturday 4:30 PM"
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Actual Amount Spent (GH₵)
                    </label>
                    <input
                      type="number"
                      value={tipAmount}
                      onChange={(e) => setTipAmount(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 150"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Your Tip / Insider Advice
                    </label>
                    <textarea
                      value={tipText}
                      onChange={(e) => setTipText(e.target.value)}
                      placeholder="e.g. Arrive early before 5 PM to get the best seats on the terrace..."
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-emerald-500"
                      rows={2}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowTipForm(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-1.5 rounded-lg font-semibold hover:bg-emerald-700 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Post Tip
                    </button>
                  </div>
                </form>
              )}

              {/* Tips List */}
              <div className="space-y-2.5">
                {experience.ugcTips.map((tip) => (
                  <div
                    key={tip.id}
                    className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-slate-900 font-semibold">
                      <span>{tip.userName}</span>
                      <span className="text-slate-400 text-[11px] font-normal">{tip.date}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">&ldquo;{tip.tipText}&rdquo;</p>
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                      <span>🕒 Best time: <strong className="text-slate-700">{tip.bestTimeToVisit}</strong></span>
                      <span>💰 Spent: <strong className="text-emerald-700">GH₵{tip.actualAmountSpent}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA (PRD Section 14: Primary Book Now + Secondary WhatsApp) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wide">
              Est. Outing Total
            </div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900">
              ~GH₵{experience.trueCost.totalPerPerson * partySize}
              <span className="text-xs text-slate-500 font-normal ml-1">
                ({partySize > 1 ? `GH₵${experience.trueCost.totalPerPerson}/person` : "all-in"})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onBookNow && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookNow(experience, partySize);
                }}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Book Now & Reserve</span>
              </button>
            )}

            <a
              href={getWhatsAppBookingUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition"
              title="Quick WhatsApp Concierge"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>WhatsApp ({BOOKING_PHONE_RAW})</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
