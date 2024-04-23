// PlayerSearch.tsx
import React, { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import { getPlayerId } from "../router/data"; // Adjust path as necessary

interface PlayerSearchProps {
    setPlayer_name: (name: string | null) => void;
}

const PlayerSearch: React.FC<PlayerSearchProps> = ({ setPlayer_name }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const debouncedSearch = useCallback(debounce(async (playerName: string) => {
        if (playerName.trim()) {
            setPlayer_name(playerName)
        }
    }, 300), []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    return (
        <input
            className="form-control search mb-3"
            type="text"
            placeholder="Search for players..."
            value={searchTerm}
            onChange={handleSearch}
        />
    );
};

export default PlayerSearch;
