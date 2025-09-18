import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/leads");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-pink-200 via-purple-200 to-indigo-300 animate-gradient-x">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border-t-4 border-indigo-500">
        {/* Header */}
        

        <h2 className="text-4xl font-extrabold text-center text-indigo-600 mb-4 animate-bounce">
          Welcome Back! ✨
        </h2>
        <p className="text-center text-gray-600 mb-6 text-lg">
          Log in to access your amazing dashboard
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200 animate-pulse">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-semibold text-indigo-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3 border border-indigo-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none shadow-md transition duration-300"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-indigo-700">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3 border border-indigo-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none shadow-md transition duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white rounded-xl font-bold text-lg hover:scale-105 transform transition duration-300 shadow-lg disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-700">
          Don’t have an account?{" "}
          <Link to="/register" className="text-purple-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
