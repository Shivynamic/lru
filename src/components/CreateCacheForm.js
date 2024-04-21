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
    <div>
      <h2>Create Cache</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Key:
          <input type="text" value={key} onChange={(e) => setKey(e.target.value)} />
        </label>
        <label>
          Value:
          <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
        <label>
          Expiration (in seconds):
          <input type="text" value={expiration} onChange={(e) => setExpiration(e.target.value)} />
        </label>
        <button type="submit">Create Cache</button>
      </form>
    </div>
  );
};

export default CreateCacheForm;