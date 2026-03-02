import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { LearningPath } from "../types";
import { useUI } from "../context/UIContext";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

interface EditPathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  path: LearningPath;
}

const EditPathModal = ({
  isOpen,
  onClose,
  onSuccess,
  path,
}: EditPathModalProps) => {
  const [formData, setFormData] = useState({
    title: path.title,
    description: path.description,
    targetDate: path.targetDate ? path.targetDate.split("T")[0] : "",
  });

  const API_URL = `http://localhost:5142/api/learningpaths/${path.id}`;
  const { showToast } = useUI();

  // Sync state whenever the path prop changes
  useEffect(() => {
    setFormData({
      title: path.title,
      description: path.description,
      targetDate: path.targetDate ? path.targetDate.split("T")[0] : "",
    });
  }, [path, isOpen]);

  // Has the form changed from the original data?
  const isChanged =
    formData.title !== path.title ||
    formData.description !== path.description ||
    formData.targetDate !==
      (path.targetDate ? path.targetDate.split("T")[0] : "");

  const mdeOptions = useMemo(
    () => ({
      spellChecker: false,
      placeholder:
        "Write your path description, notes, or code snippets here in Markdown...",
      status: false,
    }),
    [],
  );

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(API_URL, {
        ...formData,
        isCompleted: path.isCompleted,
        targetDate: formData.targetDate
          ? new Date(formData.targetDate).toISOString()
          : null,
      });
      showToast("Path Updated Successfully!", "success");

      onSuccess();
      onClose();
    } catch (err) {
      alert("Update failed");
    }
  };

  if (!isOpen) return null;

  // This sends the modal to the bottom of <body>, bypassing the card's CSS.
  // This prevents z-index and overflow issues, ensuring the modal always appears on top and is fully visible.
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl p-6 md:p-8 z-10 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Edit Learning Path
        </h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-slate-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Target Completion Date (Optional)
            </label>
            <input
              type="date"
              value={formData.targetDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, targetDate: e.target.value })
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
                value={formData.description}
                onChange={(value) =>
                  setFormData({ ...formData, description: value })
                }
                options={mdeOptions}
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isChanged}
              className={`flex-1 font-semibold py-2 rounded-lg shadow-md transition-all 
                ${isChanged ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
            >
              Update Path
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default EditPathModal;
