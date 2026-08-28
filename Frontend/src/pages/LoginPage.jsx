import React, { useState } from 'react';
import axios from 'axios';
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, Code2, Trophy, Users, TrendingUp, Zap, ChevronRight,
  Star, GitBranch, BarChart2, Globe, Shield, ArrowRight,
  Terminal, Flame, Target, Activity, Menu, X, ExternalLink
} from "lucide-react";
import { useAuth } from "../components/Contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Particles from "../components/Particles.jsx"
import GridBg from "../components/GridBg.jsx"

const BACKEND_URL = import.meta.env.VITE_API_KEY;

const STATS = [
  { label: "Problems Solved", value: "600+", icon: Code2, color: "#10b981" },
  { label: "Current Streak", value: "23d", icon: Flame, color: "#f59e0b" },
  { label: "Global Rank", value: "#2", icon: Trophy, color: "#818cf8" },
  { label: "Platforms Linked", value: "4", icon: GitBranch, color: "#38bdf8" },
];

const TICKER = [
  "LeetCode · 437 solved",
  "Codeforces · Rating 1163",
  "Streak · 23 days 🔥",
  "Global Rank · #2",
  "Contests · 49 attended",
];

function Orb({ size, x, y, delay, color = "#10b981" }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        left: x, top: y,
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
        filter: "blur(1px)",
      }}
      animate={{ y: [0, -18, 0], opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 5 + delay, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function Ticker() {
  const repeated = [...TICKER, ...TICKER];
  return (
    <div className="overflow-hidden w-full">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        {repeated.map((t, i) => (
          <span key={i} className="flex items-center gap-2 text-xs font-mono text-emerald-400/60">
            <span className="w-1 h-1 rounded-full bg-emerald-500/50 inline-block" />
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.12, duration: 0.5, ease: "easeOut" }}
      className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 hover:bg-white/[0.07] transition-colors duration-200"
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        <Icon size={14} style={{ color }} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col">
        <span className="text-white font-bold text-sm leading-none mb-0.5">{value}</span>
        <span className="text-gray-500 text-[10px] font-mono leading-none">{label}</span>
      </div>
    </motion.div>
  );
}

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    isLoading(true);
    if (isSignUp) {
      await axios.post(`${BACKEND_URL}/signup`, formData, { withCredentials: true })
        .then(res => {
          if(res.data.status === 'OK'){
            login(res.data.personalInfo);
            // console.log(res.data.personalInfo);
            isLoading(false);
            navigate("/user/Dashboard");
          } else {
            alert(res.data.message);
          }
          isLoading(false);
        }).catch((err) => {
          console.log("couldn't send post request to backend", err);
        })
    } else {
      // console.log('Sign In:', formData);
      await axios.post(`${BACKEND_URL}/signin`, formData, { withCredentials: true })
        .then(res => {
          if(res.data.status === 'OK'){
            login(res.data.personalInfo);
            // console.log(res.data.personalInfo);
            isLoading(false);
            navigate("/user/Dashboard");
          } else {
            alert(res.data.message);
          }
          isLoading(false);
        }).catch(err => {
          console.log("couldn't send post request to backend", err);
        })
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <GridBg />
      <Particles />
      <div className='flex flex-row justify-center min-w-screen max-h-screen'>
        <div className="relative hidden lg:flex flex-col justify-between w-1/3 bg-[#0d1117] overflow-hidden px-12 py-10 select-none rounded-l-xl">
          {/* Backgrounds */}
          <GridBg />
          <Orb size={320} x="60%" y="-5%" delay={0} color="#10b981" />
          <Orb size={200} x="-10%" y="55%" delay={1.5} color="#38bdf8" />
          <Orb size={160} x="70%" y="75%" delay={3} color="#818cf8" />

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 50%, transparent 40%, #0d1117 100%)"
            }}
          />

          {/* ── Logo ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative flex items-center gap-2 z-10"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src="/logo.png" alt="Logo" />
            </div>
            <span className="text-white font-bold text-lg font-mono tracking-tight">Codefolio</span>
          </motion.div>

          {/* ── Centre content ── */}
          <div className="relative z-10 flex flex-col gap-8">

            {/* Headline */}
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-emerald-400 text-xs font-mono font-semibold tracking-[0.2em] uppercase mb-3"
              >
                Your competitive edge
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="text-4xl font-black text-white leading-[1.1] tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Track every grind.
                <br />
                <span className="text-emerald-400">Own the rank.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-3 text-gray-500 text-sm leading-relaxed max-w-xs"
              >
                Sync LeetCode, Codeforces and more into one profile. Compare with peers, watch your ratings climb.
              </motion.p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((s, i) => (
                <StatCard key={s.label} {...s} index={i} />
              ))}
            </div>

            {/* Mini progress bar block */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4"
            >
              <p className="text-[10px] font-mono text-gray-500 mb-3 uppercase tracking-widest">LeetCode breakdown</p>
              <div className="space-y-2">
                {[
                  { label: "Easy", count: 145, total: 437, color: "#10b981" },
                  { label: "Medium", count: 269, total: 437, color: "#f59e0b" },
                  { label: "Hard", count: 23, total: 437, color: "#f87171" },
                ].map(({ label, count, total, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-500 w-12 font-mono">{label}</span>
                    <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / total) * 100}%` }}
                        transition={{ delay: 1 + 0.1, duration: 0.9, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-600 font-mono w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Ticker ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="relative z-10 border-t border-white/[0.06] pt-5"
          >
            <Ticker />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full space-y-8 items-center justify-center text-emerald-400 font-roboto p-8 rounded-r-xl shadow-lg bg-[#161b22] border border-gray-800 hover:border-emerald-500/40 transition-all"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold font-mono">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {isSignUp
                ? 'Sign up to get started'
                : 'Sign in to your account'}
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Full Name - Only for Sign Up */}
              {isSignUp && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-400 mb-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="relative block w-full px-3 py-2 bg-gray-200/5 placeholder-gray-600 text-emerald-300 font-mono rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="relative block w-full px-3 py-2 bg-gray-200/5 placeholder-gray-600 text-emerald-300 font-mono rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="relative block w-full px-3 py-2 bg-gray-200/5 placeholder-gray-600 text-emerald-300 font-mono rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your password"
                />
              </div>

              {/* Confirm Password - Only for Sign Up */}
              {isSignUp && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="relative block w-full px-3 py-2 bg-gray-200/5 placeholder-gray-600 text-emerald-300 font-mono rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                    placeholder="Confirm your password"
                  />
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password - Only for Sign In */}
            {!isSignUp && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 hover:text-emerald-400 hover:cursor-pointer border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-emerald-600 hover:text-emerald-400 hover:cursor-pointer transition duration-200">
                    Forgot password?
                  </a>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className='flex justify-center '>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="hover:cursor-pointer group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-3 rounded-xl text-base transition-colors"
              >
                {isLoading
                &&
                <span className="spinner"></span>
                }
                {isSignUp ? 'Sign Up' : 'Sign In'}
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </form>

          {/* Toggle Between Sign In/Sign Up */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-medium text-emerald-600 hover:text-emerald-400 hover:cursor-pointer transition duration-200"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
          {/* </div> */}
        </motion.div>
      </div>

    </section>
  );
};

export default LoginPage;
