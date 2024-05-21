import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-plugin-dragdata';

declare module 'chart.js' {
  interface PluginOptionsByType<TType extends ChartType> {
    radar: {
      dragData?: any;
    };
  }
}

let filterChart : Chart | null = null;

interface PlayerFilterProps {
  min: number[];
  max: number[];
  setPlayerFilterValues: ((value: [number[], number[]]) => void)
  handleClose: any;
}

const FilterGraph: React.FC<PlayerFilterProps> = ({min, max, setPlayerFilterValues, handleClose}) => {
    useEffect(() => {
        const ctx = document.getElementById('filterChart') as HTMLCanvasElement;
        if (ctx) {
            filterChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ["off_score_2", "off_score_3", "reb_score", "def_score", "off_score_1"],
                    datasets: [{
                            label: "Maximum",
                            data: max,
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                            borderColor: 'rgb(100, 255, 100)',
                            pointBackgroundColor: 'rgb(100, 255, 100)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgb(100, 255, 100)',
                            fill: +1,
                        },
                        {
                            label: "Minimum",
                            data: min,
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                            borderColor: 'rgb(255, 100, 100)',
                            pointBackgroundColor: 'rgb(255, 100, 100)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgb(255, 100, 100)',
                            fill: false,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        r: {
                            angleLines: {
                                color: '#ddd',
                            },
                            pointLabels: {
                                display: false,
                                color: '#ddd',
                                font: {
                                    size: 16,
                                },
                            },
                            grid: {
                                color: '#ddd',
                            },
                            ticks: {
                                color: '#ddd',
                                backdropColor: "#222222",
                            },
                            min: 0,
                            max: 100,
                        },
                    },
                    onHover: (event, chartElement) => {
                        const canvas = ctx;
                        if (canvas) {
                            canvas.style.cursor = chartElement.length ? 'pointer' : 'default';
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
                                if (ctx) {
                                    ctx.style.cursor = 'grabbing';
                                }
                            },
                            onDrag: function(e: Event, datasetIndex: number, index: number, value: number) {
                                if (datasetIndex === 0 && value < min[index]) {
                                    return false;
                                }
                                if (datasetIndex === 1 && value > max[index]) {
                                    return false;
                                }
                            },
                            onDragEnd: function(e: Event, datasetIndex: number, index: number, value: number) {
                                if (ctx) {
                                    ctx.style.cursor = 'default';
                                }
                                if (max[index] <= min[index]) {
                                    if (datasetIndex === 0) max[index] = min[index] + 1;
                                    if (datasetIndex === 1) min[index] = max[index] - 1;
                                    filterChart?.update();
                                }
                                console.log(min, max);
                            },
                        },
                    } as any,
                },
            });
        }

        return () => {
            if (filterChart) {
                filterChart.destroy();
                filterChart = null;
            }
        };
    }, [min, max]); // dependencies array ensures effect runs again if min or max props change

    return (
        <div>
            <div className="chart-container">
                <canvas id="filterChart"></canvas>
            </div>
            
            <button className="btn text-center btn-primary w-100 mb-3"
                onClick={() => {
                    // top, right, bottom right, left bottom, left
                    // off2, off3, reb, def, off1
                    setPlayerFilterValues([min, max])
                    handleClose()
                }}>
                Apply Filter
            </button>
        </div>
    );
};

export default FilterGraph;
 