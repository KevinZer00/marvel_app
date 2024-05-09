import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modals.js';


function Search({ addToFavorites }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const searchCharacters = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/characters?nameStartsWith=${query}`);
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
        addToFavorites(character);
    };

    const isFavorite = (character) => {
        // Determine if character is in favorites list
        // You might need to adjust this based on how your favorites are stored
        return results.some((fav) => fav.id === character.id);
    };

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
                        <button onClick={() => toggleFavorite(character)} className={isFavorite(character) ? "favorite-button favorite" : "favorite-button"}>
                            {isFavorite(character) ? "Unfavorite" : "Favorite"}
                        </button>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {/* Modal content */}
                {selectedCharacter && (
                    <div>
                        <h1>{selectedCharacter.name}</h1>
                        <img src={`${selectedCharacter.thumbnail.path}/portrait_incredible.${selectedCharacter.thumbnail.extension}`} alt={selectedCharacter.name} />
                        <p>{selectedCharacter.description || 'No description available.'}</p>
                        <div className="comic-appearances">
                            <h2>Comic Appearances</h2>
                            <ul>
                                {selectedCharacter.comics.items.map((comic, index) => (
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
