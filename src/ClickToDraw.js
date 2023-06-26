import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClickToDraw = () => {
  const [deckId, setDeckId] = useState(null);
  const [remainingCards, setRemainingCards] = useState(0);
  const [drawnCards, setDrawnCards] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    fetchDeck();
  }, []);

  useEffect(() => {
    let intervalId;

    if (isDrawing) {
      intervalId = setInterval(drawCard, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isDrawing]);

  const fetchDeck = async () => {
    const response = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    const { data } = response;
    setDeckId(data.deck_id);
    setRemainingCards(data.remaining);
  };

  const drawCard = async () => {
    if (remainingCards === 0) {
      alert('Error: no cards remaining!');
      setIsDrawing(false);
      return;
    }

    const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    const { data } = response;
    setRemainingCards(data.remaining);

    if (Array.isArray(data.cards)) {
      setDrawnCards(prevCards => [...prevCards, ...data.cards]);
    } else {
      setDrawnCards(prevCards => [...prevCards, data.cards]);
    }
  };

  const toggleDrawing = () => {
    setIsDrawing(prevIsDrawing => !prevIsDrawing);
  };

  return (
    <div>
      <h1>Click to Draw</h1>
      <button onClick={toggleDrawing}>{isDrawing ? 'Stop Drawing' : 'Start Drawing'}</button>
      <div>
        <h2>Drawn Cards:</h2>
        {drawnCards.map((card, index) => (
          <div key={index}>{card.value} of {card.suit}</div>
        ))}
      </div>
    </div>
  );
};

export default ClickToDraw;
