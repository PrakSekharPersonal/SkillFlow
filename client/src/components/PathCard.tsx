import { useState } from "react";
import axios from "axios";
import { LearningPath } from "../types";
import EditPathModal from "./EditPathModal";
import DeleteModal from "./DeleteModal";
import { useUI } from "../context/UIContext";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

interface PathCardProps {
  path: LearningPath;
  onRefresh: () => void;
}

const PathCard = ({ path, onRefresh }: PathCardProps) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { showToast } = useUI();
  const navigate = useNavigate();

  const toggleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    try {
      await axios.put(`http://localhost:5142/api/learningpaths/${path.id}`, {
        ...path,
        isCompleted: !path.isCompleted,
      });
      showToast(
        path.isCompleted ? "Moved back to active" : "Path Completed! 🏆",
        "success",
      );
      onRefresh();
    } catch (err) {
      console.error(err);
      showToast("Failed to update path status", "error");
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5142/api/learningpaths/${path.id}`);
      showToast("Path Deleted Successfully", "success");

      onRefresh();
      setShowDelete(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to delete path", "error");
    }
  };

  const handleCardClick = () => {
    navigate(`/path/${path.id}`);
  };

  let isOverdue = false;
  let formattedTargetDate = null;

  if (path.targetDate) {
    // Grab only the YYYY-MM-DD part from the backend ISO string
    const datePart = path.targetDate.split("T")[0];
    const [year, month, day] = datePart.split("-");

    // Force the date into local time at midnight (month is 0-indexed in JS)
    const target = new Date(Number(year), Number(month) - 1, Number(day));

    // Get today at exactly midnight for accurate comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    isOverdue = !path.isCompleted && target < today;
    formattedTargetDate = target.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col gap-2">
          <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase w-fit">
            Path #{path.id}
          </span>
        </div>

        {/* STATUS + ACTION BUTTONS */}
        <div className="flex items-center gap-3">
          <label
            onClick={(e) => e.stopPropagation()} // Prevent card click event
            className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors
      ${
        path.isCompleted
          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
          : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
      }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {path.isCompleted ? "Completed" : "Active"}
            </span>
            <input
              type="checkbox"
              checked={path.isCompleted}
              onChange={() => {}} // Handled by label click above to easily capture the event
              onClick={toggleComplete}
              className="w-4 h-4 rounded border-none bg-white/50 dark:bg-black/20 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
          </label>

          {/* EDIT & DELETE BUTTONS */}
          <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEdit(true);
              }}
              className="text-slate-400 hover:text-blue-600 p-1 transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDelete(true);
              }}
              className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <h3
        className={`text-xl font-bold mb-2 transition-colors 
        ${path.isCompleted ? "text-slate-400 line-through" : "text-slate-800 dark:text-slate-100"}`}
      >
        {path.title}
      </h3>
      <div className="text-slate-500 dark:text-slate-400 text-sm flex-grow mb-6 line-clamp-3 prose prose-sm dark:prose-invert">
        <ReactMarkdown>{path.description}</ReactMarkdown>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-[11px] text-slate-400">
        <span>Added on {new Date(path.createdAt).toLocaleDateString()}</span>

        {path.targetDate && (
          <span
            className={`font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1
            ${
              isOverdue
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300"
            }`}
          >
            {isOverdue ? "⚠️ Overdue" : "🎯 Target"}: {formattedTargetDate}
          </span>
        )}
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <EditPathModal
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          onSuccess={onRefresh}
          path={path}
        />
        <DeleteModal
          isOpen={showDelete}
          onClose={() => setShowDelete(false)}
          onConfirm={confirmDelete}
          title={path.title}
        />
      </div>
    </div>
  );
};

export default PathCard;
