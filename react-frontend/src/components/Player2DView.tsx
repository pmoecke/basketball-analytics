import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { playerStatsFromId, PlayerStatsFromIdParams} from "../router/data";

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

    const width = 560;
    const height = width

    useEffect(() => {
    
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear SVG content before adding new elements

        const margin = 50;
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
                const params: PlayerStatsFromIdParams = {
                    player_id: d.player_id
                  };
                playerStatsFromId(params).then((data) => {
                    if (data !== undefined) {
                      console.log(data);
                      const player = data[0]
                      setSelectedPlayer(player);
                    }
                }); 
                setShowModal(true);
            })
            .append("title")  // Tooltip showing the player's name on hover
            .text(d => `${d.player_name}\nOff:${d.offensive_rating}\nDef:${d.defensive_rating}`);

        // Add Axes
        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale));

        g.append("g")
            .call(d3.axisLeft(yScale));

        // Add X Axis label
        g.append("text")
        .attr("transform", `translate(${innerWidth / 2}, ${innerHeight + margin*0.7})`)
        .style("text-anchor", "middle")
        .text("Defensive Rating");

        // Add Y Axis label
        g.append("text")
            .attr("transform", `translate(${-margin*0.7}, ${innerHeight / 2}) rotate(-90)`)
            .style("text-anchor", "middle")
            .text("Offensive Rating");

    }, [players, setSelectedPlayer, setShowModal]);

    return (
        <div className="player-2d-view  d-flex justify-content-center">
            <svg ref={svgRef} width={width} height={height} style={{ backgroundColor: 'white' }}></svg>
        </div>
    );
};

export default Player2DView;

