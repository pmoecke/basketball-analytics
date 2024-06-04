// PlayerSearch.tsx
import React, { useCallback, useState } from 'react';
import { debounce } from 'lodash';

interface PlayerSearchProps {
    tempPlayerName: string | undefined;
    setTempPlayerName: (name: string | undefined) => void;
}

const PlayerSearch: React.FC<PlayerSearchProps> = ({ tempPlayerName, setTempPlayerName }) => {
    const [searchTerm, setSearchTerm] = useState(tempPlayerName);

    const debouncedSearch = useCallback(debounce(async (playerName: string) => {
        if (playerName.trim()) {
            setTempPlayerName(playerName)
        }
        else {
            setTempPlayerName(undefined)
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
