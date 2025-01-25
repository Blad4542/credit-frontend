import "./styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Form/MainForm";
import CreditApplications from "./components/CreditApplications/CreditApplications.";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/applications" element={<CreditApplications />} />
      </Routes>
    </Router>
  );
}

export default App;
