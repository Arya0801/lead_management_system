import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LeadsList from "./pages/LeadsList";
import LeadEdit from "./pages/LeadEdit";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/leads" element={<ProtectedRoute><LeadsList /></ProtectedRoute>} />
          <Route path="/leads/new" element={<ProtectedRoute><LeadEdit /></ProtectedRoute>} />
          <Route path="/leads/edit/:id" element={<ProtectedRoute><LeadEdit /></ProtectedRoute>} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
