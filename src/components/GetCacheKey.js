import React, { useState } from 'react';
import { getCache } from '../api/api';

const GetCacheKey = () => {
  const [key, setKey] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getTimeDifference = (timestamp) => {
    const timestampMs = new Date(timestamp).getTime(); // Convert timestamp to milliseconds
    const currentTimestampMs = Date.now(); // Get current timestamp in milliseconds
    const differenceMs = timestampMs - currentTimestampMs; // Calculate difference in milliseconds

    // Convert milliseconds to seconds
    const differenceInSeconds = Math.floor(differenceMs / 1000);
    return differenceInSeconds;
  };

  const handleGetCache = async () => {
    try {
      setIsLoading(true);
      const cacheData = await getCache(key);
      setData(cacheData);
    } catch (error) {
      setData(null);
      alert('Key not found. Please try again with a valid key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Get Cache Key</h2>
      <label className="px-3 py-2">
        Key:
        <input type="text" value={key} onChange={(e) => setKey(e.target.value)} />
      </label>
      <button className="btn btn-primary" onClick={handleGetCache} disabled={isLoading}>
        {isLoading ? 'Fetching...' : 'Get Value'}
      </button>
      {data && (
        <div>
          <h3>Value</h3>
          <p>{data.value}</p>
          <h3>Expires in</h3>
          <p>{getTimeDifference(data.expiration)} seconds</p>
        </div>
      )}
    </div>
  );
};

export default GetCacheKey;
