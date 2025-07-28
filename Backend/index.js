const express = require('express');
const cors = require("cors");
const app = express();

const PORT = 3000;

app.use(cors());

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
