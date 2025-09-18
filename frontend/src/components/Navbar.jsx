import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const hideNavbar = ["/login", "/register"].includes(location.pathname);
  if (hideNavbar) return null;

  return (
    <nav className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 shadow-md flex justify-between items-center">
      {/* Logo / Title */}
      <Link to="/leads" className="text-2xl font-bold tracking-wide hover:opacity-90 transition">
        LeadManager
      </Link>

      {/* Right side links */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-sm">
              Hi, <span className="font-semibold">{user.name}</span>
            </span>
            <button
              onClick={logout}
              className="bg-white text-pink-600 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:underline text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-purple-600 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
