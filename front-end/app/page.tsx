'use client'

import React, { useState } from 'react';
import axios from "axios";

export default function Home() {

  const [songTitle, setSongTitle] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [error, setError] = useState('');
  const [win, setWin] = useState(0);
  const [loss, setLoss] = useState(0);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [PrevCorrectAnswer, setPrevCorrectAnswer] = useState('');


  const fetchLyrics = async () => {
    try{
      const response = await axios.get(`https://taylor-swift-api.sarbo.workers.dev/songs`);
      var id = 0;
      if (response.data) {
        const allSongs = response.data;
        allSongs.forEach( (element : any)=> {
          if(element["title"] === songTitle){
            id = element["song_id"];
          }
        });
        const lyricsResponse = await axios.get(`https://taylor-swift-api.sarbo.workers.dev/lyrics/${id}`);
        if(lyricsResponse.data){
          setLyrics(lyricsResponse.data["lyrics"]);
          setError("");
        }
      }
    }
    catch{
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

  function generateQuestion(e: any){
    e.preventDefault();
    var lines = lyrics.split("\n").filter(line => line.trim() !== '');
    var lineNumber = Math.floor(Math.random() * (lines.length - 1));
    setQuestion(lines[lineNumber]);
    setCorrectAnswer(lines[lineNumber + 1]);
  }

  function checkAnswer(e: any){
    e.preventDefault();
    var strippedAnswer = answer.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    var strippedCorrect = correctAnswer.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    if(strippedAnswer == strippedCorrect){
      setWin(win + 1);
    }
    else{
      setLoss(loss + 1);
    }
    setPrevCorrectAnswer(correctAnswer);
    generateQuestion(e);
    setAnswer('');
  }

  function ResetScore(e: any){
    e.preventDefault();
    setWin(0);
    setLoss(0);
    generateQuestion(e);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
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
          className="w-full bg-purple-500 text-white p-3 rounded-md hover:bg-purple-300 transition duration-300"
        >
          Get Lyrics
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}
      {/*{lyrics && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Lyrics:</h3>
          <pre className="whitespace-pre-wrap text-gray-700">{lyrics}</pre>
        </div>
      )}*/}
      

      <div className='mt-12'>
        <p className="mb-4 text-2xl"> Record: {win}-{loss}</p>
        <button 
          type="submit" 
          className="w-full bg-purple-500 text-white p-3 rounded-md hover:bg-purple-300 transition duration-300 mb-4"
          onClick={ResetScore}
        >
          Reset Score
        </button>
        <p className="mb-4 text-2xl"> Previous Answer: {PrevCorrectAnswer}</p>
        <form onSubmit={checkAnswer} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <p className="mb-4 text-2xl whitespace-pre-wrap"> {question}</p>
          <input 
            type="text" 
            value={answer} 
            onChange={(e) => setAnswer(e.target.value)} 
            placeholder="Enter next line" 
            className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
          <button 
            type="submit" 
            className="w-full bg-purple-500 text-white p-3 rounded-md hover:bg-purple-300 transition duration-300"
          >
            Check
          </button>
        </form>
      </div>
    </div>
  );
}
