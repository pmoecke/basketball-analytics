// PlayerSearch.tsx
import React, { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import { getPlayerId } from "../router/data"; // Adjust path as necessary

interface PlayerSearchProps {
    setPlayerId: (ids: number[] | null) => void;
}

const PlayerSearch: React.FC<PlayerSearchProps> = ({ setPlayerId }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const debouncedSearch = useCallback(debounce(async (playerName: string) => {
        if (playerName.trim()) {
          const ids = await getPlayerId({ player_name: playerName });
          if (ids) {
              setPlayerId(ids.map(item => item.player_id));
          }
        }
        else{
          setPlayerId(null);
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
