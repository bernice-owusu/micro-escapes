import React, { useState, useRef } from "react";
import { X, Sparkles, Trophy, ArrowRight, RotateCw, MapPin } from "lucide-react";
import confetti from "canvas-confetti";
import { Experience, IntentType } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  experiences: Experience[];
  onSelectExperience: (experience: Experience) => void;
  onBookExperience: (experience: Experience, partySize: number) => void;
}

interface WheelSlice {
  id: IntentType | "surprise";
  label: string;
  emoji: string;
  color: string;
  lightColor: string;
  textColor: string;
  challenge: string;
}

const SLICES: WheelSlice[] = [
  { id: "relax", label: "Relax", emoji: "😌", color: "#10b981", lightColor: "#d1fae5", textColor: "#065f46", challenge: "Melt all stress with a tranquil coastal breeze or pool lounge!" },
  { id: "eat", label: "Good Food", emoji: "🍽️", color: "#f59e0b", lightColor: "#fef3c7", textColor: "#92400e", challenge: "Taste authentic Ghanaian grilled delicacies or artisanal brunch!" },
  { id: "adventure", label: "Adventure", emoji: "⚡", color: "#ef4444", lightColor: "#fee2e2", textColor: "#991b1b", challenge: "Conquer canopy heights, outdoor quad bikes, or coastal waves!" },
  { id: "date", label: "Romantic Date", emoji: "❤️", color: "#ec4899", lightColor: "#fce7f3", textColor: "#9d174d", challenge: "Intimate vibes, candlelit courtyard dining, and golden sunsets!" },
  { id: "fun", label: "Fun & Games", emoji: "🎳", color: "#8b5cf6", lightColor: "#ede9fe", textColor: "#5b21b6", challenge: "Roll strikes on bowling lanes or dive into board games with friends!" },
  { id: "explore", label: "Nature & Heritage", emoji: "🌿", color: "#14b8a6", lightColor: "#ccfbf1", textColor: "#115e59", challenge: "Explore historic Jamestown lighthouses or botanical hill paths!" },
  { id: "create", label: "Creative", emoji: "🎨", color: "#06b6d4", lightColor: "#cffafe", textColor: "#155e75", challenge: "Throw terracotta clay on a pottery wheel or paint with wine!" },
  { id: "surprise", label: "Wild Surprise", emoji: "🎲", color: "#f97316", lightColor: "#ffedd5", textColor: "#9a3412", challenge: "Spontaneous mystery outing — zero overthinking allowed!" },
];

const SPIN_MS = 2000;

export const EscapeWheelModal: React.FC<Props> = ({
  isOpen,
  onClose,
  experiences,
  onSelectExperience,
  onBookExperience,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [winner, setWinner] = useState<WheelSlice | null>(null);
  const [matchedVenues, setMatchedVenues] = useState<Experience[]>([]);

  if (!isOpen) return null;

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);
    setMatchedVenues([]);

    // Random landing index
    const randomIndex = Math.floor(Math.random() * SLICES.length);
    const sliceAngle = 360 / SLICES.length;
    // Calculate final angle to center the winning slice under the top pointer (90deg offset)
    const extraSpins = 360 * 5; // 5 full revolutions
    const targetDegree = rotationDegree + extraSpins + (360 - (randomIndex * sliceAngle) - sliceAngle / 2);

    setRotationDegree(targetDegree);

    setTimeout(() => {
      const selected = SLICES[randomIndex];
      setWinner(selected);
      setIsSpinning(false);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.warn(e);
      }

      // Find matched venues
      const filterIntent = selected.id === "surprise" ? null : selected.id;
      const matched = experiences
        .filter((exp) => (filterIntent ? exp.intents.includes(filterIntent as IntentType) : true))
        .slice(0, 3);
      setMatchedVenues(matched.length > 0 ? matched : experiences.slice(0, 3));
    }, SPIN_MS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              🎡
            </div>
            <div>
              <h2 className="font-extrabold text-slate-950 text-base sm:text-lg leading-tight">
                Spin the Escape Wheel
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Can't decide? Let fate hand-pick your Accra escape today.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition focus-visible:outline-2 focus-visible:outline-emerald-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 flex-1 flex flex-col items-center">
          {/* Wheel Container */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* Top Pointer Needle */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-500 drop-shadow-md" />
            </div>

            {/* Rotating SVG Wheel */}
            <div
              className="w-full h-full rounded-full border-4 border-slate-900 shadow-xl overflow-hidden relative transition-transform ease-out"
              style={{
                transform: `rotate(${rotationDegree}deg)`,
                transitionDuration: `${SPIN_MS}ms`,
                willChange: "transform",
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {SLICES.map((slice, i) => {
                  const angle = 360 / SLICES.length;
                  const startAngle = i * angle;
                  const endAngle = (i + 1) * angle;

                  const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                  const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                  const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                  const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
                  const textAngle = startAngle + angle / 2;
                  const textRad = (Math.PI * textAngle) / 180;
                  const tx = 50 + 34 * Math.cos(textRad);
                  const ty = 50 + 34 * Math.sin(textRad);

                  return (
                    <g key={slice.id}>
                      <path d={pathData} fill={slice.color} stroke="#ffffff" strokeWidth="0.75" />
                      <text
                        x={tx}
                        y={ty}
                        fill="#ffffff"
                        fontSize="6"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="central"
                        transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                      >
                        {slice.emoji} {slice.label.slice(0, 8)}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Center Hub */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-slate-900 border-4 border-white text-white flex items-center justify-center font-black text-xs shadow-md">
                  SPIN
                </div>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className={`w-full max-w-xs font-black py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md transition ${
              isSpinning
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-600 text-slate-950 scale-[1.02] active:scale-95"
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`} />
            <span>{isSpinning ? "Spinning the Wheel..." : "Spin the Wheel!"}</span>
          </button>

          {/* Winner Showcase */}
          {winner && (
            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="text-center space-y-1">
                <div className="text-3xl">{winner.emoji}</div>
                <h3 className="font-extrabold text-lg text-slate-950">
                  {winner.label}!
                </h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  {winner.challenge}
                </p>
              </div>

              {/* Matched Escapes */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Accra Escapes Ready for You:
                </div>
                <div className="space-y-2">
                  {matchedVenues.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={exp.photos[0]}
                          alt={exp.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-bold text-xs text-slate-900 line-clamp-1">
                            {exp.name}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {exp.area} • GH₵{exp.trueCost.totalPerPerson}/person
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onSelectExperience(exp);
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2.5 rounded-lg shrink-0 transition"
                      >
                        Explore
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
