// DeleteCacheButton.js

import React, { useState } from 'react';
import { deleteCache } from '../api/api';

const DeleteCacheButton = () => {
  const [id, setId] = useState('');

  const handleDelete = async () => {
    try {
      await deleteCache(id);
      alert('Cache deleted successfully!');
      setId('');
    } catch (error) {
      alert('Failed to delete cache. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Delete Cache</h2>
      <label>
        ID:
        <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
      </label>
      <button onClick={handleDelete}>Delete Cache</button>
    </div>
  );
};

export default DeleteCacheButton;