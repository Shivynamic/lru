// // GetCacheKey.js

// import React, { useState } from 'react';
// import { getCache } from '../api/api';

// const GetCacheKey = () => {
//   const [key, setKey] = useState('');
//   const [value, setValue] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleGetCache = async () => {
//     try {
//       setIsLoading(true);
//       const cacheData = await getCache(key);
//       setValue(cacheData.value);
//     } catch (error) {
//       setValue('');
//       alert('Key not found. Please try again with a valid key.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Get Cache Key</h2>
//       <label>
//         Key:
//         <input type="text" value={key} onChange={(e) => setKey(e.target.value)} />
//       </label>
//       <button onClick={handleGetCache} disabled={isLoading}>
//         {isLoading ? 'Fetching...' : 'Get Value'}
//       </button>
//       {value && (
//         <div>
//           <h3>Value</h3>
//           <p>{value}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GetCacheKey;


import React, { useState } from 'react';
import { getCache } from '../api/api';

const GetCacheKey = () => {
  const [key, setKey] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      <button className="btn btn-primary " onClick={handleGetCache} disabled={isLoading}>
        {isLoading ? 'Fetching...' : 'Get Value'}
      </button>
      {data && (
        <div>
          <h3>Value</h3>
          <p>{data.value}</p>
          <h3>Expires at</h3>
          <p>{data.expiration}</p> 
        </div>
      )}
    </div>
  );
  
};

export default GetCacheKey;
