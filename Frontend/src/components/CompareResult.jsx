import React, { useState } from 'react';
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Trophy,
  Target,
  Flame,
  Calendar,
  Award,
  Code2,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { useAuth } from "../components/Contexts/AuthContext";


const ComparePage = () => {
  const { user, logout } = useAuth();
  // Sample data for comparison
  const [userData] = useState({
    id: 1,
    name: "Your Name",
    username: "your_username",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    platforms: {
      leetcode: {
        totalSolved: 342,
        easy: 145,
        medium: 167,
        hard: 30,
        acceptanceRate: 68.5,
        ranking: 45230,
        contests: 12,
        rating: 1547
      },
      codeforces: {
        totalSolved: 287,
        rating: 1547,
        maxRating: 1623,
        contests: 24,
        rank: "Expert"
      },
      codechef: {
        totalSolved: 218,
        rating: 1789,
        maxRating: 1845,
        stars: 4,
        contests: 18
      }
    },
    currentStreak: 23,
    longestStreak: 67,
    totalSolved: 847,
    weeklyAverage: 8.5,
    topics: {
      "Arrays": 120,
      "Dynamic Programming": 85,
      "Trees": 67,
      "Graphs": 54,
      "Strings": 98,
      "Greedy": 43,
      "Binary Search": 56,
      "Math": 38
    }
  });

  const [friendData] = useState({
    id: 2,
    name: "Arjun Sharma",
    username: "arjun_codes",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    platforms: {
      leetcode: {
        totalSolved: 456,
        easy: 189,
        medium: 223,
        hard: 44,
        acceptanceRate: 72.3,
        ranking: 32145,
        contests: 18,
        rating: 1689
      },
      codeforces: {
        totalSolved: 312,
        rating: 1623,
        maxRating: 1698,
        contests: 31,
        rank: "Expert"
      },
      codechef: {
        totalSolved: 189,
        rating: 1845,
        maxRating: 1923,
        stars: 5,
        contests: 22
      }
    },
    currentStreak: 45,
    longestStreak: 89,
    totalSolved: 957,
    weeklyAverage: 11.2,
    topics: {
      "Arrays": 145,
      "Dynamic Programming": 102,
      "Trees": 78,
      "Graphs": 71,
      "Strings": 89,
      "Greedy": 56,
      "Binary Search": 67,
      "Math": 45
    }
  });

  const calculateDifference = (userValue, friendValue, higherIsBetter = true) => {
    const diff = userValue - friendValue;
    if (diff === 0) return { icon: Minus, color: 'text-gray-400', value: 0, text: 'Same' };
    
    const isPositive = higherIsBetter ? diff > 0 : diff < 0;
    return {
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'text-emerald-400' : 'text-red-400',
      value: Math.abs(diff),
      text: isPositive ? 'ahead' : 'behind'
    };
  };

  const getPercentageDiff = (userValue, friendValue) => {
    if (friendValue === 0) return 0;
    return Math.abs(((userValue - friendValue) / friendValue) * 100).toFixed(1);
  };

  const ComparisonCard = ({ title, icon: Icon, userValue, friendValue, suffix = '', higherIsBetter = true }) => {
    const diff = calculateDifference(userValue, friendValue, higherIsBetter);
    const DiffIcon = diff.icon;

    return (
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center gap-2 mb-4">
          <Icon size={20} className="text-emerald-400" />
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-2xl font-bold text-white">{userValue}{suffix}</p>
            <p className="text-xs text-gray-500 mt-1">You</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{friendValue}{suffix}</p>
            <p className="text-xs text-gray-500 mt-1">{friendData.name.split(' ')[0]}</p>
          </div>
        </div>

        <div className={`flex items-center gap-1.5 text-sm ${diff.color}`}>
          <DiffIcon size={16} />
          <span>{diff.value}{suffix} {diff.text}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-800">
      {/* Header */}
      <header className="bg-zinc-900 border-gray-200 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-full flex items-center justify-center">
              <span className="text-emerald-100 font-bold text-xl">{'<>'}</span>
            </div>
            <h1 className="text-2xl font-bold font-grotesk text-zinc-200">Codefolio</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <div>
                <button className="cursor-pointer px-4 py-2 bg-white text-red-400 rounded-lg hover:bg-red-400 hover:text-white transition-colors font-medium" onClick={logout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-6 max-w-7xl mx-auto">
        {/* Comparison Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="text-emerald-400" size={28} />
            <h2 className="text-3xl font-bold text-white">Profile Comparison</h2>
          </div>
          <p className="text-gray-400">Detailed comparison between you and {friendData.name}</p>
        </div>

        {/* User Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* User Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={userData.avatar}
                alt={userData.name}
                className="w-16 h-16 rounded-full border-2 border-white/30"
              />
              <div>
                <h3 className="text-xl font-bold">{userData.name}</h3>
                <p className="text-sm opacity-90">@{userData.username}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-3xl font-bold">{userData.totalSolved}</p>
                <p className="text-xs opacity-90 mt-1">Total Solved</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{userData.currentStreak}</p>
                <p className="text-xs opacity-90 mt-1">Current Streak</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{userData.weeklyAverage}</p>
                <p className="text-xs opacity-90 mt-1">Weekly Avg</p>
              </div>
            </div>
          </div>

          {/* Friend Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={friendData.avatar}
                alt={friendData.name}
                className="w-16 h-16 rounded-full border-2 border-white/30"
              />
              <div>
                <h3 className="text-xl font-bold">{friendData.name}</h3>
                <p className="text-sm opacity-90">@{friendData.username}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-3xl font-bold">{friendData.totalSolved}</p>
                <p className="text-xs opacity-90 mt-1">Total Solved</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{friendData.currentStreak}</p>
                <p className="text-xs opacity-90 mt-1">Current Streak</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{friendData.weeklyAverage}</p>
                <p className="text-xs opacity-90 mt-1">Weekly Avg</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Stats Comparison */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Overall Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ComparisonCard
              title="Total Problems"
              icon={Trophy}
              userValue={userData.totalSolved}
              friendValue={friendData.totalSolved}
            />
            <ComparisonCard
              title="Current Streak"
              icon={Flame}
              userValue={userData.currentStreak}
              friendValue={friendData.currentStreak}
            />
            <ComparisonCard
              title="Longest Streak"
              icon={Calendar}
              userValue={userData.longestStreak}
              friendValue={friendData.longestStreak}
            />
            <ComparisonCard
              title="Weekly Average"
              icon={Target}
              userValue={userData.weeklyAverage}
              friendValue={friendData.weeklyAverage}
            />
          </div>
        </div>

        {/* Platform Comparison */}
        <div className="space-y-8">
          {/* LeetCode */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
                <span className="font-bold text-orange-400 text-sm">LC</span>
              </div>
              <h3 className="text-xl font-bold text-white">LeetCode</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ComparisonCard
                title="Total Solved"
                icon={Code2}
                userValue={userData.platforms.leetcode.totalSolved}
                friendValue={friendData.platforms.leetcode.totalSolved}
              />
              <ComparisonCard
                title="Acceptance Rate"
                icon={Award}
                userValue={userData.platforms.leetcode.acceptanceRate}
                friendValue={friendData.platforms.leetcode.acceptanceRate}
                suffix="%"
              />
              <ComparisonCard
                title="Global Ranking"
                icon={Trophy}
                userValue={userData.platforms.leetcode.ranking}
                friendValue={friendData.platforms.leetcode.ranking}
                higherIsBetter={false}
              />
            </div>

            {/* Problem Difficulty Breakdown */}
            <div className="mt-6 bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h4 className="text-sm font-semibold text-gray-400 mb-4">Problem Difficulty Breakdown</h4>
              <div className="space-y-4">
                {/* Easy */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Easy</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-emerald-400 font-semibold">
                        {userData.platforms.leetcode.easy}
                      </span>
                      <span className="text-gray-500">vs</span>
                      <span className="text-blue-400 font-semibold">
                        {friendData.platforms.leetcode.easy}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${(userData.platforms.leetcode.easy / 200) * 100}%` }}
                      />
                    </div>
                    <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: `${(friendData.platforms.leetcode.easy / 200) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Medium */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Medium</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-emerald-400 font-semibold">
                        {userData.platforms.leetcode.medium}
                      </span>
                      <span className="text-gray-500">vs</span>
                      <span className="text-blue-400 font-semibold">
                        {friendData.platforms.leetcode.medium}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${(userData.platforms.leetcode.medium / 250) * 100}%` }}
                      />
                    </div>
                    <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: `${(friendData.platforms.leetcode.medium / 250) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Hard */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Hard</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-emerald-400 font-semibold">
                        {userData.platforms.leetcode.hard}
                      </span>
                      <span className="text-gray-500">vs</span>
                      <span className="text-blue-400 font-semibold">
                        {friendData.platforms.leetcode.hard}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${(userData.platforms.leetcode.hard / 100) * 100}%` }}
                      />
                    </div>
                    <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full"
                        style={{ width: `${(friendData.platforms.leetcode.hard / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Codeforces */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <span className="font-bold text-blue-400 text-sm">CF</span>
              </div>
              <h3 className="text-xl font-bold text-white">Codeforces</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ComparisonCard
                title="Total Solved"
                icon={Code2}
                userValue={userData.platforms.codeforces.totalSolved}
                friendValue={friendData.platforms.codeforces.totalSolved}
              />
              <ComparisonCard
                title="Current Rating"
                icon={TrendingUp}
                userValue={userData.platforms.codeforces.rating}
                friendValue={friendData.platforms.codeforces.rating}
              />
              <ComparisonCard
                title="Max Rating"
                icon={Trophy}
                userValue={userData.platforms.codeforces.maxRating}
                friendValue={friendData.platforms.codeforces.maxRating}
              />
              <ComparisonCard
                title="Contests"
                icon={Award}
                userValue={userData.platforms.codeforces.contests}
                friendValue={friendData.platforms.codeforces.contests}
              />
            </div>
          </div>

          {/* CodeChef */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center">
                <span className="font-bold text-amber-400 text-sm">CC</span>
              </div>
              <h3 className="text-xl font-bold text-white">CodeChef</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ComparisonCard
                title="Total Solved"
                icon={Code2}
                userValue={userData.platforms.codechef.totalSolved}
                friendValue={friendData.platforms.codechef.totalSolved}
              />
              <ComparisonCard
                title="Current Rating"
                icon={TrendingUp}
                userValue={userData.platforms.codechef.rating}
                friendValue={friendData.platforms.codechef.rating}
              />
              <ComparisonCard
                title="Star Rating"
                icon={Trophy}
                userValue={userData.platforms.codechef.stars}
                friendValue={friendData.platforms.codechef.stars}
                suffix="★"
              />
              <ComparisonCard
                title="Contests"
                icon={Award}
                userValue={userData.platforms.codechef.contests}
                friendValue={friendData.platforms.codechef.contests}
              />
            </div>
          </div>
        </div>

        {/* Topic-wise Comparison */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-4">Topic-wise Breakdown</h3>
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(userData.topics).map((topic) => (
                <div key={topic}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">{topic}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-emerald-400 font-semibold">
                        {userData.topics[topic]}
                      </span>
                      <span className="text-gray-500">vs</span>
                      <span className="text-blue-400 font-semibold">
                        {friendData.topics[topic]}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${(userData.topics[topic] / 150) * 100}%` }}
                      />
                    </div>
                    <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${(friendData.topics[topic] / 150) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
            <span className="text-sm text-gray-400">{userData.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-400">{friendData.name}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComparePage;
