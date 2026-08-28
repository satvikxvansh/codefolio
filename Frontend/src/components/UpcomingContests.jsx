// Data sources (public, no auth needed):
//   LeetCode  — https://leetcode.com/graphql  (ContestUpcomingContests query)
//   Codeforces — https://codeforces.com/api/contest.list
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ExternalLink, RefreshCw, Clock } from "lucide-react";
import axios from 'axios';

// ── Platform config ───────────────────────────────────────────────────────────
const PLATFORM = {
  leetcode:    { label: "LeetCode",   color: "#f59e0b", bg: "#f59e0b18", border: "#f59e0b30" },
  codeforces:  { label: "Codeforces", color: "#38bdf8", bg: "#38bdf818", border: "#38bdf830" },
};

// ── Format countdown HH:MM:SS or D days HH:MM:SS ─────────────────────────────
function formatCountdown(ms) {
  if (ms <= 0) return "Starting now";
  const totalSec = Math.floor(ms / 1000);
  const days     = Math.floor(totalSec / 86400);
  const hrs      = Math.floor((totalSec % 86400) / 3600);
  const mins     = Math.floor((totalSec % 3600) / 60);
  const secs     = totalSec % 60;
  const pad      = n => String(n).padStart(2, "0");

  if (days > 0) return `${days}d  ${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

// ── Format start date nicely ──────────────────────────────────────────────────
function formatDate(ms) {
  return new Date(ms).toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Format duration ───────────────────────────────────────────────────────────
function formatDuration(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ── Single contest card ───────────────────────────────────────────────────────
function ContestCard({ contest, index }) {
  const [timeLeft, setTimeLeft] = useState(contest.startTime - Date.now());
  const p = PLATFORM[contest.platform];

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(contest.startTime - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [contest.startTime]);

  const isImminent = timeLeft > 0 && timeLeft < 3600 * 1000; // < 1 hour

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className="relative bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] rounded-xl p-4 transition-colors group"
    >
      {/* Platform pill */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar size={12} style={{ color: p.color }} />
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider"
            style={{ color: p.color }}>
            {p.label}
          </span>
        </div>
        {/* Duration badge */}
        <span className="text-[9px] font-mono text-gray-600 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded-full">
          {formatDuration(contest.duration)}
        </span>
      </div>

      {/* Title */}
      <p className="text-white font-bold text-sm leading-snug mb-3 pr-4 line-clamp-1">
        {contest.title}
      </p>

      {/* Countdown */}
      <div className={`flex items-center gap-1.5 mb-1 ${isImminent ? "animate-pulse" : ""}`}>
        <Clock size={11} className={isImminent ? "text-red-400" : "text-gray-600"} />
        <span className={`font-mono font-black text-lg tracking-tight ${isImminent ? "text-red-400" : "text-white"}`}>
          {timeLeft > 0 ? formatCountdown(timeLeft) : "Live now"}
        </span>
      </div>
      <p className="text-[10px] font-mono text-gray-600 mb-4">
        {formatDate(contest.startTime)}
      </p>

      {/* Link button */}
      <a
        href={contest.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-bold transition-all border"
        style={{
          background:   p.bg,
          borderColor:  p.border,
          color:        p.color,
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        Open Contest
        <ExternalLink size={11} />
      </a>
    </motion.div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2].map(i => (
        <div key={i} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 space-y-3">
          <div className="flex justify-between">
            <div className="h-3 w-20 bg-white/[0.06] rounded-full" />
            <div className="h-3 w-10 bg-white/[0.06] rounded-full" />
          </div>
          <div className="h-4 w-3/4 bg-white/[0.06] rounded-full" />
          <div className="h-6 w-1/2 bg-white/[0.06] rounded-full" />
          <div className="h-8 bg-white/[0.06] rounded-lg" />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function UpcomingContests() {
  const [contests, setContests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const BACKEND_URL = import.meta.env.VITE_API_KEY;

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/upcomingContests`);

      const lcData = response.data.leetcode || [];
      const cfData = response.data.codeforces || [];

      // console.log("upcomingContest", lcData, cfData);

      // Merge, sort by start time, keep closest 2 (one per platform ideally)
      const all = [...lcData, ...cfData]
        .filter(c => c.startTime > Date.now())
        .sort((a, b) => a.startTime - b.startTime);

      // Prefer showing 1 from each platform if possible
      const seen = new Set();
      const picked = [];
      for (const c of all) {
        if (!seen.has(c.platform)) { seen.add(c.platform); picked.push(c); }
        if (picked.length === 2) break;
      }
      // If one platform had nothing, fill with next available
      if (picked.length < 2) {
        for (const c of all) {
          if (!picked.includes(c)) { picked.push(c); }
          if (picked.length === 2) break;
        }
      }

      setContests(picked);
    } catch (e) {
      setError("Could not load contests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  return (
    <div className="bg-zinc-900 border-zinc-700 rounded-xl p-5 w-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Calendar size={13} className="text-emerald-400" />
          </div>
          <p className="text-lg font-semibold text-gray-600">Next Contests</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          onClick={fetchAll}
          className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors"
        >
          <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
        </motion.button>
      </div>

      {/* Content */}
      {loading && <Skeleton />}

      {error && !loading && (
        <p className="text-center text-gray-500 text-xs font-mono py-6">{error}</p>
      )}

      {!loading && !error && (
        <div className="space-y-3">
          <AnimatePresence>
            {contests.map((c, i) => (
              <ContestCard key={`${c.platform}-${c.startTime}`} contest={c} index={i} />
            ))}
          </AnimatePresence>
          {contests.length === 0 && (
            <p className="text-center text-gray-600 text-xs font-mono py-6">
              No upcoming contests found
            </p>
          )}
        </div>
      )}
    </div>
  );
}