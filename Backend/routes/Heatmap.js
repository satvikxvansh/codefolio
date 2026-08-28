// Endpoint:
//   GET /api/heatmap?cf=tourist&lc=neal_wu
//   GET /api/heatmap?cf=tourist          (only codeforces)
//   GET /api/heatmap?lc=neal_wu          (only leetcode)
// ─────────────────────────────────────────────────────────────────────────────

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

// ── Constants ─────────────────────────────────────────────────────────────────
const ONE_YEAR_AGO_S = () => Math.floor(Date.now() / 1000) - 365 * 24 * 60 * 60;

// ── Utility: unix timestamp (seconds) → "YYYY-MM-DD" ─────────────────────────
function tsToDate(unixSeconds) {
  return new Date(unixSeconds * 1000).toISOString().split("T")[0];
}

// ── Utility: is date within last 1 year ───────────────────────────────────────
function isWithinYear(unixSeconds) {
  return unixSeconds >= ONE_YEAR_AGO_S();
}

// ─────────────────────────────────────────────────────────────────────────────
// CODEFORCES
// Docs: https://codeforces.com/apiHelp/methods#user.status
// Returns all submissions for a user. We filter to last 1 year.
// Each submission has a creationTimeSeconds field.
// We count every submission (not just AC) to match LC behaviour.
// If you want only AC submissions, filter by: sub.verdict === "OK"
// ─────────────────────────────────────────────────────────────────────────────
async function getCodeforcesData(handle) {
  const url = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`;
  const { data } = await axios.get(url, { timeout: 10000 });

  if (data.status !== "OK") {
    throw new Error(`Codeforces error: ${data.comment || "Unknown error"}`);
  }

  const calendar = {}; // { "YYYY-MM-DD": count }
  let totalSubmissions = 0;
  let solvedSet = new Set(); // unique problem IDs that are AC

  for (const sub of data.result) {
    if (!isWithinYear(sub.creationTimeSeconds)) continue;

    const date = tsToDate(sub.creationTimeSeconds);
    calendar[date] = (calendar[date] || 0) + 1;
    totalSubmissions++;

    if (sub.verdict === "OK") {
      solvedSet.add(`${sub.problem.contestId}-${sub.problem.index}`);
    }
  }

  return {
    calendar,
    totalSubmissions,
    uniqueSolved: solvedSet.size,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LEETCODE
// LeetCode has no official API. We use their internal GraphQL endpoint.
// submissionCalendar returns: JSON string of { "unixTimestamp": submissionCount }
// The timestamps are already aggregated by day on LeetCode's end.
// ─────────────────────────────────────────────────────────────────────────────
async function getLeetCodeData(username) {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submissionCalendar
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  const { data } = await axios.post(
    "https://leetcode.com/graphql",
    { query, variables: { username } },
    {
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        // LeetCode sometimes needs a referer header to not reject the request
        "Referer": "https://leetcode.com",
        "Origin":  "https://leetcode.com",
      },
    }
  );

  if (!data?.data?.matchedUser) {
    throw new Error(`LeetCode user "${username}" not found`);
  }

  const { submissionCalendar, submitStats } = data.data.matchedUser;

  // submissionCalendar is a JSON string: { "1700000000": 3, ... }
  const rawCalendar = JSON.parse(submissionCalendar || "{}");
  const oneYearAgo  = ONE_YEAR_AGO_S();

  const calendar = {};
  let totalSubmissions = 0;

  for (const [ts, count] of Object.entries(rawCalendar)) {
    if (parseInt(ts) < oneYearAgo) continue;
    const date = tsToDate(parseInt(ts));
    calendar[date] = (calendar[date] || 0) + count;
    totalSubmissions += count;
  }

  // Extract solve counts by difficulty
  const acStats = submitStats?.acSubmissionNum || [];
  const solved = {
    easy:   acStats.find(s => s.difficulty === "Easy")?.count   || 0,
    medium: acStats.find(s => s.difficulty === "Medium")?.count || 0,
    hard:   acStats.find(s => s.difficulty === "Hard")?.count   || 0,
  };

  return {
    calendar,
    totalSubmissions,
    solved,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MERGE — combine both calendars into one
// ─────────────────────────────────────────────────────────────────────────────
function mergeCalendars(...calendars) {
  const merged = {};
  for (const cal of calendars) {
    for (const [date, count] of Object.entries(cal)) {
      merged[date] = (merged[date] || 0) + count;
    }
  }
  return merged;
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE: GET /api/heatmap?cf=<handle>&lc=<username>
// ─────────────────────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  const { cf, lc } = req.query;

  if (!cf && !lc) {
    return res.status(400).json({
      error: "Provide at least one query param: cf (Codeforces handle) or lc (LeetCode username)",
    });
  }

  // Run both fetches in parallel, fail gracefully per platform
  const [cfResult, lcResult] = await Promise.allSettled([
    cf ? getCodeforcesData(cf) : Promise.resolve(null),
    lc ? getLeetCodeData(lc)   : Promise.resolve(null),
  ]);

  // Extract values or errors per platform
  const cfData = cfResult.status  === "fulfilled" ? cfResult.value  : null;
  const lcData = lcResult.status  === "fulfilled" ? lcResult.value  : null;
  const cfError = cfResult.status === "rejected"  ? cfResult.reason.message : null;
  const lcError = lcResult.status === "rejected"  ? lcResult.reason.message : null;

  // If BOTH failed, return error
  if (!cfData && !lcData) {
    return res.status(502).json({
      error: "Failed to fetch data from all platforms.",
      details: { codeforces: cfError, leetcode: lcError },
    });
  }

  // Merge calendars from whichever platforms succeeded
  const calendarsToMerge = [
    cfData?.calendar || {},
    lcData?.calendar || {},
  ];
  const mergedCalendar = mergeCalendars(...calendarsToMerge);

  // Total submissions across both platforms
  const totalSubmissions =
    (cfData?.totalSubmissions || 0) +
    (lcData?.totalSubmissions || 0);

  // Most active day
  const mostActiveDay = Object.entries(mergedCalendar).reduce(
    (best, [date, count]) => (count > best.count ? { date, count } : best),
    { date: null, count: 0 }
  );

  // Active days count
  const activeDays = Object.values(mergedCalendar).filter(c => c > 0).length;

  // ── Response shape ──────────────────────────────────────────────────────────
  return res.json({
    // The main heatmap data — feed this directly into your grid
    // Shape: { "2024-11-14": 5, "2024-11-15": 2, ... }
    calendar: mergedCalendar,

    // Summary stats for the stat pills
    summary: {
      totalSubmissions,
      activeDays,
      mostActiveDay,
      // Codeforces specific
      codeforces: cfData ? {
        totalSubmissions: cfData.totalSubmissions,
        uniqueSolved:     cfData.uniqueSolved,
      } : null,
      // LeetCode specific
      leetcode: lcData ? {
        totalSubmissions: lcData.totalSubmissions,
        solved:           lcData.solved, // { easy, medium, hard }
      } : null,
    },

    // Let frontend know if a platform partially failed
    errors: {
      codeforces: cfError || null,
      leetcode:   lcError || null,
    },
  });
});

module.exports = router;