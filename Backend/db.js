const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Users = new Schema({
    name: String,
    email: {type: String, unique:true },
    password: String
})

const Leetcode = new Schema({
    username: {type: String, unique:true },
    problemSolved: Number,
    constestAttended: Number,
    currentRating: Number,
    maxRating: Number,
    id: ObjectId
})
const Codeforces = new Schema({
    username: {type: String, unique:true },
    problemSolved: Number,
    constestAttended: Number,
    currentRating: Number,
    maxRating: Number,
    id: ObjectId
})

const userModel = mongoose.model('users', Users);
const leetcodeModel = mongoose.model('leetcode', Leetcode);
const codeforcesModel = mongoose.model('codeforces', Codeforces);

module.exports = {
    userModel: userModel,
    leetcodeModel: leetcodeModel,
    codeforcesModel: codeforcesModel,
}