import React, { useEffect } from 'react';
import Chart, { ChartConfiguration, ChartType, PluginOptionsByType } from 'chart.js/auto';
import 'chartjs-plugin-dragdata'

declare module 'chart.js' {
  interface PluginOptionsByType<TType extends ChartType> {
    radar: {
      dragData?: any;
    };
  }
}

let myChart : any

const PlayerFilter = () => {
    useEffect(() => {
        var max_name = "Maximum"
        var min_name = "Minimum"
        var max_color = 'rgb(150, 200, 0)'
        var min_color = 'rgb(200, 100, 0)'
        var max_color_transparent = 'rgba(255, 255, 255, 0.3)'

        var max_stats = [85, 85, 85, 85, 85, 85, 85]
        var min_stats = [65, 65, 65, 65, 65, 65, 65]

        var text_color = '#ddd'
        var background_color = "#222222"
        var font_size = 16

        const data = {
            labels: ["Overall", "Inside Scoring", "Outside Scoring", "Athleticism", "Playmaking", "Rebounding", "Defending"],
            datasets: [{
                label: max_name,
                data: max_stats,
                backgroundColor: max_color_transparent,
                borderColor: max_color,
                pointBackgroundColor: max_color,
                pointHoverBorderColor: max_color,
                fill: +1,
              },
              {
                label: min_name,
                data: min_stats,
                backgroundColor: max_color_transparent,
                borderColor: min_color,
                pointBackgroundColor: min_color,
                pointHoverBorderColor: min_color,
                fill: false,
              },
            ],
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
                    const hoverElement = document.getElementById('myChart') as HTMLCanvasElement;
                    if (hoverElement) {
                        hoverElement.style.cursor = chartElement[0] ? 'pointer' : 'default';
                    }
                },
                plugins: {
                    legend: {
                      display: false,
                    },
                    dragData: {
                      round: 0,
                      showTooltip: true,
                      onDragStart: function() {
                        const element = document.getElementById('myChart');
                        if (element) {
                          element.style.cursor = 'pointer'; //or 'move' or 'grab' or 'grabbing'
                        }                      },
                      onDrag: function(e: Event, datasetIndex: number, index: number, value: number) {
                        if (datasetIndex === 0 && value < min_stats[index]) {
                          return false;
                        }
                        if (datasetIndex === 1 && value > max_stats[index]) {
                          return false;
                        }
                      },
                      onDragEnd: function(e: Event, datasetIndex: number, index: number, value: number) {
                        const element = document.getElementById('myChart');
                        if (element) {
                          element.style.cursor = 'default';
                        }
                        if (max_stats[index] <= min_stats[index]) {
                          if (datasetIndex == 0) max_stats[index] = min_stats[index] + 1
                          if (datasetIndex == 1) min_stats[index] = max_stats[index] - 1
                          myChart.update();
                        }
                      },
                    },
                  } as any,
            },
        };

        const chartElement = document.getElementById('myChart') as HTMLCanvasElement;
        if (chartElement) {
            Chart.defaults.font.size = font_size;
            const myChart = new Chart(chartElement, config);
        }
    }, []);

    return (
        <div className="chart-container">
            <canvas id="myChart"></canvas>
        </div>
    );
};

export default PlayerFilter;
