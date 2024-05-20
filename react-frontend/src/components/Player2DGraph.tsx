import React, { useEffect, useRef } from "react";
import Chart, { ChartConfiguration } from "chart.js/auto";
import { Player, PlayerArray, ProjectedPlayer } from "../types/player";
import zoomPlugin from "chartjs-plugin-zoom";
import { PlayerStatsFromIdParams, playerStatsFromId } from "../router/data";

Chart.register(zoomPlugin);

function transformPlayerData(players: any[]): ProjectedPlayer[] {
  return players.map(player => {
    const transformed: ProjectedPlayer = { player_id: player.player_id, x: 0, y: 0 };

    for (const key in player) {
      if (key.startsWith('x_')) {
        transformed.x = player[key];  // Assign the first found '_x' value to 'x'
      } else if (key.startsWith('y_')) {
        transformed.y = player[key];  // Assign the first found '_y' value to 'y'
      }
    }
    return transformed;
  });
}

interface ScatterDataPoint {
  x: number;
  y: number;
  player_id: number;
}

interface Player2DGraphProps {
  players: Player[];
  projectedPlayersData: any[];
  comparisonPlayers: PlayerArray;
  setSelectedPlayer: (player: Player) => void;
  setShowModal: (show: boolean) => void;
  highlightedPlayer: Player | null;
  setHighlightedPlayer: (player: Player | null) => void;
}

const Player2DGraph: React.FC<Player2DGraphProps> = ({
  players,
  projectedPlayersData,
  comparisonPlayers,
  setSelectedPlayer,
  setShowModal,
  highlightedPlayer,
  setHighlightedPlayer,
}) => {
  const chartRef = useRef<Chart | null>(null);

  const projectedPlayers = transformPlayerData(projectedPlayersData);
  let activePlayers = projectedPlayers;

  useEffect(() => {
    const chartElement = document.getElementById("chart2d") as HTMLCanvasElement;
    if (chartElement) {
      activePlayers = projectedPlayers.filter(
        p => !comparisonPlayers.some(cp => cp.player_id === p.player_id)
      );

      const config: ChartConfiguration<
        "scatter",
        ScatterDataPoint[],
        unknown
      > = {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Players",
              data: activePlayers.map((player) => ({
                x: player.x,
                y: player.y,
                player_id: player.player_id,
              })),
              backgroundColor: "rgb(153, 102, 255)",
              pointBackgroundColor: "rgb(153, 102, 255)",
              pointHoverBackgroundColor: "rgb(153, 102, 255)",
              pointHoverBorderColor: "white",
              pointBorderColor: "rgb(34, 34, 34)",
              order: 10,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: "Comparison Players",
              data: comparisonPlayers.map((player) => ({
                x: player.offensive_rating,
                y: player.defensive_rating,
                player_id: player.player_id,
              })),
              backgroundColor: "rgb(255, 159, 64)",
              pointBackgroundColor: "rgb(255, 159, 64)",
              pointBorderColor: "rgb(34, 34, 34)",
              pointHoverBackgroundColor: "rgb(255, 159, 64)",
              pointHoverBorderColor: "white",
              order: 1,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: "Highlighted Player",
              data: [],
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              pointBackgroundColor: "rgba(255, 255, 255, 0.0)",
              pointBorderColor: "white",
              pointBorderWidth: 3,
              order: 0,
              pointRadius: 6,
            },
          ],
        },
        options: {
          animation: {
            duration: 0, // Disable animations
          },
          scales: {
            x: {
              type: "linear",
              position: "bottom",
              grid: {
                color: "grey", // Grid line colors
              },
              ticks: {
                color: "white", // Ticks labels color
              },
            },
            y: {
              type: "linear",
              grid: {
                color: "grey", // Grid line colors
              },
              ticks: {
                color: "white", // Ticks labels color
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                color: "white", // Legend labels color
                filter: function (legendItem, chartData) {
                  // Check the label of the dataset and decide whether to display it in the legend
                  if (legendItem.text === "Highlighted Player") {
                    return false; // Do not display the label for "Highlighted Player"
                  }
                  return true; // Display labels for all other datasets
                }
              },
            },
            zoom: {
              limits: {
                x: { min: "original", max: "original" },
                y: { min: "original", max: "original" },
              },
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: "xy",
              },
              pan: {
                enabled: true,
                mode: "xy",
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const raw = context.raw as ScatterDataPoint;
                  const player = players.find(p => p.player_id === raw.player_id);
                  const playerName = player ? player.player_name : "Unknown Player";
                  return `${playerName}: (${Math.round(raw.x).toFixed(1)}, ${Math.round(raw.y).toFixed(1)})`;
                },
              },
            },
          },
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const index = elements[0].index;
              const datasetIndex = elements[0].datasetIndex;
              const selectedPlayer = datasetIndex === 0 ? players[index] : comparisonPlayers[index];

              const params: PlayerStatsFromIdParams = {
                player_id: [selectedPlayer.player_id]
              };
              playerStatsFromId(params).then((data) => {
                if (data !== undefined) {
                  const player = data[0]
                  console.log("api call", player)
                  setSelectedPlayer(player);
                }
              }); 
              
              setShowModal(true);
            }
          },
          onHover: (event, chartElements) => {
            const chartElement = event.native
              ? (event.native.target as HTMLElement)
              : null;
            if (chartElement && chartElements.length > 0) {
              chartElement.style.cursor = "pointer";
            } else if (chartElement) {
              chartElement.style.cursor = "default";
            }
          },
          maintainAspectRatio: false,
        },
      };

      chartRef.current = new Chart(chartElement, config);
    }
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };

  }, [projectedPlayers, comparisonPlayers, players]); // Only reinitialize chart if these arrays change

  useEffect(() => {
    if (chartRef.current) {
      const comparisonDataset = chartRef.current.data.datasets[1]; // Accessing the second dataset
      
      const comparisonPlayerIds = comparisonPlayers.map(player => player.player_id);
      const comparisonProjection = projectedPlayers.filter(player => comparisonPlayerIds.includes(player.player_id));
      comparisonDataset.data = comparisonProjection.map((player) => ({
        x: player.x,
        y: player.y,
        player_id: player.player_id,
      }));

      activePlayers = projectedPlayers.filter(
        p => !comparisonPlayers.some(cp => cp.player_id === p.player_id)
      );

      const activeDataset = chartRef.current.data.datasets[0];
      activeDataset.data = activePlayers.map((player) => ({
        x: player.x,
        y: player.y,
        player_id: player.player_id,
      }));
      chartRef.current.update("none"); // Update without animation
    }
  }, [comparisonPlayers, projectedPlayers]); // Update the dataset whenever the comparison players change

  useEffect(() => {
    if (chartRef.current && highlightedPlayer != null) {
      const dataset = chartRef.current.data.datasets[2] as {data: ScatterDataPoint[];};
      const highlightedProjection = projectedPlayers.find(player => player.player_id === highlightedPlayer.player_id);
      dataset.data = highlightedProjection
        ? [
          {
            x: highlightedProjection.x,
            y: highlightedProjection.y,
            player_id: highlightedProjection.player_id,
          },
        ]
        : [];
      chartRef.current.update("none"); // Update without animation
    }
  }, [highlightedPlayer, projectedPlayers]); // Update the dataset whenever the highlighted player changes, even if null

  return (
    <div className="chart-container" style={{ height: "100%", width: "100%" }}>
      <canvas id="chart2d"></canvas>
    </div>
  );
};

export default Player2DGraph;
