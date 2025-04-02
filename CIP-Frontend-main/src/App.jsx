import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import IndividualCard from "./components/IndiCard/IndividualCard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/individual-card/:threatId" element={<IndividualCard />} />
      </Routes>
    </Router>
  );
}

export default App;
