const express        = require("express");
const axios          = require("axios");
const CodeforcesData = require("../models/CodeforcesData");
const { userModel } = require("../db.js");

const router = express.Router();
router.use(express.json());

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS  (your original logic, unchanged)
// ─────────────────────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getProblemsSolved = async (username) => {
  try {
    const res = await axios(
      `https://codeforces.com/api/user.status?handle=${username}`
    );
    if (res.data?.status !== "OK") return 0;

    const set = new Set();
    for (const sub of res.data.result) {
      if (sub.verdict === "OK") {
        set.add(`${sub.problem.contestId}-${sub.problem.index}`);
      }
    }
    return set.size;
  } catch (err) {
    console.error("[CF] getProblemsSolved failed:", err.message);
    return 0;
  }
};

const getContestsAttended = async (username) => {
  try {
    const res = await axios(
      `https://codeforces.com/api/user.rating?handle=${username}`
    );
    if (res.data?.status !== "OK") return 0;
    return res.data.result.length;
  } catch (err) {
    console.error("[CF] getContestsAttended failed:", err.message);
    return 0;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — fetch all CF data and shape it for our schema
// ─────────────────────────────────────────────────────────────────────────────
async function fetchFromCodeforces(username) {
  // Three CF API calls with delays to avoid rate limiting (same as your original)
  const infoRes = await axios(
    `https://codeforces.com/api/user.info?handles=${username}`
  );

  if (infoRes.data?.status !== "OK") {
    throw new Error(`Codeforces user "${username}" not found`);
  }

  const info = infoRes.data.result[0];

  await delay(1000);
  const problemsSolved = await getProblemsSolved(username);

  await delay(1000);
  const contestsAttended = await getContestsAttended(username);

  return {
    username:   info.handle,
    profile: {
      handle:       info.handle       || "",
      firstName:    info.firstName    || "",
      lastName:     info.lastName     || "",
      country:      info.country      || "",
      city:         info.city         || "",
      organization: info.organization || "",
      avatar:       info.avatar       || "",
      titlePhoto:   info.titlePhoto   || "",
    },
    rating: {
      current: info.rating    || 0,
      max:     info.maxRating || 0,
    },
    rank: {
      current: info.rank    || "",
      max:     info.maxRank || "",
    },
    problemsSolved,
    contestsAttended,
    contribution:  info.contribution  || 0,
    friendOfCount: info.friendOfCount || 0,
    lastSyncedAt:  new Date(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/codeforces/userData?username=tourist
// Reads cached data from DB.
// Returns 404 with needsSync: true if user hasn't synced yet.
// ─────────────────────────────────────────────────────────────────────────────
router.get("/userData", async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: "username query param is required" });
  }

  try {
    const doc = await CodeforcesData.findOne({ username }); // change 'username' to '_id' of the user in the future because username is not Primary Key.

    if (!doc) {
      return res.status(404).json({
        error: "No data found. Call POST /api/codeforces/updateData to sync first.",
        needsSync: true,
      });
    }

    return res.json({ data: doc });
  } catch (err) {
    console.error("[codeforces/userData]", err);
    return res.status(500).json({ error: "Failed to read from database" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/codeforces/updateData
//
// Body (JSON): { userId: "<mongo user _id>", username: "<cf handle>" }
//
// Calls Codeforces API, upserts result into DB, returns fresh data.
// Call on first setup and whenever the user clicks "Sync Data".
// ─────────────────────────────────────────────────────────────────────────────
router.post("/updateData", async (req, res) => {
  const { userId, username } = req.body;

  // console.log(req.body)

  if (!userId || !username) {
    return res.status(400).json({
      error: "Both userId and username are required in the request body",
    });
  }

  try {
    // ── 1. Verify user exists in your DB ──────────────────────────────────
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }

    // ── 2. Fetch fresh data from Codeforces ───────────────────────────────
    const shaped = await fetchFromCodeforces(username);

    // ── 3. Upsert into DB ─────────────────────────────────────────────────
    const doc = await CodeforcesData.findOneAndUpdate(
      { user: userId },
      { ...shaped, user: userId },
      { upsert: true, new: true }
    );

    return res.json({
      message: "Codeforces data synced successfully",
      lastSyncedAt: doc.lastSyncedAt,
      data: doc,
    });

  } catch (err) {
    console.error("[codeforces/updateData]", err);

    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }

    return res.status(500).json({ error: "Failed to sync Codeforces data" });
  }
});

module.exports = router;