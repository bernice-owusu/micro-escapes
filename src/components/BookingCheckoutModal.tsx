import React, { useState } from "react";
import {
  X,
  Check,
  CreditCard,
  Smartphone,
  Car,
  Clock,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Sparkles,
  QrCode,
  Share2,
  Star,
  Upload,
  MessageCircle,
  Award,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Experience, BookingRecord, RideSimulation } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  experience: Experience | null;
  initialPartySize?: number;
  onBookingConfirmed: (booking: BookingRecord) => void;
  onClaimReviewPoints: (points: number) => void;
}

export const BookingCheckoutModal: React.FC<Props> = ({
  isOpen,
  onClose,
  experience,
  initialPartySize = 2,
  onBookingConfirmed,
  onClaimReviewPoints,
}) => {
  if (!isOpen || !experience) return null;

  const [step, setStep] = useState<"checkout" | "processing" | "confirmed" | "review">("checkout");
  const [partySize, setPartySize] = useState<number>(initialPartySize);
  const [selectedDate, setSelectedDate] = useState<string>("Saturday, Sep 19");
  const [selectedTime, setSelectedTime] = useState<string>("3:00 PM");

  // Ride transport simulation
  const [needRide, setNeedRide] = useState<boolean>(true);
  const [pickupAddress, setPickupAddress] = useState<string>("Airport Residential, Accra");
  const RIDE_COST_ESTIMATE = 35;

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<"momo" | "telecel" | "card" | "wallet">("momo");
  const [momoNumber, setMomoNumber] = useState<string>("0244123456");
  const [customerName, setCustomerName] = useState<string>("Kofi Mensah");

  // Confirmed booking record
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  // Review state
  const [rating, setRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("Incredible escape! Easy booking and great atmosphere.");
  const [photoUploaded, setPhotoUploaded] = useState<boolean>(false);
  const [pointsClaimed, setPointsClaimed] = useState<boolean>(false);

  // Cost calculations
  const ticketCostPerPerson = experience.trueCost.entryFee + experience.trueCost.activityCost;
  const totalTicketsCost = ticketCostPerPerson * partySize;
  const totalTransportCost = needRide ? RIDE_COST_ESTIMATE * (partySize > 4 ? 2 : 1) : 0;
  const grandTotal = totalTicketsCost + totalTransportCost;

  const handlePay = () => {
    setStep("processing");

    setTimeout(() => {
      const newBookingId = `ME-${Math.floor(1000 + Math.random() * 9000)}`;
      const booking: BookingRecord = {
        id: newBookingId,
        experienceId: experience.id,
        experienceName: experience.name,
        experienceArea: experience.area,
        experiencePhoto: experience.photos[0],
        date: selectedDate,
        timeSlot: selectedTime,
        partySize,
        ticketCost: totalTicketsCost,
        rideIncluded: needRide,
        rideCost: totalTransportCost,
        pickupAddress: needRide ? pickupAddress : undefined,
        totalPaid: grandTotal,
        paymentMethod,
        customerName,
        customerPhone: momoNumber,
        status: "confirmed",
        pointsEarned: 50,
        createdAt: new Date().toISOString(),
      };

      setConfirmedBooking(booking);
      onBookingConfirmed(booking);
      setStep("confirmed");

      // Confetti burst
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.warn(e);
      }
    }, 1800);
  };

  const handleCompleteEscapeAndReview = () => {
    setStep("review");
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setPointsClaimed(true);
    const earned = photoUploaded ? 80 : 70;
    onClaimReviewPoints(earned);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleShareToWhatsApp = () => {
    if (!confirmedBooking) return;
    const text = encodeURIComponent(
      `🎉 My Micro Escape in Accra is Confirmed!\n\n` +
      `• Escape: ${confirmedBooking.experienceName} (${confirmedBooking.experienceArea})\n` +
      `• Date & Time: ${confirmedBooking.date} at ${confirmedBooking.timeSlot}\n` +
      `• Party Size: ${confirmedBooking.partySize} people\n` +
      `• Total Paid: GH₵${confirmedBooking.totalPaid}\n` +
      `• Booking ID: ${confirmedBooking.id}\n\n` +
      `Concierge Line: 0559184383`
    );
    window.open(`https://wa.me/233559184383?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[calc(100dvh-1rem)] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              🎫
            </div>
            <div>
              <h2 className="font-extrabold text-slate-950 text-base leading-tight">
                {step === "checkout" && "Book & Plan Your Escape"}
                {step === "processing" && "Confirming Reservation..."}
                {step === "confirmed" && "Escape Confirmed 🎉"}
                {step === "review" && "How Was Your Escape?"}
              </h2>
              <div className="text-[11px] text-slate-500">
                {experience.name} • {experience.area}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 flex-1">
          {/* ================= STEP 1: CHECKOUT & RIDE CONFIGURATION ================= */}
          {step === "checkout" && (
            <div className="space-y-5">
              {/* Outing Summary Card */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex items-center gap-3">
                <img
                  src={experience.photos[0]}
                  alt={experience.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-sm text-slate-900 truncate">
                    {experience.name}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {experience.area} • {experience.duration}
                  </div>
                  <div className="text-xs font-bold text-emerald-700 mt-1">
                    GH₵{ticketCostPerPerson} / person ticket & activity
                  </div>
                </div>
              </div>

              {/* Schedule & People Pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Party Size
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setPartySize(Math.max(1, partySize - 1))}
                      className="w-8 h-8 rounded-lg bg-white text-slate-800 font-bold border border-slate-200 shadow-2xs"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-bold text-xs">
                      {partySize} {partySize > 1 ? "people" : "person"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPartySize(partySize + 1)}
                      className="w-8 h-8 rounded-lg bg-white text-slate-800 font-bold border border-slate-200 shadow-2xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    When
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold focus:outline-emerald-600"
                  >
                    <option>Saturday, Sep 19</option>
                    <option>Sunday, Sep 20</option>
                    <option>Tomorrow afternoon</option>
                    <option>Friday evening</option>
                  </select>
                </div>
              </div>

              {/* Transport Integration (PRD Section 13: Ride / Transport Integration) */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">
                        How are you getting there?
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Simulated Bolt / Uber ride partner
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 font-mono">
                    {needRide ? `+GH₵${totalTransportCost}` : "Self-drive"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setNeedRide(false)}
                    className={`p-2.5 rounded-xl border text-center font-bold transition ${
                      !needRide
                        ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    🚗 I'll get there myself
                  </button>
                  <button
                    type="button"
                    onClick={() => setNeedRide(true)}
                    className={`p-2.5 rounded-xl border text-center font-bold transition ${
                      needRide
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    🚕 I need a ride (+GH₵{RIDE_COST_ESTIMATE})
                  </button>
                </div>

                {needRide && (
                  <div className="space-y-2 pt-1 animate-in fade-in duration-200 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Pickup Location:
                      </label>
                      <input
                        type="text"
                        value={pickupAddress}
                        onChange={(e) => setPickupAddress(e.target.value)}
                        placeholder="e.g. Airport Residential, East Legon, Labone..."
                        className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs focus:outline-emerald-600"
                      />
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-2.5 flex items-center justify-between text-[11px] text-emerald-900">
                      <span>⚡ Estimated Pickup: ~8 mins</span>
                      <span className="font-bold">Driver Assigned on confirmation</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method Selector (PRD Section 15: Simulated Payment) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "momo", label: "MTN MoMo", icon: "📱" },
                    { id: "telecel", label: "Telecel Cash", icon: "🔴" },
                    { id: "card", label: "Bank Card", icon: "💳" },
                    { id: "wallet", label: "Escape Wallet", icon: "🪙" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 ${
                        paymentMethod === m.id
                          ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-base">{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Phone Number (MoMo / SMS)
                    </label>
                    <input
                      type="text"
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Price Breakdown Bill */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>
                    Experience Passes ({partySize} × GH₵{ticketCostPerPerson})
                  </span>
                  <span className="font-mono font-bold">GH₵{totalTicketsCost}</span>
                </div>
                {needRide && (
                  <div className="flex justify-between text-slate-300">
                    <span>Simulated Ride Transport</span>
                    <span className="font-mono font-bold">GH₵{totalTransportCost}</span>
                  </div>
                )}
                <div className="flex justify-between text-emerald-400 font-bold pt-2 border-t border-slate-800 text-sm">
                  <span>Total Amount</span>
                  <span className="font-mono text-base">GH₵{grandTotal}</span>
                </div>
                <div className="text-[10px] text-slate-400 text-center pt-1">
                  🔒 Secure simulated checkout • Earns +50 Escape Points!
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handlePay}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Pay GH₵{grandTotal} & Confirm Escape</span>
                </button>

                {/* Secondary WhatsApp Concierge Inquiry (PRD Section 14) */}
                <a
                  href={`https://wa.me/233559184383?text=${encodeURIComponent(
                    `Hello! I have questions before booking ${experience.name} on Micro Escapes:\n- Party Size: ${partySize}\n- Date: ${selectedDate}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Enquiry (0559184383)</span>
                </a>
              </div>
            </div>
          )}

          {/* ================= STEP 2: PROCESSING SIMULATION ================= */}
          {step === "processing" && (
            <div className="py-12 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">
                  Processing Your Escape Booking...
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Connecting to {paymentMethod === "momo" ? "MTN Mobile Money" : "Payment Gateway"} and reserving your slots at {experience.name}.
                </p>
              </div>
            </div>
          )}

          {/* ================= STEP 3: CONFIRMED DIGITAL TICKET ================= */}
          {step === "confirmed" && confirmedBooking && (
            <div className="space-y-5 animate-in zoom-in-95 duration-200">
              {/* Confirmed Header */}
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-xl font-black text-slate-950">
                  Your Escape is Confirmed!
                </h3>
                <p className="text-xs text-slate-600">
                  Booking ID:{" "}
                  <span className="font-mono font-extrabold text-emerald-800">
                    {confirmedBooking.id}
                  </span>
                </p>
              </div>

              {/* Digital Ticket Pass */}
              <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 relative overflow-hidden shadow-xl">
                <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                      Micro Escapes Accra Pass
                    </div>
                    <div className="text-base font-extrabold line-clamp-1 mt-0.5">
                      {confirmedBooking.experienceName}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {confirmedBooking.experienceArea}
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-slate-900" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-800 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400">Date</div>
                    <div className="font-bold text-xs">{confirmedBooking.date}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Party</div>
                    <div className="font-bold text-xs">{confirmedBooking.partySize} Guests</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Amount</div>
                    <div className="font-bold text-xs text-emerald-400 font-mono">
                      GH₵{confirmedBooking.totalPaid}
                    </div>
                  </div>
                </div>

                {confirmedBooking.rideIncluded && (
                  <div className="pt-2 text-[11px] text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-emerald-400" />
                      Ride Partner: Bolt Driver Isaac (Toyota Vitz)
                    </span>
                    <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                      Dispatched
                    </span>
                  </div>
                )}
              </div>

              {/* Earned Points Toast */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <div>
                    <span className="font-extrabold">+50 Escape Points</span> added to your account!
                  </div>
                </div>
                <span className="font-bold text-[11px] text-amber-700 bg-white px-2 py-0.5 rounded-lg border border-amber-200">
                  Leveling Up
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleShareToWhatsApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition text-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Ticket to WhatsApp (0559184383)</span>
                </button>

                {/* Simulate Outing Completed (PRD Section 15 & 23) */}
                <button
                  type="button"
                  onClick={handleCompleteEscapeAndReview}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-2 transition text-xs"
                >
                  <span>Simulate Escape Completed → Leave Review (+70 pts)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: POST-ESCAPE REVIEW & LOYALTY REWARD ================= */}
          {step === "review" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-slate-950">
                  How was your escape?
                </h3>
                <p className="text-xs text-slate-600">
                  Share your experience to help fellow Accra explorers and earn{" "}
                  <span className="font-bold text-amber-600">+70 Escape Points</span>!
                </p>
              </div>

              {!pointsClaimed ? (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Star Rating */}
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-2xl transition hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Review / Insider Tips
                    </label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-emerald-600"
                      placeholder="What made this escape special? Best dish, best time to visit?"
                    />
                  </div>

                  {/* Photo Upload Simulation */}
                  <div
                    onClick={() => setPhotoUploaded(!photoUploaded)}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${
                      photoUploaded
                        ? "border-emerald-500 bg-emerald-50/50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-slate-800">
                      {photoUploaded ? "✓ Photo Attached (sunset_escape.jpg)" : "Upload a photo (+10 extra bonus points)"}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Click to toggle mockup photo
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Submit & Claim +{photoUploaded ? "80" : "70"} Points</span>
                  </button>
                </form>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                  <div className="text-3xl">🎉</div>
                  <h4 className="font-extrabold text-base text-emerald-950">
                    Points Credited Successfully!
                  </h4>
                  <p className="text-xs text-emerald-800 max-w-xs mx-auto">
                    You earned <span className="font-bold">{photoUploaded ? 80 : 70} Escape Points</span> for reviewing {experience.name}. Your Accra Passport has been updated!
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
