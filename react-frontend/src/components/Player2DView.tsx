import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { playerStatsFromId, PlayerStatsFromIdParams } from "../router/data";
import { Player, PlayerArray } from '../types/player';

interface Player2DViewProps {
    players: PlayerArray;
    comparisonPlayers: PlayerArray;
    setSelectedPlayer: (player: Player) => void;
    setShowModal: (show: boolean) => void;
}

const Player2DView: React.FC<Player2DViewProps> = ({ players, comparisonPlayers, setSelectedPlayer, setShowModal }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [showGridlines, setShowGridlines] = useState(true);

    const width = 560;
    const height = width;
    const margin = 50;
    const innerWidth = width - 2 * margin;
    const innerHeight = height - 2 * margin;

    useEffect(() => {
        const svg = d3.select(svgRef.current!);
        svg.selectAll("*").remove();

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(players, d => d.defensive_rating) || 100])
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(players, d => d.offensive_rating) || 100])
            .range([innerHeight, 0]);

        const g = svg.append("g").attr("transform", `translate(${margin},${margin})`);

        // Create gridlines
        const makeXGridlines = () => d3.axisBottom(xScale).tickSize(-innerHeight).tickFormat(() => (""));
        const makeYGridlines = () => d3.axisLeft(yScale).tickSize(-innerWidth).tickFormat(() => (""));

        // Append gridlines to the chart
        g.append("g")
        .attr("class", "grid x-grid")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(makeXGridlines());

        g.append("g")
        .attr("class", "grid y-grid")
        .call(makeYGridlines());

        g.selectAll("circle")
            .data(players)
            .enter().append("circle")
            .attr("cx", d => xScale(d.defensive_rating))
            .attr("cy", d => yScale(d.offensive_rating))
            .attr("r", 5)
            .attr("fill", "dodgerblue")
            .on("click", (event, d) => {
                const params: PlayerStatsFromIdParams = { player_id: [d.player_id] };
                playerStatsFromId(params).then((data) => {
                    if (data !== undefined) {
                        console.log(data);
                        setSelectedPlayer(data[0]);
                    }
                });
                setShowModal(true);
            })
            .append("title")
            .text(d => `${d.player_name}\nOff:${d.offensive_rating}\nDef:${d.defensive_rating}`);

        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale));

        g.append("g")
            .call(d3.axisLeft(yScale));

        g.append("text")
            .attr("transform", `translate(${innerWidth / 2}, ${innerHeight + margin * 0.7})`)
            .style("text-anchor", "middle")
            .text("Defensive Rating");

        g.append("text")
            .attr("transform", `translate(${-margin * 0.7}, ${innerHeight / 2}) rotate(-90)`)
            .style("text-anchor", "middle")
            .text("Offensive Rating");

        // Zoom behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 10])
            .translateExtent([[-margin, -margin], [width - margin, height - margin]])
            .on("zoom", event => {
                const transform = event.transform;
                g.attr("transform", transform)

                g.selectAll("circle").attr('r', 5 / Math.sqrt(transform.k));
            });
        svg.call(zoom);
    }, [players]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        if (!svg.empty()) {
            const comparisonPlayerIds = new Set(comparisonPlayers.map(player => player.player_id));

            svg.selectAll("circle")
                .data(players)
                .attr("fill", d => comparisonPlayerIds.has(d.player_id) ? "red" : "dodgerblue");
        }
    }, [players, comparisonPlayers]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('.grid').style('display', showGridlines ? 'block' : 'none');
    }, [showGridlines]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('.grid').style('display', showGridlines ? 'block' : 'none');
    }, [showGridlines]);

    const resetZoom = () => {
        const svg = d3.select(svgRef.current);
        // Directly setting the transform attribute to reset the zoom
        const g = svg.select('g')
        g.transition()
            .duration(500)
            .attr("transform", "translate(" + margin + "," + margin + ") scale(1)"); // Reset transform to original
        
        g.selectAll("circle").attr('r', 5);
    };

    return (
        <div className="player-2d-view d-flex flex-column justify-content-center">
            <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group mr-2">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={resetZoom}>Reset Zoom</button>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowGridlines(!showGridlines)}>
                        {showGridlines ? 'Hide Gridlines' : 'Show Gridlines'}
                    </button>
                </div>
            </div>
            <svg ref={svgRef} width={width} height={height} style={{ backgroundColor: 'white' }}></svg>
        </div>
    );
};

export default Player2DView;
