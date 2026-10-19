import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowUp, TrendingUp, ExternalLink, Award, Target, Calendar, Activity, CirclePlus } from 'lucide-react';
import UsernameModal from '../components/UsernameModal';
import { useAuth } from "../components/Contexts/AuthContext";
import { useLoader } from "../components/Contexts/loaderContext";
import RefreshButton from "../components/RefreshButton";
import GitHubHeatmap from "../components/GitHubHeatmap";
import ActivityGraph from "../components/ActivityGraph";
import UpcomingContests from "../components/UpcomingContests";
import DashboardSkeleton from "../components/DashboardSkeleton";

const BACKEND_URL = import.meta.env.VITE_API_KEY;

const CodingProfileDashboard = () => {
  const { user, login } = useAuth();
  const { isSync } = useLoader();
  const [isCFLoading, setIsCFLoading] = useState(true);
  const [isLCLoading, setIsLCLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [codeforcesData, setCodeforcesData] = useState({});
  const [LeetcodeData, setLeetcodeData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [refreshFeedback, setRefreshFeedback] = useState(null);
  const [selectedContestPlatform, setSelectedContestPlatform] = useState('leetcode');

  useEffect(() => {
    if (user?.leetcode || user?.codeforces) {
      setFormData({
        leetcode: user?.leetcode || '',
        codeforces: user?.codeforces || '',
      });
    }
  }, [user]);

  const displayedContestInfo = selectedContestPlatform === 'leetcode'
    ? {
        rating: LeetcodeData?.contest?.rating ?? 0,
        maxRating: LeetcodeData?.contest?.rating ?? 0,
        attended: LeetcodeData?.contest?.attendedContestsCount ?? 0,
      }
    : {
        rating: codeforcesData?.rating?.current ?? 0,
        maxRating: codeforcesData?.rating?.max ?? 0,
        attended: codeforcesData?.contestsAttended ?? 0,
      };

  const closeModal = () => {
    setShowModal(false);
  };

  const onSubmit = (newFormData) => {
    setFormData(newFormData);
    if (login && user) {
      login({
        ...user,
        leetcode: newFormData.leetcode,
        codeforces: newFormData.codeforces,
      });
    }
    setShowModal(false);
  };

  const getLatestSyncTime = () => {
    const dates = [LeetcodeData?.lastSyncedAt, codeforcesData?.lastSyncedAt]
      .filter(Boolean)
      .map((d) => new Date(d).getTime());
    if (dates.length === 0) return null;
    return new Date(Math.max(...dates));
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    if (!formData?.leetcode && !formData?.codeforces) {
      setShowModal(true);
      return;
    }

    setIsRefreshing(true);
    setRefreshFeedback(null);
    setRefreshSuccess(false);
    if (isSync) isSync(true);

    try {
      const tasks = [];

      if (formData?.leetcode) {
        tasks.push(
          axios.post(
            `${BACKEND_URL}/api/leetcode/updateData`,
            { userId: user?.mongoId, username: formData.leetcode },
            { withCredentials: true }
          ).then((res) => {
            if (res.data?.data) {
              setLeetcodeData(res.data.data);
            }
            return { platform: 'LeetCode', success: true };
          }).catch((err) => {
            console.error("LeetCode refresh failed:", err);
            return {
              platform: 'LeetCode',
              success: false,
              error: err.response?.data?.error || err.message,
            };
          })
        );
      }

      if (formData?.codeforces) {
        tasks.push(
          axios.post(
            `${BACKEND_URL}/api/codeforces/updateData`,
            { userId: user?.mongoId, username: formData.codeforces },
            { withCredentials: true }
          ).then((res) => {
            if (res.data?.data) {
              setCodeforcesData(res.data.data);
            }
            return { platform: 'Codeforces', success: true };
          }).catch((err) => {
            console.error("Codeforces refresh failed:", err);
            return {
              platform: 'Codeforces',
              success: false,
              error: err.response?.data?.error || err.message,
            };
          })
        );
      }

      const results = await Promise.all(tasks);
      const failures = results.filter((r) => !r.success);

      if (failures.length === 0) {
        setRefreshSuccess(true);
        setTimeout(() => setRefreshSuccess(false), 3000);
      } else if (failures.length === results.length) {
        setRefreshFeedback({
          type: 'error',
          message: "Failed to update statistics from coding platforms. Please verify usernames or try again.",
        });
      } else {
        const failedPlatforms = failures.map((f) => f.platform).join(', ');
        setRefreshFeedback({
          type: 'warning',
          message: `Partially updated. Could not refresh: ${failedPlatforms}.`,
        });
      }
    } catch (err) {
      console.error("Error refreshing stats:", err);
      setRefreshFeedback({
        type: 'error',
        message: "An unexpected error occurred while updating data.",
      });
    } finally {
      setIsRefreshing(false);
      if (isSync) isSync(false);
    }
  };

  // Leetcode API calls
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
        // console.log("/api/leetcode/userData response: ", res.data.data);
        
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

  // Codeforces API call
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
          <div className="flex items-center gap-3">
            <button
              className="cursor-pointer px-3.5 py-2 bg-zinc-800 text-gray-200 rounded-lg hover:bg-zinc-700 transition-colors font-medium text-sm border border-zinc-700"
              onClick={() => setShowModal(true)}
              title="Connect or edit platform handles"
            >
              {formData?.leetcode || formData?.codeforces ? "Edit Handles" : "Connect Platforms"}
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
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bodoni italic text-zinc-200">Dashboard</h2>
              <p className="text-gray-500 mt-1">Track your competitive programming journey across platforms.</p>
            </div>

            {/* ── UPDATE / REFRESH BUTTON ──────────────────────────────────────────
                Positioned in the dashboard action bar.
                To change position, simply move this <RefreshButton ... /> component. */}
            <div className="flex items-center gap-3">
              <RefreshButton
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
                lastSyncedAt={getLatestSyncTime()}
                success={refreshSuccess}
              />
            </div>
          </div>

          {/* Feedback message banner if refresh encounter issues */}
          {refreshFeedback && (
            <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm flex items-center justify-between ${
              refreshFeedback.type === 'error'
                ? 'bg-red-900/40 border border-red-700/60 text-red-200'
                : 'bg-yellow-900/40 border border-yellow-700/60 text-yellow-200'
            }`}>
              <span>{refreshFeedback.message}</span>
              <button
                type="button"
                onClick={() => setRefreshFeedback(null)}
                className="text-xs text-zinc-400 hover:text-white cursor-pointer ml-4"
              >
                ✕
              </button>
            </div>
          )}

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
                    <h2>{parseInt(displayedContestInfo?.rating || 0)}</h2>
                    <p className='text-xl'>(max. {(parseInt(displayedContestInfo?.maxRating) || 0)})</p>
                  </div>
                  <div className='text-base'>
                    <div className='flex justify-between'>
                      <button
                        onClick={() => setSelectedContestPlatform('leetcode')}
                        className={`cursor-pointer hover:bg-gray-50/10 px-1 rounded transition-colors ${
                          selectedContestPlatform === 'leetcode' ? 'text-emerald-400 font-semibold' : 'text-zinc-300'
                        }`}
                      >
                        Leetcode
                      </button>
                      <p className='text-gray-400'>{LeetcodeData?.contest?.attendedContestsCount ?? 0} Attended</p>
                    </div>
                    <div
                      onClick={() => setSelectedContestPlatform('codeforces')}
                      className='flex justify-between'
                    >
                      <button
                        className={`cursor-pointer hover:bg-gray-50/10 px-1 rounded transition-colors ${
                          selectedContestPlatform === 'codeforces' ? 'text-emerald-400 font-semibold' : 'text-zinc-300'
                        }`}
                      >
                        Codeforces
                      </button>
                      <p className='text-gray-400'>{codeforcesData?.contestsAttended ?? 0} Attended</p>
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
