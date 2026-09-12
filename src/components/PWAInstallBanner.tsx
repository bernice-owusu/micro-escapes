import React, { useState } from "react";
import { Download, Share2, X, Smartphone } from "lucide-react";
import { usePWAInstall } from "../hooks/usePWAInstall";

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) {
    return null;
  }

  if (isInstallable) {
    return (
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 py-2.5 shadow-sm text-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 shrink-0 text-emerald-200" />
          <span className="font-medium text-xs sm:text-sm">
            Install <strong>Micro Escapes</strong> for faster 1-tap Accra recommendations
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={install}
            className="flex items-center gap-1.5 bg-white text-emerald-800 hover:bg-emerald-50 px-3 py-1 rounded-full text-xs font-semibold shadow transition"
          >
            <Download className="w-3.5 h-3.5" />
            Install App
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-white/80 hover:text-white p-1 rounded transition"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (isIOS) {
    return (
      <>
        <div className="bg-slate-900 text-slate-100 px-4 py-2 text-xs flex items-center justify-between gap-2 border-b border-slate-800">
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            Add to iPhone home screen for the full app experience
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIOSGuide(true)}
              className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2"
            >
              How to install
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  Install Micro Escapes on iOS
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ol className="mt-4 space-y-3 text-sm text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="bg-emerald-100 text-emerald-800 font-bold rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Tap the <strong>Share</strong> icon (
                    <Share2 className="w-4 h-4 inline text-blue-600 mx-0.5" />) in your Safari toolbar at the bottom.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="bg-emerald-100 text-emerald-800 font-bold rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Scroll down and select <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="bg-emerald-100 text-emerald-800 font-bold rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    Tap <strong>Add</strong> in the top right corner. You're set!
                  </span>
                </li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
