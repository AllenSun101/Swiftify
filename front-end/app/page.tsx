'use client'

import React, { useState } from 'react';
import Image from "next/image";
import axios from "axios";

export default function Home() {

  const [songTitle, setSongTitle] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [error, setError] = useState('');

  const fetchLyrics = async () => {
    try {
      const response = await axios.get(`https://taylor-swift-api.sarbo.workers.dev/songs`);
      if (response.data && response.data) {
        setLyrics(response.data[60]["title"]);
        setError('');
      } else {
        setError('Lyrics not found.');
      }
    } catch (error) {
      setError('Error fetching lyrics.');
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (songTitle) {
      fetchLyrics();
    } else {
      setError('Please enter a song title.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-4 text-gray-800">Get Song Lyrics</h1>
        <input 
          type="text" 
          value={songTitle} 
          onChange={(e) => setSongTitle(e.target.value)} 
          placeholder="Enter song title" 
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Get Lyrics
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}
      {lyrics && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Lyrics:</h3>
          <pre className="whitespace-pre-wrap text-gray-700">{lyrics}</pre>
        </div>
      )}
    </div>
  );
}
