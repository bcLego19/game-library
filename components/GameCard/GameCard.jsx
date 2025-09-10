import React from 'react';
import './GameCard.css'; // Assuming you have a CSS file for styling

const GameCard = ({ game }) => {
  return (
    <a href={game.link} className="game-card">
      <img src={game.image} alt={game.title} className="game-image" />
      <div className="game-info">
        <h3>{game.title}</h3>
        <p>{game.description}</p>
      </div>
    </a>
  );
};

export default GameCard;