import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { LearningPath } from "../types";

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
  });
  const API_URL = `http://localhost:5142/api/learningpaths/${path.id}`;

  // Sync state whenever the path prop changes
  useEffect(() => {
    setFormData({ title: path.title, description: path.description });
  }, [path, isOpen]);

  // Has the form changed from the original data?
  const isChanged =
    formData.title !== path.title || formData.description !== path.description;
  const isInvalid = formData.title.trim() === "";

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(API_URL, formData);
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Edit Learning Path
        </h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32"
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg"
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
