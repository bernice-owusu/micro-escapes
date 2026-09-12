import React, { useState } from "react";
import {
  Heart,
  FolderPlus,
  Share2,
  Trash2,
  ExternalLink,
  MapPin,
  Coins,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Experience, SavedFolder } from "../types";
import { ExperienceCard } from "./ExperienceCard";

interface Props {
  savedFolders: SavedFolder[];
  experiences: Experience[];
  onSelectExperience: (exp: Experience) => void;
  onRemoveSaved: (folderId: string, expId: string) => void;
  onCreateFolder: (name: string) => void;
  onShare: (exp: Experience) => void;
}

export const MyEscapesView: React.FC<Props> = ({
  savedFolders,
  experiences,
  onSelectExperience,
  onRemoveSaved,
  onCreateFolder,
  onShare,
}) => {
  const [activeFolderId, setActiveFolderId] = useState<string>(
    savedFolders[0]?.id || "f-dates"
  );
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);

  const activeFolder =
    savedFolders.find((f) => f.id === activeFolderId) || savedFolders[0];

  const savedExperiences = activeFolder
    ? experiences.filter((e) => activeFolder.experienceIds.includes(e.id))
    : [];

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onCreateFolder(newFolderName.trim());
    setNewFolderName("");
    setShowNewFolderModal(false);
  };

  const handleShareWhatsAppFolder = () => {
    if (!activeFolder || savedExperiences.length === 0) return;

    let text = `✨ *My Saved Micro Escapes: ${activeFolder.name}*\n\n`;
    savedExperiences.forEach((exp, idx) => {
      text += `${idx + 1}. *${exp.name}* (${exp.area})\n`;
      text += `   • What to do: ${exp.activities.slice(0, 2).join(", ")}\n`;
      text += `   • Est. Outing: ~GH₵${exp.trueCost.totalPerPerson}/person\n\n`;
    });
    text += `Curated using Micro Escapes (Accra, Ghana)`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 text-xs font-bold px-3 py-1 rounded-full border border-rose-200 mb-1">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            Personal Escape Collections
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            My Escapes
          </h2>
          <p className="text-xs text-slate-500">
            Organize spots into wishlists, date night ideas, or friend hangouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedExperiences.length > 0 && (
            <button
              onClick={handleShareWhatsAppFolder}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share List on WhatsApp
            </button>
          )}

          <button
            onClick={() => setShowNewFolderModal(true)}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition"
          >
            <FolderPlus className="w-3.5 h-3.5 text-slate-600" />
            New Folder
          </button>
        </div>
      </div>

      {/* Folders Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
        {savedFolders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => setActiveFolderId(folder.id)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-2 ${
              activeFolderId === folder.id
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <span>{folder.name}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeFolderId === folder.id
                  ? "bg-slate-700 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {folder.experienceIds.length}
            </span>
          </button>
        ))}
      </div>

      {/* Experiences List in Active Folder */}
      {savedExperiences.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <Heart className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">
            No escapes saved to &ldquo;{activeFolder?.name}&rdquo; yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse recommendations and tap the heart icon on any card to save it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedExperiences.map((exp) => (
            <div key={exp.id} className="relative group">
              <ExperienceCard
                experience={exp}
                onSelect={onSelectExperience}
                isSaved={true}
                onToggleSave={() => onRemoveSaved(activeFolder.id, exp.id)}
                onShare={onShare}
              />
            </div>
          ))}
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateFolder}
            className="bg-white rounded-2xl p-5 w-full max-w-sm border border-slate-200 shadow-xl space-y-4"
          >
            <h3 className="font-bold text-base text-slate-900">
              Create New Escape Folder
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Folder Name
              </label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g. Kokrobite Weekends, Spas to Try"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-emerald-600"
                autoFocus
                required
              />
            </div>
            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setShowNewFolderModal(false)}
                className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-xs"
              >
                Create Folder
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
