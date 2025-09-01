sLTracker - Valorant Match Statistics Tracker
An open-source web application for tracking and analyzing Valorant match statistics. Built with the MERN stack and Riot Games API.
🚀 Features

    Player Search: Look up any Valorant player by Riot ID (Name#Tag)

    Match History: View recent matches with detailed statistics

    Performance Analytics: Track K/D/A, win rates, and performance trends

    Crosshair Creator: Customize and share your crosshair settings

    Agent Explorer: Browse all Valorant agents and their abilities

    Line-up Wiki: Community-driven collection of ability line-ups

🛠️ Tech Stack

    Frontend: React, Tailwind CSS, Axios

    Backend: Node.js, Express.js

    Database: MongoDB

    API: Riot Games API

    Deployment: Vercel/Netlify (Frontend), Railway/Render (Backend)

📦 Installation
Prerequisites

    Node.js (v16 or higher)

    MongoDB Atlas account or local MongoDB

    Riot Games API key

Setup Instructions

    Clone the repository
    bash

git clone https://github.com/your-username/sLTracker.git
cd sLTracker

Setup Backend
bash

cd backend
npm install
cp .env.example .env
# Add your Riot API key to .env
npm run dev

Setup Frontend
bash

    cd frontend
    npm install
    npm start

    Access the application

        Frontend: http://localhost:3000

        Backend API: http://localhost:5000

🔑 API Configuration

    Get your Riot Games API key from developer.riotgames.com

    Add it to your .env
