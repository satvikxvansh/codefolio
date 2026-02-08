const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId; 
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URL;

const connectDB = async () => {
    await mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to Database'))
    .catch(err => console.error('Could not connect to Database', err));
}

const Users = new Schema({
    name: String,
    email: {type: String, unique:true },
    password: String,
    profile: { type: Schema.Types.ObjectId, ref: "profile" },
})

const Leetcode = new Schema({
    id: ObjectId,
    username: String,
    problemSolved: Number,
    constestAttended: Number,
    currentRating: Number,
    maxRating: Number
})
const Codeforces = new Schema({
    id: ObjectId,
    username: String,
    problemSolved: Number,
    constestAttended: Number,
    currentRating: Number,
    maxRating: Number
})

const Profile = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users" },
  leetcode: String,
  codeforces: String
});

const userModel = mongoose.model('users', Users);
const leetcodeModel = mongoose.model('leetcode', Leetcode);
const codeforcesModel = mongoose.model('codeforces', Codeforces);
const profileModel = mongoose.model('profile', Profile);

module.exports = {
    userModel: userModel,
    leetcodeModel: leetcodeModel,
    codeforcesModel: codeforcesModel,
    profileModel: profileModel,
    connectDB: connectDB,
}