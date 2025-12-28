const express = require("express");
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { connectDB, userModel, leetcodeModel, codeforcesModel } = require("./db");
const PORT = 3000;
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET

connectDB();

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

//you cannot parse a 'body' unless you are using the express.json() middleware

app.get('/me', auth, (req, res) => {
  res.json({
    loggedIn: true,
    user: req.user
  });
});

app.post('/signup', async (req, res) => {
  const name = req.body.fullName
  const email = req.body.email
  const password = await bcrypt.hash(req.body.password, 10);

  await userModel.create({
    name: name,
    email: email,
    password: password
  }).then(() => {
    console.log("Data created")
    const token = jwt.sign({
      name: name,
      email: email
    }, JWT_SECRET);
    res.cookie('token', token)
    console.log("Cookie has been created")
  })
  res.status(201).json({ message: "Signup successful" }); //always send response status otherwise frontend api call will wait forevers
  // res.json({message: "you are signed in"})
})

app.post('/signin', async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  const user = await userModel.findOne({ email: email });
  if (user) {
    const hashPassword = user.password;
    const result = await bcrypt.compare(password, hashPassword);
    console.log(result);
    console.log("password", password);
    console.log("hash password", hashPassword);
    if(result){
      const token = jwt.sign({
        name: user.name,
        email: email
      }, JWT_SECRET);
      res.cookie('token', token)
      console.log("Cookie has been created")
      res.status(201).json({ message: "Signin successful" }); //always send response status otherwise frontend api call will keep waiting forever
    } else {
      console.log('Invalid password');
      return null;
    }
  } else {
    console.log('No user found with email:', userEmail);
    res.status(203).json({ message: "Signin successful" });
  }
  // res.json({message: "you are signed in"})
})

app.post('/logout', (req, res) => {
  res.clearCookie('token');
  console.log("Cookie has been deleted")
  res.status(200).json({ message: "Logged out" });
});


app.get('/api/codeforces', auth, async (req, res) => {
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

app.use('/api/leetcode', auth, async (req, res) => {
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
function auth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "No token found"
    });
  }

  try {
    const decodedData = jwt.verify(token, JWT_SECRET);
    req.user = decodedData;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Invalid or expired token"
    });
  }
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
