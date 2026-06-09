import React, { useState } from 'react';
import { useAuth } from '../components/Contexts/AuthContext'
import {
  BarChart3,
  Users,
  GitCompare,
  Search,
  Code2,
  Target,
  User,
  Shield,
  Globe,
  TrendingUp,
  Clock,
  ChevronRight
} from 'lucide-react';

const CompareForm = () => {
  const { user, logout } = useAuth();
  const [comparisonType, setComparisonType] = useState('platform');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [username, setUsername] = useState('');

  const friends = [
    {
      id: 1,
      name: "Arjun Sharma",
      username: "arjun_codes",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
      totalSolved: 957,
      streak: 45
    },
    {
      id: 2,
      name: "Priya Patel",
      username: "priya_dev",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      totalSolved: 1002,
      streak: 67
    },
    {
      id: 3,
      name: "Rahul Verma",
      username: "rahul_algo",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
      totalSolved: 921,
      streak: 12
    }
  ];

  const recentComparisons = [
    { name: "Arjun Sharma", username: "arjun_codes", time: "2 hours ago", platform: "All Platforms" },
    { name: "Priya Patel", username: "priya_dev", time: "Yesterday", platform: "LeetCode" },
    { name: "tourist", username: "tourist_cf", time: "3 days ago", platform: "Codeforces" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission and navigate to comparison page
    console.log('Comparison Type:', comparisonType);
    console.log('Username:', username);
    if (comparisonType === 'specific') {
      console.log('Selected Platform:', selectedPlatform);
    }
  };

  const handleReset = () => {
    setComparisonType('platform');
    setSelectedPlatform('');
    setUsername('');
  };

  return (
    <div>
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
      
      <main className="px-8 bg-zinc-800 py-6 rounded-tl-2xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="text-emerald-400" size={28} />
            <h2 className="text-3xl font-bold text-white">Compare Profiles</h2>
          </div>
          <p className="text-gray-400">Compare your coding stats with friends or any coder across platforms</p>
        </div>

        {/* Quick Compare with Friends */}
        {/* <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="text-emerald-400" size={20} />
            Quick Compare with Friends
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <button
                key={friend.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-emerald-500 transition-all text-left group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-12 h-12 rounded-full border-2 border-zinc-700 group-hover:border-emerald-500 transition-colors"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-white">{friend.name}</p>
                    <p className="text-sm text-gray-400">@{friend.username}</p>
                  </div>
                  <GitCompare className="text-gray-600 group-hover:text-emerald-400 transition-colors" size={20} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-gray-400">Solved</p>
                    <p className="text-white font-semibold">{friend.totalSolved}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Streak</p>
                    <p className="text-white font-semibold">{friend.streak} days</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div> */}

        {/* Comparison Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Search className="text-emerald-400" size={24} />
            <h3 className="text-xl font-bold text-white">Compare with Anyone</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Comparison Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Choose Comparison Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="relative">
                  <input
                    type="radio"
                    name="comparisonType"
                    value="platform"
                    checked={comparisonType === 'platform'}
                    onChange={(e) => setComparisonType(e.target.value)}
                    className="peer sr-only"
                  />
                  <div className="bg-zinc-800 border-2 border-zinc-700 rounded-lg p-4 cursor-pointer peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                        <Code2 className="text-emerald-400" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Platform Username</p>
                        <p className="text-xs text-gray-400">Compare using CodeStats username</p>
                      </div>
                    </div>
                  </div>
                </label>

                <label className="relative">
                  <input
                    type="radio"
                    name="comparisonType"
                    value="specific"
                    checked={comparisonType === 'specific'}
                    onChange={(e) => setComparisonType(e.target.value)}
                    className="peer sr-only"
                  />
                  <div className="bg-zinc-800 border-2 border-zinc-700 rounded-lg p-4 cursor-pointer peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <Target className="text-blue-400" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Specific Platform ID</p>
                        <p className="text-xs text-gray-400">Compare on specific platform only</p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Platform Username Input */}
            {comparisonType === 'platform' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CodeStats Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter CodeStats username"
                    className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  This will fetch and compare data from all connected platforms
                </p>
              </div>
            )}

            {/* Specific Platform Selection */}
            {comparisonType === 'specific' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Platform
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <label className="relative">
                    <input
                      type="radio"
                      name="platform"
                      value="leetcode"
                      checked={selectedPlatform === 'leetcode'}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      className="peer sr-only"
                    />
                    <div className="bg-zinc-800 border-2 border-zinc-700 rounded-lg p-4 cursor-pointer peer-checked:border-orange-500 peer-checked:bg-orange-500/10 transition-all">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                          <span className="font-bold text-orange-400 text-lg">LC</span>
                        </div>
                        <p className="font-semibold text-white text-sm">LeetCode</p>
                      </div>
                    </div>
                  </label>

                  <label className="relative">
                    <input
                      type="radio"
                      name="platform"
                      value="codeforces"
                      checked={selectedPlatform === 'codeforces'}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      className="peer sr-only"
                    />
                    <div className="bg-zinc-800 border-2 border-zinc-700 rounded-lg p-4 cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-500/10 transition-all">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                          <span className="font-bold text-blue-400 text-lg">CF</span>
                        </div>
                        <p className="font-semibold text-white text-sm">Codeforces</p>
                      </div>
                    </div>
                  </label>

                  <label className="relative">
                    <input
                      type="radio"
                      name="platform"
                      value="codechef"
                      checked={selectedPlatform === 'codechef'}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      className="peer sr-only"
                    />
                    <div className="bg-zinc-800 border-2 border-zinc-700 rounded-lg p-4 cursor-pointer peer-checked:border-amber-500 peer-checked:bg-amber-500/10 transition-all">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="w-12 h-12 bg-amber-600/20 rounded-lg flex items-center justify-center">
                          <span className="font-bold text-amber-400 text-lg">CC</span>
                        </div>
                        <p className="font-semibold text-white text-sm">CodeChef</p>
                      </div>
                    </div>
                  </label>
                </div>

                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {selectedPlatform === 'leetcode' && 'LeetCode Username'}
                  {selectedPlatform === 'codeforces' && 'Codeforces Handle'}
                  {selectedPlatform === 'codechef' && 'CodeChef Username'}
                  {!selectedPlatform && 'Platform Username'}
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={
                      selectedPlatform === 'leetcode' ? 'Enter LeetCode username' :
                        selectedPlatform === 'codeforces' ? 'Enter Codeforces handle' :
                          selectedPlatform === 'codechef' ? 'Enter CodeChef username' :
                            'Select a platform first'
                    }
                    disabled={!selectedPlatform}
                    className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {selectedPlatform
                    ? `Enter the username for ${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} only`
                    : 'Please select a platform to continue'
                  }
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={!username || (comparisonType === 'specific' && !selectedPlatform)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:text-gray-500"
              >
                <GitCompare size={20} />
                Compare Now
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 border border-zinc-700 text-gray-300 rounded-lg hover:bg-zinc-800 transition-colors font-medium"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-emerald-400" size={24} />
            </div>
            <h4 className="text-white font-semibold mb-2">Compare with Friends</h4>
            <p className="text-sm text-gray-400">
              Quick compare with your added friends with a single click
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
              <Globe className="text-blue-400" size={24} />
            </div>
            <h4 className="text-white font-semibold mb-2">Platform Specific</h4>
            <p className="text-sm text-gray-400">
              Compare on individual platforms like LeetCode, Codeforces, or CodeChef
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="text-purple-400" size={24} />
            </div>
            <h4 className="text-white font-semibold mb-2">Detailed Analysis</h4>
            <p className="text-sm text-gray-400">
              Get comprehensive comparison with visual charts and statistics
            </p>
          </div>
        </div>

        {/* Recent Comparisons */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Clock className="text-emerald-400" size={20} />
              Recent Comparisons
            </h3>
            <button className="text-sm text-emerald-400 hover:text-emerald-300 font-medium">
              View All
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl divide-y divide-zinc-800">
            {recentComparisons.map((comparison, idx) => (
              <button
                key={idx}
                className="w-full px-6 py-4 hover:bg-zinc-800 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                    <GitCompare className="text-gray-400 group-hover:text-emerald-400 transition-colors" size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">{comparison.name}</p>
                    <p className="text-sm text-gray-400">@{comparison.username} • {comparison.platform}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{comparison.time}</span>
                  <ChevronRight className="text-gray-600 group-hover:text-emerald-400 transition-colors" size={20} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompareForm;
