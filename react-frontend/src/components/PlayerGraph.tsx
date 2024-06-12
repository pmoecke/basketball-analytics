import React, { useEffect, useRef } from 'react';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { Player } from "../types/player";
import "./PlayerGraph.css"

interface PlayerGraphProps {
    player: Player;
}

const PlayerGraph: React.FC<PlayerGraphProps> = ({player}) => {
    const chartRef = useRef<Chart | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const chartElement = canvasRef.current;
        if (!chartElement) return;

        const player1_name = player.player_name;
        const player1_stats = [
            player.off_score_2,
            player.off_score_3,
            player.reb_score,
            player.def_score,
            player.off_score_1,
        ];
        const player1_color = 'rgb(153, 102, 255)';
        const player1_color_transparent = 'rgba(153, 102, 255, 0.1)';

        const text_color = '#ddd';
        const background_color = "#222222";
        const font_size = 16;

        const data = {
            labels: ["off_score_2", "off_score_3", "reb_score", "def_score", "off_score_1"],
            datasets: [{
                label: player1_name,
                data: player1_stats,
                backgroundColor: player1_color_transparent,
                borderColor: player1_color,
                pointBackgroundColor: player1_color,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
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
                maintainAspectRatio: true, // Ensure the aspect ratio is maintained
                aspectRatio: 1.4, // Width is 1.4 times the height
            },
        };

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(chartElement, config);

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [player]);

    return (
        <div className="chart-container">
            <canvas id="playerChart" ref={canvasRef}></canvas>
        </div>
    );
};

export default PlayerGraph;
