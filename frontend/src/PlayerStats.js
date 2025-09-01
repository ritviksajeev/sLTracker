import React, { useState } from 'react';
import axios from 'axios';

function PlayerStats() {
  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [playerData, setPlayerData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/summoner/${gameName}/${tagLine}`);
      setPlayerData(response.data);
    } catch (error) {
      console.error("Error fetching player data:", error);
      alert("Player not found or API error!");
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="Game Name (e.g., TenZ)"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Tagline (e.g., 000)"
          value={tagLine}
          onChange={(e) => setTagLine(e.target.value)}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Search</button>
      </form>

      {playerData && (
        <div>
          <h2>Recent Matches:</h2>
          {playerData.matches.map(match => (
            <div key={match.metadata.matchid} className="border-b py-2">
              <p>Map: {match.metadata.map}</p>
              <p>Mode: {match.metadata.mode}</p>
              {/* Find the player in the match data using puuid */}
              {match.players.all_players.find(p => p.puuid === playerData.puuid) && (
                <p>K/D/A: { /* Display stats here */ }</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlayerStats;