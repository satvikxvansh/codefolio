const mongoose = require("mongoose");
require('dotenv').config();
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId; 
const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    await mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to Database'))
    .catch(err => console.error('Could not connect to Database', err));
}

const LeetcodeData = require("./models/LeetcodeData.js");
const CodeforcesData = require("./models/CodeforcesData.js");

const Users = new Schema({
    name: String,
    email: {type: String, unique:true },
    password: String,
    pictureURL: String,
    profile: { type: Schema.Types.ObjectId, ref: "profile" },
    leetcode: { type: Schema.Types.ObjectId, ref: "LeetcodeData" },
    codeforces: { type: mongoose.Schema.Types.ObjectId, ref: "CodeforcesData" },
})

const Profile = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users" },
  leetcode: String,
  codeforces: String
});

const userModel = mongoose.model('users', Users);
const profileModel = mongoose.model('profile', Profile);

module.exports = {
    userModel: userModel,
    profileModel: profileModel,
    connectDB: connectDB,
}