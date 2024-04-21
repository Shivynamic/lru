// App.js

import React from 'react';
import CreateCacheForm from './components/CreateCacheForm';
import GetCacheKey from './components/GetCacheKey';
import DeleteCacheButton from './components/DeleteCacheButton';
import CacheState from './components/CacheState';

import './App.css'; 

function App() {
  return (
    <div className="App">
      <h1>LRU Cache Manager</h1>
      <div className="section">
        <CreateCacheForm />
      </div>
      <hr />
      <div className="section">
        <GetCacheKey />
      </div>
      <hr />
      <div className="section">
        <DeleteCacheButton />
      </div>
      <hr />
      <div className="section">
        <CacheState />
      </div>
    </div>
  );
}

export default App;