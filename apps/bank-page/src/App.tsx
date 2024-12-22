import "./App.css";
import Home from "@/page/Home";
import { Route, Routes } from "react-router-dom";
import Hdfc from "@/page/Hdfc";
import Axis from "@/page/Axis";

function App() {
  return (
    <>
      <div className="min-h-min">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bank/hdfc" element={<Hdfc />} />
          <Route path="/bank/axis" element={<Axis />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
