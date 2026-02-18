import React, { useState } from "react";
import axios from "axios";
import { useUI } from "../context/UIContext";

interface AddPathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddPathModal = ({ isOpen, onClose, onSuccess }: AddPathModalProps) => {
  const [newPath, setNewPath] = useState({ title: "", description: "" });
  const API_URL = "http://localhost:5142/api/learningpaths";

  const { showToast } = useUI();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, newPath);
      setNewPath({ title: "", description: "" });
      showToast("Path Saved Successfully!", "success");

      onSuccess();
      onClose();
    } catch (err) {
      alert(`Error saving new path ${err}`);
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
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-slate-200 dark:border-slate-700">
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
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              value={newPath.description}
              onChange={(e) =>
                setNewPath({ ...newPath, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-slate-100 h-32 transition-all"
              placeholder="What will you learn?"
            />
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
