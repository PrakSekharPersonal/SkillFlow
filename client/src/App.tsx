import { useEffect, useState } from "react";
import axios from "axios";
import { LearningPath } from "./types";
import AddPathModal from "./components/AddPathModal";
import PathCard from "./components/PathCard";

const App = () => {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <header className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            SkillFlow <span className="text-blue-600">Dashboard</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Your technical roadmap, visualized.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-blue-200 active:scale-95"
        >
          + New Path
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paths.map((path) => (
              <PathCard key={path.id} path={path} onRefresh={fetchPaths} />
            ))}
          </div>
        )}
      </main>

      <AddPathModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => fetchPaths()}
      />
    </div>
  );
};

export default App;
