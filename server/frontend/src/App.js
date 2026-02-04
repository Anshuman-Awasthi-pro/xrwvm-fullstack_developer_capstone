import LoginPanel from "./components/Login/Login";
import Register from "./components/Register/Register"; // IMPORT ADDED
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<Register />} /> {/* ROUTE ADDED */}
    </Routes>
  );
}
export default App;