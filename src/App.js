import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import SpeakingPage from "./SpeakingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/speak" element={<SpeakingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
