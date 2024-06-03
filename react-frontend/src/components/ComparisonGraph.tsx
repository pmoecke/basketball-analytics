import React, { useEffect } from "react";
import Chart, { ChartConfiguration } from "chart.js/auto";
import { Player } from "../types/player";

interface ComparisonGraphProps {
  player1: Player;
  player2: Player;
  playerScore1: any;
  playerScore2: any;
}

const ComparisonGraph: React.FC<ComparisonGraphProps> = ({
  player1,
  player2,
  playerScore1,
  playerScore2,
}) => {
  useEffect(() => {
    var player1_name = player1.player_name;

    var player1_stats = [
      playerScore1.off_score_2,
      playerScore1.off_score_3,
      playerScore1.reb_score,
      playerScore1.def_score,
      playerScore1.off_score_1,
    ]
    var player1_color = "rgb(153, 102, 255)";
    var player1_color_transparent = "rgba(153, 102, 255, 0.1)";

    var player2_name = player2.player_name;
    var player2_stats = [
      playerScore2.off_score_2,
      playerScore2.off_score_3,
      playerScore2.reb_score,
      playerScore2.def_score,
      playerScore2.off_score_1,
    ]
    var player2_color = "rgb(255, 159, 64)";
    var player2_color_transparent = "rgba(255, 159, 64, 0.1)";

    var text_color = "#ddd";
    var background_color = "#222222";
    var font_size = 16;

    const data = {
      labels: ["off_score_2", "off_score_3", "reb_score", "def_score", "off_score_1"],
      datasets: [
        {
          label: player1_name,
          data: player1_stats,
          backgroundColor: player1_color_transparent,
          borderColor: player1_color,
          pointBackgroundColor: player1_color,
          pointHoverBorderColor: player1_color,
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
        },
        {
          label: player2_name,
          data: player2_stats,
          backgroundColor: player2_color_transparent,
          borderColor: player2_color,
          pointBackgroundColor: player2_color,
          pointHoverBorderColor: player2_color,
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
        },
      ],
    };

    const config: ChartConfiguration<"radar", number[], string> = {
      type: "radar",
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
            borderColor: "#fff",
            hoverBackgroundColor: "#fff",
          },
        },
        scales: {
          r: {
            angleLines: {
              color: text_color,
            },
            pointLabels: {
              //display: false,
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
        onHover: function (event, chartElement) {
          const hoverElement = document.getElementById(
            "playerChart"
          ) as HTMLCanvasElement;
          if (hoverElement) {
            hoverElement.style.cursor = chartElement[0] ? "pointer" : "default";
          }
        },
        plugins: {
          legend: {
            position: "bottom",
            //display: false,
            //onClick: (e) => e.stopPropagation(),
          },
        },
        maintainAspectRatio: true, // Ensure the aspect ratio is maintained
        aspectRatio: 1.4, //Width is X times height
      },
    };

    const chartElement = document.getElementById(
      "playerChart"
    ) as HTMLCanvasElement;
    if (chartElement) {
      Chart.defaults.font.size = font_size;
      // Create the new chart based on the config
      new Chart(chartElement, config);
    }
  }, [player1, player2, playerScore1, playerScore2]);

  return (
    <div className="chart-container">
      <canvas id="playerChart"></canvas>
    </div>
  );
};

export default ComparisonGraph;
