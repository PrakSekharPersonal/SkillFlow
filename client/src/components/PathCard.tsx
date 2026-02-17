import { useState } from "react";
import axios from "axios";
import { LearningPath } from "../types";
import EditPathModal from "./EditPathModal";
import DeleteModal from "./DeleteModal";

interface PathCardProps {
  path: LearningPath;
  onRefresh: () => void;
}

const PathCard = ({ path, onRefresh }: PathCardProps) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5142/api/learningpaths/${path.id}`);
      onRefresh();
      setShowDelete(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
          Path #{path.id}
        </span>

        <div className="flex space-x-1">
          {/* EDIT BUTTON */}
          <button
            onClick={() => setShowEdit(true)}
            className="text-slate-400 hover:text-blue-600 p-1 transition-colors"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          {/* DELETE BUTTON */}
          <button
            onClick={() => setShowDelete(true)}
            className="text-slate-400 hover:text-red-500 p-1 transition-colors"
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
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-2">{path.title}</h2>
      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
        {path.description}
      </p>

      {/* MODALS */}
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
  );
};

export default PathCard;
