import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { LearningPath } from "./types";
import AddPathModal from "./components/AddPathModal";
import PathCard from "./components/PathCard";
import StatCard from "./components/StatCard";
import { useUI } from "./context/UIContext";

type SortOption = "newest" | "oldest" | "alphabetical";

const App = () => {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOption>("newest");

  const API_URL = "http://localhost:5142/api/learningpaths";
  const { theme, toggleTheme } = useUI();

  const fetchPaths = useCallback(async () => {
    try {
      const res = await axios.get<LearningPath[]>(API_URL);
      setPaths(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchPaths();
  }, [fetchPaths]);

  // Calculate stats like total paths, added 24 hours ago, etc.
  const stats = useMemo(() => {
    const total = paths.length;

    // Paths added in the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newToday = paths.filter(
      (p) => new Date(p.createdAt) > oneDayAgo,
    ).length;

    // Longest path description
    const longestPath = paths.reduce(
      (prev, current) =>
        (prev.description?.length || 0) > (current.description?.length || 0)
          ? prev
          : current,
      paths[0],
    );

    return { total, newToday, longestTitle: longestPath?.title || "N/A" };
  }, [paths]);

  // Process the learning paths with filters, if any selected. Then sort based on the selected order.
  const processedPaths = useMemo(() => {
    let result = paths.filter(
      (path) =>
        path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (path.description?.toLowerCase() || "").includes(
          searchQuery.toLowerCase(),
        ),
    );

    return result.sort((a, b) => {
      if (sortOrder === "newest") return b.id - a.id;
      if (sortOrder === "oldest") return a.id - b.id;
      if (sortOrder === "alphabetical") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [paths, searchQuery, sortOrder]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        {/* HEADER AREA */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              SkillFlow <span className="text-blue-600">Dashboard</span>
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Your technical roadmap, visualized.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-blue-200 active:scale-95"
            >
              + New Path
            </button>
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-xl"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </header>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Paths"
            value={stats.total}
            icon="📚"
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            title="New Today"
            value={stats.newToday}
            icon="✨"
            color="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            title="Top Interest"
            value={stats.longestTitle}
            icon="🔥"
            color="bg-amber-50 text-amber-600"
            isText
          />
        </div>

        {/* TOOLBAR: SEARCH & SORT */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Filter by title or keywords..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-48">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOption)}
                className="w-full pl-4 pr-10 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <main>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {processedPaths.map((path) => (
                <PathCard key={path.id} path={path} onRefresh={fetchPaths} />
              ))}
            </div>
          )}
        </main>
      </div>

      <AddPathModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchPaths}
      />
    </div>
  );
};

export default App;
