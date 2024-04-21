// CreateCacheForm.js

import React, { useState } from 'react';
import { createCache } from '../api/api';

const CreateCacheForm = () => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [expiration, setExpiration] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCache(key, value, expiration);
      setKey('');
      setValue('');
      setExpiration('');
      alert('Cache created successfully!');
    } catch (error) {
      alert('Failed to create cache. Please try again later.');
    }
  };

  return (
    <div className="px-3 py-2">
      <h2>Create Cache</h2>
      <form onSubmit={handleSubmit}>
        <label className="px-2 py-2">
          Key: 
          </label> 
          <input type="text" value={key} onChange={(e) => setKey(e.target.value)} />
        
        <label className="px-2 py-2" >
          Value:
          </label>
          <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
        
        <label className="px-2 py-2">
          Expiration (in seconds):
          </label>
          <input type="text" value={expiration} onChange={(e) => setExpiration(e.target.value)} />
        <div className="px-6 py-4">
        <button type="submit" className="btn btn-primary">Create Cache</button>
        </div>
      </form>
    </div>
  );
  
};

export default CreateCacheForm;