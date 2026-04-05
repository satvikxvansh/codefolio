import { useState, useEffect, useRef } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import {
  Code2, Trophy, Users, TrendingUp, Zap, ChevronRight,
  Star, GitBranch, BarChart2, Globe, Shield, ArrowRight,
  Terminal, Flame, Target, Activity, Menu, X, ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import Particles from "../components/Particles.jsx"
import GridBg from "../components/GridBg.jsx"

// --- Utility ---
const cn = (...classes) => classes.filter(Boolean).join(" ");

// --- Animated counter ---
function Counter({ to, duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, to, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

// --- Nav ---
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Features", "Stats", "Compare", "Platforms", "Pricing"];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-[#0d1117]/90 backdrop-blur-md border-b border-emerald-900/30" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Code2 size={16} className="text-black" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold text-lg tracking-tight font-mono">Codefolio</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`}
              className="text-sm text-gray-400 hover:text-emerald-400 transition-colors duration-200 font-medium">
              {l}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">Sign In</button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold px-5 py-2 rounded-lg transition-colors"
          >
            Get Started
          </motion.button>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0d1117] border-t border-emerald-900/30 px-6 py-4 flex flex-col gap-4"
          >
            {links.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-gray-300 hover:text-emerald-400 text-sm" onClick={() => setOpen(false)}>{l}</a>
            ))}
            <button className="bg-emerald-500 text-black font-bold py-2 rounded-lg text-sm mt-2">Get Started</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// --- Hero ---
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden">
      <GridBg />
      <Particles />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-emerald-600/8 blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono px-4 py-2 rounded-full mb-8"
        >
          <Flame size={12} />
          Track. Compare. Dominate.
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          One profile for
          <br />
          <span className="text-emerald-400">every platform</span>
          <br />
          you grind.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Codefolio unifies your LeetCode, Codeforces, and more into one competitive dashboard. 
          Track streaks, ratings, and rank—then challenge your peers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="hover:cursor-pointer group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-4 rounded-xl text-base transition-colors"
            >
              Build your Codefolio
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="hover:cursor-pointer flex items-center gap-2 border border-gray-700 hover:border-emerald-500/50 text-gray-300 hover:text-white px-8 py-4 rounded-xl text-base transition-all"
          >
            <Terminal size={16} />
            View Demo
          </motion.button>
        </motion.div>

        {/* Social proof row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500"
        >
          <div className="flex -space-x-2">
            {["🧑‍💻", "👩‍💻", "🧑‍💻", "👨‍💻", "👩‍💻"].map((e, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#0d1117] flex items-center justify-center text-sm">{e}</div>
            ))}
          </div>
          <span><span className="text-white font-semibold">12,000+</span> coders already tracking</span>
          <span className="hidden sm:block text-gray-700">|</span>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(i => <Star key={i} size={13} className="text-emerald-400 fill-emerald-400" />)}
            <span className="ml-1"><span className="text-white font-semibold">4.9</span> rating</span>
          </div>
        </motion.div>
      </div>

      {/* Dashboard preview mockup */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 20 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative mt-20 w-full max-w-5xl mx-auto"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d1117] z-10 pointer-events-none" style={{ top: "60%" }} />
        <div className="bg-[#161b22] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/10">
          {/* Fake browser bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-[#0d1117]">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <div className="ml-4 bg-gray-800 rounded-md px-4 py-1 text-gray-500 text-xs font-mono flex-1 max-w-xs">codefolio.io/dashboard</div>
          </div>
          {/* Mini dashboard */}
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Problems Solved", value: "600", accent: true },
              { label: "Global Rank", value: "#2", accent: false },
              { label: "Current Streak", value: "23d", accent: false },
              { label: "Contest Rating", value: "1163", accent: false },
            ].map((card) => (
              <div key={card.label} className={cn(
                "rounded-xl p-4 border",
                card.accent
                  ? "bg-emerald-600 border-emerald-500"
                  : "bg-[#0d1117] border-gray-800"
              )}>
                <p className={cn("text-xs mb-2", card.accent ? "text-emerald-100" : "text-gray-500")}>{card.label}</p>
                <p className={cn("text-2xl font-black", card.accent ? "text-white" : "text-white")}>{card.value}</p>
              </div>
            ))}
          </div>
          <div className="px-6 pb-6 grid grid-cols-2 gap-4">
            <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-3">LeetCode Breakdown</p>
              <div className="space-y-2">
                {[["Easy", "145", "emerald"], ["Medium", "269", "yellow"], ["Hard", "23", "red"]].map(([d, v, c]) => (
                  <div key={d} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-${c}-500`} />
                    <div className={`h-2 flex-1 rounded-full bg-gray-800`}>
                      <div className={`h-full rounded-full bg-${c}-500`} style={{ width: `${(+v / 437) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#0d1117] border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-3">Codeforces Stats</p>
              {[["Rating", "1134"], ["Max Rating", "1163"], ["Title", "Newbie"]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm py-1 border-b border-gray-800 last:border-0">
                  <span className="text-gray-400">{k}</span>
                  <span className="text-white font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// --- Stats section ---
function StatsSection() {
  const stats = [
    { value: 12000, suffix: "+", label: "Active Users", icon: Users },
    { value: 850000, suffix: "+", label: "Problems Tracked", icon: Target },
    { value: 50, suffix: "+", label: "Countries", icon: Globe },
    { value: 98, suffix: "%", label: "Uptime", icon: Activity },
  ];

  return (
    <section id="stats" className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(({ value, suffix, label, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 text-center hover:border-emerald-500/30 transition-colors"
          >
            <Icon size={20} className="text-emerald-400 mx-auto mb-3" />
            <div className="text-3xl font-black text-white mb-1 font-mono">
              <Counter to={value} />{suffix}
            </div>
            <p className="text-sm text-gray-500">{label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// --- Features ---
function Features() {
  const features = [
    {
      icon: BarChart2,
      title: "Unified Dashboard",
      desc: "All your stats from LeetCode, Codeforces, CodeChef, and more aggregated into one beautiful view. No more tab-hopping.",
      tag: "Core",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      desc: "Watch your ratings climb, streaks grow, and problem count skyrocket. Visual heatmaps and activity graphs keep you motivated.",
      tag: "Insights",
    },
    {
      icon: Users,
      title: "Friend Comparisons",
      desc: "Challenge your peers head-to-head. Compare ratings, solved counts, and contest performance side by side.",
      tag: "Social",
    },
    {
      icon: Trophy,
      title: "Contest History",
      desc: "Every contest you've attended, ranked and graphed. Spot your peak performance and plan your next climb.",
      tag: "Contests",
    },
    {
      icon: Zap,
      title: "Live Sync",
      desc: "One click to pull fresh data from all connected platforms. Your profile stays current without manual updates.",
      tag: "Realtime",
    },
    {
      icon: Shield,
      title: "Public Portfolio",
      desc: "Share your Codefolio link with recruiters or friends. A clean, impressive profile that shows your competitive coding journey.",
      tag: "Portfolio",
    },
  ];

  return (
    <section id="features" className="relative py-24 px-6">
      <GridBg />
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-emerald-400 text-sm font-mono font-semibold tracking-widest uppercase">Features</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">
            Everything a competitive<br />coder needs.
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Built by coders, for coders. Every feature designed around what matters on the leaderboard.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc, tag }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="group relative bg-[#161b22] border border-gray-800 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-300 cursor-default"
            >
              <div className="absolute inset-0 rounded-2xl bg-emerald-500/0 group-hover:bg-emerald-500/3 transition-colors duration-300" />
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Icon size={18} className="text-emerald-400" />
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-500/60 bg-emerald-500/8 border border-emerald-500/15 px-2 py-1 rounded-full">
                  {tag}
                </span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Compare section ---
function CompareSection() {
  const [active, setActive] = useState(0);
  const users = [
    { name: "You", lc: 437, cf: 163, streak: 23, rating: 1163, emoji: "🧑‍💻" },
    { name: "Alex", lc: 312, cf: 205, streak: 7, rating: 1344, emoji: "👩‍💻" },
    { name: "Raj", lc: 590, cf: 88, streak: 41, rating: 1098, emoji: "👨‍💻" },
  ];

  const me = users[0];
  const them = users[active === 0 ? 1 : active];

  const metrics = [
    { label: "LeetCode Problems", a: me.lc, b: them.lc },
    { label: "Codeforces Problems", a: me.cf, b: them.cf },
    { label: "Streak (days)", a: me.streak, b: them.streak },
    { label: "Max Rating", a: me.rating, b: them.rating },
  ];

  return (
    <section id="compare" className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-emerald-400 text-sm font-mono font-semibold tracking-widest uppercase">Compare</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">
            Know where you stand.
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Challenge friends or any public profile. Concrete comparisons that fuel your next grind session.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#161b22] border border-gray-800 rounded-2xl p-8"
        >
          {/* User selector */}
          <div className="flex gap-3 mb-8 flex-wrap">
            {users.slice(1).map((u, i) => (
              <button
                key={u.name}
                onClick={() => setActive(i + 1)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                  active === i + 1
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                    : "border-gray-700 text-gray-400 hover:border-gray-600"
                )}
              >
                <span>{u.emoji}</span>{u.name}
              </button>
            ))}
          </div>

          {/* Comparison bars */}
          <div className="space-y-5">
            {metrics.map(({ label, a, b }) => {
              const total = Math.max(a, b);
              const aW = Math.round((a / total) * 100);
              const bW = Math.round((b / total) * 100);
              const aWins = a >= b;
              return (
                <div key={label}>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span className={cn("font-semibold", aWins && "text-emerald-400")}>{me.name} — {a}</span>
                    <span className="text-center text-gray-600">{label}</span>
                    <span className={cn("font-semibold", !aWins && "text-emerald-400")}>{them.name} — {b}</span>
                  </div>
                  <div className="flex gap-1 h-3 rounded-full overflow-hidden">
                    <motion.div
                      className={cn("rounded-l-full", aWins ? "bg-emerald-500" : "bg-gray-600")}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${aW}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                    <motion.div
                      className={cn("rounded-r-full", !aWins ? "bg-emerald-500" : "bg-gray-600")}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bW}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// --- Platforms ---
function Platforms() {
  const platforms = [
    { name: "LeetCode", color: "#FFA116", problems: "3000+", desc: "DSA problems & weekly contests" },
    { name: "Codeforces", color: "#1890ff", problems: "8000+", desc: "Competitive programming rounds" },
    { name: "CodeChef", color: "#6E4C1E", problems: "5000+", desc: "Long challenges & cookoffs" },
    { name: "HackerRank", color: "#00EA64", problems: "4000+", desc: "Skill certifications & tracks" },
    { name: "AtCoder", color: "#888", problems: "6000+", desc: "Japanese CP competitions" },
    { name: "GeeksforGeeks", color: "#2F8D46", problems: "10k+", desc: "Placement & interview prep" },
  ];

  return (
    <section id="platforms" className="relative py-24 px-6">
      <GridBg />
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-emerald-400 text-sm font-mono font-semibold tracking-widest uppercase">Platforms</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">
            All your platforms.<br />One place.
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Connect once, track forever. More platforms added regularly based on community requests.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map(({ name, color, problems, desc }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.02 }}
              className="group flex items-start gap-4 bg-[#161b22] border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition-all cursor-default"
            >
              <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-sm"
                style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}>
                {name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-bold text-sm">{name}</h3>
                  <span className="text-[10px] font-mono text-gray-500">{problems} problems</span>
                </div>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 text-sm mt-8"
        >
          + More platforms coming soon · <span className="text-emerald-500 cursor-pointer hover:text-emerald-400">Request a platform →</span>
        </motion.p>
      </div>
    </section>
  );
}

// --- Pricing ---
function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "0",
      desc: "For casual coders just getting started.",
      features: ["2 platforms connected", "Basic stats dashboard", "Public profile link", "30-day history"],
      cta: "Get Started Free",
      highlight: false,
    },
    {
      name: "Pro",
      price: "4",
      desc: "For serious competitive programmers.",
      features: ["Unlimited platforms", "Full analytics & heatmaps", "Friend comparisons", "Contest history & graphs", "Priority sync", "Embed in portfolio"],
      cta: "Start Pro",
      highlight: true,
    },
    {
      name: "Team",
      price: "12",
      desc: "For coding clubs and CP teams.",
      features: ["Everything in Pro", "Team leaderboard", "Group comparison views", "Admin dashboard", "Custom team URL", "Early feature access"],
      cta: "Start Team Trial",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-emerald-400 text-sm font-mono font-semibold tracking-widest uppercase">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 mb-4">Simple pricing.</h2>
          <p className="text-gray-400">Start free. Upgrade when you're ready to get serious.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(({ name, price, desc, features, cta, highlight }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative rounded-2xl p-7 border transition-all",
                highlight
                  ? "bg-emerald-600 border-emerald-500 shadow-xl shadow-emerald-900/30"
                  : "bg-[#161b22] border-gray-800"
              )}
            >
              {highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-black px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}
              <p className={cn("text-sm font-semibold mb-1", highlight ? "text-emerald-100" : "text-gray-400")}>{name}</p>
              <div className="flex items-end gap-1 mb-2">
                <span className={cn("text-4xl font-black", highlight ? "text-white" : "text-white")}>${price}</span>
                <span className={cn("text-sm mb-1", highlight ? "text-emerald-200" : "text-gray-500")}>/mo</span>
              </div>
              <p className={cn("text-xs mb-6", highlight ? "text-emerald-200" : "text-gray-500")}>{desc}</p>
              <ul className="space-y-2 mb-8">
                {features.map((f) => (
                  <li key={f} className={cn("flex items-start gap-2 text-sm", highlight ? "text-white" : "text-gray-300")}>
                    <span className={cn("mt-0.5 text-xs", highlight ? "text-emerald-200" : "text-emerald-400")}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "w-full py-3 rounded-xl font-bold text-sm transition-colors",
                  highlight
                    ? "bg-black text-white hover:bg-gray-900"
                    : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                )}
              >
                {cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- CTA Banner ---
function CTABanner() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-emerald-600 rounded-3xl p-12 text-center overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
              backgroundSize: "32px 32px"
            }}
          />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Ready to level up?
            </h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of competitive programmers who use Codefolio to track, compare, and dominate.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white font-bold px-10 py-4 rounded-xl text-base hover:bg-gray-900 transition-colors inline-flex items-center gap-2"
            >
              Create your free profile
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// --- Footer ---
function Footer() {
  return (
    <footer className="border-t border-gray-800 py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Code2 size={14} className="text-black" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold font-mono">Codefolio</span>
        </div>
        <p className="text-gray-600 text-sm">© 2026 Codefolio. Built with love by Satvik Vansh.</p>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          {["Privacy", "Terms", "Contact"].map((l) => (
            <a key={l} href="#" className="hover:text-gray-300 transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// --- App ---
export default function App() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap');`}</style>
      <Navbar />
      <Hero />
      <StatsSection />
      <Features />
      <CompareSection />
      <Platforms />
      <Pricing />
      <CTABanner />
      <Footer />
    </div>
  );
}