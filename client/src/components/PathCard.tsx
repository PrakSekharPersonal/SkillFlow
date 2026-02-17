import axios from "axios";
import { LearningPath } from "../types";

interface PathCardProps {
  path: LearningPath;
  onRefresh: () => void; // To reload the list after a path is added or deleted
}

const PathCard = ({ path, onRefresh }: PathCardProps) => {
  const DELETE_URL = `http://localhost:5142/api/learningpaths/${path.id}`;

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${path.title}"?`)) {
      return;
    }

    try {
      await axios.delete(DELETE_URL);
      onRefresh();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Could not delete the path. Is the server running?");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Path #{path.id}
        </span>

        <button
          onClick={handleDelete}
          className="text-slate-300 hover:text-red-500 transition-colors p-1"
          title="Delete Path"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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

      <h2 className="text-xl font-bold text-slate-800 mb-2">{path.title}</h2>
      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
        {path.description}
      </p>

      <div className="pt-4 border-t border-slate-50 text-[10px] text-slate-400 font-medium flex justify-between">
        <span>Added {new Date(path.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default PathCard;
