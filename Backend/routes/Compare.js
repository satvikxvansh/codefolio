// Endpoint:
//   GET /api/compare/leetcode?user1=neal_wu&user2=tourist
// ─────────────────────────────────────────────────────────────────────────────

const express   = require("express");
const axios     = require("axios");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: "Too many requests, slow down." },
});
router.use(limiter);

// ── LeetCode GraphQL query ────────────────────────────────────────────────────
const LC_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        ranking
        reputation
        starRating
        aboutMe
        userAvatar
        countryName
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      badges {
        id
        displayName
      }
      userCalendar {
        activeYears
        streak
        totalActiveDays
        submissionCalendar
      }
      problemsSolvedBeatsStats {
        difficulty
        percentage
      }
      tagProblemCounts {
        advanced {
          tagName
          problemsSolved
        }
        intermediate {
          tagName
          problemsSolved
        }
        fundamental {
          tagName
          problemsSolved
        }
      }
      contestBadge {
        name
        expired
        hoverText
        icon
      }
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
      badge {
        name
      }
    }
  }
`;

// ── Fetch single user from LeetCode GraphQL ───────────────────────────────────
async function fetchLeetCodeUser(username) {
  const { data } = await axios.post(
    "https://leetcode.com/graphql",
    { query: LC_QUERY, variables: { username } },
    {
      timeout: 12000,
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com",
        "Origin":  "https://leetcode.com",
      },
    }
  );

  console.log(data);

  if (!data?.data?.matchedUser) {
    throw new Error(`LeetCode user "${username}" not found`);
  }

  const u  = data.data.matchedUser;
  const cr = data.data.userContestRanking;

  // ── Solved counts ──────────────────────────────────────────────────────────
  const ac    = u.submitStats.acSubmissionNum;
  const total = u.submitStats.totalSubmissionNum;

  const solved = {
    easy:   ac.find(d => d.difficulty === "Easy")?.count   || 0,
    medium: ac.find(d => d.difficulty === "Medium")?.count || 0,
    hard:   ac.find(d => d.difficulty === "Hard")?.count   || 0,
    all:    ac.find(d => d.difficulty === "All")?.count    || 0,
  };

  const submissions = {
    easy:   total.find(d => d.difficulty === "Easy")?.count   || 0,
    medium: total.find(d => d.difficulty === "Medium")?.count || 0,
    hard:   total.find(d => d.difficulty === "Hard")?.count   || 0,
    all:    total.find(d => d.difficulty === "All")?.count    || 0,
  };

  // ── Acceptance rate ────────────────────────────────────────────────────────
  const acceptanceRate = submissions.all > 0
    ? Math.round((solved.all / submissions.all) * 100 * 10) / 10
    : 0;

  // ── Beats percentage ───────────────────────────────────────────────────────
  const beats = {};
  (u.problemsSolvedBeatsStats || []).forEach(b => {
    beats[b.difficulty.toLowerCase()] = Math.round(b.percentage * 10) / 10;
  });

  // ── Top tags (top 6 by problems solved) ───────────────────────────────────
  const allTags = [
    ...(u.tagProblemCounts?.fundamental  || []),
    ...(u.tagProblemCounts?.intermediate || []),
    ...(u.tagProblemCounts?.advanced     || []),
  ]
    .sort((a, b) => b.problemsSolved - a.problemsSolved)
    .slice(0, 6)
    .map(t => ({ tag: t.tagName, count: t.problemsSolved }));

  // ── Recent activity calendar (last 6 months) ──────────────────────────────
  const rawCal   = JSON.parse(u.userCalendar?.submissionCalendar || "{}");
  const sixMonAgo = Math.floor(Date.now() / 1000) - 180 * 24 * 60 * 60;
  const recentActivity = Object.entries(rawCal)
    .filter(([ts]) => parseInt(ts) >= sixMonAgo)
    .reduce((acc, [ts, cnt]) => {
      const month = new Date(parseInt(ts) * 1000)
        .toLocaleString("default", { month: "short" });
      acc[month] = (acc[month] || 0) + cnt;
      return acc;
    }, {});

  return {
    username:        u.username,
    displayName:     u.profile.realName || u.username,
    avatar:          u.profile.userAvatar,
    country:         u.profile.countryName,
    ranking:         u.profile.ranking,
    reputation:      u.profile.reputation,
    solved,
    submissions,
    acceptanceRate,
    beats,
    topTags:         allTags,
    streak:          u.userCalendar?.streak          || 0,
    totalActiveDays: u.userCalendar?.totalActiveDays || 0,
    badges:          (u.badges || []).map(b => b.displayName).slice(0, 5),
    contest: cr ? {
      attended:         cr.attendedContestsCount,
      rating:           Math.round(cr.rating),
      globalRanking:    cr.globalRanking,
      totalParticipants:cr.totalParticipants,
      topPercentage:    Math.round(cr.topPercentage * 10) / 10,
      badge:            cr.badge?.name || null,
    } : null,
    recentActivity,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE: GET /api/compare/leetcode?user1=abc&user2=xyz
// ─────────────────────────────────────────────────────────────────────────────
router.get("/leetcode", async (req, res) => {
  const { user1, user2 } = req.query;

  if (!user1 || !user2) {
    return res.status(400).json({
      error: "Both user1 and user2 query params are required.",
    });
  }

  // Fetch both in parallel
  const [r1, r2] = await Promise.allSettled([
    fetchLeetCodeUser(user1),
    fetchLeetCodeUser(user2),
  ]);

  if (r1.status === "rejected") {
    return res.status(404).json({ error: r1.reason.message });
  }
  if (r2.status === "rejected") {
    return res.status(404).json({ error: r2.reason.message });
  }

  const u1 = r1.value;
  const u2 = r2.value;

  // ── Head-to-head verdicts ──────────────────────────────────────────────────
  // +1 = user1 wins, -1 = user2 wins, 0 = tie
  const verdict = (a, b) => a > b ? 1 : a < b ? -1 : 0;

  const headToHead = {
    totalSolved:     verdict(u1.solved.all,          u2.solved.all),
    easySolved:      verdict(u1.solved.easy,         u2.solved.easy),
    mediumSolved:    verdict(u1.solved.medium,       u2.solved.medium),
    hardSolved:      verdict(u1.solved.hard,         u2.solved.hard),
    acceptanceRate:  verdict(u1.acceptanceRate,      u2.acceptanceRate),
    streak:          verdict(u1.streak,              u2.streak),
    activeDays:      verdict(u1.totalActiveDays,     u2.totalActiveDays),
    contestRating:   verdict(u1.contest?.rating||0,  u2.contest?.rating||0),
    contestAttended: verdict(u1.contest?.attended||0,u2.contest?.attended||0),
    globalRanking:   verdict(                        // lower rank = better
      u2.ranking || Infinity,
      u1.ranking || Infinity
    ),
  };

  const u1Wins = Object.values(headToHead).filter(v => v ===  1).length;
  const u2Wins = Object.values(headToHead).filter(v => v === -1).length;

  return res.json({
    user1: u1,
    user2: u2,
    headToHead,
    score: { user1: u1Wins, user2: u2Wins },
  });
});

module.exports = router;