import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_KEY;

const UsernameModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  // 1. Internal state for form inputs
  const [formData, setFormData] = useState({
    leetcode: '',
    codeforces: '',
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ leetcode: '', codeforces: '' });
    }
  }, [isOpen]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Pass data back to parent component
    await axios.post(`${BACKEND_URL}/platformdetails`,
      formData, { 
      withCredentials: true 
    });
    onSubmit(formData);

  };

  // If isOpen is false, don't render anything in the DOM
  if (!isOpen) return null;

  return (
    // --- The Backdrop Overlay ---
    // "fixed inset-0" covers the whole screen. "z-50" ensures it's on top.
    <div
      className="fixed inset-0 bg-gray-900/80 backdrop-blur-xs overflow-y-auto h-full w-full z-50 flex items-center justify-center"
      onClick={onClose} // Close modal when clicking outside
    >
      {/* // --- The Modal Content Box ---
      // We use e.stopPropagation() to prevent clicks inside the box from closing the modal */}
      <div
        className="relative p-8 bg-white w-full max-w-md m-auto rounded-xl shadow-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Connect Platforms</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            type="button"
          >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-6">
          Enter your usernames to fetch and display your coding statistics on the dashboard.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* LeetCode Input */}
          <div>
            <label
              htmlFor="leetcode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              LeetCode Username
            </label>
            <input
              type="text"
              id="leetcode"
              name="leetcode"
              value={formData.leetcode}
              onChange={handleChange}
              placeholder="e.g. leetcode_warrior"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700"
            />
          </div>

          {/* Codeforces Input */}
          <div>
            <label
              htmlFor="codeforces"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Codeforces Handle
            </label>
            <input
              type="text"
              id="codeforces"
              name="codeforces"
              value={formData.codeforces}
              onChange={handleChange}
              placeholder="e.g. tourist"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all text-gray-700"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Saving...' : 'Save Credentials'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsernameModal;
