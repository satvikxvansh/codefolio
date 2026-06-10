import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { ArrowUp , TrendingUp, ExternalLink, Award, Target, Calendar, Activity, CirclePlus } from 'lucide-react';
import UsernameModal from '../components/UsernameModal';
import { useAuth } from "../components/Contexts/AuthContext";
import GitHubHeatmap from "../components/GitHubHeatmap";
import ActivityGraph from "../components/ActivityGraph";
import UpcomingContests from "../components/UpcomingContests";
import DashboardSkeleton from "../components/DashboardSkeleton";

const BACKEND_URL = import.meta.env.VITE_API_KEY;

const CodingProfileDashboard = () => {
  const { user } = useAuth();
  const [isCFLoading, setIsCFLoading] = useState(true);
  const [isLCLoading, setIsLCLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState(null);
  const [showModal, setShowModal] = useState(false)
  const [codeforcesData, setCodeforcesData] = useState({});
  const [LeetcodeData, setLeetcodeData] = useState(null);
  

  useEffect(() => {
    if(user?.leetcode && user?.codeforces){
      setFormData({leetcode: user?.leetcode, codeforces: user?.codeforces});
    }
    console.log("user", user);
    console.log("formData", formData);
  }, [  ])

  const ratingInfo = [
    {
      "rating": (LeetcodeData?.contest?.rating ?? 0),
      "maxRating": (LeetcodeData?.contest?.rating ?? 0)
    },
    {
      "rating": (codeforcesData?.rating?.current ?? 0),
      "maxRating": (codeforcesData?.rating?.max ?? 0)
    }

  ]
  const [contestInfo, setContestInfo] = useState({});

  useEffect(() => {
    if (ratingInfo?.[0]?.rating && !contestInfo?.rating) {
      setContestInfo(ratingInfo[0]);
    }
  }, [ratingInfo]);

  const closeModal = () => {
    setShowModal(false);
  }

  const onSubmit = (formData) => {
    setFormData(formData)
    setShowModal(false);
    console.log(formData); //console log formData
  }

  useEffect(() => {
  console.log("LeetcodeData updated:", LeetcodeData);
}, [LeetcodeData]);

  // API calls
  useEffect(() => {
    if (!formData?.leetcode) return;

    const fetchLeetcodeData = async () => {
      setIsLCLoading(true);
      try {
        // 1. Try reading from DB first
        const res = await axios.get(
          `${BACKEND_URL}/api/leetcode/userData?username=${formData.leetcode}`,
          { withCredentials: true }
        );
        setLeetcodeData(res.data.data);
        console.log("/api/leetcode/userData response: ", res.data.data);
        
      } catch (err) {
        // 2. If never synced, trigger a sync automatically
        if (err.response?.status === 404 && err.response?.data?.needsSync) {
          try {
            const syncRes = await axios.post(
              `${BACKEND_URL}/api/leetcode/updateData`,
              { userId: user.mongoId, username: formData.leetcode },
              { withCredentials: true }
            );
            setLeetcodeData(syncRes.data.data);
          } catch (syncErr) {
            console.error("Sync failed:", syncErr);
          }
        } else {
          console.error("Failed to fetch LeetCode data:", err);
        }
      } finally {
        setIsLCLoading(false);
      }
    };
    
    fetchLeetcodeData();
  }, [formData]);

  // Codeforces Data API call
  useEffect(() => {
    // console.log("formData:", formData);
    if (!formData?.codeforces) return;

    const fetchCodeforcesData = async () => {
      setIsCFLoading(true);
      try {
        // 1. Try reading from DB first
        const res = await axios.get(
          `${BACKEND_URL}/api/codeforces/userData?username=${formData.codeforces}`,
          { withCredentials: true }
        );
        setCodeforcesData(res.data.data);
        // console.log("codeforces data response",res.data.data);

      } catch (err) {
        // 2. If never synced, trigger sync automatically
        if (err.response?.status === 404 && err.response?.data?.needsSync) {
          try {
            const syncRes = await axios.post(
              `${BACKEND_URL}/api/codeforces/updateData`,
              { userId: user.mongoId, username: formData.codeforces },
              { withCredentials: true }
            );
            setCodeforcesData(syncRes.data.data);
          } catch (syncErr) {
            console.error("CF sync failed:", syncErr);
          }
        } else {
          console.error("Failed to fetch Codeforces data:", err);
        }
      } finally{
        setIsCFLoading(false);
      }
    };

    fetchCodeforcesData();
  }, [formData]);

  useEffect(() => {
    if (!isCFLoading && !isLCLoading) {
      setIsLoading(false);
    }
  }, [isCFLoading, isLCLoading]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-zinc-900 border-gray-200 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <img src="/logo.png" alt="Logo" />
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
                src={user?.pictureURL || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-200">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      {formData ? 
        <main className="flex-1 flex flex-col px-8 py-6 bg-zinc-800 rounded-tl-2xl">
          <div className="mb-6">
            <h2 className="text-3xl font-bodoni italic text-zinc-200">Dashboard</h2>
            <p className="text-gray-500 mt-1">Track your competitive programming journey across platforms.</p>
          </div>

          {!isLoading ?
            <>
              {/* Hero Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Total Problems Solved */}
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-900 flex flex-col justify-between rounded-xl p-4 px-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md opacity-90">Total Problems Solved</h3>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <ExternalLink size={16} />
                    </div>
                  </div>
                  <p className="text-8xl font-roboto font-semibold flex justify-center">{(LeetcodeData?.submitStats?.all?.count || 0)
                    + (codeforcesData?.problemsSolved || 0)}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-sm opacity-90">
                    <TrendingUp size={14} />
                    <span className='font-roboto'>Increased from last month</span>
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
                  <p className="text-8xl font-roboto font-semibold flex justify-center text-zinc-200">#2</p>
                  <div className="text-green-400 flex justify-center items-center gap-1 text-xs font-bold rounded-full py-1">
                    <ArrowUp size={15}/> 
                    <p>RANK GAIN: 54 POSITIONS</p>
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
                    <p className="text-6xl font-roboto font-semibold text-zinc-200">23</p>
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
                  <div className="text-6xl font-roboto font-semibold text-zinc-200 my-4">
                    <h2>{parseInt(contestInfo?.rating || 0)}</h2>
                    <p className='text-xl'>(max. {(parseInt(contestInfo?.maxRating) || 0)})</p>
                  </div>
                  <div className='text-base'>
                    <div className='flex justify-between'>
                      <button onClick={()=>setContestInfo(ratingInfo?.[0])} className='text-zinc-300 cursor-pointer hover:bg-gray-50/10'>Leetcode</button>
                      <p className='text-gray-400'>{LeetcodeData?.contest?.attendedContestsCount} Attended</p>
                    </div>
                    <div onClick={()=>setContestInfo(ratingInfo?.[1])} className='flex justify-between'>
                      <button className='text-zinc-300 cursor-pointer hover:bg-gray-50/10'>Codeforces</button>
                      <p className='text-gray-400'>{codeforcesData?.contestsAttended} Attended</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Platform specific details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

                {/* LeetCode Stats */}
                <div className="bg-zinc-900 rounded-xl px-6 py-4 shadow-sm border border-zinc-700 flex flex-col justify-between">

                  <div id="head" className="flex justify-between items-center">
                    <h3 className="text-base font-medium text-gray-600">Leetcode Problems</h3>
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <ExternalLink size={16} className="text-orange-600" />
                    </div>
                  </div>

                  <p className="text-6xl font-roboto font-semibold text-zinc-200 my-4">{LeetcodeData?.submitStats?.all?.count   || 0}</p>

                  <div className='text-base'>
                    <div className='flex justify-between bg-[#264545] px-2 py-1 rounded-md'>
                      <p className='text-[#1cbaba] font-semibold'>Easy</p>
                      <p className='text-white font-bold'>{LeetcodeData?.submitStats?.easy?.count || 0}</p>
                    </div>
                    <div className='my-2 flex justify-between bg-[#534520] px-2 py-1 rounded-md'>
                      <p className='text-[#ffb700] font-semibold'>Medium</p>
                      <p className='text-white font-bold'>{LeetcodeData?.submitStats?.medium?.count   || 0}</p>
                    </div>
                    <div className='mt-2 flex justify-between bg-[#512b2b] px-2 py-1 rounded-md'>
                      <p className='text-[#f63737] font-semibold'>Hard</p>
                      <p className='text-white font-bold'>{LeetcodeData?.submitStats?.hard?.count   || 0}</p>
                    </div>
                  </div>

                </div>


                {/* Codeforces Rating */}
                <div className="bg-zinc-900 rounded-xl px-6 py-4 shadow-sm border border-zinc-700 flex flex-col justify-between">
                  <div id="head" className="flex justify-between items-center">
                    <h3 className="text-base font-medium text-gray-600">Codeforces Problems</h3>
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <ExternalLink size={16} className="text-orange-600" />
                    </div>
                  </div>

                  <p className="text-6xl font-roboto font-semibold text-zinc-200 mb-5">{codeforcesData?.problemsSolved}</p>
                  <div className='text-base'>
                    <div className='flex justify-between'>
                      <p className='text-zinc-300 '>Title</p>
                      <p className={`text-gray-500 font-bold ${codeforcesData.rank?.current === 'pupil' && 'text-green-600'} ${codeforcesData.rank?.current === 'specialist' && 'text-blue-400'}`}>{codeforcesData.rank?.current}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='text-zinc-300 '>Rating</p>
                      <p className='text-white'>{codeforcesData?.rating?.current}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='text-zinc-300 '>Max. Rating</p>
                      <p className='text-white'>{codeforcesData?.rating?.max}</p>
                    </div>
                    <div className='flex justify-between'>
                      <p className='text-zinc-300 '>Contributions</p>
                      <p className='text-white'>{codeforcesData?.contribution}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 rounded-2xl shadow-sm col-span-2">
                  <GitHubHeatmap cfHandle={formData?.codeforces} lcUsername={formData?.leetcode} />
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">

                  {/* Problem Solving Activity */}
                  <div className="bg-zinc-900 rounded-2xl shadow-sm border border-gray-700">
                    <ActivityGraph
                      cfHandle={codeforcesData?.profile?.handle}
                      lcUsername={LeetcodeData?.username}
                      backendUrl={BACKEND_URL}
                    />
                  </div>
                </div>

                {/* Right Column - 1/3 width */}
                <div className="space-y-6">
                  {/* Upcoming Contests */}
                  <div className="rounded-xl text-white shadow-lg">
                    <UpcomingContests />
                  </div>
                </div>
              </div>
            </>
            :
            <DashboardSkeleton />
          }
        </main>
      :
      <div className='flex-1 flex flex-col px-8 py-6 bg-zinc-800 rounded-tl-2xl'>
        <div className="mb-6">
          <h2 className="text-3xl font-bodoni italic text-zinc-200">Dashboard</h2>
          <p className="text-gray-500 mt-1">Track your competitive programming journey across platforms.</p>
        </div>
        <div className='flex-1 text-gray-600 text-2xl flex flex-col justify-center items-center'>
          <div className='flex flex-col gap-4 items-center justify-center p-5 border-1 border-gray-600 rounded-3xl'>
            <button className='hover:text-gray-500 hover:cursor-pointer' onClick={() => setShowModal(true)}>
              <CirclePlus size={70} />
            </button>
            <p className='text-sm text-gray-500'>Add username to sync data</p>
          </div>
        </div>
      </div>
      }
    </div>
  );
};

export default CodingProfileDashboard;
