const express = require("express");
const axios   = require("axios");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// ── Rate limiter — prevents users from hammering external APIs ────────────────
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { error: "Too many requests, please slow down." },
});
router.use(limiter);

// ── Fetch LeetCode upcoming contests ─────────────────────────────────────────
async function fetchLeetCode() {
  const query = `
    query {
      topTwoContests: upcomingContests {
        title
        titleSlug
        startTime
        duration
      }
    }
  `;
  const res = await axios.post("https://leetcode.com/graphql", { query }, {
    headers: {
      "Content-Type": "application/json",
      "Referer": "https://leetcode.com",
      "Origin": "https://leetcode.com",
    },
    timeout: 10000,
  });
  const json = res.data;
  return (json?.data?.topTwoContests || []).slice(0, 2).map(c => ({
    platform:  "leetcode",
    title:     c.title,
    startTime: c.startTime * 1000,           // convert s → ms
    duration:  c.duration,                    // seconds
    url:       `https://leetcode.com/contest/${c.titleSlug}/`,
  }));
}

// ── Fetch Codeforces upcoming contests ────────────────────────────────────────
async function fetchCodeforces() {
  const res  = await axios.get("https://codeforces.com/api/contest.list?gym=false", {
    timeout: 10000,
  });
  const json = res.data;
  if (json.status !== "OK") return [];

  return json.result
    .filter(c => c.phase === "BEFORE")        // only upcoming
    .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds)
    .slice(0, 2)
    .map(c => ({
      platform:  "codeforces",
      title:     c.name,
      startTime: c.startTimeSeconds * 1000,   // convert s → ms
      duration:  c.durationSeconds,
      url:       `https://codeforces.com/contests/${c.id}`,
    }));
}

router.get("/", async (req, res) => {
  const [leetcodeResult, codeforcesResult] = await Promise.allSettled([
    fetchLeetCode(),
    fetchCodeforces(),
  ]);

  const leetcode = leetcodeResult.status === "fulfilled" ? leetcodeResult.value : [];
  const codeforces = codeforcesResult.status === "fulfilled" ? codeforcesResult.value : [];

  if (leetcodeResult.status === "rejected") {
    console.error("[upcoming-contests/leetcode]", leetcodeResult.reason.message);
  }
  if (codeforcesResult.status === "rejected") {
    console.error("[upcoming-contests/codeforces]", codeforcesResult.reason.message);
  }

  return res.json({
    leetcode,
    codeforces,
    // contests: pickUpcomingContests(leetcode, codeforces),
  });
});

// router.get("/leetcode", async (req, res) => {
//   try {
//     return res.json(await fetchLeetCode());
//   } catch (err) {
//     console.error("[upcoming-contests/leetcode]", err.message);
//     return res.status(502).json({ error: "Failed to fetch LeetCode contests" });
//   }
// });

// router.get("/codeforces", async (req, res) => {
//   try {
//     return res.json(await fetchCodeforces());
//   } catch (err) {
//     console.error("[upcoming-contests/codeforces]", err.message);
//     return res.status(502).json({ error: "Failed to fetch Codeforces contests" });
//   }
// });

module.exports = router;