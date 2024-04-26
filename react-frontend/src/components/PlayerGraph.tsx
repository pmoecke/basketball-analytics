import React, { useEffect } from 'react';
import Chart, { ChartConfiguration, ChartType } from 'chart.js/auto';
import { Player } from "../types/player";

interface PlayerGraphProps {
    player: Player;
}

const PlayerGraph: React.FC<PlayerGraphProps> = ({player}) => {
    useEffect(() => {
        var player1_name = player['player-name']
        const multiply = 5;
        var player1_stats = [
            player['2-pt_field_goals_attempted']*multiply,
            player['2-pt_field_goals_made']*multiply,
            player['3-pt_field_goals_attempted']*multiply,
            player['3-pt_field_goals_made']*multiply,
            player['assists']*multiply
        ]
        var player1_color = 'rgb(153, 102, 255)'
        var player1_color_transparent = 'rgba(153, 102, 255, 0.1)'

        var text_color = '#ddd'
        var background_color = "#222222"
        var font_size = 16

        const data = {
            labels: ["Drives %", "Free Throws %", "Isolation %", "Pick-n-Pops %", "Transition Attacks %"],
            datasets: [{
                label: player1_name,
                data: player1_stats,
                backgroundColor: player1_color_transparent,
                borderColor: player1_color,
                pointBackgroundColor: player1_color,
                pointHoverBorderColor: player1_color,
            }],
        };

        const config: ChartConfiguration<'radar', number[], string> = {
            type: 'radar',
            data: data,
            options: {
                responsive: true,
                elements: {
                    line: {
                        borderWidth: 3,
                    },
                    point: {
                        radius: 4,
                        hitRadius: 10,
                        hoverRadius: 6,
                        borderColor: '#fff',
                        hoverBackgroundColor: '#fff',
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            color: text_color,
                        },
                        pointLabels: {
                            color: text_color,
                            font: {
                                size: font_size,
                            },
                        },
                        grid: {
                            color: text_color,
                        },
                        ticks: {
                            color: text_color,
                            backdropColor: background_color,
                        },
                        min: 0,
                        max: 100,
                    },
                },
                onHover: function(event, chartElement) {
                    const hoverElement = document.getElementById('playerChart') as HTMLCanvasElement;
                    if (hoverElement) {
                        hoverElement.style.cursor = chartElement[0] ? 'pointer' : 'default';
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                        //onClick: (e) => e.stopPropagation(),
                    },
                },
            },
        };

        const chartElement = document.getElementById('playerChart') as HTMLCanvasElement;
        if (chartElement) {
            Chart.defaults.font.size = font_size;
            const playerChart = new Chart(chartElement, config);
        }
    }, []);

    return (
        <div className="chart-container">
            <canvas id="playerChart"></canvas>
        </div>
    );
};

export default PlayerGraph;
