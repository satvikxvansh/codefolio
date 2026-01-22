import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  ExternalLink, 
  GitCompare, 
  Flame, 
  Trophy, 
  MoreVertical,
  Search,
  X,
  Check,
  UserMinus
} from 'lucide-react';
import { useAuth } from "../components/Contexts/AuthContext";

const FriendsPage = () => {
  const {user, logout} = useAuth();
  const [friends, setFriends] = useState([
    {
      id: 1,
      name: "Arjun Sharma",
      username: "arjun_codes",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
      platforms: {
        leetcode: { username: "arjun_lc", solved: 456, rating: null },
        codeforces: { username: "arjun_cf", solved: 312, rating: 1623 },
        codechef: { username: "arjun_cc", solved: 189, rating: 1845 }
      },
      currentStreak: 45,
      totalSolved: 957,
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "Priya Patel",
      username: "priya_dev",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      platforms: {
        leetcode: { username: "priya_lc", solved: 523, rating: null },
        codeforces: { username: "priya_cf", solved: 278, rating: 1547 },
        codechef: { username: "priya_cc", solved: 201, rating: 1789 }
      },
      currentStreak: 67,
      totalSolved: 1002,
      lastActive: "1 day ago"
    },
    {
      id: 3,
      name: "Rahul Verma",
      username: "rahul_algo",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
      platforms: {
        leetcode: { username: "rahul_lc", solved: 298, rating: null },
        codeforces: { username: "rahul_cf", solved: 456, rating: 1834 },
        codechef: { username: "rahul_cc", solved: 167, rating: 1623 }
      },
      currentStreak: 12,
      totalSolved: 921,
      lastActive: "5 hours ago"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFriendUsername, setNewFriendUsername] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFriend = async () => {
    // API call placeholder to add friend
    // const response = await fetch('/api/friends/add', { method: 'POST', body: JSON.stringify({ username: newFriendUsername }) });
    setShowAddModal(false);
    setNewFriendUsername('');
  };

  const handleRemoveFriend = (friendId) => {
    // API call placeholder to remove friend
    setFriends(friends.filter(f => f.id !== friendId));
    setShowDropdown(null);
  };

  const handleCompare = (friend) => {
    // Navigate to comparison page or open modal
    console.log('Compare with:', friend.username);
  };

  const handleViewProfile = (friend) => {
    // Navigate to friend's profile page
    console.log('View profile:', friend.username);
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

      {/* Main Content */}
      <main className="px-8 py-6 bg-zinc-800 mx-auto rounded-tl-2xl">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bodoni italic text-zinc-200">Friends</h2>
              <p className="text-gray-500 mt-1">Track and compare progress with your coding buddies</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              <UserPlus size={20} />
              Add Friend
            </button>
          </div>
        </div>

        <div className='flex gap-7'>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-4 flex-1 justify-around">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Users size={24} />
              </div>
              <p className="text-4xl font-bold mb-1">{friends.length}</p>
              <p className="text-sm opacity-90">Total Friends</p>
            </div>

            <div className="bg-zinc-900 flex flex-col justify-between rounded-xl p-4 px-6 shadow-sm border border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <Flame size={24} className="text-orange-600" />
              </div>
              <p className="text-4xl font-bold text-zinc-200 mb-1">
                {Math.max(...friends.map(f => f.currentStreak))}
              </p>
              <p className="text-sm text-gray-400">Highest Streak</p>
            </div>

            <div className="bg-zinc-900 flex flex-col justify-between rounded-xl p-4 px-6 shadow-sm border border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <Trophy size={24} className="text-yellow-600" />
              </div>
              <p className="text-4xl font-bold text-gray-200 mb-1">
                {Math.max(...friends.map(f => f.totalSolved))}
              </p>
              <p className="text-sm text-gray-400">Top Solver</p>
            </div>

            <div className="bg-zinc-900 flex flex-col justify-between rounded-xl p-4 px-6 shadow-sm border border-zinc-700">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
              <p className="text-4xl font-bold text-gray-200 mb-1">
                {Math.round(friends.reduce((acc, f) => acc + f.totalSolved, 0) / friends.length)}
              </p>
              <p className="text-sm text-gray-400">Avg. Problems</p>
            </div>
          </div>
          {/* Friends List */}
          <div className='flex-2'>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search friends by name or username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-gray-200"
                />
              </div>
            </div>
            <div className="overflow-y-auto grid h-126 no-scrollbar grid-col-1 gap-6 rounded-xl border border-gray-200 p-5">
              {filteredFriends.map((friend) => (
                <div key={friend.id} className="bg-zinc-900 flex flex-col justify-between rounded-xl p-4 px-6 shadow-sm border border-zinc-700">
                  {/* Friend Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-16 h-16 rounded-full border-2 border-emerald-100"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-200">{friend.name}</h3>
                        <p className="text-sm text-gray-500">@{friend.username}</p>
                        <p className="text-xs text-gray-500 mt-1">Active {friend.lastActive}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(showDropdown === friend.id ? null : friend.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical size={18} className="text-gray-600" />
                      </button>
                      
                      {showDropdown === friend.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                          <button
                            onClick={() => {
                              handleViewProfile(friend);
                              setShowDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <ExternalLink size={16} />
                            View Profile
                          </button>
                          <button
                            onClick={() => {
                              handleCompare(friend);
                              setShowDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <GitCompare size={16} />
                            Compare Stats
                          </button>
                          <hr className="my-2" />
                          <button
                            onClick={() => handleRemoveFriend(friend.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <UserMinus size={16} />
                            Remove Friend
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-emerald-950 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Flame size={16} className="text-orange-600" />
                        <p className="text-xs text-gray-500 font-medium">Current Streak</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-200">{friend.currentStreak}</p>
                      <p className="text-xs text-gray-400">days</p>
                    </div>
                    <div className="bg-blue-950 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy size={16} className="text-blue-600" />
                        <p className="text-xs text-gray-500 font-medium">Total Solved</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-200">{friend.totalSolved}</p>
                      <p className="text-xs text-gray-400">problems</p>
                    </div>
                  </div>

                  {/* Platform Stats */}
                  <div className="grid grid-cols-3 gap-3 justify-around mb-4">
                    <div className="flex items-center justify-between p-2 bg-orange-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center">
                          <span className="text-xs font-bold text-orange-600">LC</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">LeetCode</p>
                          <p className="text-sm font-semibold text-gray-200">{friend.platforms.leetcode.solved} solved</p>
                        </div>
                      </div>
                      <a href={`https://leetcode.com/${friend.platforms.leetcode.username}`} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700">
                        <ExternalLink size={16} />
                      </a>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">CF</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Codeforces</p>
                          <p className="text-sm font-semibold text-gray-200">
                            {friend.platforms.codeforces.solved} solved • {friend.platforms.codeforces.rating}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`https://codeforces.com/profile/${friend.platforms.codeforces.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-amber-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-100 rounded-md flex items-center justify-center">
                          <span className="text-xs font-bold text-amber-600">CC</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">CodeChef</p>
                          <p className="text-sm font-semibold text-gray-200">
                            {friend.platforms.codechef.solved} solved • {friend.platforms.codechef.rating}
                          </p>
                        </div>
                      </div>
                      <a
                        href={`https://www.codechef.com/users/${friend.platforms.codechef.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-600 hover:text-amber-700"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleViewProfile(friend)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-300 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={16} />
                      View Profile
                    </button>
                    <button
                      onClick={() => handleCompare(friend)}
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <GitCompare size={16} />
                      Compare
                    </button>
                  </div>
                </div>
              ))}
            {filteredFriends.length === 0 && (

              <div className="text-center py-12 rounded-xl border border-gray-200">
                <Users className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-200 mb-2">No friends found</h3>
                <p className="text-gray-500">Try adjusting your search or add new friends</p>
              </div>
            )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Friend Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Add Friend</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={newFriendUsername}
                onChange={(e) => setNewFriendUsername(e.target.value)}
                placeholder="Enter their username"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
              <p className="text-xs text-gray-500 mt-2">
                They must have an account on CodeStats
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFriend}
                disabled={!newFriendUsername.trim()}
                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check size={18} />
                Add Friend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
