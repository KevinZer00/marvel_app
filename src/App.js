import React, { useState, useEffect } from 'react';
import './App.css';
import Search from './Search.js';
import Modal from './Modals.js';

function App() {
    const [favorites, setFavorites] = useState([]);

    // Function to add a character to favorites
    const addToFavorites = (character) => {
        if (!favorites.some((fav) => fav.id === character.id)) {
            setFavorites([...favorites, character]);
        }
    };

    // Function to remove a character from favorites
    const removeFromFavorites = (character) => {
        const updatedFavorites = favorites.filter((fav) => fav.id !== character.id);
        setFavorites(updatedFavorites);
    };

    // Effect to load favorites from local storage on component mount
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites'));
        if (storedFavorites) {
            setFavorites(storedFavorites);
        }
    }, []);

    // Effect to update local storage when favorites change
    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    return (
        <div className="App">
            <h1>Marvel Character Explorer</h1>
            <Search addToFavorites={addToFavorites} />
        </div>
    );
}

export default App;
