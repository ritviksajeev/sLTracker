const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express(); // <-- This line creates the 'app' variable
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- ROUTES --- //

// MAKE SURE THIS LINE STARTS WITH 'app.get' NOT 'pp.get'
app.get('/api/summoner/:gameName/:tagLine', async (req, res) => {
  const { gameName, tagLine } = req.params;
  
  console.log("1. Received request for:", gameName, tagLine);

  try {
    // 1. Get account info by Riot ID (Name#Tag)
    const accountUrl = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}?api_key=${process.env.RIOT_API_KEY}`;
    console.log("2. Making account request to:", accountUrl);
    
    const accountResponse = await axios.get(accountUrl);
    console.log("3. Account API Success!");
    const puuid = accountResponse.data.puuid;
    const gameNameFound = accountResponse.data.gameName;
    const tagLineFound = accountResponse.data.tagLine;

    // 2. Try different regions for match data
    const regions = ['americas', 'asia', 'europe'];
    
    for (const region of regions) {
      try {
        console.log(`4. Trying ${region} region...`);
        const matchesUrl = `https://${region}.api.riotgames.com/valorant/match/v1/matchlists/by-puuid/${puuid}?api_key=${process.env.RIOT_API_KEY}`;
        
        const matchesResponse = await axios.get(matchesUrl);
        console.log(`5. ${region} region successful!`);
        const matchIds = matchesResponse.data;
        
        // 3. Get details for the first 3 matches
        console.log("6. Getting details for first 3 matches");
        const matchDetailsPromises = matchIds.slice(0, 3).map(matchId => 
          axios.get(`https://${region}.api.riotgames.com/valorant/match/v1/matches/${matchId}?api_key=${process.env.RIOT_API_KEY}`)
        );
        
        const matchDetailsResponses = await Promise.all(matchDetailsPromises);
        const matchDetails = matchDetailsResponses.map(response => response.data);

        // 4. Send all the data back to the frontend
        return res.json({
          puuid,
          gameName: gameNameFound,
          tagLine: tagLineFound,
          region: region,
          matchList: matchIds,
          matches: matchDetails
        });

      } catch (regionError) {
        console.log(`7. ${region} region failed:`, regionError.response?.status || regionError.message);
        // Continue to next region
        continue;
      }
    }

    // If all regions failed
    throw new Error('All regions failed to retrieve match data');

  } catch (error) {
    console.log("=== FINAL ERROR START ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
      res.status(error.response.status).json({ 
        error: 'Riot API Error: ' + JSON.stringify(error.response.data) 
      });
    } else {
      console.error("General error:", error.message);
      res.status(500).json({ error: 'Failed to fetch data: ' + error.message });
    }
    console.log("=== FINAL ERROR END ===");
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));