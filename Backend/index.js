const express = require("express");
require('dotenv').config()
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// const JWT_SECRET = "verysecretmessage"
const { userModel, leetcodeModel, codeforcesModel } = require("./db");

const MONGODB_URI = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to Database'))
  .catch(err => console.error('Could not connect to Database', err));


app.use(cors());
const PORT = 3000;
//you cannot parse a 'body' unless you are using the express.json() middleware
app.use(express.json());

app.post('/signup', async (req, res) => {
  const name = req.body.fullName
  const email = req.body.email
  const password = req.body.password

  await userModel.create({
    name: name,
    email: email,
    password: password
  })

  console.log("Data created")

  // res.json({message: "you are signed in"})
})


app.get('/api/codeforces', async (req, res) => {
  const { username } = req.query;
  if (username === "" && !username) return res.status(400).json({ error: 'Username required' });

  try {
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
    const data = await response.json();
    if (data.status !== "OK") {
      return res.status(404).json({ error: 'Codeforces user not found' })
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data (Backend causing error)' });
  }
})

app.use('/api/leetcode', async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'Username required' });

  try {
    const query = `
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
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username } }), //here we give the username
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data (Backend causing error)' });
  }
})

//add a auth middleware, if not verified, redirect to login page


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
