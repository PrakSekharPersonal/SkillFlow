import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { LearningPath, Milestone, ResourceLink } from "../types";
import { useUI } from "../context/UIContext";

const PathDetails = () => {
  const { id } = useParams(); // Get path ID from URL
  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useUI();

  const API_URL = `http://localhost:5142/api/learningpaths/${id}`;

  const fetchPathDetails = async () => {
    try {
      const res = await axios.get<LearningPath>(API_URL);
      setPath(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load path details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPathDetails();
  }, [id]);

  if (loading)
    return <div className="text-center py-20 dark:text-white">Loading...</div>;
  if (!path)
    return (
      <div className="text-center py-20 dark:text-white">Path not found</div>
    );

  const totalMilestones = path.milestones?.length || 0;
  const completedMilestones =
    path.milestones?.filter((m) => m.isCompleted).length || 0;
  const progressPercent =
    totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/"
          className="text-blue-600 hover:underline flex items-center gap-2 mb-6 font-semibold"
        >
          ← Back to Dashboard
        </Link>

        {/* Header Section */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
          <h1 className="text-3xl font-extrabold mb-4">{path.title}</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">
            {path.description}
          </p>

          {/* Progress Bar */}
          <div className="mb-2 flex justify-between text-sm font-bold text-slate-500">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Milestones Section */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
              Milestones
              <button className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition">
                + Add
              </button>
            </h2>
            <div className="space-y-3">
              {path.milestones?.length === 0 ? (
                <p className="text-slate-400 text-sm">No milestones yet.</p>
              ) : (
                path.milestones?.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
                  >
                    <input
                      type="checkbox"
                      checked={m.isCompleted}
                      readOnly
                      className="w-5 h-5 rounded text-blue-600"
                    />
                    <span
                      className={
                        m.isCompleted ? "line-through text-slate-400" : ""
                      }
                    >
                      {m.title}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Resources Section */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
              Resource Links
              <button className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition">
                + Add
              </button>
            </h2>
            <div className="space-y-3">
              {path.resourceLinks?.length === 0 ? (
                <p className="text-slate-400 text-sm">No resources yet.</p>
              ) : (
                path.resourceLinks?.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-blue-600 hover:underline truncate"
                  >
                    🔗 {link.title}
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathDetails;
