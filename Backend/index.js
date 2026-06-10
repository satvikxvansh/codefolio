const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { connectDB, userModel, profileModel } = require("./db");
const LeetcodeData = require("./models/LeetcodeData.js");
const CodeforcesData = require("./models/CodeforcesData.js");
const PORT = 3000;
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;


const codeforcesRoute = require("./routes/api-codeforces.js");
const leetcodeRoute = require("./routes/api-leetcode.js");
const heatmapRouter = require("./routes/Heatmap");
const compareRouter = require("./routes/Compare.js");
const upcomingContestsRouter = require("./routes/upcomingContests.js");


connectDB();

app.use(cors({
  origin: process.env.  CLIENT_ORIGIN,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send("I am working fine dude");
});

app.get('/me', auth, async (req, res) => {
  const userId = req.user.userId;
  const user = await userModel.findById(userId);
  const profile = await profileModel.findOne({ userId });

  res.json({
    loggedIn: true,
    user: {
      name: user?.name,
      email: user?.email,
      pictureURL: user?.pictureURL,
      leetcode: profile?.leetcode,
      codeforces: profile?.codeforces,
      mongoId: userId
    }
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
  }).then(user => {
    console.log("User data created, name: ", user.name)
    const token = jwt.sign({
      name: user.name,
      email: user.email,
      userId: user._id
    }, JWT_SECRET);
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    })
    res.json({
      name: name,
      email: email
    })
    console.log("Cookie has been created")
  })
  res.status(201).json({ message: "Signup successful" }); //always send response status otherwise frontend api call will wait forevers
  // res.json({message: "you are signed in"})
})

app.get('/check', (req, res) => {
  console.log("This prints to the server terminal");
  res.send("Hello World");
});

app.post('/signin', async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const user = await userModel.findOne({ email: email });

  const userId = user._id;
  const profile = await profileModel.findOne({ userId }).populate("userId");

  const personalInfo = {
    name: user?.name,
    email: user?.email,
    pictureURL: user?.pictureURL,
    leetcode: profile?.leetcode,
    codeforces: profile?.codeforces,
    mongoId: userId
  }
  if (user) {
    const hashPassword = user.password;
    const result = await bcrypt.compare(password, hashPassword);
    // console.log(result);
    console.log("password", password);
    console.log("hash password", hashPassword);
    if (result) {
      const token = jwt.sign({
        name: user.name,
        email: email,
        userId: user._id
      }, JWT_SECRET);
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
      })
      res.json(personalInfo);  //sending platform IDs as a response
      console.log(personalInfo);
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

app.post('/platformdetails', auth, async (req, res) => {
  const leetcode = req.body.leetcode
  const codeforces = req.body.codeforces

  // console.log(leetcode, codeforces, req.user.userId)

  await profileModel.create({
    userId: req.user.userId,
    leetcode: leetcode,
    codeforces: codeforces
  }).then(() => {
    console.log("platform details added");
    res.status(201).json({ message: "platform details successfully added to the database" });
  }).catch(err => {
    console.log(err);
  })
})

app.use('/api/codeforces', auth, codeforcesRoute);
app.use('/api/leetcode', auth, leetcodeRoute);
app.use("/api/heatmap", heatmapRouter);
app.use("/api/compare", compareRouter);
app.use("/api/upcomingContests", upcomingContestsRouter);


//add a auth middleware, if not verified, redirect to login page
function auth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    console.log("auth middleware could not find token")
    return res.status(401).json({
      message: "No token found"
    });
  }
  // console.log("JWT token: ", token)
  try {
    const decodedData = jwt.verify(token, JWT_SECRET);
    req.user = decodedData;
    console.log("Authenicated");
    next();
  } catch (err) {
    console.log("Invalid or expired token");
    return res.status(403).json({
      loggedIn: false,
      message: "Invalid or expired token"
    });
  }
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
