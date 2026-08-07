import React, { useState, useContext } from "react";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
} from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showOTP, setShowOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, verifyOTP } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      if (!showOTP) {
        const data = await login(email, password);

        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        const data = await verifyOTP(email, otp);

        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      if (err.needsVerification) {
        setShowOTP(true);

        setError(
          "Account not verified. A new OTP has been sent to your email.",
        );
      } else {
        setError(err.message || err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-5 -mt-10">
      <AnimatedBackground />

      {/* Floating Event Icons */}

      <motion.div
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="absolute top-20 left-16 text-6xl opacity-20 select-none"
      >
        🎫
      </motion.div>

      <motion.div
        animate={{
          y: [20, -20, 20],
          rotate: [0, -10, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
        }}
        className="absolute top-40 right-20 text-6xl opacity-20 select-none"
      >
        🎉
      </motion.div>

      <motion.div
        animate={{
          y: [-18, 18, -18],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute bottom-28 left-24 text-5xl opacity-20 select-none"
      >
        🎵
      </motion.div>

      <motion.div
        animate={{
          y: [18, -18, 18],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
        }}
        className="absolute bottom-20 right-20 text-5xl opacity-20 select-none"
      >
        📅
      </motion.div>

      {/* Card Animation */}

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
          y: 40,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        className="
glass-card
floating-card
relative
overflow-hidden
max-w-117.5
w-full
rounded-3xl
p-6
z-10
transition-all
duration-500
hover:scale-[1.02]
hover:shadow-[0_0_60px_rgba(109,91,255,.35)]
"
      >
        {/* Moving Shine Effect */}

        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: ["-150%", "250%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "linear",
            }}
            className="absolute top-0 left-0 h-full w-32 bg-white/10 rotate-12"
          />
        </div>

        {/* Heading */}

        <div className="text-center mb-6">
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-black text-center"
          >
            <span className="bg-linear-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              EVENTORA
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white text-lg mt-2"
          >
            Welcome Back 👋
          </motion.p>

          <p className="text-gray-400 text-sm mt-1">
            Discover • Book • Experience Amazing Events
          </p>
        </div>

        {/* Error */}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 rounded-xl bg-red-500/20 border border-red-400/30 p-3 text-center text-red-200"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!showOTP ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* Email */}

                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input w-full rounded-xl py-3 pl-12 pr-4"
                  />
                </div>

                {/* Password */}

                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input w-full rounded-xl py-3 pl-12 pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <FaShieldAlt className="text-white text-3xl" />
                  </div>
                </div>

                <h3 className="text-center text-white text-2xl font-semibold">
                  Verify OTP
                </h3>

                <p className="text-center text-gray-400 text-sm">
                  Enter the 6-digit verification code sent to your email.
                </p>

                <input
                  type="text"
                  required
                  maxLength="6"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="glass-input w-full rounded-xl py-3 text-center tracking-[10px] text-2xl"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{
              scale: 1.03,
              y: -3,
              boxShadow: "0px 0px 30px rgba(109,91,255,.45)",
            }}
            whileTap={{
              scale: 0.98,
            }}
            type="submit"
            disabled={loading}
            className="gradient-btn
    w-full
    py-3
    rounded-2xl
    text-white
    font-bold
    text-lg
    shadow-2xl
    mt-2
    transition-all
    duration-300
    disabled:opacity-60
    disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex justify-center items-center gap-3">
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                  }}
                  className="w-5 h-5 rounded-full border-2 border-white border-t-transparent"
                />

                <span>Signing In...</span>
              </div>
            ) : showOTP ? (
              "Verify OTP"
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>

        <div className="mt-5 text-center">
          <p className="text-gray-400">Don't have an account?</p>

          <Link
            to="/register"
            className="inline-block mt-2 text-lg font-semibold bg-linear-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent hover:scale-105 transition"
          >
            Create Account →
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

