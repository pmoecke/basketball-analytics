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

  //const projectedPlayers = transformPlayerData(projectedPlayersData);
  let activePlayers = projectedPlayersData;

  const calculatePointRadius = (zoomLevel: number) => {
    const baseRadius = 4; // Base radius for the default zoom level
    return baseRadius * Math.sqrt(zoomLevel);
  };

  useEffect(() => {
    const chartElement = document.getElementById("chart2d") as HTMLCanvasElement;
    if (chartElement) {
      activePlayers = projectedPlayersData.filter(
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
              pointHoverRadius: 5,
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
              pointBorderWidth: 1,
              order: 0,
              pointRadius: 4,
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
                display: false,
                color: "white", // Ticks labels color
              },
            },
            y: {
              type: "linear",
              grid: {
                color: "grey", // Grid line colors
              },
              ticks: {
                display: false,
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
                x: { min: 'original', max: 'original', minRange: 3 },
                y: { min: 'original', max: 'original', minRange: 3 },
              },
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: "xy",
                onZoom: ({chart}) => {
                  const zoomLevel = chart.getZoomLevel(); // Get the current zoom level
                  chart.data.datasets.forEach((dataset) => {
                    if ('pointRadius' in dataset) {
                      (dataset as any).pointRadius = calculatePointRadius(zoomLevel);
                      (dataset as any).pointHoverRadius = calculatePointRadius(zoomLevel) + 2;
                    }
                  });
                  chart.update('none');
                },
                onZoomComplete: ({chart}) => {
                  const zoomLevel = chart.getZoomLevel(); // Get the current zoom level
                  chart.data.datasets.forEach((dataset) => {
                    if ('pointRadius' in dataset) {
                      (dataset as any).pointRadius = calculatePointRadius(zoomLevel);
                      (dataset as any).pointHoverRadius = calculatePointRadius(zoomLevel) + 2;
                    }
                  });
                  chart.update('none');
                },
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
                  return `${playerName}`;
                },
              },
            },
          },
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const datasetIndex = elements[0].datasetIndex;
              const dataIndex = elements[0].index;
              const dataPoint = chartRef.current?.data.datasets[datasetIndex].data[dataIndex] as ScatterDataPoint;

              const selectedPlayerId = dataPoint.player_id;
              const selectedPlayer = players.find(p => p.player_id === selectedPlayerId) || comparisonPlayers.find(p => p.player_id === selectedPlayerId);

              if (selectedPlayer) {
                const params: PlayerStatsFromIdParams = {
                  player_id: [selectedPlayer.player_id]
                };
                playerStatsFromId(params).then((data) => {
                  if (data !== undefined) {
                    const player = data[0];
                    console.log("selected query", player.player_name);
                    setSelectedPlayer(player);
                  }
                }); 
                
                setShowModal(true);
              }
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
          responsive: true,
        },
      };

      chartRef.current = new Chart(chartElement, config);
    }
    //console.log("proj, comp, players", projectedPlayers, comparisonPlayers, players)
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };

  }, [projectedPlayersData, comparisonPlayers, players, highlightedPlayer]); // Only reinitialize chart if these arrays change

  useEffect(() => {
    if (chartRef.current) {
      const comparisonDataset = chartRef.current.data.datasets[1]; // Accessing the second dataset
      
      const comparisonPlayerIds = comparisonPlayers.map(player => player.player_id);
      const comparisonProjection = projectedPlayersData.filter(player => comparisonPlayerIds.includes(player.player_id));
      comparisonDataset.data = comparisonProjection.map((player) => ({
        x: player.x,
        y: player.y,
        player_id: player.player_id,
      }));

      activePlayers = projectedPlayersData.filter(
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
    //console.log("comp, proj", comparisonPlayers, projectedPlayers)
  }, [comparisonPlayers, projectedPlayersData]); // Update the dataset whenever the comparison players change

  useEffect(() => {
    if (chartRef.current) {
      const dataset = chartRef.current.data.datasets[2] as { data: ScatterDataPoint[] };
      if (highlightedPlayer != null) {
        const highlightedProjection = projectedPlayersData.find(player => player.player_id === highlightedPlayer.player_id);
        dataset.data = highlightedProjection
          ? [
              {
                x: highlightedProjection.x,
                y: highlightedProjection.y,
                player_id: highlightedProjection.player_id,
              },
            ]
          : [];
      } else {
        dataset.data = [];
      }
      chartRef.current.update("none"); // Update without animation
    }
    //console.log("proj, high", highlightedPlayer, projectedPlayers)
  }, [highlightedPlayer, projectedPlayersData]);
   // Update the dataset whenever the highlighted player changes, even if null

  return (
    <div className="chart-container" style={{ height: "100%", width: "100%" }}>
      <canvas id="chart2d"></canvas>
    </div>
  );
};

export default Player2DGraph;
