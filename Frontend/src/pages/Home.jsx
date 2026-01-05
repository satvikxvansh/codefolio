import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircleArrowUp, TrendingUp, ExternalLink, Award, Target, Calendar, Activity } from 'lucide-react';
import UsernameModal from '../components/UsernameModal';
import Layout from '@/components/layout.jsx';


const CodingProfileDashboard = ({ userData, setIsLoggedIn }) => {
  const user = userData;
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false)
  const [LeetcodeData, setLeetcodeData] = useState({});
  const [codeforcesData, setCodeforcesData] = useState({});

  const closeModal = () => {
    setShowModal(false);
  }

  const onSubmit = (formData) => {
    setFormData(formData)
    setShowModal(false);
  }

  const logout = async () => {
    await axios.post("http://localhost:3000/logout", {}, {
      withCredentials: true
    }).then(() => {
      console.log("logged out")
      setIsLoggedIn(false);
    }).catch(error => {
      console.log(error);
    })
  }


  // Placeholder functions for API calls
  useEffect(() => {
    if (formData.leetcode !== undefined) {
      fetch(`http://localhost:3000/api/leetcode?username=${formData.leetcode}`)
        .then(async res => await res.json())
        .then(res => {
          setLeetcodeData(res.data.matchedUser)
          console.log(res.data.matchedUser);
        })
        .catch(console.error);
    }
  }, [formData.leetcode])

  useEffect(() => {
    if (formData.codeforces !== undefined) {
      fetch(`http://localhost:3000/api/codeforces?username=${formData.codeforces}`)
        .then(async res => await res.json())
        .then(res => {
          setCodeforcesData(res.result)
          console.log(res.result);
        })
        .catch(console.error);
    }
  }, [formData.codeforces])

  return (
    <div className="min-h-screen">
      <Layout>
        {/* Header */}
        <header className="bg-zinc-900 border-gray-200 px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">{'<>'}</span>
              </div>
              <h1 className="text-2xl font-bold font-grotesk text-zinc-200">Codefolio</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="cursor-pointer px-4 py-2 bg-emerald-600 text-gray-100 rounded-lg hover:bg-gray-100 hover:text-emerald-600 transition-colors font-medium" onClick={() => setShowModal(true)}>
                Sync Data
              </button>
              <UsernameModal isOpen={showModal} onClose={closeModal} onSubmit={onSubmit} />
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

        {/* Dashboard */}
        <main className="px-8 py-6 bg-zinc-800 rounded-tl-2xl">
          <div className="mb-6">
            <h2 className="text-3xl font-bodoni italic text-zinc-200">Dashboard</h2>
            <p className="text-gray-500 mt-1">Track your competitive programming journey across platforms.</p>
          </div>

          {/* Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Problems Solved */}
            <div className="bg-gradient-to-br flex flex-col justify-between from-emerald-600 to-emerald-900 rounded-xl p-4 px-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-md opacity-90">Total Problems Solved</h3>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <ExternalLink size={16} />
                </div>
              </div>
              <p className="text-8xl font-staatliches flex justify-center">847</p>
              <div className="flex items-center justify-center gap-1 text-sm opacity-90">
                <TrendingUp size={14} />
                <span className='font-bodoni'>Increased from last month</span>
              </div>
            </div>

            {/* Global Rank */}
            <div className="bg-zinc-900 flex flex-col justify-between rounded-xl p-4 px-6 shadow-sm border border-zinc-700">
              <div className="flex items-center justify-between">
                <h3 className="text-md text-gray-400">Global Rank</h3>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <ExternalLink size={16} />
                </div>
              </div>
              <p className="text-8xl font-staatliches flex justify-center text-zinc-200">#2</p>
              <div className="text-lime-300 font-bold flex justify-center items-center gap-1 text-lg opacity-90">
                <CircleArrowUp size={18} />54
              </div>
            </div>

            {/* Current Streak */}
            <div className="bg-zinc-900 rounded-xl p-6 py-4 shadow-sm border border-zinc-700 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-600">Current Streak</h3>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Activity size={16} className="text-purple-600" />
                </div>
              </div>
              <div className='my-4'>
                <p className="text-6xl font-staatliches text-zinc-200">23</p>
                <p className="text-sm text-gray-400">Days</p>
              </div>
              <div className='text-base'>
                <div className='flex justify-between'>
                  <button className='text-zinc-300 cursor-pointer hover:bg-gray-50/10'>Leetcode</button>
                </div>
                <div className='flex justify-between'>
                  <button className='text-zinc-300 cursor-pointer hover:bg-gray-50/10'>Codeforces</button>
                </div>
              </div>
            </div>

            {/* Contest Rating s*/}
            <div className="bg-zinc-900 rounded-xl px-6 py-4 shadow-sm border border-zinc-700 flex flex-col justify-between">
              <div id="head" className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-600">Contest Ratings</h3>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Activity size={16} className="text-purple-600" />
                </div>
              </div>
              <div className="text-6xl font-staatliches text-zinc-200 my-4">
                <h2>1500</h2>  
                <p className='text-xl'>(max. 1550)</p>
              </div>
              <div className='text-base'>
                <div className='flex justify-between'>
                  <button className='text-zinc-300 cursor-pointer hover:bg-gray-50/10'>Leetcode</button>
                  <p className='text-gray-400'>Attended</p>
                </div>
                <div className='flex justify-between'>
                  <button className='text-zinc-300 cursor-pointer hover:bg-gray-50/10'>Codeforces</button>
                  <p className='text-gray-400'>Attended</p>
                </div>
              </div>
            </div>
          </div>

          {/* Platform specific details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

            {/* LeetCode Stats */}
            <div className="bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-400">LeetCode Problems</h3>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center cursor-pointer">
                  <ExternalLink size={16} className="text-orange-600" />
                </div>
              </div>
              <p className="text-4xl font-bold text-zinc-200 mb-8">{LeetcodeData?.submitStats?.acSubmissionNum[0]?.count}</p>
              <div>
                <div className='my-2 flex justify-between text-xl bg-[#264545] px-2 py-1 rounded-md'>
                  <p className='text-[#1cbaba] font-semibold'>Easy</p>
                  <p className='text-white font-bold'>{LeetcodeData?.submitStats?.acSubmissionNum[1]?.count}</p>
                </div>
                <div className='my-2 flex justify-between text-xl bg-[#534520] px-2 py-1 rounded-md'>
                  <p className='text-[#ffb700] font-semibold'>Medium</p>
                  <p className='text-white font-bold'>{LeetcodeData?.submitStats?.acSubmissionNum[2]?.count}</p>
                </div>
                <div className='my-2 flex justify-between text-xl bg-[#512b2b] px-2 py-1 rounded-md'>
                  <p className='text-[#f63737] font-semibold'>Hard</p>
                  <p className='text-white font-bold'>{LeetcodeData?.submitStats?.acSubmissionNum[3]?.count}</p>
                </div>
              </div>
            </div>


            {/* Codeforces Rating */}
            <div className="bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-400">Codeforces Rating</h3>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <ExternalLink size={16} className="text-blue-600" />
                </div>
              </div>
              <p className="mb-8 text-4xl font-bold text-zinc-200">{codeforcesData[0]?.rating}</p>

              <div>
                <div className='flex justify-between text-xl py-1 rounded-md'>
                  <p className='text-zinc-300 '>Title</p>
                  <p className='text-white'>{codeforcesData[0]?.rank}</p>
                </div>
                <div className='flex justify-between text-xl py-1 rounded-md'>
                  <p className='text-zinc-300 '>Max. Rating</p>
                  <p className='text-white'>{codeforcesData[0]?.maxRating}</p>
                </div>
                <div className='flex justify-between text-xl py-1 rounded-md'>
                  <p className='text-zinc-300 '>Problems Solved</p>
                  <p className='text-white'>api.call</p>
                </div>
                <div className='flex justify-between text-xl py-1 rounded-md'>
                  <p className='text-zinc-300 '>Contributions</p>
                  <p className='text-white'>{codeforcesData[0]?.contribution}</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 flex justify-center items-center rounded-xl p-6 shadow-sm border border-zinc-700 col-span-2">
              <h3 className="text-sm font-medium text-gray-400">Heatmap coming soon...</h3>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">

              {/* Problem Solving Activity */}
              <div className="bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-700">
                <h3 className="text-lg font-semibold text-gray-400 mb-6">Problem Solving Activity</h3>
                <div className="flex items-end justify-between h-64 gap-3">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-lg relative"
                        style={{ height: `${[45, 70, 55, 85, 60, 40, 65][idx]}%` }}>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">{day[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform Breakdown */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Platform Breakdown</h3>
                  <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {/* LeetCode */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="font-bold text-orange-600">LC</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">LeetCode</p>
                          <p className="text-sm text-gray-500">Easy: 145 • Medium: 167 • Hard: 30</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-800">342</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>

                  {/* Codeforces */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="font-bold text-blue-600">CF</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Codeforces</p>
                          <p className="text-sm text-gray-500">Rating: 1547 • Max: 1623</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-800">287</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{ width: '34%' }}></div>
                    </div>
                  </div>

                  {/* CodeChef */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                          <span className="font-bold text-amber-600">CC</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">CodeChef</p>
                          <p className="text-sm text-gray-500">Rating: 1789 • Stars: 4★</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-800">218</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full" style={{ width: '26%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Upcoming Contests */}
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Next Contest</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <Calendar size={16} />
                    <span>Codeforces Round #920</span>
                  </div>
                  <p className="text-2xl font-bold">02:15:30</p>
                  <p className="text-sm opacity-90">Time remaining</p>
                  <button className="w-full mt-4 bg-white/20 hover:bg-white/30 py-2.5 rounded-lg font-medium transition-colors">
                    Set Reminder
                  </button>
                </div>
              </div>
              {/* Recent Achievements */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Achievements</h3>
                  <button className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
                    <span className="text-xl">+</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award size={20} className="text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">100 Days Badge</p>
                      <p className="text-xs text-gray-500 mt-0.5">Earned on LeetCode</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target size={20} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">Contest Master</p>
                      <p className="text-xs text-gray-500 mt-0.5">50 contests on CF</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award size={20} className="text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">Problem Solver</p>
                      <p className="text-xs text-gray-500 mt-0.5">500+ problems solved</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overall Progress */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Overall Progress</h3>

                <div className="relative w-48 h-48 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#e5e7eb"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#059669"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 80}`}
                      strokeDashoffset={`${2 * Math.PI * 80 * (1 - 0.68)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-800">68%</span>
                    <span className="text-sm text-gray-500 mt-1">Goal Progress</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                      <span className="text-gray-600">Completed</span>
                    </div>
                    <span className="font-semibold text-gray-800">847</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <span className="text-gray-600">Remaining</span>
                    </div>
                    <span className="font-semibold text-gray-800">403</span>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </main>
      </Layout>
    </div>
  );
};

export default CodingProfileDashboard;
