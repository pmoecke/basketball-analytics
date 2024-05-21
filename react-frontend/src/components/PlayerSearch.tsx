// PlayerSearch.tsx
import React, { useCallback, useState } from 'react';
import { debounce } from 'lodash';

interface PlayerSearchProps {
    setPlayer_name: (name: string | undefined) => void;
}

const PlayerSearch: React.FC<PlayerSearchProps> = ({ setPlayer_name }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const debouncedSearch = useCallback(debounce(async (playerName: string) => {
        if (playerName.trim()) {
            setPlayer_name(playerName)
        }
        else {
            setPlayer_name(undefined)
        }
    }, 300), []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    return (
        <input
            className="form-control"
            type="text"
            placeholder="Search for players..."
            value={searchTerm}
            onChange={handleSearch}
        />
    );
};

export default PlayerSearch;
