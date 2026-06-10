// ─── File: components/DashboardSkeleton.jsx ───────────────────────────────────
// Usage:
//   import DashboardSkeleton from "./components/DashboardSkeleton";
//   {loading && <DashboardSkeleton />}
// ─────────────────────────────────────────────────────────────────────────────

// ── Base shimmer block ────────────────────────────────────────────────────────
function Shimmer({ className = "" }) {
  return (
    <div
      className={`rounded-lg bg-white/[0.06] relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}

// ── Top stat card (generic dark card) ────────────────────────────────────────
function StatCardSkeleton() {
  return (
    <div className="bg-[#161b22] border border-white/[0.07] rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Shimmer className="h-3 w-28" />
        <Shimmer className="h-7 w-7 rounded-full" />
      </div>
      <Shimmer className="h-12 w-2/3 mt-1" />
      <Shimmer className="h-3 w-1/2" />
    </div>
  );
}

// ── Green "Total Problems Solved" card ────────────────────────────────────────
function TotalSolvedSkeleton() {
  return (
    <div className="bg-emerald-700/40 border border-emerald-600/30 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Shimmer className="h-3 w-32 bg-emerald-500/20" />
        <Shimmer className="h-7 w-7 rounded-full bg-emerald-500/20" />
      </div>
      <Shimmer className="h-14 w-2/3 mt-1 bg-emerald-500/20" />
      <Shimmer className="h-3 w-40 bg-emerald-500/20" />
    </div>
  );
}

// ── LeetCode problems card (with progress bars) ───────────────────────────────
function LCProblemsSkeleton() {
  return (
    <div className="bg-[#161b22] border border-white/[0.07] rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Shimmer className="h-3 w-28" />
        <Shimmer className="h-7 w-7 rounded-full" />
      </div>
      <Shimmer className="h-10 w-1/2" />
      {/* Progress bars */}
      <div className="space-y-2.5 mt-1">
        {[["w-full", "bg-emerald-500/20"], ["w-full", "bg-yellow-500/20"], ["w-full", "bg-red-500/20"]].map(([w, bg], i) => (
          <div key={i} className={`h-7 ${w} rounded-md bg-white/[0.06] relative overflow-hidden`}>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite]
                            bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Codeforces problems card ──────────────────────────────────────────────────
function CFProblemsSkeleton() {
  return (
    <div className="bg-[#161b22] border border-white/[0.07] rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Shimmer className="h-3 w-32" />
        <Shimmer className="h-7 w-7 rounded-full" />
      </div>
      <Shimmer className="h-10 w-1/2" />
      {/* Key-value rows */}
      <div className="space-y-3 mt-1">
        {[["w-12", "w-20"], ["w-14", "w-16"], ["w-20", "w-12"], ["w-24", "w-8"]].map(([kw, vw], i) => (
          <div key={i} className="flex items-center justify-between">
            <Shimmer className={`h-3 ${kw}`} />
            <Shimmer className={`h-3 ${vw}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Heatmap card ──────────────────────────────────────────────────────────────
function HeatmapSkeleton() {
  return (
    <div className="bg-[#161b22] border border-white/[0.07] rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Shimmer className="h-3 w-36" />
        <Shimmer className="h-6 w-6 rounded-full" />
      </div>

      {/* Month labels row */}
      <div className="flex gap-6 mt-1 ml-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <Shimmer key={i} className="h-2.5 w-6" />
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="flex gap-[3px] overflow-hidden">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] mr-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-[10px] w-5" />
          ))}
        </div>
        {/* Cells — 32 weeks visible */}
        {Array.from({ length: 32 }).map((_, wi) => (
          <div key={wi} className="flex flex-col gap-[3px] flex-shrink-0">
            {Array.from({ length: 7 }).map((_, di) => {
              // Vary opacity to fake realistic heatmap density
              const opacity = Math.random() > 0.55 ? "opacity-100" : "opacity-30";
              return (
                <div
                  key={di}
                  className={`w-[10px] h-[10px] rounded-[2px] bg-white/[0.07] ${opacity}
                               relative overflow-hidden`}
                >
                  <div className="absolute inset-0 -translate-x-full
                                  animate-[shimmer_1.6s_infinite]
                                  bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
                    style={{ animationDelay: `${(wi * 7 + di) * 0.01}s` }}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Scrollbar placeholder */}
      <div className="h-2.5 bg-white/[0.04] rounded-full mx-1 mt-1 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite]
                        bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      {/* Legend + pills */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex gap-2">
          {[1,2].map(i => <Shimmer key={i} className="h-5 w-32 rounded-full" />)}
        </div>
        <div className="flex items-center gap-1">
          <Shimmer className="h-2.5 w-6" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-[10px] h-[10px] rounded-[2px] bg-white/[0.07]" />
          ))}
          <Shimmer className="h-2.5 w-6" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SKELETON — mirrors your exact dashboard layout
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardSkeleton() {
  return (
    <>
      {/* Inject shimmer keyframe once */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="space-y-4">
        {/* Page title */}
        <div className="mb-6 space-y-2">
          <Shimmer className="h-8 w-48" style={{ borderRadius: "4px" }} />
          <Shimmer className="h-3 w-72" />
        </div>

        {/* ── Row 1: 4 stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TotalSolvedSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* ── Row 2: LC Problems | CF Problems | Heatmap ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LCProblemsSkeleton />
          <CFProblemsSkeleton />
          <HeatmapSkeleton />
        </div>
      </div>
    </>
  );
}