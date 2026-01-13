const express = require("express");
const router = express.Router();
const axios = require("axios");

const UPCOMING_CONTESTS_QUERY = "\n    query contestV2UpcomingContests {\n  contestV2UpcomingContests {\n    titleSlug\n    title\n    titleCn\n    startTime\n    duration\n    cardImg\n    cardImgApp\n  }\n}\n    "

router.get("/upcomingContests", async (req, res) =>{
  const response = await axios.post("https://leetcode.com/graphql/", {
      query: UPCOMING_CONTESTS_QUERY
    }, {
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => {
    return res.data
  }).catch(err =>{
    console.log("Couldn't fetch upcoming contest Data");
    return null;
  })
  res.json(response);
})

router.get("/userData", async (req, res) => {
  const { username } = req.query;
  // console.log(username)
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

module.exports = router;