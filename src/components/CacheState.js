import React, { useState, useEffect } from 'react';
import { getCacheState } from '../api/api';

const CacheState = () => {
  const [cacheState, setCacheState] = useState(null);

  const fetchCacheState = async () => {
    try {
      const response = await getCacheState();
      setCacheState(response.keys); // Update state with keys array from the API response
    } catch (error) {
      console.error('Failed to fetch cache state:', error);
    }
  };

  useEffect(() => {
    fetchCacheState();
  }, []); // Fetch cache state on component mount

  const handleRefresh = () => {
    fetchCacheState(); // Manually trigger cache state refresh
  };
  const getTimeDifference = (timestamp) => {
    const timestampMs = new Date(timestamp).getTime(); // Convert timestamp to milliseconds
    const currentTimestampMs = Date.now(); // Get current timestamp in milliseconds
    const differenceMs = currentTimestampMs - timestampMs; // Calculate difference in milliseconds

    // Convert milliseconds to seconds
    const differenceInSeconds = Math.floor(differenceMs / 1000);
    return differenceInSeconds;
  };

  return (
    <div>
      <h2>Cache State</h2>
      <button onClick={handleRefresh}>Refresh</button> {/* Refresh button */}
      {cacheState ? (
        <div>
          {cacheState.map((entry) => (
            <div key={entry.key}>
              <p>
                <strong>Key:</strong> {entry.key}, 
                <strong>Value:</strong> {entry.value},
                <strong>Expiring in:</strong> T{getTimeDifference(entry.expiration)} seconds
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading cache state...</p>
      )}
    </div>
  );
};

export default CacheState;
