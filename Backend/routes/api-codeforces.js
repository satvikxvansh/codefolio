const express = require("express");
const router = express.Router();
const axios = require('axios');
router.use(express.json());

const problemSolved = async (username) => {
  const temp = await axios(`https://codeforces.com/api/user.status?handle=${username}`
  ).then(res => {
    return res.data;
  }).catch(err => {
    console.log("api-codeforces status=\"FAILED\"", err);
  })
  const set = new Set();
  if (temp && temp.status == "OK") {
    for (const submission of temp.result) {
      if (submission.verdict == "OK") {
        const uniqueId = `${submission.problem.contestId}-${submission.problem.index}`;
        set.add(uniqueId);
      }
    }
    return set.size;
  } else {
    console.log("Status = FAILED")
  }
}
const contestsAttended = async (username) => {
  const temp = await axios(`https://codeforces.com/api/user.rating?handle=${username}`
  ).then(res => {
    return res.data;
  }).catch(err => {
    console.log("api-codeforces status=\"FAILED\"", err);
  })
  if (temp && temp.status == "OK") {
    return Object.keys(temp.result).length;
  } else {
    console.log("Status = FAILED")
  }
}

router.get("/", async (req, res) => {
  const { username } = req.query;
  if (username === "" && !username) return res.status(400).json({ error: 'Username required' });

  try {
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`)
    const problems = await problemSolved(`${username}`);
    const contests = await contestsAttended(`${username}`);
    const data = await response.json();
    data.problemSolved = problems;
    data.contestsAttended = contests;
    if (data.status !== "OK") {
      return res.status(404).json({ error: 'Codeforces user not found' })
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data (Backend causing error)' });
  }
})

module.exports = router;