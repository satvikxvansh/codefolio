import React from 'react';
import { RotateCw, Check } from 'lucide-react';

/**
 * Formats a Date or timestamp string into a human-readable relative time.
 */
function formatRelativeTime(date) {
  if (!date) return '';
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return '';

  const diffMs = Date.now() - parsed.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 45) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

/**
 * RefreshButton component
 * 
 * Modular refresh/update button designed to be placed anywhere on the dashboard.
 * Refetches fresh data from LeetCode and Codeforces via the backend,
 * updates the database, and reflects the updated data in the UI.
 *
 * @param {Function} onRefresh - Async callback function that triggers data update
 * @param {boolean} isRefreshing - Loading state indicating refresh is in flight
 * @param {string|Date} lastSyncedAt - Timestamp of last sync
 * @param {boolean} disabled - Whether the button is disabled
 * @param {boolean} success - Transient success flag to show success state
 * @param {boolean} showTimestamp - Whether to render relative "Synced X ago" label
 * @param {string} className - Additional CSS class names for custom layout
 */
const RefreshButton = ({
  onRefresh,
  isRefreshing = false,
  lastSyncedAt = null,
  disabled = false,
  success = false,
  showTimestamp = true,
  className = '',
}) => {
  const relativeTime = formatRelativeTime(lastSyncedAt);

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {showTimestamp && relativeTime && (
        <span
          className="text-xs text-zinc-400 select-none whitespace-nowrap"
          title={lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : ''}
        >
          Synced {relativeTime}
        </span>
      )}
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing || disabled}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer select-none focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-60 disabled:cursor-not-allowed ${
          success
            ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
            : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-xs'
        }`}
        title="Refetch latest statistics from LeetCode & Codeforces"
        aria-label="Refresh competitive programming statistics"
      >
        {success ? (
          <Check size={15} className="text-emerald-300" />
        ) : (
          <RotateCw
            size={15}
            className={`${isRefreshing ? 'animate-spin' : 'transition-transform duration-300'}`}
          />
        )}
        <span>
          {isRefreshing ? 'Updating...' : success ? 'Updated!' : 'Refresh Data'}
        </span>
      </button>
    </div>
  );
};

export default RefreshButton;

