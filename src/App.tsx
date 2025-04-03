import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "@/components/ui/Navbar"; // Your navbar component
import Claims from "@/Pages/Claims"; // Import the Claims page
import Home from "@/Pages/Home"; // Import your Home page
import Login from "./Pages/Login";

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar should be outside Routes so it appears on all pages */}
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/claims" element={<Claims />} />
      </Routes>
    </Router>
  );
}

export default App;
