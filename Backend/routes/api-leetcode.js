// Endpoints:
//   GET  /api/leetcode/userData?username=neal_wu   → reads from DB
//   POST /api/leetcode/updateData                  → calls LC API, writes to DB
// ─────────────────────────────────────────────────────────────────────────────

const express      = require("express");
const LeetcodeData = require("../models/LeetcodeData.js");
const { userModel } = require("../db.js");

const router = express.Router();

const LC_QUERY = `
  query getUserProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
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
    matchedUser(username: $username) {
      username
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      profile {
        ranking
        userAvatar
        realName
        aboutMe
        school
        websites
        countryName
        company
        jobTitle
        skillTags
        starRating
        reputation
        ranking
      }
    }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — call LeetCode GraphQL and return raw data
// ─────────────────────────────────────────────────────────────────────────────
async function fetchFromLeetCode(username) {
  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Referer": "https://leetcode.com",
      "Origin":  "https://leetcode.com",
    },
    body: JSON.stringify({ query: LC_QUERY, variables: { username } }),
  });

  if (!response.ok) {
    throw new Error(`LeetCode API responded with status ${response.status}`);
  }

  const json = await response.json(); // converted response from leetcode API into JSON.

  if (!json?.data?.matchedUser) {
    throw new Error(`LeetCode user "${username}" not found`);
  }

  return json.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — shape raw LC response into our schema's structure
// ─────────────────────────────────────────────────────────────────────────────
function shapeLCData(data) {
  const { matchedUser, userContestRanking, allQuestionsCount } = data;

  // ── submitStats: flatten array → object keyed by difficulty ───────────────
  const acStats = matchedUser.submitStats?.acSubmissionNum || [];
  const submitStats = {
    all:    { count: 0, submissions: 0 },
    easy:   { count: 0, submissions: 0 },
    medium: { count: 0, submissions: 0 },
    hard:   { count: 0, submissions: 0 },
  };
  acStats.forEach(({ difficulty, count, submissions }) => {
    const key = difficulty.toLowerCase();
    if (submitStats[key] !== undefined) {
      submitStats[key] = { count, submissions };
    }
  });

  // ── allQuestionsCount: flatten array → object ─────────────────────────────
  const allQ = { all: 0, easy: 0, medium: 0, hard: 0 };
  (allQuestionsCount || []).forEach(({ difficulty, count }) => {
    const key = difficulty.toLowerCase();
    if (allQ[key] !== undefined) allQ[key] = count;
  });

  // ── contest ────────────────────────────────────────────────────────────────
  const cr = userContestRanking || {};
  const contest = {
    attendedContestsCount: cr.attendedContestsCount || 0,
    rating:                cr.rating                || 0,
    globalRanking:         cr.globalRanking         || 0,
    totalParticipants:     cr.totalParticipants      || 0,
    topPercentage:         cr.topPercentage          || 0,
    badgeName:             cr.badge?.name            || "",
  };

  // ── profile ────────────────────────────────────────────────────────────────
  const p = matchedUser.profile || {};
  const profile = {
    realName:    p.realName    || "",
    userAvatar:  p.userAvatar  || "",
    aboutMe:     p.aboutMe     || "",
    school:      p.school      || "",
    company:     p.company     || "",
    jobTitle:    p.jobTitle    || "",
    countryName: p.countryName || "",
    websites:    p.websites    || [],
    skillTags:   p.skillTags   || [],
    starRating:  p.starRating  || 0,
    reputation:  p.reputation  || 0,
    ranking:     p.ranking     || 0,
  };

  return {
    username: matchedUser.username,
    profile,
    submitStats,
    allQuestionsCount: allQ,
    contest,
    lastSyncedAt: new Date(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/leetcode/userData?username=<leetcode_username>
//
// Reads cached data from DB.
// Returns 404 if the user hasn't synced yet (prompt frontend to call /updateData).
// ─────────────────────────────────────────────────────────────────────────────
router.get("/userData", async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: "username query param is required" });
  }

  try {
    const doc = await LeetcodeData.findOne({ username });

    if (!doc) {
      // No cached data yet — tell frontend to trigger a sync first
      return res.status(404).json({
        error: "No data found. Call POST /api/leetcode/updateData to sync first.",
        needsSync: true,
      });
    }

    return res.json({ data: doc });
  } catch (err) {
    console.error("[leetcode/userData]", err);
    return res.status(500).json({ error: "Failed to read from database" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/leetcode/updateData
//
// Body (JSON): { userId: "<mongo user _id>", username: "<leetcode handle>" }
//
// Calls LeetCode API, upserts the result into DB, returns fresh data.
// Call this on first setup and whenever the user clicks "Sync Data".
// ─────────────────────────────────────────────────────────────────────────────
router.post("/updateData", async (req, res) => {
  const { userId, username } = req.body;

  if (!userId || !username) {
    return res.status(400).json({ error: "Both userId and username are required in the request body" });
  }

  try {
    // ── 1. Verify the user exists in your DB ──────────────────────────────
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }
    
    // ── 2. Fetch fresh data from LeetCode ─────────────────────────────────
    const rawData = await fetchFromLeetCode(username);
    const shaped = shapeLCData(rawData);

    if (user) {
      user.pictureURL = shaped?.profile.userAvatar;
      await user.save(); 
    }
    
    // ── 3. Upsert into DB (create if not exists, update if exists) ────────
    const doc = await LeetcodeData.findOneAndUpdate(
      { user: userId },                // find by linked user
      { ...shaped, user: userId },     // update with fresh data
      { upsert: true, new: true }      // create if missing, return updated doc
    );

    return res.json({
      message: "LeetCode data synced successfully",
      lastSyncedAt: doc.lastSyncedAt,
      data: doc,
    });

  } catch (err) {
    console.error("[leetcode/updateData]", err);

    // Distinguish LC API errors from DB errors for clearer frontend messages
    if (err.message.includes("not found") || err.message.includes("status 4")) {
      return res.status(404).json({ error: err.message });
    }

    return res.status(500).json({ error: "Failed to sync LeetCode data" });
  }
});

module.exports = router;