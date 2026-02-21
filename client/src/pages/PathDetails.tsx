import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { LearningPath, Milestone, ResourceLink } from "../types";
import { useUI } from "../context/UIContext";

const PathDetails = () => {
  const { id } = useParams(); // Get path ID from URL
  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);

  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState("");

  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

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

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneTitle.trim()) {
      showToast("Milestone title cannot be empty", "error");
      return;
    }

    try {
      await axios.post<Milestone>(`${API_URL}/milestones`, {
        title: milestoneTitle,
        isCompleted: false,
        learningPathId: Number(id),
      });
      setMilestoneTitle("");
      setShowMilestoneForm(false);
      showToast("Milestone added successfully", "success");
      fetchPathDetails();
    } catch (err) {
      console.error("Add Milestone Error:", err);
      showToast("Failed to add milestone", "error");
    }
  };

  const handleToggleMilestone = async (milestone: Milestone) => {
    try {
      await axios.put<Milestone>(`${API_URL}/milestones/${milestone.id}`, {
        ...milestone,
        isCompleted: !milestone.isCompleted,
      });
      showToast("Milestone updated successfully", "success");
      fetchPathDetails();
    } catch (err) {
      console.error("Toggle Milestone Error:", err);
      showToast("Failed to update milestone", "error");
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkTitle.trim() || !linkUrl.trim()) {
      showToast("Link title and URL cannot be empty", "error");
      return;
    }

    try {
      await axios.post<ResourceLink>(`${API_URL}/resourcelinks`, {
        title: linkTitle,
        url: linkUrl,
        learningPathId: Number(id),
      });
      setLinkTitle("");
      setLinkUrl("");
      setShowLinkForm(false);
      showToast("Resource link added successfully", "success");
      fetchPathDetails();
    } catch (err) {
      console.error("Add Resource Link Error:", err);
      showToast("Failed to add resource link", "error");
    }
  };

  if (loading)
    return <div className="text-center py-20 dark:text-white">Loading...</div>;
  if (!path)
    return (
      <div className="text-center py-20 dark:text-white">Path not found</div>
    );

  const totalMilestones = path.milestones?.length || 0;
  const completedMilestones =
    path.milestones?.filter((m) => m.isCompleted).length || 0;
  const progressPercent = path.isCompleted
    ? 100
    : totalMilestones === 0
      ? 0
      : Math.round((completedMilestones / totalMilestones) * 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2 mb-6 font-semibold w-fit cursor-pointer"
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
            <span>{path.isCompleted ? "Path Completed 🏆" : "Progress"}</span>
            <span className={path.isCompleted ? "text-emerald-500" : ""}>
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${path.isCompleted ? "bg-emerald-500" : "bg-blue-600"}`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* --- MILESTONES SECTION --- */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-fit">
            <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
              Milestones
              <button
                onClick={() => setShowMilestoneForm(!showMilestoneForm)}
                className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition cursor-pointer"
              >
                {showMilestoneForm ? "Cancel" : "+ Add"}
              </button>
            </h2>

            {/* Inline Add Milestone Form */}
            {showMilestoneForm && (
              <form onSubmit={handleAddMilestone} className="mb-4 flex gap-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="E.g., Read Chapter 1"
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 cursor-pointer"
                >
                  Save
                </button>
              </form>
            )}

            <div className="space-y-3">
              {path.milestones?.length === 0 && !showMilestoneForm ? (
                <p className="text-slate-400 text-sm">No milestones yet.</p>
              ) : (
                path.milestones?.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition"
                  >
                    <input
                      type="checkbox"
                      onChange={() => handleToggleMilestone(m)}
                      checked={m.isCompleted}
                      readOnly
                      className="w-5 h-5 rounded text-blue-600 cursor-pointer"
                    />
                    <span
                      className={
                        m.isCompleted || path.isCompleted
                          ? "line-through text-slate-400"
                          : ""
                      }
                    >
                      {m.title}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* --- RESOURCES SECTION --- */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-fit">
            <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
              Resource Links
              <button
                onClick={() => setShowLinkForm(!showLinkForm)}
                className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition cursor-pointer"
              >
                {showLinkForm ? "Cancel" : "+ Add"}
              </button>
            </h2>

            {/* Inline Add Link Form */}
            {showLinkForm && (
              <form
                onSubmit={handleAddLink}
                className="mb-4 flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-600"
              >
                <input
                  type="text"
                  placeholder="Link Title (e.g., React Docs)"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  placeholder="https://..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 mt-1 cursor-pointer"
                >
                  Save Link
                </button>
              </form>
            )}

            <div className="space-y-3">
              {path.resourceLinks?.length === 0 && !showLinkForm ? (
                <p className="text-slate-400 text-sm">No resources yet.</p>
              ) : (
                path.resourceLinks?.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-blue-600 dark:text-blue-400 hover:underline truncate border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition"
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
