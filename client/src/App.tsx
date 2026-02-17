import { useEffect, useState } from "react";
import axios from "axios";
import { LearningPath } from "./types";
import AddPathModal from "./components/AddPathModal";
import PathCard from "./components/PathCard";

const App = () => {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = "http://localhost:5142/api/learningpaths";

  const fetchPaths = async () => {
    try {
      const res = await axios.get<LearningPath[]>(API_URL);
      setPaths(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaths();
  }, []);

  // Filter paths based on search query, we check both title and description
  const filteredPaths = paths.filter(
    (path) =>
      path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (path.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      ),
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900">
      <header className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              SkillFlow <span className="text-blue-600">Dashboard</span>
            </h1>
            <p className="text-slate-500 mt-2">
              Your technical roadmap, visualized.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg active:scale-95"
          >
            + New Path
          </button>
        </div>

        <div className="mt-8 relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
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
          </div>
          <input
            type="text"
            placeholder="Search paths or descriptions..."
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPaths.length > 0 ? (
              filteredPaths.map((path) => (
                <PathCard key={path.id} path={path} onRefresh={fetchPaths} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-400 text-lg">
                  No matches found for "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <AddPathModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchPaths}
      />
    </div>
  );
};

export default App;
