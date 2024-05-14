import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modals.js';

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [favorites, setFavorites] = useState([]);

    const searchCharacters = async () => {
        try {
            const response = await axios.get(`${process.env.API_URL}/characters?nameStartsWith=${query}`);
            setResults(response.data.data.results);
        } catch (error) {
            console.error('Error retrieving characters:', error);
        }
    };

    const openModal = (character) => {
        setSelectedCharacter(character);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const toggleFavorite = (character) => {
        const isFavorite = favorites.some((fav) => fav.id === character.id);
        if (isFavorite) {
            const updatedFavorites = favorites.filter((fav) => fav.id !== character.id);
            setFavorites(updatedFavorites);
            console.log('Removed from favorites:', updatedFavorites);
        } else {
            const newFavorites = [...favorites, character];
            setFavorites(newFavorites);
            console.log('Added to favorites:', newFavorites);
        }
    };

    const removeFavorite = (characterId) => {
        const updatedFavorites = favorites.filter((fav) => fav.id !== characterId);
        setFavorites(updatedFavorites);
    };





    const isCharacterFavorite = (character) => favorites.some((fav) => fav.id === character.id);

    return (
        <div className="container">
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Enter character name"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-input"
                />
                <button onClick={searchCharacters} className="search-button">
                    Search
                </button>
            </div>
            <div className="results-container">
                {results.map((character) => (
                    <div key={character.id} className="character-card">
                        <img
                            src={character.thumbnail ? `${character.thumbnail.path}/portrait_incredible.${character.thumbnail.extension}` : 'default-image-path.jpg'}
                            alt={character.name}
                            onClick={() => openModal(character)}
                        />
                        <h3>{character.name}</h3>
                        <button onClick={() => toggleFavorite(character)} className={isCharacterFavorite(character) ? "favorite-button favorite" : "favorite-button"}>
                            {isCharacterFavorite(character) ? "Unfavorite" : "Favorite"}
                        </button>
                    </div>
                ))}
            </div>
            <div className="favorites-container">
                <h2>Favorites</h2>
                <div className="favorites-grid">
                    {favorites.map((fav) => (
                        <div key={fav.id} className="favorite-item" onClick={() => openModal(fav)}>
                            <img
                                src={fav.thumbnail ? `${fav.thumbnail.path}/portrait_incredible.${fav.thumbnail.extension}` : 'default-image-path.jpg'}
                                alt={fav.name}
                            />
                            <h3>{fav.name}</h3>
                            <button onClick={(e) => { e.stopPropagation(); removeFavorite(fav.id); }} className="remove-favorite-button">
                                Remove
                            </button>

                        </div>
                    ))}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {selectedCharacter && (
                    <div>
                        <h1>{selectedCharacter.name}</h1>
                        <img src={`${selectedCharacter.thumbnail.path}/portrait_incredible.${selectedCharacter.thumbnail.extension}`} alt={selectedCharacter.name} />
                        <p>{selectedCharacter.description || 'No description available.'}</p>
                        <div className="comic-appearances">
                            <h2>Comic Appearances</h2>
                            <ul>
                                {selectedCharacter.comics && selectedCharacter.comics.items.map((comic, index) => (
                                    <li key={index}>{comic.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );

}

export default Search;
