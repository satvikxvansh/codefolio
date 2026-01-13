const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { connectDB, userModel, leetcodeModel, codeforcesModel } = require("./db");
const PORT = 3000;
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET

const codeforcesRoute = require("./routes/api-codeforces.js");
const leetcodeRoute = require("./routes/api-leetcode.js");

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
    res.json({
      name: name,
      email: email
    })
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

app.use('/api/codeforces', auth, codeforcesRoute);
app.use('/api/leetcode', auth, leetcodeRoute);

//add a auth middleware, if not verified, redirect to login page
function auth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    console.log("auth middleware could not find token")
    return res.status(401).json({
      message: "No token found"
    });
  }

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
