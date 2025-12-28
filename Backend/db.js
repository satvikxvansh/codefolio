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
    password: String
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

const userModel = mongoose.model('users', Users);
const leetcodeModel = mongoose.model('leetcode', Leetcode);
const codeforcesModel = mongoose.model('codeforces', Codeforces);

module.exports = {
    userModel: userModel,
    leetcodeModel: leetcodeModel,
    codeforcesModel: codeforcesModel,
    connectDB: connectDB
}