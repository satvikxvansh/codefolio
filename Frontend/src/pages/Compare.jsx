import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, Cell,
  LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import {
  Search, Trophy, Flame, Target, Star,
  TrendingUp, Award, CheckCircle, XCircle, Minus,
  User, Swords, Activity, Code2,
} from "lucide-react";
import { useAuth } from "../components/Contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_KEY;

// ── Palette ───────────────────────────────────────────────────────────────────
const COLORS = {
  u1: "#10b981",   // emerald — user 1
  u2: "#38bdf8",   // blue    — user 2
  easy:   "#10b981",
  medium: "#f59e0b",
  hard:   "#f87171",
};

const fmt = (n) => (n == null ? "—" : Number(n).toLocaleString());

// ── Verdict icon ──────────────────────────────────────────────────────────────
function VerdictIcon({ v }) {
  if (v === 1)  return <CheckCircle size={13} className="text-emerald-400 flex-shrink-0" />;
  if (v === -1) return <XCircle     size={13} className="text-red-400     flex-shrink-0" />;
  return              <Minus        size={13} className="text-gray-600    flex-shrink-0" />;
}

// ── Card wrapper ──────────────────────────────────────────────────────────────
function Card({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`bg-[#161b22] border border-white/[0.07] rounded-2xl p-5 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={15} className="text-emerald-400" />
      <p className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}

// ── Custom recharts tooltip ───────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1c2333] border border-white/10 rounded-xl px-4 py-3 text-xs shadow-xl">
      <p className="text-gray-400 mb-2 font-mono">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-300">{p.name}:</span>
          <span className="text-white font-bold">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INPUT FORM
// ─────────────────────────────────────────────────────────────────────────────
function InputForm({ onCompare, loading }) {
  const [u1, setU1] = useState("");
  const [u2, setU2] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (u1.trim() && u2.trim()) onCompare(u1.trim(), u2.trim());
  };

  return (
    <Card className="mb-8">
      <div className="flex items-center gap-2 mb-5">
        <Swords size={16} className="text-emerald-400" />
        <h2 className="text-white font-bold text-sm">Compare LeetCode Profiles</h2>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={u1} onChange={e => setU1(e.target.value)}
            placeholder="Your LeetCode username"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl
                       pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600
                       focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
        <div className="flex items-center justify-center text-gray-600 font-black text-sm">VS</div>
        <div className="relative flex-1">
          <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={u2} onChange={e => setU2(e.target.value)}
            placeholder="Opponent's LeetCode username"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl
                       pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600
                       focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading || !u1.trim() || !u2.trim()}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400
                     disabled:opacity-40 disabled:cursor-not-allowed
                     text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
        >
          {loading
            ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            : <Search size={14} />}
          {loading ? "Comparing..." : "Compare"}
        </motion.button>
      </form>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCORE BANNER
// ─────────────────────────────────────────────────────────────────────────────
function ScoreBanner({ user1, user2, score }) {
  const winner = score.user1 > score.user2 ? user1.username
    : score.user2 > score.user1 ? user2.username : null;

  return (
    <Card className="mb-6" delay={0.05}>
      <div className="flex items-center justify-between gap-4">
        {/* User 1 */}
        <div className="flex-1 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30
                          flex items-center justify-center mx-auto mb-2 overflow-hidden">
            {user1.avatar
              ? <img src={user1.avatar} alt="" className="w-full h-full object-cover" />
              : <span className="text-2xl">🧑‍💻</span>}
          </div>
          <p className="text-white font-bold text-sm">{user1.username}</p>
          {user1.country && <p className="text-gray-500 text-[10px] font-mono mt-0.5">{user1.country}</p>}
          {user1.contest?.badge && (
            <span className="inline-block mt-1 text-[9px] font-mono bg-emerald-500/10 
                             border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
              {user1.contest.badge}
            </span>
          )}
        </div>

        {/* Score */}
        <div className="text-center">
          <div className="flex items-center gap-3 mb-1">
            <span className={`text-5xl font-black tabular-nums
                             ${score.user1 > score.user2 ? "text-emerald-400" : "text-gray-500"}`}>
              {score.user1}
            </span>
            <span className="text-gray-700 font-black text-xl">:</span>
            <span className={`text-5xl font-black tabular-nums
                             ${score.user2 > score.user1 ? "text-emerald-400" : "text-gray-500"}`}>
              {score.user2}
            </span>
          </div>
          {winner
            ? <p className="text-emerald-400 text-[11px] font-mono">🏆 {winner} wins</p>
            : <p className="text-gray-500 text-[11px] font-mono">Dead even</p>}
          <p className="text-gray-600 text-[9px] font-mono mt-1">out of {score.user1 + score.user2} categories</p>
        </div>

        {/* User 2 */}
        <div className="flex-1 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-500/10 border-2 border-blue-500/30
                          flex items-center justify-center mx-auto mb-2 overflow-hidden">
            {user2.avatar
              ? <img src={user2.avatar} alt="" className="w-full h-full object-cover" />
              : <span className="text-2xl">👨‍💻</span>}
          </div>
          <p className="text-white font-bold text-sm">{user2.username}</p>
          {user2.country && <p className="text-gray-500 text-[10px] font-mono mt-0.5">{user2.country}</p>}
          {user2.contest?.badge && (
            <span className="inline-block mt-1 text-[9px] font-mono bg-blue-500/10
                             border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
              {user2.contest.badge}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HEAD TO HEAD TABLE
// ─────────────────────────────────────────────────────────────────────────────
function HeadToHead({ user1, user2, headToHead }) {
  const rows = [
    { label: "Total Solved",      v1: fmt(user1.solved.all),           v2: fmt(user2.solved.all),           verdict: headToHead.totalSolved },
    { label: "Easy",              v1: fmt(user1.solved.easy),          v2: fmt(user2.solved.easy),          verdict: headToHead.easySolved },
    { label: "Medium",            v1: fmt(user1.solved.medium),        v2: fmt(user2.solved.medium),        verdict: headToHead.mediumSolved },
    { label: "Hard",              v1: fmt(user1.solved.hard),          v2: fmt(user2.solved.hard),          verdict: headToHead.hardSolved },
    { label: "Acceptance Rate",   v1: `${user1.acceptanceRate}%`,      v2: `${user2.acceptanceRate}%`,      verdict: headToHead.acceptanceRate },
    { label: "Streak",            v1: `${user1.streak}d`,              v2: `${user2.streak}d`,              verdict: headToHead.streak },
    { label: "Active Days",       v1: fmt(user1.totalActiveDays),      v2: fmt(user2.totalActiveDays),      verdict: headToHead.activeDays },
    { label: "Contest Rating",    v1: fmt(user1.contest?.rating),      v2: fmt(user2.contest?.rating),      verdict: headToHead.contestRating },
    { label: "Contests Attended", v1: fmt(user1.contest?.attended),    v2: fmt(user2.contest?.attended),    verdict: headToHead.contestAttended },
    { label: "Global Rank",       v1: `#${fmt(user1.ranking)}`,        v2: `#${fmt(user2.ranking)}`,        verdict: headToHead.globalRanking },
  ];

  return (
    <Card delay={0.1}>
      <SectionLabel icon={Swords} label="Head to Head" />
      <div className="space-y-1">
        {/* Header */}
        <div className="flex items-center gap-3 px-3 pb-2 border-b border-white/[0.05]">
          <span className="text-[10px] font-mono text-emerald-400/70 w-20 text-right">{user1.username}</span>
          <span className="flex-1 text-center" />
          <span className="text-[10px] font-mono text-blue-400/70 w-20 text-left">{user2.username}</span>
        </div>
        {rows.map(({ label, v1, v2, verdict }, i) => (
          <div key={label}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
            {/* User 1 value */}
            <span className={`text-sm font-bold w-20 text-right tabular-nums
                             ${verdict === 1 ? "text-emerald-400" : "text-gray-400"}`}>
              {v1}
            </span>
            {/* Verdict + label */}
            <div className="flex-1 flex items-center justify-center gap-2">
              <VerdictIcon v={verdict === 1 ? 1 : 0} />
              <span className="text-gray-500 text-[11px] font-mono">{label}</span>
              <VerdictIcon v={verdict === -1 ? 1 : 0} />
            </div>
            {/* User 2 value */}
            <span className={`text-sm font-bold w-20 text-left tabular-nums
                             ${verdict === -1 ? "text-blue-400" : "text-gray-400"}`}>
              {v2}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SOLVED BY DIFFICULTY — grouped bar chart
// ─────────────────────────────────────────────────────────────────────────────
function SolvedChart({ user1, user2 }) {
  const data = [
    { name: "Easy",   [user1.username]: user1.solved.easy,   [user2.username]: user2.solved.easy },
    { name: "Medium", [user1.username]: user1.solved.medium, [user2.username]: user2.solved.medium },
    { name: "Hard",   [user1.username]: user1.solved.hard,   [user2.username]: user2.solved.hard },
  ];

  const diffColor = { Easy: COLORS.easy, Medium: COLORS.medium, Hard: COLORS.hard };

  return (
    <Card delay={0.15}>
      <SectionLabel icon={Target} label="Problems Solved by Difficulty" />
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barCategoryGap="30%" barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} width={30} />
          <RTooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey={user1.username} radius={[4,4,0,0]} fill={COLORS.u1} opacity={0.9} />
          <Bar dataKey={user2.username} radius={[4,4,0,0]} fill={COLORS.u2} opacity={0.9} />
          <Legend
            wrapperStyle={{ fontSize: 11, fontFamily: "monospace", paddingTop: 12 }}
            formatter={(v) => <span style={{ color: v === user1.username ? COLORS.u1 : COLORS.u2 }}>{v}</span>}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RADAR — overall skill profile
// ─────────────────────────────────────────────────────────────────────────────
function RadarComp({ user1, user2 }) {
  const norm = (val, max) => max > 0 ? Math.round((val / max) * 100) : 0;

  const maxSolved  = Math.max(user1.solved.all,          user2.solved.all,         1);
  const maxHard    = Math.max(user1.solved.hard,         user2.solved.hard,        1);
  const maxStreak  = Math.max(user1.streak,              user2.streak,             1);
  const maxActive  = Math.max(user1.totalActiveDays,     user2.totalActiveDays,    1);
  const maxRating  = Math.max(user1.contest?.rating||0,  user2.contest?.rating||0, 1);
  const maxAttend  = Math.max(user1.contest?.attended||0,user2.contest?.attended||0,1);

  const data = [
    { subject: "Total Solved", [user1.username]: norm(user1.solved.all,          maxSolved), [user2.username]: norm(user2.solved.all,          maxSolved) },
    { subject: "Hard Solved",  [user1.username]: norm(user1.solved.hard,         maxHard),  [user2.username]: norm(user2.solved.hard,         maxHard) },
    { subject: "Streak",       [user1.username]: norm(user1.streak,              maxStreak), [user2.username]: norm(user2.streak,              maxStreak) },
    { subject: "Active Days",  [user1.username]: norm(user1.totalActiveDays,     maxActive), [user2.username]: norm(user2.totalActiveDays,     maxActive) },
    { subject: "CF Rating",    [user1.username]: norm(user1.contest?.rating||0,  maxRating), [user2.username]: norm(user2.contest?.rating||0,  maxRating) },
    { subject: "Contests",     [user1.username]: norm(user1.contest?.attended||0,maxAttend), [user2.username]: norm(user2.contest?.attended||0,maxAttend) },
  ];

  return (
    <Card delay={0.2}>
      <SectionLabel icon={Activity} label="Skill Radar" />
      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis dataKey="subject"
            tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "monospace" }} />
          <Radar name={user1.username} dataKey={user1.username}
            stroke={COLORS.u1} fill={COLORS.u1} fillOpacity={0.15} strokeWidth={2} />
          <Radar name={user2.username} dataKey={user2.username}
            stroke={COLORS.u2} fill={COLORS.u2} fillOpacity={0.15} strokeWidth={2} />
          <Legend
            wrapperStyle={{ fontSize: 11, fontFamily: "monospace" }}
            formatter={(v) => <span style={{ color: v === user1.username ? COLORS.u1 : COLORS.u2 }}>{v}</span>}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BEATS PERCENTILE bars
// ─────────────────────────────────────────────────────────────────────────────
function BeatsSection({ user1, user2 }) {
  const diffs = ["easy", "medium", "hard"];
  const labels = { easy: "Easy", medium: "Medium", hard: "Hard" };
  const diffColor = { easy: COLORS.easy, medium: COLORS.medium, hard: COLORS.hard };

  return (
    <Card delay={0.25}>
      <SectionLabel icon={TrendingUp} label="Beats Percentile" />
      <div className="space-y-4">
        {diffs.map((d) => {
          const p1 = user1.beats[d] || 0;
          const p2 = user2.beats[d] || 0;
          return (
            <div key={d}>
              <div className="flex justify-between text-[10px] font-mono text-gray-500 mb-1.5">
                <span style={{ color: COLORS.u1 }}>{p1}%</span>
                <span style={{ color: diffColor[d] }}>{labels[d]}</span>
                <span style={{ color: COLORS.u2 }}>{p2}%</span>
              </div>
              <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-white/[0.05]">
                <motion.div className="rounded-l-full" style={{ background: COLORS.u1 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${p1 / 2}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }} />
                <div className="flex-1" />
                <motion.div className="rounded-r-full" style={{ background: COLORS.u2 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${p2 / 2}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }} />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[9px] font-mono text-gray-700 mt-3">
        Percentile = beats X% of all LeetCode users in that difficulty
      </p>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RECENT ACTIVITY line chart
// ─────────────────────────────────────────────────────────────────────────────
function ActivityChart({ user1, user2 }) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const data = months.map(m => ({
    month: m,
    [user1.username]: user1.recentActivity[m] || 0,
    [user2.username]: user2.recentActivity[m] || 0,
  }));

  return (
    <Card delay={0.3}>
      <SectionLabel icon={Activity} label="Monthly Submission Activity" />
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "monospace" }} axisLine={false} tickLine={false} width={28} />
          <RTooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)" }} />
          <Line type="monotone" dataKey={user1.username} stroke={COLORS.u1} strokeWidth={2}
            dot={{ fill: COLORS.u1, r: 3 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey={user2.username} stroke={COLORS.u2} strokeWidth={2}
            dot={{ fill: COLORS.u2, r: 3 }} activeDot={{ r: 5 }} />
          <Legend
            wrapperStyle={{ fontSize: 11, fontFamily: "monospace" }}
            formatter={(v) => <span style={{ color: v === user1.username ? COLORS.u1 : COLORS.u2 }}>{v}</span>}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOP TAGS side by side
// ─────────────────────────────────────────────────────────────────────────────
function TopTags({ user1, user2 }) {
  return (
    <Card delay={0.35}>
      <SectionLabel icon={Code2} label="Strongest Topics" />
      <div className="grid grid-cols-2 gap-6">
        {[user1, user2].map((u, ui) => (
          <div key={u.username}>
            <p className="text-[10px] font-mono mb-3"
               style={{ color: ui === 0 ? COLORS.u1 : COLORS.u2 }}>
              {u.username}
            </p>
            <div className="space-y-2">
              {u.topTags.map(({ tag, count }) => {
                const max = u.topTags[0]?.count || 1;
                return (
                  <div key={tag}>
                    <div className="flex justify-between text-[10px] font-mono text-gray-500 mb-1">
                      <span className="text-gray-300">{tag}</span>
                      <span>{count}</span>
                    </div>
                    <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: ui === 0 ? COLORS.u1 : COLORS.u2 }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / max) * 100}%` }}
                        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTEST stats side by side
// ─────────────────────────────────────────────────────────────────────────────
function ContestSection({ user1, user2 }) {
  const rows = [
    { label: "Rating",     v1: fmt(user1.contest?.rating),       v2: fmt(user2.contest?.rating) },
    { label: "Attended",   v1: fmt(user1.contest?.attended),     v2: fmt(user2.contest?.attended) },
    { label: "Top %",      v1: user1.contest?.topPercentage ? `${user1.contest.topPercentage}%` : "—",
                           v2: user2.contest?.topPercentage ? `${user2.contest.topPercentage}%` : "—" },
    { label: "Global Rank",v1: user1.contest?.globalRanking ? `#${fmt(user1.contest.globalRanking)}` : "—",
                           v2: user2.contest?.globalRanking ? `#${fmt(user2.contest.globalRanking)}` : "—" },
  ];

  return (
    <Card delay={0.4}>
      <SectionLabel icon={Trophy} label="Contest Stats" />
      <div className="space-y-1">
        <div className="flex items-center gap-4 px-2 pb-2 border-b border-white/[0.05] text-[10px] font-mono">
          <span style={{ color: COLORS.u1 }} className="flex-1 text-right">{user1.username}</span>
          <span className="w-24 text-center text-gray-600">Category</span>
          <span style={{ color: COLORS.u2 }} className="flex-1 text-left">{user2.username}</span>
        </div>
        {rows.map(({ label, v1, v2 }, i) => (
          <div key={label} className={`flex items-center gap-4 px-2 py-2 rounded-lg ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
            <span className="flex-1 text-right text-sm font-bold text-white tabular-nums">{v1}</span>
            <span className="w-24 text-center text-[10px] font-mono text-gray-500">{label}</span>
            <span className="flex-1 text-left text-sm font-bold text-white tabular-nums">{v2}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BADGES
// ─────────────────────────────────────────────────────────────────────────────
function Badges({ user1, user2 }) {
  if (!user1.badges?.length && !user2.badges?.length) return null;
  return (
    <Card delay={0.45}>
      <SectionLabel icon={Award} label="Badges" />
      <div className="grid grid-cols-2 gap-6">
        {[user1, user2].map((u, ui) => (
          <div key={u.username}>
            <p className="text-[10px] font-mono mb-2" style={{ color: ui === 0 ? COLORS.u1 : COLORS.u2 }}>
              {u.username}
            </p>
            {u.badges.length
              ? <div className="flex flex-wrap gap-1.5">
                  {u.badges.map(b => (
                    <span key={b} className="text-[10px] font-mono bg-white/[0.05] border border-white/[0.08]
                                            text-gray-400 px-2 py-1 rounded-lg">
                      {b}
                    </span>
                  ))}
                </div>
              : <p className="text-gray-600 text-xs font-mono">No badges yet</p>
            }
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ERROR STATE
// ─────────────────────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center"
    >
      <XCircle size={28} className="text-red-400 mx-auto mb-3" />
      <p className="text-white font-bold mb-1 text-sm">Something went wrong</p>
      <p className="text-gray-400 text-xs mb-4 font-mono">{message}</p>
      <button onClick={onRetry}
        className="text-xs bg-white/[0.06] border border-white/[0.1] text-gray-300
                   hover:text-white px-4 py-2 rounded-lg transition-colors">
        Try again
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function Compare({ setIsLoggedIn }) {
  const { user } = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate();

  const logout = async () => {
    await axios.post(`${BACKEND_URL}/logout`, {}, {
      withCredentials: true
    }).then(() => {
      console.log("logged out")
      setIsLoggedIn(false);
    }).catch(error => {
      console.log(error);
    })
    navigate("/login");
  }

  const handleCompare = async (u1, u2) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/compare/leetcode?user1=${u1}&user2=${u2}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch comparison");
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col">
      {/* Header */}
      <header className="bg-zinc-900 border-gray-200 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <img src="/logo.png" alt="Logo" />
            </div>
            <h1 className="text-2xl font-bold font-grotesk text-zinc-200">Codefolio</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="cursor-pointer px-4 py-2 bg-emerald-600 text-gray-100 rounded-lg hover:bg-gray-100 hover:text-emerald-600 transition-colors font-medium" onClick={() => setShowModal(true)}>
              Sync Data
            </button>
            <div className="flex items-center gap-3">
              <img
                src={user?.pictureURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-200">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col px-8 py-6 bg-zinc-800 rounded-tl-2xl">

        {/* Page title */}
        <div className="mb-6">
          <h2 className="text-3xl font-bodoni italic text-zinc-200">Compare</h2>
          <p className="text-gray-500 mt-1">LeetCode head-to-head stats.</p>
        </div>

        <InputForm onCompare={handleCompare} loading={loading} />

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            {[180, 120, 260, 200].map((h, i) => (
              <div key={i} className="bg-[#161b22] border border-white/[0.05] rounded-2xl"
                style={{ height: h }} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <ErrorState message={error} onRetry={() => setError(null)} />
        )}

        {/* Results */}
        <AnimatePresence>
          {data && !loading && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="space-y-5"
            >
              <ScoreBanner user1={data.user1} user2={data.user2} score={data.score} />

              {/* 2-col layout for charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <SolvedChart  user1={data.user1} user2={data.user2} />
                <RadarComp    user1={data.user1} user2={data.user2} />
              </div>

              <HeadToHead user1={data.user1} user2={data.user2} headToHead={data.headToHead} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <BeatsSection   user1={data.user1} user2={data.user2} />
                <ContestSection user1={data.user1} user2={data.user2} />
              </div>

              <ActivityChart user1={data.user1} user2={data.user2} />
              <TopTags       user1={data.user1} user2={data.user2} />
              <Badges        user1={data.user1} user2={data.user2} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}