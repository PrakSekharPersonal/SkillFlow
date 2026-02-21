import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PathDetails from "./pages/PathDetails";
import { UIProvider } from "./context/UIContext";

function App() {
  return (
    <UIProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/path/:id" element={<PathDetails />} />
        </Routes>
      </Router>
    </UIProvider>
  );
}

export default App;
