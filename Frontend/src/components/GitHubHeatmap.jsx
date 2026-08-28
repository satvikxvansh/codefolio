import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_API_KEY;

function getLevel(count) {
  if (count === 0) return 0;
  if (count <= 2)  return 1;
  if (count <= 5)  return 2;
  if (count <= 9)  return 3;
  return 4;
}

const LEVEL_COLORS = [
  "bg-white/[0.05] border-white/[0.06]",
  "bg-emerald-900/60 border-emerald-800/40",
  "bg-emerald-700/70 border-emerald-600/40",
  "bg-emerald-500/80 border-emerald-400/50",
  "bg-emerald-400    border-emerald-300/60",
];

const LEVEL_GLOW = [
  "",
  "",
  "",
  "shadow-[0_0_4px_rgba(16,185,129,0.3)]",
  "shadow-[0_0_6px_rgba(52,211,153,0.5)]",
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["", "Mon", "", "Wed", "", "Fri", ""];

function Tooltip({ day, visible, x, y }) {
  if (!visible || !day) return null;
  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{ left: x, top: y - 42, transform: "translateX(-50%)" }}
    >
      <div className="bg-[#1c2333] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white whitespace-nowrap shadow-xl">
        <span className="text-emerald-400 font-bold">{day.count} Submissions{day.count !== 1 ? "s" : ""}</span>
        <span className="text-gray-400 ml-1">on {day.date}</span>
      </div>
    </div>
  );
}

// converts the contribution calendar object into a 52-week × 7-day array for rendering a contribution heatmap.
function calendarToWeeks(calendar) {
  const weeks = [];
  const now = new Date();
  for (let w = 51; w >= 0; w--) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      const key = date.toISOString().split("T")[0];   // toISOString to convert Date object into a ISO type String.
      days.push({ date: key, count: calendar[key] || 0 });
    }
    weeks.push(days);
  }
  return weeks;
}

export default function GitHubHeatmap({ cfHandle, lcUsername }) {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, day: null, x: 0, y: 0 });
  const [totalContribs, setTotal] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {      
      const res = await fetch(`${BACKEND_URL}/api/heatmap?cf=${cfHandle}&lc=${lcUsername}`);

      if (!res.ok) throw new Error(data.error || "Failed to fetch heatmap");

      const data = await res.json();
      // console.log(data);
      setWeeks(calendarToWeeks(data.calendar));
      setTotal(data.summary.totalSubmissions);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [lcUsername, cfHandle]);

  // Month labels
  const monthLabels = [];
  
  // Iterates through weeks and records the starting week index whenever a new month begins, so month names can be displayed above a heatmap.
  if (weeks.length) {
    let lastMonth = null;
    weeks.forEach((week, wi) => {
      const month = new Date(week[0].date).getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ index: wi, label: MONTHS[month] });
        lastMonth = month;
      }
    });
  }

  return (
    <div className="bg-zinc-900 border border-white/[0.07] rounded-2xl p-5 w-full">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <p className="text-lg font-medium text-gray-600">Submission Heatmap</p>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={fetchData}
            className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </motion.button>
        </div>
      </div>

      {/* ── Error ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center py-8 text-gray-500 text-sm"
          >
            Could not load GitHub data for <span className="text-white">@{lcUsername}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          <div className="flex gap-1">
            {Array.from({ length: 52 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, j) => (
                  <div key={j} className="w-2.5 h-2.5 rounded-sm bg-white/[0.05]" />
                ))}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            {[1,2,3,4].map(i => <div key={i} className="h-10 flex-1 rounded-xl bg-white/[0.04]" />)}
          </div>
        </div>
      )}

      {/* ── Heatmap grid ── */}
      {!loading && !error && (
        <>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-x-auto"
        >
          {/* Month labels */}
          <div className="flex mb-1 gap-1 ml-6">
            {monthLabels.map(({ index, label }) => (
              <div
                key={label + index}
                className="text-[9px] font-mono text-gray-600 absolute"
                style={{ left: `calc(1.5rem + ${index * 14}px)` }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-1 mt-4 p-1">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mr-1 flex-shrink-0">
              {DAYS.map((d, i) => (
                <div key={i} className="h-[10px] text-[8px] font-mono text-gray-700 flex items-center leading-none w-5">
                  {d}
                </div>
              ))}
            </div>

            {/* Contribution cells */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px] flex-shrink-0">
                {week.map((day, di) => {
                  const level = getLevel(day.count);
                  return (
                    <motion.div
                      key={day.date}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (wi * 7 + di) * 0.0008, duration: 0.2 }}
                      className={`w-[10px] h-[10px] rounded-[2px] border cursor-pointer transition-transform hover:scale-150 hover:z-10 relative ${LEVEL_COLORS[level]} ${LEVEL_GLOW[level]}`}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          visible: true, day,
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                        });
                      }}
                      onMouseLeave={() => setTooltip({ visible: false, day: null, x: 0, y: 0 })}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex items-center justify-end gap-1.5 mt-2">
          <span className="text-[9px] font-mono text-gray-600">Less</span>
          {LEVEL_COLORS.map((cls, i) => (
            <div key={i} className={`w-[10px] h-[10px] rounded-[2px] border ${cls}`} />
          ))}
          <span className="text-[9px] font-mono text-gray-600">More</span>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          {!loading && !error && (
            <span className="text-[10px] font-mono text-emerald-400/70 bg-emerald-500/8 border border-emerald-500/15 px-2 py-1 rounded-full">
              {totalContribs.toLocaleString()} Submissions this year
            </span>
          )}
          {!loading && !error && (
            <span className="text-[10px] font-mono text-emerald-400/70 bg-emerald-500/8 border border-emerald-500/15 px-2 py-1 rounded-full">
              {15} Max Streak
            </span>
          )}
        </div>
        </>
      )}

      {/* Global tooltip */}
      <Tooltip {...tooltip} />
    </div>
  );
}