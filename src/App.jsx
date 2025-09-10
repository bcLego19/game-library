// src/App.jsx
import React, { useState } from 'react';
import { games } from './data/games';
import GameCard from '../components/GameCard';
import ThemeToggle from '../components/ThemeToggle';
import './styles/global.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <header className="header">
        <h1>My Game Library</h1>
        <div className="header-controls">
          <input
            type="text"
            placeholder="Search for a game..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          <ThemeToggle />
        </div>
      </header>
      <main className="game-list">
        {filteredGames.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </main>
    </div>
  );
}

export default App;