import React, { useEffect, useRef } from "react";
import Chart, { ChartConfiguration } from "chart.js/auto";
import { Player, PlayerArray } from "../types/player";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);

interface Player2DGraphProps {
  players: PlayerArray;
  comparisonPlayers: PlayerArray;
  setSelectedPlayer: (player: Player) => void;
  setShowModal: (show: boolean) => void;
  highlightedPlayer: Player | null;
  setHighlightedPlayer: (player: Player | null) => void;
}

const Player2DGraph: React.FC<Player2DGraphProps> = ({
  players,
  comparisonPlayers,
  setSelectedPlayer,
  setShowModal,
  highlightedPlayer,
  setHighlightedPlayer,
}) => {
  const chartRef = useRef<Chart | null>(null);

    var activePlayers = players;

  useEffect(() => {
    const chartElement = document.getElementById(
      "chart2d"
    ) as HTMLCanvasElement;
    if (chartElement) {

        activePlayers = players.filter(
            p => !comparisonPlayers.some(cp => cp.player_id === p.player_id)
          );

      const config: ChartConfiguration<
        "scatter",
        { x: number; y: number }[],
        unknown
      > = {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Players",
              data: activePlayers.map((player) => ({
                x: player.offensive_rating,
                y: player.defensive_rating,
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
                filter: function(legendItem, chartData) {
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
          },
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const index = elements[0].index;
              const datasetIndex = elements[0].datasetIndex;
              const selectedPlayer =
                datasetIndex === 0 ? players[index] : comparisonPlayers[index];
              setSelectedPlayer(selectedPlayer);
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
  }, [players]); // Only reinitialize chart if these arrays change

  useEffect(() => {
    if (chartRef.current) {
      const comparisonDataset = chartRef.current.data.datasets[1]; // Accessing the second dataset
      comparisonDataset.data = comparisonPlayers.map((player) => ({
        x: player.offensive_rating,
        y: player.defensive_rating,
      }));

      activePlayers = players.filter(
        p => !comparisonPlayers.some(cp => cp.player_id === p.player_id)
      );

      const activeDataset = chartRef.current.data.datasets[0];
      activeDataset.data = activePlayers.map((player) => ({
        x: player.offensive_rating,
        y: player.defensive_rating,
      }));
      chartRef.current.update("none");
    }
  }, [comparisonPlayers, activePlayers]); // Update the dataset whenever the comparison players change

  useEffect(() => {
    if (chartRef.current) {
      const dataset = chartRef.current.data.datasets[2]; // Assuming highlighted player is always the third dataset
      dataset.data = highlightedPlayer
        ? [
            {
              x: highlightedPlayer.offensive_rating,
              y: highlightedPlayer.defensive_rating,
            },
          ]
        : [];
      chartRef.current.update("none"); // Update without animation
    }
  }, [highlightedPlayer]); // Update the dataset whenever the highlighted player changes, even if null

  return (
    <div className="chart-container" style={{ height: "100%", width: "100%" }}>
      <canvas id="chart2d"></canvas>
    </div>
  );
};

export default Player2DGraph;
