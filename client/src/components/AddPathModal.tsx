import React, { useMemo, useState } from "react";
import axios from "axios";
import { useUI } from "../context/UIContext";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

interface AddPathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddPathModal = ({ isOpen, onClose, onSuccess }: AddPathModalProps) => {
  const [newPath, setNewPath] = useState({
    title: "",
    description: "",
    targetDate: "",
  });
  const API_URL = "http://localhost:5142/api/learningpaths";

  const { showToast } = useUI();

  const mdeOptions = useMemo(
    () => ({
      spellChecker: false,
      placeholder:
        "Write your path description, notes, or code snippets here in Markdown...",
      status: false,
    }),
    [],
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newPath,
        targetDate: newPath.targetDate
          ? new Date(newPath.targetDate).toISOString()
          : null, // If there is a date, convert it to a UTC ISO string. Otherwise null.
      };

      await axios.post(API_URL, payload);
      setNewPath({ title: "", description: "", targetDate: "" });
      showToast("Path Saved Successfully!", "success");

      onSuccess();
      onClose();
    } catch (err) {
      showToast(`Failed to save path. Error - ${err}`, "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl p-6 md:p-8 z-10 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Create New Learning Path
        </h2>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Title
            </label>
            <input
              required
              type="text"
              value={newPath.title}
              onChange={(e) =>
                setNewPath({ ...newPath, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-slate-100 transition-all"
              placeholder="e.g. Master TypeScript"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Target Completion Date (Optional)
            </label>
            <input
              type="date"
              value={newPath.targetDate || ""}
              onChange={(e) =>
                setNewPath({ ...newPath, targetDate: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Description / Notes
            </label>
            <div className="prose-sm dark:prose-invert max-w-none">
              <SimpleMdeReact
                value={newPath.description}
                onChange={(value) =>
                  setNewPath({ ...newPath, description: value })
                }
                options={mdeOptions}
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-all active:scale-95"
            >
              Save Path
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPathModal;
