import { useEffect, useState } from "react";
import axios from "axios";
import { LearningPath } from "./types";

const App = () => {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const API_URL = "http://localhost:5142/api/learningpaths";

  useEffect(() => {
    axios
      .get<LearningPath[]>(API_URL)
      .then((res) => setPaths(res.data))
      .catch((err) => console.error("API Error:", err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">SkillFlow Learning Paths</h1>
      <div className="grid gap-4">
        {paths.map((path) => (
          <div key={path.id} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{path.title}</h2>
            <p className="text-gray-600">{path.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
