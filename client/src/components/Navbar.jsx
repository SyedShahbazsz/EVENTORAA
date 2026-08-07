import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { FaTicketAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B1120]/80 border-b border-white/10 shadow-xl">
      <div className="relative max-w-7xl mx-auto h-16 px-8 flex items-center overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <AnimatedBackground />
        </div>

        {/* Logo */}

        <Link
          to="/"
          className="relative z-20 flex items-center gap-3 text-white text-2xl font-bold"
        >
          <FaTicketAlt className="text-purple-400 text-xl" />

          <span className="bg-linear-to-r from-white via-cyan-300 to-purple-300 bg-clip-text text-transparent">
            Eventora
          </span>
        </Link>

        {/* Menu */}

        <div className="relative z-20 ml-auto flex items-center gap-7">
          <Link
            to="/"
            className="text-gray-300 hover:text-white transition duration-300"
          >
            Events
          </Link>

          {user ? (
            <>
              <Link
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className="text-gray-300 hover:text-white transition"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition text-white font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-6 py-2 rounded-xl font-semibold text-white bg-linear-to-r from-purple-600 via-indigo-500 to-blue-500 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(109,91,255,.35)]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
