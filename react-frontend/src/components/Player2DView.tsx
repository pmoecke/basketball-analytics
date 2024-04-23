import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Import styles for the component


// Assuming you have defined these types somewhere else in your project.
// If not, you need to define them appropriately based on how players are structured.
import { Player, PlayerArray } from '../types/player';

interface Player2DViewProps {
    players: PlayerArray;
    setSelectedPlayer: (player: Player) => void;
    setShowModal: (show: boolean) => void;
}



const Player2DView: React.FC<Player2DViewProps> = ({ players, setSelectedPlayer, setShowModal }) => {
    const svgRef = useRef(null);

    const width = 500;
    const height = width

    useEffect(() => {
    
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear SVG content before adding new elements

        const margin = 30;
        const innerWidth = width - 2*margin;
        const innerHeight = height - 2*margin;

        console.log(players)

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(players, d => d.defensive_rating) || 100])
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(players, d => d.offensive_rating) || 100]) // Assuming 'offense_stat' is a valid property
            .range([innerHeight, 0]);

        const g = svg.append("g").attr("transform", `translate(${margin},${margin})`);

        // Add circles for each player
        g.selectAll("circle")
            .data(players)
            .enter().append("circle")
            .attr("cx", d => xScale(d.defensive_rating))
            .attr("cy", d => yScale(d.offensive_rating))
            .attr("r", 5)
            .attr("fill", "dodgerblue")
            .on("click", (event, d) => {
                setSelectedPlayer(d);
                setShowModal(true);
            })
            .append("title")  // Tooltip showing the player's name on hover
            .text(d => `${d["player-name"]}\nOff:${d.offensive_rating}\nDef:${d.defensive_rating}`);

        // Add Axes
        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale));

        g.append("g")
            .call(d3.axisLeft(yScale));
    }, [players, setSelectedPlayer, setShowModal]);

    return (
        <div className="player-2d-view  d-flex justify-content-center">
            <svg ref={svgRef} width={width} height={height} style={{ backgroundColor: 'white' }}></svg>
        </div>
    );
};

export default Player2DView;

