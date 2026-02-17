import { useEffect, useState } from "react";
import axios from "axios";
import { LearningPath } from "./types";

const App = () => {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:5142/api/learningpaths";

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get<LearningPath[]>(API_URL);
        setPaths(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <header className="max-w-6xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          SkillFlow <span className="text-blue-600">Dashboard</span>
        </h1>
        <p className="text-slate-500 mt-2">
          Manage and track your learning journey.
        </p>
      </header>

      <main className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paths.map((path) => (
              <div
                key={path.id}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded">
                    Path #{path.id}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                  {path.title}
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {path.description}
                </p>
                <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
                  Added on {new Date(path.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
