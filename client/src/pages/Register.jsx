import React, { useState, useContext } from "react";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
} from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showOTP, setShowOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, verifyOTP } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      if (!showOTP) {
        await register(name, email, password);
        setShowOTP(true);
      } else {
        await verifyOTP(email, otp);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden px-5">

      {/* Animated Glow Background */}

      <AnimatedBackground />

      {/* Floating Event Icons */}

      <motion.div
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="absolute top-24 left-16 text-4xl opacity-20 select-none"
      >
        🎫
      </motion.div>

      <motion.div
        animate={{
          y: [20, -20, 20],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute top-40 right-20 text-4xl opacity-20 select-none"
      >
        🎉
      </motion.div>

      <motion.div
        animate={{
          y: [-18, 18, -18],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
        }}
        className="absolute bottom-28 left-20 text-4xl opacity-20 select-none"
      >
        🎵
      </motion.div>

      <motion.div
        animate={{
          y: [18, -18, 18],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
        }}
        className="absolute bottom-24 right-16 text-4xl opacity-20 select-none"
      >
        📅
      </motion.div>

      {/* Glass Card */}

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
        className="glass-card floating-card relative overflow-hidden w-full max-w-[480px] rounded-3xl p-6 z-10 translate-y-3"
      >
        {/* Moving Shine */}

        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              x: ["-120%", "220%"],
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
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black"
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
            Create Your Account ✨
          </motion.p>

          <p className="text-gray-400 text-sm mt-1">
            Join thousands of people discovering amazing events.
          </p>
        </div>

        {/* Animated Error */}

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
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* Name */}

                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="glass-input w-full rounded-xl py-3 pl-12 pr-4"
                  />
                </div>

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
                  Verify Your Email
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
              y: -2,
            }}
            whileTap={{
              scale: 0.98,
            }}
            type="submit"
            disabled={loading}
            className="gradient-btn
  w-full
  py-3
  rounded-xl
  text-white
  font-bold
  text-lg
  shadow-xl
  mt-2
  disabled:opacity-70
  disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                  }}
                  className="w-5 h-5 rounded-full border-2 border-white border-t-transparent"
                />

                <span>Processing...</span>
              </div>
            ) : showOTP ? (
              "Verify & Complete"
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        {!showOTP && (
          <div className="mt-5 text-center">
            <p className="text-gray-300">Already have an account?</p>

            <Link
              to="/login"
              className="inline-block
      mt-2
      text-purple-300
      font-semibold
      hover:text-white
      transition
      duration-300"
            >
              Sign In →
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
