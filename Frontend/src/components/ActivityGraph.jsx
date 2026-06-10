// ─── File: components/ActivityGraph.jsx ──────────────────────────────────────
// npm install recharts framer-motion lucide-react  (already installed)
//
// Usage:
//   import ActivityGraph from "./components/ActivityGraph";
//   <ActivityGraph
//     cfHandle="tourist"
//     lcUsername="neal_wu"
//     backendUrl={BACKEND_URL}
//   />
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { Flame, Calendar, TrendingUp, Zap, Award, RefreshCw, Activity } from "lucide-react";

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  lc:      "#f59e0b",   // amber  — LeetCode
  cf:      "#38bdf8",   // sky    — Codeforces
  combined:"#10b981",   // emerald — combined
  lcFill:  "#f59e0b22",
  cfFill:  "#38bdf822",
  grid:    "rgba(255,255,255,0.04)",
  surface: "#161b22",
  bg:      "#0d1117",
};

const RANGES = [
  { key: "1W", label: "1W", days: 7  },
  { key: "1M", label: "1M", days: 30 },
  { key: "1Y", label: "1Y", days: 365 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n) { return n == null ? "—" : Number(n).toLocaleString(); }

function daysBetween(dateStr) {
  const now  = new Date();
  const then = new Date(dateStr);
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Format date label based on range
function formatLabel(dateStr, days) {
  const d = new Date(dateStr);
  if (days <= 7)  return DOW[d.getDay()];
  if (days <= 30) return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  return `${MONTHS[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`;
}

// Group daily data into weekly buckets for 1Y view
function groupByWeek(entries) {
  const weeks = {};
  entries.forEach(({ date, lc, cf }) => {
    const d    = new Date(date);
    const day  = d.getDay();
    const diff = d.getDate() - day;
    const weekStart = new Date(d.setDate(diff)).toISOString().split("T")[0];
    if (!weeks[weekStart]) weeks[weekStart] = { date: weekStart, lc: 0, cf: 0 };
    weeks[weekStart].lc += lc;
    weeks[weekStart].cf += cf;
  });
  return Object.values(weeks).sort((a, b) => a.date.localeCompare(b.date));
}

// ── Custom tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, range }) {
  if (!active || !payload?.length) return null;
  const lc  = payload.find(p => p.dataKey === "lc")?.value  || 0;
  const cf  = payload.find(p => p.dataKey === "cf")?.value  || 0;
  return (
    <div className="bg-[#1c2333] border border-white/10 rounded-xl px-4 py-3 text-xs shadow-2xl">
      <p className="text-gray-400 font-roboto mb-2">{label}</p>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: C.lc }} />
          <span className="text-gray-300">LeetCode</span>
          <span className="text-white font-bold ml-auto pl-4">{fmt(lc)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: C.cf }} />
          <span className="text-gray-300">Codeforces</span>
          <span className="text-white font-bold ml-auto pl-4">{fmt(cf)}</span>
        </div>
        <div className="border-t border-white/[0.08] pt-1.5 mt-0.5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: C.combined }} />
          <span className="text-gray-300">Total</span>
          <span className="text-emerald-400 font-bold ml-auto pl-4">{fmt(lc + cf)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex gap-3 items-start"
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon size={14} style={{ color }} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-white font-bold text-base leading-none">{value}</p>
        <p className="text-gray-500 text-[10px] font-roboto mt-1 leading-none">{label}</p>
        {sub && <p className="text-gray-600 text-[9px] font-roboto mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ── Chart type toggle ─────────────────────────────────────────────────────────
function ChartToggle({ value, onChange }) {
  return (
    <div className="flex bg-white/[0.04] border border-white/[0.07] rounded-lg p-0.5 gap-0.5">
      {["area", "bar"].map(type => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`px-3 py-1.5 rounded-md text-[11px] font-roboto font-semibold transition-all capitalize
                      ${value === type
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "text-gray-500 hover:text-gray-300"}`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function ActivityGraph({ cfHandle, lcUsername, backendUrl }) {
  const [rawCalendar, setRawCalendar] = useState(null); // { "YYYY-MM-DD": { lc, cf } }
  const [summary,     setSummary]     = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [range,       setRange]       = useState("1M");
  const [chartType,   setChartType]   = useState("area");

  // ── Fetch from your heatmap endpoint ───────────────────────────────────────
  const fetchData = async () => {
    if (!cfHandle && !lcUsername) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (cfHandle)   params.append("cf", cfHandle);
      if (lcUsername) params.append("lc", lcUsername);

      const res  = await fetch(`${backendUrl}/api/heatmap?${params}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");

      // ── The heatmap endpoint returns separate lc/cf calendars in summary.
      // We need per-platform daily data. Re-request both separately OR
      // reconstruct from the merged calendar + per-platform totals.
      // Since your endpoint returns a single merged calendar, we fetch
      // both platforms separately to get individual daily counts.
      // ── Fetch LC-only and CF-only to split per-platform daily data ────────
      const [lcRes, cfRes] = await Promise.allSettled([
        lcUsername ? fetch(`${backendUrl}/api/heatmap?lc=${lcUsername}`, { credentials: "include" }).then(r => r.json()) : Promise.resolve(null),
        cfHandle   ? fetch(`${backendUrl}/api/heatmap?cf=${cfHandle}`,   { credentials: "include" }).then(r => r.json()) : Promise.resolve(null),
      ]);

      const lcCal = lcRes.status === "fulfilled" && lcRes.value?.calendar ? lcRes.value.calendar : {};
      const cfCal = cfRes.status === "fulfilled" && cfRes.value?.calendar ? cfRes.value.calendar : {};

      // Merge into { date: { lc, cf } }
      const allDates = new Set([...Object.keys(lcCal), ...Object.keys(cfCal)]);
      const merged = {};
      allDates.forEach(date => {
        merged[date] = { lc: lcCal[date] || 0, cf: cfCal[date] || 0 };
      });

      setRawCalendar(merged);
      setSummary(data.summary);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [cfHandle, lcUsername]);

  // ── Filter + shape data for selected range ─────────────────────────────────
  const chartData = useMemo(() => {
    if (!rawCalendar) return [];
    const { days } = RANGES.find(r => r.key === range);

    // Filter to range
    const filtered = Object.entries(rawCalendar)
      .filter(([date]) => daysBetween(date) <= days)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, { lc, cf }]) => ({
        date,
        label: formatLabel(date, days),
        lc,
        cf,
      }));

    // For 1Y: group into weekly buckets to avoid too many bars
    if (days === 365) {
      return groupByWeek(filtered).map(d => ({
        ...d,
        label: formatLabel(d.date, days),
      }));
    }

    return filtered;
  }, [rawCalendar, range]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!rawCalendar || !summary) return null;
    const { days } = RANGES.find(r => r.key === range);

    const inRange = Object.entries(rawCalendar)
      .filter(([date]) => daysBetween(date) <= days);

    const totalLc  = inRange.reduce((s, [, { lc }]) => s + lc, 0);
    const totalCf  = inRange.reduce((s, [, { cf }]) => s + cf, 0);
    const total    = totalLc + totalCf;
    const activeDays = inRange.filter(([, { lc, cf }]) => lc + cf > 0).length;

    // Most active day in range
    const mostActive = inRange.reduce(
      (best, [date, { lc, cf }]) => lc + cf > best.count
        ? { date, count: lc + cf }
        : best,
      { date: null, count: 0 }
    );

    // Current streak (from today backwards)
    const allDates = Object.keys(rawCalendar).sort().reverse();
    let streak = 0;
    for (const date of allDates) {
      const { lc, cf } = rawCalendar[date];
      if (lc + cf > 0) streak++;
      else break;
    }

    // Best single day ever
    const bestDay = Object.entries(rawCalendar).reduce(
      (best, [date, { lc, cf }]) => lc + cf > best.count
        ? { date, count: lc + cf }
        : best,
      { date: null, count: 0 }
    );

    return { totalLc, totalCf, total, activeDays, mostActive, streak, bestDay };
  }, [rawCalendar, summary, range]);

  // ── Chart shared props ─────────────────────────────────────────────────────
  const axisProps = {
    tick:     { fill: "#4b5563", fontSize: 10, fontFamily: "monospace" },
    axisLine: false,
    tickLine: false,
  };

  const ChartComponent = chartType === "area" ? AreaChart : BarChart;

  return (
    <div className="bg-zinc-900 rounded-2xl p-5 w-full">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div>
            <p className="text-lg font-semibold text-gray-600 leading-none">Submission Activity</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Range selector */}
          <div className="flex bg-white/[0.04] border border-white/[0.07] rounded-lg p-0.5 gap-0.5">
            {RANGES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setRange(key)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-roboto font-semibold transition-all
                            ${range === key
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "text-gray-500 hover:text-gray-300"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <ChartToggle value={chartType} onChange={setChartType} />

          {/* Refresh */}
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={fetchData}
            className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08]
                       flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </motion.button>
        </div>
      </div>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="animate-pulse space-y-4">
          <div className="h-52 bg-white/[0.04] rounded-xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1,2,3,4].map(i => <div key={i} className="h-16 bg-white/[0.04] rounded-xl" />)}
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <div className="text-center py-10 text-gray-500 text-sm font-roboto">
          {error}
        </div>
      )}

      {/* ── Chart + stats ── */}
      <AnimatePresence>
        {!loading && !error && chartData.length > 0 && (
          <motion.div
            key={range + chartType}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Platform legend pills */}
            <div className="flex gap-3 mb-4">
              {[
                { label: "LeetCode",   color: C.lc },
                { label: "Codeforces", color: C.cf },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span className="text-[10px] font-roboto text-gray-500">{label}</span>
                </div>
              ))}
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={220}>
              {chartType === "area" ? (
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lcGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={C.lc} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={C.lc} stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="cfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={C.cf} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={C.cf} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                  <XAxis dataKey="label" {...axisProps} interval="preserveStartEnd" />
                  <YAxis {...axisProps} width={28} allowDecimals={false} />
                  <RTooltip content={<CustomTooltip range={range} />} cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="lc" stroke={C.lc} strokeWidth={2}
                    fill="url(#lcGrad)" dot={false} activeDot={{ r: 4, fill: C.lc }} />
                  <Area type="monotone" dataKey="cf" stroke={C.cf} strokeWidth={2}
                    fill="url(#cfGrad)" dot={false} activeDot={{ r: 4, fill: C.cf }} />
                </AreaChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="30%" barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                  <XAxis dataKey="label" {...axisProps} interval="preserveStartEnd" />
                  <YAxis {...axisProps} width={28} allowDecimals={false} />
                  <RTooltip content={<CustomTooltip range={range} />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="lc" fill={C.lc} radius={[3,3,0,0]} opacity={0.85} />
                  <Bar dataKey="cf" fill={C.cf} radius={[3,3,0,0]} opacity={0.85} />
                </BarChart>
              )}
            </ResponsiveContainer>

            {/* ── Stat cards ── */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                <StatCard
                  icon={Zap}
                  label={`Total in ${RANGES.find(r => r.key === range)?.label}`}
                  value={fmt(stats.total)}
                  sub={`LC ${fmt(stats.totalLc)}  ·  CF ${fmt(stats.totalCf)}`}
                  color={C.combined}
                  delay={0.05}
                />
                <StatCard
                  icon={Calendar}
                  label="Active Days"
                  value={`${stats.activeDays}d`}
                  sub={`of ${RANGES.find(r => r.key === range)?.days} days`}
                  color={C.lc}
                  delay={0.1}
                />
                <StatCard
                  icon={Flame}
                  label="Current Streak"
                  value={`${stats.streak}d`}
                  sub="consecutive days"
                  color="#f87171"
                  delay={0.15}
                />
                <StatCard
                  icon={Award}
                  label="Most Active Day"
                  value={fmt(stats.bestDay.count)}
                  sub={stats.bestDay.date || "—"}
                  color={C.cf}
                  delay={0.2}
                />
              </div>
            )}

            {/* ── Submission split bar ── */}
            {stats && stats.total > 0 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4"
              >
                <p className="text-[10px] font-roboto text-gray-600 mb-2 uppercase tracking-widest">
                  Platform split
                </p>
                <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                  <motion.div
                    className="rounded-l-full"
                    style={{ background: C.lc }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.totalLc / stats.total) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                  <motion.div
                    className="rounded-r-full flex-1"
                    style={{ background: C.cf }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] font-roboto" style={{ color: C.lc }}>
                    LeetCode {stats.total > 0 ? Math.round((stats.totalLc / stats.total) * 100) : 0}%
                  </span>
                  <span className="text-[10px] font-roboto" style={{ color: C.cf }}>
                    Codeforces {stats.total > 0 ? Math.round((stats.totalCf / stats.total) * 100) : 0}%
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Empty state ── */}
      {!loading && !error && chartData.length === 0 && rawCalendar && (
        <div className="text-center py-10 text-gray-600 text-xs font-roboto">
          No activity in this range
        </div>
      )}
    </div>
  );
}