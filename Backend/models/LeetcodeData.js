// ─── File: models/LeetcodeData.js ─────────────────────────────────────────────
// Connect to your existing User schema like:
// Or reference it however your User schema is structured.
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const LeetcodeDataSchema = new mongoose.Schema(
  {
    // ── Link to your existing User ───────────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,          // one LeetcodeData doc per user
    },

    // ── LeetCode identity ────────────────────────────────────────────────────
    username: {
      type: String,
      required: true,
      trim: true,
    },

    // ── Profile ──────────────────────────────────────────────────────────────
    profile: {
      realName:    { type: String,   default: "" },
      userAvatar:  { type: String,   default: "" },
      aboutMe:     { type: String,   default: "" },
      school:      { type: String,   default: "" },
      company:     { type: String,   default: "" },
      jobTitle:    { type: String,   default: "" },
      countryName: { type: String,   default: "" },
      websites:    { type: [String], default: [] },
      skillTags:   { type: [String], default: [] },
      starRating:  { type: Number,   default: 0  },
      reputation:  { type: Number,   default: 0  },
      ranking:     { type: Number,   default: 0  },
    },

    // ── Solved counts ────────────────────────────────────────────────────────
    submitStats: {
      all:    { count: { type: Number, default: 0 }, submissions: { type: Number, default: 0 } },
      easy:   { count: { type: Number, default: 0 }, submissions: { type: Number, default: 0 } },
      medium: { count: { type: Number, default: 0 }, submissions: { type: Number, default: 0 } },
      hard:   { count: { type: Number, default: 0 }, submissions: { type: Number, default: 0 } },
    },

    // ── Total questions available on LC (from allQuestionsCount) ────────────
    allQuestionsCount: {
      all:    { type: Number, default: 0 },
      easy:   { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard:   { type: Number, default: 0 },
    },

    // ── Contest ──────────────────────────────────────────────────────────────
    contest: {
      attendedContestsCount: { type: Number, default: 0  },
      rating:                { type: Number, default: 0  },
      globalRanking:         { type: Number, default: 0  },
      totalParticipants:     { type: Number, default: 0  },
      topPercentage:         { type: Number, default: 0  },
      badgeName:             { type: String, default: "" },
    },

    // ── Timestamp of last successful sync from LeetCode API ─────────────────
    lastSyncedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,   // adds createdAt + updatedAt automatically
  }
);

module.exports = mongoose.model("LeetcodeData", LeetcodeDataSchema);