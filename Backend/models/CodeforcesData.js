const mongoose = require("mongoose");

const CodeforcesDataSchema = new mongoose.Schema(
  {
    // ── Link to your existing User ───────────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ── Codeforces identity ──────────────────────────────────────────────────
    username: {
      type: String,
      required: true,
      trim: true,
    },

    // ── Profile (from user.info) ─────────────────────────────────────────────
    profile: {
      handle:        { type: String, default: "" },
      firstName:     { type: String, default: "" },
      lastName:      { type: String, default: "" },
      country:       { type: String, default: "" },
      city:          { type: String, default: "" },
      organization:  { type: String, default: "" },
      avatar:        { type: String, default: "" },
      titlePhoto:    { type: String, default: "" },
    },

    // ── Ratings ──────────────────────────────────────────────────────────────
    rating: {
      current:  { type: Number, default: 0 },
      max:      { type: Number, default: 0 },
    },

    // ── Rank titles ──────────────────────────────────────────────────────────
    rank: {
      current:  { type: String, default: "" },  // e.g. "newbie", "specialist"
      max:      { type: String, default: "" },
    },

    // ── Solved & contest stats (from your helper functions) ──────────────────
    problemsSolved:    { type: Number, default: 0 },
    contestsAttended:  { type: Number, default: 0 },
    contribution:      { type: Number, default: 0 },
    friendOfCount:     { type: Number, default: 0 },

    // ── Timestamp of last successful sync ────────────────────────────────────
    lastSyncedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CodeforcesData", CodeforcesDataSchema);